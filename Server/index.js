import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import cors from "cors";
import env from "dotenv";

const app = express();
const port = 3010;
const saltRounds = 10;
env.config();

app.use(cors());
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
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

const pool = new pg.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});


// app.get("/logout", (req, res) => {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     res.redirect("/");
//   });
// });


app.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/welcome",
    failureRedirect: "/",
  })
);

app.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const checkResult = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) { // email already exists
      return res.status(400).json({ error: "User already exists" });
    } 

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, hashedPassword]
    );

    return res.json({ success: true, message: "User registered successfully!" });
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
      return cb(err);
    }
  })
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
