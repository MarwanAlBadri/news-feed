import NewsArticle from "./NewsArticle";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
export default function NewsFeed({ articles, loading }) {
    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!articles.length) {
        return (
            <Typography
                align="center"
                variant="h6"
                color="textSecondary"
                marginTop={4}
            >
                No articles found.
            </Typography>
        );
    }

    return (
        <div>
            {articles.map((article) => (
                <NewsArticle key={JSON.stringify(article)} {...article} />
            ))}
        </div>
    );
}
