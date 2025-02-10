import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import cors from "cors";
import env from "dotenv";

const app = express();
const port = 3010;
const saltRounds = 10;
env.config();

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true, // Allow cookies and session authentication
  })
);
// app.use(
//   cors()
// );
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // prevents storing empty sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS
      httpOnly: true, // Prevent client-side access
      sameSite: "lax" // Protect against CSRF
    }
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

const pool = new pg.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/welcome",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/welcome",
    failureRedirect: "http://localhost:3000",
  })
);

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) return res.status(500).json({ message: "Internal server error" });
    if (!user) return res.status(401).json({ message: "Invalid email/password" });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: "Error logging in" });
      return res.json({ message: "Login successful", user });
    });
  })(req, res, next);
});

app.get("/check-session", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ user: req.user });
  } else {
    return res.status(401).json({ message: "Not authenticated" });
  }
});

app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Error logging out" });
    return res.json({ message: "Logout successful" });
  });
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try {
    const checkResult = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) { // email already exists
      return res.status(400).json({ error: "User already exists" });
    } 

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    );
    const user = result.rows[0];
    req.login(user, (err) => {  // Log the new user in
      if (err) return res.status(500).json({ message: "Error logging in" });
      return res.json({ message: "Login successful", user });
    });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

passport.use(
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1 ", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            //Error with password check
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              //Passed password check
              return cb(null, user);
            } else {
              //Did not pass password check
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
      return cb("An error Occurred");
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3010/auth/google/welcome",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        // console.log(profile);
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);
        if (result.rows.length === 0) {
          const newUser = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [profile.email, "*****"]
          );
          return cb(null, newUser.rows[0]); // Register
        } else {
          return cb(null, result.rows[0]); // Login
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);


passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
