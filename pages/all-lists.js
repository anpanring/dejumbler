import { useState, useEffect } from "react";
import dbConnect from "../lib/mongodb";
import Layout from "../components/layout";
import Link from "next/link";
import List from "../models/List";
import Head from "next/head";
import styles from "../styles/AllLists.module.css";

export default function AllLists({ lists }) {
    const [listData, setListData] = useState(JSON.parse(lists));

    // lists = JSON.parse(lists);

    // async function handleDelete(listId) {
    //     try {
    //         await fetch(`/api/${listId}`, {
    //             method: 'DELETE',
    //         })
    //         router.push('/all-lists');
    //     } catch (error) {
    //         alert('Failed to delete the pet.');
    //     }
    // }

    async function filterOnChange(e) {
        const data = await fetch(`/api/get-all-lists?type=${e.target.value}`)
            .then((res) => res.json())
            .then((data) => {
                return data;
            });
        setListData(data);
    }

    return (
        <Layout>
            <Head>
                <title>All Lists</title>
            </Head>
            <div className={styles.topBar}>
                <h2>All Lists</h2>
                <div className='form-row'>
                    <label>Type: </label>
                    <select id="types" list="types" name="type" onChange={filterOnChange} required>
                        <option value="Any">All</option>
                        <option value="Music">Music</option>
                        <option value="Movies">Movies</option>
                        <option value="Books">Books</option>
                    </select>
                </div>
            </div>

            <div className={styles.allListsContainer}>
                {listData.map((list) => {
                    return <div key={list._id} className={styles.listInfo}>
                        <p><Link href={`/list/${list._id}`} >{list.name}</Link> - {list.type}</p>
                        {/* <button onClick={handleDelete(list._id)}>Delete list</button> */}
                    </div>
                })}
            </div>
        </Layout>
    );
}

export async function getServerSideProps() {
    await dbConnect();

    /* find all the data in our database */
    const result = await List.find({});

    return { props: { lists: JSON.stringify(result) } }
}