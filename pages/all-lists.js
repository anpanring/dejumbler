import { useState } from "react";
import dbConnect from "../lib/mongodb";
import Head from "next/head";
import Layout from "../components/layout";
import Link from "next/link";
import List from "../models/List";
import styles from "../styles/AllLists.module.css";

export default function AllLists({ lists }) {
    const [listData, setListData] = useState(JSON.parse(lists));
    const [isLoading, setIsLoading] = useState(false);

    async function handleDelete(e, id) {
        try {
            const updatedData =
                await fetch(`/api/delete-list?id=${id}`)
                    .then((res) => res.json())
                    .then((data) => {
                        return data;
                    });
            setListData(updatedData);
        } catch (error) { alert('Failed to delete list.'); }
    }

    async function handleFilterChange(e) {
        setIsLoading(true);
        try {
            const data =
                await fetch(`/api/get-all-lists?type=${e.target.value}`)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);
                        return data;
                    });
            setListData(data);
            setIsLoading(false);
        } catch (error) { alert('Failed to retrieve data.'); }
    }

    // if (isLoading) return <p>Loading...</p>

    function listLink(data) {
        if (data.description) {
            return (
                <div key={data._id} className={styles.listInfo}>
                    <p><Link href={`/list/${data._id}`} >{data.name}</Link> - {data.type}</p>
                    <p>{data.description} - {data.items.length} items</p>
                    <a onClick={(e) => handleDelete(e, data._id)} className={styles.delete}>Delete list</a>
                </div>);
        }
        else return (
            <div key={data._id} className={styles.listInfo}>
                <p><Link href={`/list/${data._id}`} >{data.name}</Link> - {data.type}</p>
                <p>{data.items.length} items</p>
                <a onClick={(e) => handleDelete(e, data._id)} className={styles.delete}>Delete list</a>
            </div>);
    }

    const listContainer =
        <div className={styles.allListsContainer}>
            {listData.map((list) => {
                return listLink(list);
            })}
        </div>

    return (
        <Layout>
            <Head>
                <title>All Lists</title>
            </Head>
            <div className={styles.topBar}>
                <h2>All Lists</h2>
                <div className='form-row'>
                    <label>Type: </label>
                    <select id="types" list="types" name="type" onChange={handleFilterChange} required>
                        <option value="Any">All</option>
                        <option value="Music">Music</option>
                        <option value="Movies">Movies</option>
                        <option value="Books">Books</option>
                    </select>
                </div>
            </div>
            {listContainer}
        </Layout>
    );
}

export async function getServerSideProps() {
    await dbConnect();

    /* find all the data in our database */
    const result = await List.find({});

    return { props: { lists: JSON.stringify(result) } }
}