import { useEffect, useState } from "react";
import dbConnect from "../lib/mongodb";
import Layout from "../components/layout";
import Link from "next/link";
import List from "../models/List";
import styles from "../styles/AllLists.module.css";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

function ListBox({ data, setListData }) {
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

    let descriptionLine;
    if (data.description) {
        descriptionLine = <p>{data.description} - {data.items.length} items</p>;
    } else descriptionLine = <p>{data.items.length} items</p>;
    return (
        <div key={data._id} className={styles.listInfo}>
            <p><Link href={`/list/${data._id}`} >{data.name}</Link> - {data.type}</p>
            {descriptionLine}
            <a href="#" onClick={(e) => handleDelete(e, data._id)} className={styles.delete}>Delete list</a>
        </div>
    );
}

function ListContainer({ lists, setListData }) {
    return (
        <div className={styles.allListsContainer}>
            {lists.map((list) => {
                return <ListBox data={list} setListData={setListData} key={list._id} />;
            })}
        </div>
    );
}

export default function AllLists({ lists }) {
    const parsedData = lists ? JSON.parse(lists) : [];
    const [listData, setListData] = useState(parsedData);
    const [type, setType] = useState('Any');

    // infinite loop!! fix
    useEffect(() => {
        console.log('hello');
        async function populateList() {
            const res = await fetch(`/api/get-all-lists?type=${type}`);
            const data = await res.json();
            setListData(await data);
        }
        populateList();
    }, [type]);


    // // Block non-logged in users - need to check if correct user too
    // if (!session.data) return (
    //     <Layout>
    //         <h2>You must be signed in to see lists.</h2>
    //     </Layout>
    // );

    return (
        <Layout>
            <div className={styles.topBar}>
                <h2>{type} Lists ({listData.length})</h2>
                <div className='form-row'>
                    <label>Type: </label>
                    <select id="types" list="types" name="type" onChange={e => setType(e.target.value)} required>
                        <option value="Any">All</option>
                        <option value="Music">Music</option>
                        <option value="Movies">Movies</option>
                        <option value="Books">Books</option>
                    </select>
                </div>
            </div>
            <ListContainer lists={listData} setListData={setListData} />
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (session) {
        const { user, expires } = session;

        // Get lists with direct mongoose call
        await dbConnect();
        const result = await List.find({ user: user.email }); // email is rly _id

        return { props: { lists: JSON.stringify(result) } }
    } else return { props: {} };
}