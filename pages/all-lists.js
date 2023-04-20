import { useState } from "react";
import dbConnect from "../lib/mongodb";
import Head from "next/head";
import Layout from "../components/layout";
import Link from "next/link";
import List from "../models/List";
import styles from "../styles/AllLists.module.css";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

export default function AllLists({ lists }) {
    const parsedData = lists ? JSON.parse(lists) : [];
    const [listData, setListData] = useState(parsedData);
    const [type, setType] = useState('All');
    // const [isLoading, setIsLoading] = useState(false);

    const session = useSession();

    if (!session.data) return (
        <Layout>
            <h2>You must be signed in to see lists.</h2>
        </Layout>
    );

    async function handleDelete(e, id) {
        e.preventDefault();
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
        let type = e.target.value;
        try {
            const data =
                await fetch(`/api/get-all-lists?type=${type}`)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);
                        return data;
                    });
            setListData(data);
            switch(type) {
                case 'Any': 
                    type = 'All';
                    break;
                case 'Books': 
                    type = 'Book';
                    break;
                case 'Movies': 
                    type = 'Movie';
                    break;
                default:
                    type = 'Music';
            }
            setType(type);
        } catch (error) { alert('No lists.'); }
    }

    // if (isLoading) return <p>Loading...</p>

    function listBox(data) {
        if (data.description) {
            return (
                <div key={data._id} className={styles.listInfo}>
                    <p><Link href={`/list/${data._id}`} >{data.name}</Link> - {data.type}</p>
                    <p>{data.description} - {data.items.length} items</p>
                    <a href="#" onClick={(e) => handleDelete(e, data._id)} className={styles.delete}>Delete list</a>
                </div>);
        }
        else return (
            <div key={data._id} className={styles.listInfo}>
                <p><Link href={`/list/${data._id}`} >{data.name}</Link> - {data.type}</p>
                <p>{data.items.length} items</p>
                <a href="#" onClick={(e) => handleDelete(e, data._id)} className={styles.delete}>Delete list</a>
            </div>);
    }

    const listContainer =
        <div className={styles.allListsContainer}>
            {listData.map((list) => {
                return listBox(list);
            })}
        </div>

    return (
        <Layout>
            <Head>
                <title>All Lists</title>
            </Head>
            <div className={styles.topBar}>
                <h2>{type} Lists ({listData.length})</h2>
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

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (session) {
        const { user, expires } = session;

        await dbConnect();

        const result = await List.find({ user: user.email }); // email is rly _id

        return { props: { lists: JSON.stringify(result) } }
    } else return { props: {} };
}