import NewsFeed from "./components/NewsFeed";
import { Container, Button, styled, Typography } from "@mui/material";
import NewsHeader from "./components/NewsHeader";
import { useEffect, useMemo, useState } from "react";
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
    const [category, setCategory] = useState("general");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    // أي تغيير في category / query / page => يعمل fetch لوحده
    useEffect(() => {
        let ignore = false; // يمنع رد قديم يكتب فوق رد أحدث

        async function load() {
            setLoading(true);
            setError("");
            try {
                const params = new URLSearchParams({
                    category,
                    country: "us",
                    pageSize: PAGE_SIZE,
                    page,
                    apiKey: import.meta.env.VITE_NEWS_API_KEY,
                });
                if (query) params.set("q", query);

                const response = await fetch(
                    `https://newsapi.org/v2/top-headlines?${params}`
                );
                const data = await response.json();
                if (data.status === "error") throw new Error(data.message);

                if (!ignore) {
                    setArticles(
                        data.articles.map(
                            ({ urlToImage, title, description, author, publishedAt ,url}) => ({
                                title,
                                url,
                                description,
                                author,
                                publishedAt,
                                image: urlToImage,
                            })
                        )
                    );
                }
            } catch (e) {
                if (!ignore) setError(e.message);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        load();
        return () => {
            ignore = true;
        };
    }, [category, query, page]);

    // debounce يتعمل مرة واحدة بس (مش كل render)
    const debouncedSearch = useMemo(
        () =>
            debounce((value) => {
                setPage(1);
                setQuery(value);
            }, 500),
        []
    );

    const handleCategoryChange = (event) => {
        setPage(1);
        setCategory(event.target.value);
    };

    return (
        <Container>
            <NewsHeader
                onSearchChange={debouncedSearch}
                category={category}
                onCategoryChange={handleCategoryChange}
            />
            {error.length === 0 ? (
                <NewsFeed articles={articles} loading={loading} />
            ) : (
                <Typography color="error" align="center">
                    {error}
                </Typography>
            )}

            <Footer>
                <Button
                    variant="outlined"
                    onClick={() => setPage((p) => p - 1)}
                    disabled={loading || page === 1}
                >
                    Previous
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={loading || articles.length < PAGE_SIZE}
                >
                    Next
                </Button>
            </Footer>
        </Container>
    );
}

export default App;
