import dbConnect from "../lib/mongodb";
import Layout from "../components/layout";
import Link from "next/link";
import List from "../models/List";
import Head from "next/head";
import styles from "../styles/AllLists.module.css";

export default function AllLists({ lists }) {
    lists = JSON.parse(lists);
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

    return (
        <Layout>
            <Head>
                <title>All Lists</title>
            </Head>
            <h2>All Lists</h2>
            <div className={styles.allListsContainer}>
                {lists.map((list) => {
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