import NewsFeed from "./components/NewsFeed";
import { Container, Button, styled, Typography } from "@mui/material";
import NewsHeader from "./components/NewsHeader";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
const Footer = styled("div")(({ theme }) => ({
    margin: theme.spacing(2, 0),
    display: "flex",
    justifyContent: "space-between",
}));
const PAGE_SIZE = 4;
function App() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [category , setCategory]= useState("general")
    const pageNumber = useRef(1);
    const queryValue = useRef("");

    async function loadData() {
        const url = queryValue
            ? `https://newsapi.org/v2/everything?q=${queryValue}&pageSize=${PAGE_SIZE}&page=${pageNumber}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
            : `https://newsapi.org/v2/top-headlines?q=${queryValue}&category=${category}&country=us&pageSize=${PAGE_SIZE}&page=${pageNumber}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();
        if (data.status == "error") {
            throw new Error(data.message);
        }
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

    const fetchAndUpdateArticles = () => {
        setLoading(true);
        loadData("", pageNumber.current)
            .then((newData) => {
                setArticles(newData);
            })
            .catch((errorMessage) => {
                setError(errorMessage.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const debounceLoadData = debounce(fetchAndUpdateArticles, 500);

    useEffect(() => {
        fetchAndUpdateArticles();
    }, []);

    const handelSearchChange = (newQuery) => {
        pageNumber.current = 1;
        queryValue.current = newQuery;
        debounceLoadData();
    };
    const handelNextClick = () => {
        pageNumber.current += 1;
        fetchAndUpdateArticles();
    };
    const handelPreviousClick = () => {
        pageNumber.current -= 1;
        fetchAndUpdateArticles();
    };

    const handelCategoryChange=(event)=>{
        
        setCategory(event.target.value)
        pageNumber.current= 1 ;
    }
    return (
        <Container>
            <NewsHeader onSearchChange={handelSearchChange} category={category} onCategoryChange={handelCategoryChange} />
            {error.length === 0 ? (
                <NewsFeed articles={articles} loading={loading}  />
            ) : (
                <Typography color="error" align="center">
                    {error}
                </Typography>
            )}

            <Footer>
                <Button
                    variant="outlined"
                    onClick={handelPreviousClick}
                    disabled={loading|| pageNumber.current === 1}
                >
                    Previous
                </Button>
                <Button
                    variant="outlined"
                    onClick={handelNextClick}
                    disabled={loading|| articles.length < PAGE_SIZE - 1}
                >
                    Next
                </Button>
            </Footer>
        </Container>
    );
}

export default App;
