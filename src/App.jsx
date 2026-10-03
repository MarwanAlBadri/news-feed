import NewsFeed from "./components/NewsFeed";
import { Container } from "@mui/material";
import NewsHeader from "./components/NewsHeader";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
function App() {
    const [articles, setArticles] = useState([]);
    const [loading , setLoading] =useState(false)

    async function loadData(inputQuery) {
        const url = inputQuery
            ? `https://newsapi.org/v2/everything?q=${inputQuery}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
            : `https://newsapi.org/v2/top-headlines?country=us&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`;

        const response = await fetch(url);

        const data = await response.json();
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

    const debounceLoadData = debounce((query)=>{
        setLoading(true);
        loadData(query).then((query)=>{
            setArticles(query)
            setLoading(false)
        });
    },500)
    console.log("Reevaluated");
    useEffect(() => {
        setLoading(true);
        loadData("").then((newData)=>{
            setArticles(newData);
            setLoading(false)
        });
    }, []);
    const handelSearchChange =(query)=>{
        debounceLoadData(query);
    }
    return (
        <Container>
            <NewsHeader onSearchChange={handelSearchChange}  />
            <NewsFeed articles={articles} loading={loading}/>
        </Container>
    );
}

export default App;
