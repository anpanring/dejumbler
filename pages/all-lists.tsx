import { createContext, useContext, useEffect, useState } from "react";

import dbConnect from "../lib/mongodb";
import List from "../models/List";

import Layout, { WindowSizeContext } from "../components/layout/layout";
import Modal from "../components/modal/modal";
import Snackbar from "../components/snackbar/snackbar";
import ListItem from "../components/list-item";
import SearchBar from "../components/search/search";

import Link from "next/link";
import Head from "next/head";

import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

// TODO: implement drag and drop
import { useDrag } from "react-dnd";

import useWindowSize from "../lib/useWindowSize";

import styles from "../styles/AllLists.module.css";

const mobileWidth = 600;

import { ListMetadata, ListData, CurrentListContextType } from "../types/dejumbler-types";
export const CurrentListContext = createContext<CurrentListContextType | null>(null);


interface ListBoxProps {
    data: ListData,
    setListData: React.Dispatch<React.SetStateAction<ListData[]>>,
    setListModified: React.Dispatch<React.SetStateAction<"Deleted" | "Updated" | null>>,
    selected: boolean
}

export const ListBox: React.FC<ListBoxProps> = ({
    data,
    setListData,
    setListModified,
    selected
}) => {
    // kinda messy, refactor to make sure never null
    const currentListContext = useContext(CurrentListContext);
    if (!currentListContext) throw new Error('CurrentListContext is null');
    const { setCurrentList } = currentListContext;

    const { width } = useContext(WindowSizeContext) ?? { width: 1200, height: 800 };

    // control modals
    const [showEditOptions, setShowEditOptions] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    // list name and description
    const [name, setName] = useState<string>(data.name);
    const [description, setDescription] = useState<string>(data.description);
    const [expandDescription, setExpandDescription] = useState(false);

    function close() {
        setConfirmDelete(false);
        setShowEditOptions(false);
        setEditMode(false);
    }

    // handle deleting list
    async function handleDelete(id: string) {
        try {
            const response = await fetch(`/api/delete-list?id=${id}`, {
                method: 'DELETE'
            });
            const updatedData = await response.json();
            setListData(updatedData); // in order to update lists instantly
            // setLength(length - 1);
        } catch (error) {
            alert('Failed to delete list.');
        }
    }

    // handle editing list description
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

        const res = await fetch('/api/edit-list', fetchOptions);
        const updatedData = await res.json();
        close();
        setName(updatedData.name);
        setDescription(updatedData.description);
        setListModified("Updated");
    }

    return (
        <div key={data._id} className={`${styles.listInfo} ${selected && width >= mobileWidth ? styles.selected : ''}`}>
            <p><Link
                href={width < mobileWidth ? `/list/${data._id}` : "#"}
                onClick={() => setCurrentList && setCurrentList({ id: data._id, name: data.name, type: data.type })} >
                {name}
                {/* </Link> ({selected && currentListData ? currentListData.items.length : length}) - {data.type}</p> */}
            </Link> ({data.items.length}) - {data.type}</p>
            {/* currentlistdata is changing later than selected */}
            {data.description &&
                <p className={styles.description}>
                    {expandDescription ?
                        <span>{description} <a onClick={() => setExpandDescription(false)}>Show less</a></span>
                        : description.length > 100 ?
                            <span>{description.slice(0, 100)}... <a onClick={() => setExpandDescription(true)}>Show more</a></span>
                            : description}
                </p>
            }
            {selected && <div className={styles.selected}></div>}
            <svg width="15px" height="15px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000" className={styles.kebab} onClick={() => setShowEditOptions(!showEditOptions)}>
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
            </svg>

            {/* List options modal */}
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

            {/* Delete modal */}
            {confirmDelete &&
                <Modal toggleModal={close}>
                    <div className={styles.editContainer}>
                        <p>Are you sure you want to delete <u><strong>{name}</strong></u>?</p>
                        <button onClick={(e) => {
                            e.preventDefault();
                            close();
                            handleDelete(data._id);
                            setListModified("Deleted");
                            if (selected) setCurrentList && setCurrentList(null);
                        }} className={`${styles.editButton} ${styles.delete}`}>
                            Delete list
                        </button>

                        <button className={styles.editButton} onClick={close}>
                            Cancel
                        </button>
                    </div>
                </Modal>}

            {/* Edit modal */}
            {editMode &&
                <Modal toggleModal={close}>
                    <form className={`flex-column ${styles.form}`} onSubmit={handleListUpdate} method="POST">
                        <div className={styles.formRow}>
                            <label>Name: </label>
                            <input className={styles.formInput} type="text" name="name" defaultValue={name} required />
                        </div>
                        <div className={styles.formRow}>
                            <label>Description: </label>
                            <textarea name="description" defaultValue={description}></textarea>
                        </div>
                        <div className={styles.formRow}>
                            <input className={styles.editButton} type="submit" value="Save edits" />
                        </div>
                    </form>
                </Modal>}
        </div>
    );
}

