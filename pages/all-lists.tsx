import { createContext, useContext, useEffect, useState } from "react";
import dbConnect from "../lib/mongodb";
import List from "../models/List";
import Layout, { WindowSizeContext } from "../components/layout";
import Snackbar from "../components/snackbar";
import ListItem from "../components/list-item";
import SearchBar from "../components/search";
import Link from "next/link";
import Head from "next/head";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"


import useWindowSize from "../lib/useWindowSize";
import { useQueryParams, withDefault, StringParam, QueryParamConfig } from "use-query-params";
import styles from "../styles/AllLists.module.css";

const mobileWidth = 600;

import { ListMetadata, ListData, CurrentListContextType } from "../types/dejumbler-types";
import { Button } from "../components/ui/button";
import { Kebab } from "../components/ui/kebab";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
export const CurrentListContext = createContext<CurrentListContextType | null>(null);

export interface AllListsPageQueryParams {
  listId: string;
}

interface ListBoxProps {
  data: ListData;
  setListData: React.Dispatch<React.SetStateAction<ListData[]>>;
  setListModified: React.Dispatch<React.SetStateAction<"Deleted" | "Updated" | null>>;
  selected: boolean;
}

export const ListBox: React.FC<ListBoxProps> = ({
  data,
  setListData,
  setListModified,
  selected,
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
      </Link> ({data.items.length}) - {data.type}</p>
      {/* currentlistdata is changing later than selected */}
      {data.description &&
        <p className="font-mono text-sm">
          {expandDescription ?
            <span>{description} <a onClick={() => setExpandDescription(false)}>Show less</a></span>
            : description.length > 100 ?
              <span>{description.slice(0, 100)}... <a onClick={() => setExpandDescription(true)}>Show more</a></span>
              : description}
        </p>
      }
      {selected && <div className={styles.selected}></div>}

      {/* List options modal */}
      <Dialog>
        <DialogTrigger asChild className="self-end w-auto border-none hover:border-1 hover:bg-none">
          <svg
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            className="self-end border-none h-6 p-1 
            fill-[var(--main-text-color)] 
            hover:fill-[var(--accent-color)] hover:cursor-pointer"
            onClick={() => setShowEditOptions(!showEditOptions)}
          >
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="m-0">Edit List</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          {/* nested dialog */}
          <Dialog>
            <DialogTrigger asChild className="self-end w-auto hover:border-1 hover:bg-none">
              <Button variant="ghost">
                Edit list
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="m-0">Edit Description</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you are done.
                </DialogDescription>
              </DialogHeader>
              <form className={`flex-column ${styles.form}`} onSubmit={handleListUpdate} method="POST">
                <div className={styles.formRow}>
                  <Label>Name</Label>
                  <input className={styles.formInput} type="text" name="name" defaultValue={name} required />
                </div>
                <div className={styles.formRow}>
                  <Label>Description</Label>
                  <textarea name="description" defaultValue={description}></textarea>
                </div>
                <div className={styles.formRow}>
                  <Button type="submit" variant="ghost">Save edits</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild className="self-end w-auto hover:border-1 hover:bg-none">
              <Button
                className="hover:bg-red-600 hover:text-white"
                variant="ghost"
              >
                Delete list
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="m-0"><p>Are you sure you want to delete <u><strong>{name}</strong></u>?</p></DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 items-center text-center">
                <Button onClick={(e) => {
                  e.preventDefault();
                  close();
                  handleDelete(data._id);
                  setListModified("Deleted");
                  if (selected) setCurrentList && setCurrentList(null);
                }} className="text-base w-[100%] text-red-600" variant="ghost"
                >
                  Yes, delete list
                </Button>

                <DialogClose asChild>
                  <Button className="w-[100%]" type="button" variant="ghost">
                    No, close
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>


        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ListContainerProps {
  lists: ListData[];
  setListData: React.Dispatch<React.SetStateAction<ListData[]>>;
  setListModified: React.Dispatch<React.SetStateAction<"Deleted" | "Updated" | null>>;
}

// List Container
export const ListContainer: React.FC<ListContainerProps> = ({
  lists,
  setListData,
  setListModified,
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
      // setLoading(true);
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
              {currentList.type === "Movies" &&
                <Select onValueChange={(val) => setSort(val)} defaultValue="added">
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="added">added</SelectItem>
                    <SelectItem value="name">name</SelectItem>
                    <SelectItem value="director">director</SelectItem>
                  </SelectContent>
                </Select>}
              {currentList.type === "Music" &&
                <Select onValueChange={(val) => setSort(val)} defaultValue="added">
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="added">added</SelectItem>
                    <SelectItem value="name">name</SelectItem>
                  </SelectContent>
                </Select>}
              {currentList.type === "Books" &&
                <Select onValueChange={(val) => setSort(val)} defaultValue="added">
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="added">added</SelectItem>
                    <SelectItem value="name">name</SelectItem>
                    <SelectItem value="author">author</SelectItem>
                  </SelectContent>
                </Select>}
              <Button className="h-8" onClick={() => setListView(listView === "grid" ? "list" : "grid")} variant="ghost">
                {listView === "grid" ? "list" : "grid"} view
              </Button>
              <Button className="h-8" onClick={() => {
                if (setCurrentList) setCurrentList(null);
                setCurrentListData(null);
              }} variant="destructive">X</Button>
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

  function toggleType(type) {
    if (type != "Any" && (currentList && type != currentList.type)) setCurrentList(null);
    setType(type);
    if (type == "Any") setDisplayType("All");
    if (type == "Movies") setDisplayType("Movie");
    if (type == "Music") setDisplayType("Music");
    if (type == "Books") setDisplayType("Book");
  }

  return (
    <Layout>
      <Head>
        <title>Dejumbler - All Lists</title>
      </Head>

      <div className="flex items-center justify-between">
        <h2>{displayType} Lists ({listData.length})</h2>
        <div>
          <Select onValueChange={toggleType} defaultValue="Any">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Any">All</SelectItem>
              <SelectItem value="Music">Music</SelectItem>
              <SelectItem value="Movies">Movies</SelectItem>
              <SelectItem value="Books">Books</SelectItem>
            </SelectContent>
          </Select>
          {/* <label>Filter: </label>
          <select className="border border-[--var(accent-color)] bg-[var(--background-color)] h-10" name="type" onChange={toggleType} required>
            <option value="Any">All</option>
            <option value="Music">Music</option>
            <option value="Movies">Movies</option>
            <option value="Books">Books</option>
          </select> */}
        </div>
      </div>

      {/* {listData.length == 0 && <h1>Make some lists!</h1>} */}

      <CurrentListContext.Provider value={{ currentList, setCurrentList }}>
        <ListContainer
          lists={listData}
          setListData={setListData}
          setListModified={setListModified}
        />
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