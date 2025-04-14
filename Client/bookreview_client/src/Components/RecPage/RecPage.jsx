import React, {useState} from 'react';
import './RecPage.css';
import NavBar from "../NavBar/NavBar";
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context';
import Loading from "../Loader/Loader";

const RecPage = () => {
    const [formData, setFormData] = useState({ query: "", category: "All", tone: "All"});
    const {setResultTitle, setIsbnSearch, setIsbnList} = useGlobalContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setIsbnSearch(true);

        const response = await fetch("http://localhost:3010/run-python", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });       
        
        if (response.ok) {
            const data = await response.json();
            setIsbnList(data.map((book)=> book.isbn))
            setResultTitle(`Here's what we found for "${formData.query}"`);
            setLoading(false);
            navigate("/book");
        } else {
            console.error("Request failed with status:", response.status);
            setLoading(false);
        }
    };

    if(loading) return <Loading />;

    return (
        <main>
        <NavBar />
        <div>
            <form onSubmit={handleSubmit}>
                <div className="query-box">
                    <label for="query">Please enter a description of a book:</label>
                    <input type="text" name="query" id="query" value={formData.query} onChange={handleChange} placeholder="e.g. A book that spooks you" required/>
                </div>

                <div className="category-dropdown">
                    <label for="category">Choose a category:</label>
                    <select name="category" id="category" value={formData.category} onChange={handleChange}>
                        <option value="All" selected>All</option>
                        <option value="Children's Fiction">Children's Fiction</option>
                        <option value="Children's NonFiction">Children's Nonfiction</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Nonfiction">Nonfiction</option>
                    </select>
                </div>

                <div className="tone-dropdown">
                    <label for="tone">Choose a tone:</label>
                    <select name="tone" id="tone" value={formData.tone} onChange={handleChange}>
                        <option value="All" selected>All</option>
                        <option value="Happy">Happy</option>
                        <option value="Surprising">Surprising</option>
                        <option value="Angry">Angry</option>
                        <option value="Suspenseful">Suspenseful</option>
                        <option value="Sad">Sad</option>
                    </select>
                </div>

                <button type="submit">Get Recommendations</button>
            </form>
        </div>
        </main>
    );
};

export default RecPage;