interface ListContainerProps {
    lists: ListData[],
    setListData: React.Dispatch<React.SetStateAction<ListData[]>>,
    setListModified: React.Dispatch<React.SetStateAction<"Deleted" | "Updated" | null>>
}

// List Container
export const ListContainer: React.FC<ListContainerProps> = ({
    lists,
    setListData,
    setListModified
}) => {
    const currentListContext = useContext(CurrentListContext);
    if (!currentListContext) throw new Error('CurrentListContext is null');
    const { currentList, setCurrentList } = currentListContext;

    // detecting wide mode
    const [width] = useWindowSize();

    const [currentListData, setCurrentListData] = useState<ListData | null>(null);
    const [songAdded, setSongAdded] = useState(false);
    const [changeType, setChangeType] = useState('');
    const [loading, setLoading] = useState(false);
    const [listView, setListView] = useState<"list" | "grid">('list');
    const [sort, setSort] = useState('added');

    useEffect(() => {
        if (currentList !== null) {
            setLoading(true);
            const populateList = async () => {
                const res = await fetch(`/api/get-list?id=${currentList?.id}`);
                const data = await res.json();
                setLoading(false);
                setCurrentListData(await data);
            };
            populateList();
        }
        setSort("added");
    }, [currentList]);

    useEffect(() => {
        if (currentListData) {
            const currentListDataCopy = { ...currentListData };
            const newItems = currentListDataCopy.items.sort((a, b) => {
                if (sort === 'added') {
                    const populateList = async () => {
                        const res = await fetch(`/api/get-list?id=${currentList?.id}`);
                        const data = await res.json();
                        setLoading(false);
                        setCurrentListData(await data);
                    };
                    populateList();
                }
                if (sort === 'name') return a.name.localeCompare(b.name);
                if (sort === 'director') return a.director.localeCompare(b.director);
                if (sort === 'author') return a.author.localeCompare(b.author);
            })
            currentListDataCopy.items = newItems;
            setCurrentListData(currentListDataCopy);
        }
    }, [sort])

    function handleDataChange(changedData, changeType: string) {
        setCurrentListData(changedData);        // all list items
        setSongAdded(true);                     // controls showing of snackbar
        setChangeType(changeType);              // when adding/removing items
    }

    function toggleSort(e) {
        setSort(e.target.value);
    }

    return (
        <div className={`${styles.wideview} ${width < mobileWidth ? styles.mobileview : ''}`}>
            {/* Left */}
            <section className={`${styles.allListsContainer} ${currentList == null || width < mobileWidth ? styles.wide : ''}`}>
                {lists.map((list) => {
                    return <ListBox
                        key={list._id}
                        data={list}
                        setListData={setListData}
                        setListModified={setListModified}
                        selected={width >= mobileWidth && list._id == currentList?.id ? true : false}
                    />;
                })}
            </section>

            {/* Right */}
            {/* {loading && <p>Loading...</p>} */}
            {currentList && width >= mobileWidth && currentListData &&
                <section className={styles.currentListContainer} key={currentList.id}>
                    <div className={styles.currentListTopBar}>
                        <SearchBar listContext={currentList} handleDataChange={handleDataChange} />
                        {/* Shuffle button */}
                        {/* <button className={styles.closeCurrentList} onClick={() => {
                            const rand = Math.floor(Math.random() * currentListData.items.length);
                            console.log(rand);
                            console.log(currentListData.items[rand].name);
                        }}>S</button> */}
                        <div className={styles.controlButtons}>
                            {currentList.type === "Movies" && <select onChange={toggleSort}>
                                <option>added</option>
                                <option>name</option>
                                <option>director</option>
                            </select>}
                            {currentList.type === "Music" && <select onChange={toggleSort}>
                                <option>added</option>
                                <option>name</option>
                            </select>}
                            {currentList.type === "Books" && <select onChange={toggleSort}>
                                <option>added</option>
                                <option>name</option>
                                <option>author</option>
                            </select>}
                            <button onClick={() => setListView(listView === "grid" ? "list" : "grid")}>{listView === "grid" ? "list" : "grid"} view</button>
                            <button className={styles.closeCurrentListButton} onClick={() => {
                                if (setCurrentList) setCurrentList(null);
                                setCurrentListData(null);
                            }}>X</button>
                        </div>
                    </div>
                    <div className={listView === "grid" ? styles.gridViewContainer : styles.listViewContainer}>
                        {currentListData.items.map((item) => {
                            return <ListItem
                                itemData={item}
                                listMetadata={currentList}
                                view={listView}
                                key={item._id}
                                handleDataChange={handleDataChange} // for editing and deleting
                            />
                        })}
                    </div>

                    {songAdded && <Snackbar message={`${changeType} ${currentListData.name}`} toggleShow={setSongAdded} />}
                </section>
            }
        </div>

    );
}

