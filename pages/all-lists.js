import { useEffect, useState } from "react";

import dbConnect from "../lib/mongodb";
import List from "../models/List";

import Layout from "../components/layout";
import Modal from "../components/modal";
import Snackbar from "../components/snackbar";
import ListItem from "../components/list-item";
import SearchBar from "../components/search";

import Link from "next/link";
import Head from "next/head";

import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

import { useDrag } from "react-dnd";

import styles from "../styles/AllLists.module.css";
import formStyles from '../components/navbar.module.css';

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

function ListBox({ data, setListData, isDragging, listModified, setListModified, setCurrentList, selected }) {
    const [showEditOptions, setShowEditOptions] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    // list name and description
    const [name, setName] = useState(data.name);
    const [description, setDescription] = useState(data.description);

    const [width, height] = useWindowSize();

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

    function close() {
        setConfirmDelete(false);
        setShowEditOptions(false);
        setEditMode(false);
    }

    async function handleListUpdate(e) {
        e.preventDefault();

        const itemInfo = {
            listId: data._id,
            updatedName: e.target.name.value,
            updatedDescription: e.target.description.value
        }

        const fetchOptions = {
            method: 'POST',
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify(itemInfo),
        };

        fetch('/api/edit-list', fetchOptions)
            .then(response => response.json())
            .then((data) => {
                close();
                setName(data.name);
                setDescription(data.description);
            });
    }

    return (
        <div key={data._id} className={`${styles.listInfo} ${selected && width >= 430 ? styles.selected : ''}`}>
            {width < 430 && <p><Link href={`/list/${data._id}`} >{name}</Link> ({data.items.length}) - {data.type}</p>}
            {width >= 430 && <p><Link href="#" onClick={() => setCurrentList(data._id)} >{name}</Link> ({data.items.length}) - {data.type}</p>}
            {/* <p><Link href={`/list/${data._id}`} >{name}</Link> ({data.items.length}) - {data.type}</p> */}
            {data.description && <p className={styles.description}>{description}</p>}
            {selected && <div className={styles.selected}></div>}
            <svg width="15px" height="15px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000" className={styles.kebab} onClick={() => setShowEditOptions(!showEditOptions)}>
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
            </svg>
            {showEditOptions && !confirmDelete && !editMode &&
                <Modal toggleModal={() => setShowEditOptions(!showEditOptions)}>
                    <div className={styles.editContainer}>
                        <button className={styles.editButton} onClick={() => setEditMode(true)}>
                            Edit list
                        </button>

                        <button className={`${styles.editButton} ${styles.delete}`} onClick={() => setConfirmDelete(true)}>
                            Delete list
                        </button>
                    </div>
                </Modal>}
            {confirmDelete &&
                <Modal toggleModal={close}>
                    <div className={styles.editContainer}>
                        <p>Are you sure you want to delete <u><strong>{name}</strong></u>?</p>
                        <button onClick={(e) => {
                            close();
                            handleDelete(e, data._id);
                            setListModified(true);
                        }} className={`${styles.editButton} ${styles.delete}`}>
                            Delete list
                        </button>

                        <button className={styles.editButton} onClick={close}>
                            Cancel
                        </button>
                    </div>
                </Modal>}
            {editMode &&
                <Modal toggleModal={close}>
                    <form className={formStyles.form} onSubmit={handleListUpdate} method="POST">
                        <div className={formStyles.formRow}>
                            <label>Name: </label>
                            <input className={styles.formInput} type="text" name="name" defaultValue={name} required />
                        </div>
                        <div className={formStyles.formRow}>
                            <label>Description: </label>
                            <textarea type="text" name="description" defaultValue={description}></textarea>
                        </div>
                        <div className={formStyles.formRow}>
                            <input className={styles.editButton} type="submit" value="Save edits" />
                        </div>
                    </form>
                </Modal>}
        </div>
    );
}

function ListContainer({ lists, setListData, listModified, setListModified }) {
    const [currentList, setCurrentList] = useState(null);
    const [width, height] = useWindowSize();

    const [currentListData, setCurrentListData] = useState(null);

    useEffect(() => {
        if (currentList !== null) {
            async function populateList() {
                const res = await fetch(`/api/get-list?id=${currentList}`);
                const data = await res.json();
                setCurrentListData(await data);
            }
            populateList();
        }
    }, [currentList]);

    return (
        <div className={`${styles.wideview} ${width < 430 ? styles.mobileview : ''}`}>
            {/* Left */}
            <section className={`${styles.allListsContainer} ${currentList == null || width < 430 ? styles.wide : ''}`}>
                {lists.map((list) => {
                    return <ListBox
                        data={list}
                        setListData={setListData}
                        key={list._id}
                        listModified={listModified}
                        setListModified={setListModified}
                        setCurrentList={setCurrentList}
                        selected={list._id == currentList ? true : false}
                    />;
                })}
            </section>
            {/* Right */}
            {currentList && width >= 430 &&
                <section className={styles.currentListContainer}>
                    <div className={styles.flexSpaceBetween}>
                        {currentListData &&
                            <SearchBar listId={currentList} listType={currentListData.type} handleDataChange={setCurrentListData} />}
                        {currentListData &&
                            <button className={styles.closeCurrentList} onClick={() => {
                                setCurrentList(null);
                                setCurrentListData(null);
                            }}>X</button>}
                    </div>
                    {currentListData && currentListData.items.map((item) => {
                        return <ListItem
                            data={item}
                            listId={currentList}
                            key={item._id}
                            handleDataChange={setCurrentListData}
                        />
                    })}
                    {/* {songAdded && <Snackbar message={`${changeType} ${data.name}`} toggleShow={setSongAdded} />} */}
                </section>}
        </div>
    );
}

export default function AllLists({ lists }) {
    const parsedData = lists ? JSON.parse(lists) : [];
    const [listData, setListData] = useState(parsedData);
    const [type, setType] = useState('Any');
    const [displayType, setDisplayType] = useState('All');
    const [listModified, setListModified] = useState(false);

    const [width, height] = useWindowSize();

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
            <ListContainer lists={listData} setListData={setListData} listModified={listModified} setListModified={setListModified} />
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