import LoadingArticle from "./LoadingArticle";
import NewsArticle from "./NewsArticle";

import Typography from "@mui/material/Typography";
export default function NewsFeed({ articles, loading }) {
    if (!loading && !articles.length) {
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
            {loading && [...Array(3)].map((_,index) => <LoadingArticle key={index}/>)}
            {!loading &&
                articles.map((article) => (
                    <NewsArticle key={JSON.stringify(article)} {...article} />
                ))}
        </div>
    );
}
