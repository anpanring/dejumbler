import { useEffect, useState } from "react";

import dbConnect from "../lib/mongodb";
import List from "../models/List";

import Layout from "../components/layout";
import Modal from "../components/modal";
import Snackbar from "../components/snackbar";

import Link from "next/link";
import Head from "next/head";

import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

import { useDrag } from "react-dnd";

import styles from "../styles/AllLists.module.css";
import { set } from "mongoose";


function ListBox({ data, setListData, isDragging, listModified, setListModified}) {
    const [showEditOptions, setShowEditOptions] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

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
            {showEditOptions && !confirmDelete && <Modal toggleModal={() => setShowEditOptions(!showEditOptions)}>
                <div className={styles.editContainer}>
                    <a href="#">Edit list</a>

                    <a href="#" onClick={() => setConfirmDelete(!confirmDelete)} className={styles.delete}>
                        Delete list
                    </a>
                </div>
            </Modal>}
            {confirmDelete && <Modal toggleModal={() => {
                setConfirmDelete(false);
                setShowEditOptions(false);
            }}>
                <div className={styles.editContainer}>
                    <p>Are you sure you want to delete <strong>{data.name}</strong>?</p>
                    <a href="#" onClick={(e) => {
                        handleDelete(e, data._id);
                        setListModified(true);
                    }
                    } className={styles.delete}>
                        Delete list
                    </a>
                </div>
            </Modal>}
            {/* {listModified && <Snackbar message={`modified ${data.name}`} toggleShow={setListModified} />} */}
        </div>
    );
}

function ListContainer({ lists, setListData, listModified, setListModified }) {
    return (
        <div className={styles.allListsContainer}>
            {lists.map((list) => {
                return <ListBox data={list} setListData={setListData} key={list._id} listModified={listModified} setListModified={setListModified}/>;
            })}
        </div>
    );
}

export default function AllLists({ lists }) {
    const parsedData = lists ? JSON.parse(lists) : [];
    const [listData, setListData] = useState(parsedData);
    const [type, setType] = useState('Any');
    const [displayType, setDisplayType] = useState('All');
    const [listModified, setListModified] = useState(false);

    useEffect(() => {
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

    function toggleType(e) {
        setType(e.target.value);
        if (e.target.value == "Any") setDisplayType("All");
        if (e.target.value == "Movies") setDisplayType("Movie");
        if (e.target.value == "Music") setDisplayType("Music");
        if (e.target.value == "Books") setDisplayType("Book");
    }

    return (
        <Layout>
            <Head>
                <title>All Lists</title>
            </Head>
            <div className={styles.topBar}>
                <h2>{displayType} Lists ({listData.length})</h2>
                <div className='form-row'>
                    <label>Filter: </label>
                    <select className={styles.selectMenu} list="types" name="type" onChange={toggleType} required>
                        <option value="Any">All</option>
                        <option value="Music">Music</option>
                        <option value="Movies">Movies</option>
                        <option value="Books">Books</option>
                    </select>
                </div>
            </div>
            <ListContainer lists={listData} setListData={setListData} listModified={listModified} setListModified={setListModified}/>
            {listModified && <Snackbar message={`Deleted list`} toggleShow={setListModified} />}
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    const { user, expires } = session;

    // Get lists with direct mongoose call
    await dbConnect();
    const result = await List.find({ user: user.email }); // email is rly _id

    return { props: { lists: JSON.stringify(result) } }
}