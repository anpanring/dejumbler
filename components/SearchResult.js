import Router from "next/router";
import styles from "./search.module.css";

export default function SearchResult(props) {
    return (
        <div className={styles.searchResultsWrapper}>
            <img src={props.data.image} alt={props.data.name} />
            <div className={styles.searchResultText}>
                <p>{props.data.name}{props.data.artist}</p>
                <button onClick={() => addToList(props.data, props.listId)}>Add to list</button>
            </div>
        </div>
    );
}

async function addToList(data, listId) {
    // Call add-item API route

    data.listId = listId;
    data = JSON.stringify(data);
    console.log(data);

    const fetchOptions = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
        },
        body: data
    };

    await fetch('/api/add-item', fetchOptions);

    Router.push(`/list/${listId}`);
    console.log('refreshed');
}