// Main page for now
export default function AllLists({ lists }) {
    // ALL LISTS
    const [listData, setListData] = useState<ListData[]>(lists ? JSON.parse(lists) : []);

    // state used for context!
    const [currentList, setCurrentList] = useState<ListMetadata | null>(null);

    const [type, setType] = useState('Any');
    const [displayType, setDisplayType] = useState('All');

    // control snackbars
    const [listModified, setListModified] = useState<"Deleted" | "Updated" | null>(null);

    // runs every time filter type changes
    useEffect(() => {
        const filtered = JSON.parse(lists).filter((list) => {
            if (type == "Any") return true;
            return list.type == type;
        });
        setListData(filtered);
    }, [type, lists]);

    function toggleType(e) {
        if (e.target.value != "Any" && (currentList && e.target.value != currentList.type)) setCurrentList(null);
        setType(e.target.value);
        if (e.target.value == "Any") setDisplayType("All");
        if (e.target.value == "Movies") setDisplayType("Movie");
        if (e.target.value == "Music") setDisplayType("Music");
        if (e.target.value == "Books") setDisplayType("Book");
    }

    return (
        <Layout>
            <Head>
                <title>Dejumbler - All Lists</title>
            </Head>

            <div className={styles.topBar}>
                <h2>{displayType} Lists ({listData.length})</h2>
                <div>
                    <label>Filter: </label>
                    <select className={styles.filterSelect} name="type" onChange={toggleType} required>
                        <option value="Any">All</option>
                        <option value="Music">Music</option>
                        <option value="Movies">Movies</option>
                        <option value="Books">Books</option>
                    </select>
                </div>
            </div>

            {/* {listData.length == 0 && <h1>Make some lists!</h1>} */}

            <CurrentListContext.Provider value={{ currentList, setCurrentList }}>
                <ListContainer
                    lists={listData}
                    setListData={setListData}
                    setListModified={setListModified} />
            </CurrentListContext.Provider>

            {/* Snackbar */}
            {listModified && <Snackbar message={`${listModified} list`} toggleShow={setListModified} />}
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);

    // Block non-logged in users
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const { user } = session;
    console.log(user);

    // Get lists with direct mongoose call
    await dbConnect();
    const result = await List.find({ user: user.id });
    console.log(result);

    return {
        props: {
            lists: JSON.stringify(result)
        }
    }
}