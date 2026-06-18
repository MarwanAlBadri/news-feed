import NewsFeed from "./components/NewsFeed";
import { Container } from "@mui/material";
import NewsHeader from "./components/NewsHeader";
import { useEffect, useState } from "react";
const API = `https://newsapi.org/v2/everything?q=egypt&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`;
console.log(API)
function App() {
    const [articles,setArticles]=useState([]);
    async function loadData() {
        const response = await fetch(API);
        console.log(response)
        const data = await response.json();
        console.log(data)
       return data.articles.map((article) => {
            const { urlToImage, title, description, author, publishedAt } =
                article;
            return {
                title,
                description,
                author,
                publishedAt,
                image: urlToImage,
            };
        });
    }
    useEffect(()=>{
      loadData().then(setArticles)
    },[])
    return (
        <Container>
            <NewsHeader />
             <NewsFeed articles={articles} /> 
        </Container>
    );
}

export default App;
