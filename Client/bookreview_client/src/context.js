import React, {useState, useContext, useEffect} from 'react';
import { useCallback } from 'react';
const URL = "http://openlibrary.org/search.json?title=";
const AppContext = React.createContext();

const AppProvider = ({children}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [books, setBooks] = useState([]); 
    const [isbnList, setIsbnList] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [isbnSearch, setIsbnSearch] = useState(false);
    const [resultTitle, setResultTitle] = useState("");

    const fetchBooks = useCallback(async() => {
        setLoading(true);
        try{
            if (isbnSearch) {
                if (isbnList.length !== 0) {
                    const isbnQuery = isbnList.map(isbn => `ISBN:${isbn}`).join(",");
                    const response = await fetch(`https://openlibrary.org/api/books?bibkeys=${isbnQuery}&jscmd=data&format=json`);
                    const data = await response.json();
                    // console.log(data)

                    let newBooks = Object.keys(data).map(isbn_key => {
                        let dates = data[isbn_key]['publish_date'].split(" ")
                        return {
                            id: data[isbn_key]['key'].replace("/books/", ""),
                            author: data[isbn_key]['authors'].map(author=>author.name),
                            cover_id: data[isbn_key]?.['cover']?.['large'] || null,
                            edition_count: 'Not Available',
                            first_publish_year: dates[dates.length-1],
                            title: data[isbn_key]['title']
                        }
                    });
                    
                    setBooks(newBooks);
                    console.log(newBooks)
                }
            } else {
                if (searchTerm) {
                    const response = await fetch(`${URL}${searchTerm}`);
                    const data = await response.json();
        
                    const {docs} = data;
                    
                    if(docs){
                        let newBooks = docs.slice(0, 20).map((bookSingle) => {
                            const {key, author_name, cover_i, edition_count, first_publish_year, title} = bookSingle;
                            return {
                                id: key.replace("/works/", ""),
                                author: author_name,
                                cover_id: cover_i,
                                edition_count: edition_count,
                                first_publish_year: first_publish_year,
                                title: title
                            }
                        });
        
                        setBooks(newBooks);
                        // console.log(newBooks)
        
                        if(newBooks.length > 0){
                            setResultTitle(`Here's what we found for "${searchTerm}"`);
                        } else {
                            setResultTitle(`Sorry, no results were found for "${searchTerm}". Try another search!`)
                        }
                    } else {
                        setBooks([]);
                        setResultTitle(`Sorry, no results were found for "${searchTerm}". Try another search!`);
                    }
                }
            }    
        } catch(error){
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, isbnList, isbnSearch]);

    useEffect(() => {
        fetchBooks();
    }, [searchTerm, isbnList, isbnSearch, fetchBooks]);

    return (
        <AppContext.Provider value = {{
            loading, books, setSearchTerm, resultTitle, setResultTitle, setIsbnSearch, setIsbnList, isbnSearch
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext);
}

export {AppContext, AppProvider};