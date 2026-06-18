import NewsArticle from "./NewsArticle";
export default function NewsFeed({articles}) {
    return (
        <div>
            {articles.map((article)=>(<NewsArticle key={JSON.stringify(article)} {...article}/>))}
        </div>
    )
}
