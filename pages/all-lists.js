import { useEffect, useState } from "react";
import dbConnect from "../lib/mongodb";
import Layout from "../components/layout";
import Link from "next/link";
import Image from "next/image";
import List from "../models/List";
import styles from "../styles/AllLists.module.css";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { useDrag } from "react-dnd";
import kebab from "../public/images/kebab.svg";

function ListBox({ data, setListData, isDragging }) {
    const [showEditOptions, setShowEditOptions] = useState(false);
    // const [{ opacity }, dragRef] = useDrag(
    //     () => ({
    //         type: "ListBox",
    //         item: { id: data._id },
    //         collect: (monitor) => ({
    //             opacity: monitor.isDragging() ? 0.5 : 1
    //         })
    //     }),
    //     []
    // )

    async function handleDelete(e, id) {
        e.preventDefault();
        try {
            const updatedData =
                fetch(`/api/delete-list?id=${id}`)
                    .then((res) => res.json())
                    .then((data) => {
                        return data;
                    });
            setListData(await updatedData);
        } catch (error) { alert('Failed to delete list.'); }
    }


    return (
        <div key={data._id} className={styles.listInfo}>
            <p><Link href={`/list/${data._id}`} >{data.name}</Link> ({data.items.length}) - {data.type}</p>
            {data.description && <p className={styles.description}>{data.description}</p>}
            <svg width="15px" height="15px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000" className={styles.kebab} onClick={() => setShowEditOptions(!showEditOptions)}>
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
            </svg>
            {showEditOptions && <a href="#" onClick={(e) => handleDelete(e, data._id)} className={styles.delete}>
                Delete list
            </a>}
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
                    <label>Filter: </label>
                    <select className={styles.selectMenu} list="types" name="type" onChange={e => setType(e.target.value)} required>
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