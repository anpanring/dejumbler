import React, { useState } from "react";

import styles from '../styles/ListPage.module.css';

import { IAlbum, IArtist, IBook, IItem, IMovie, ISong } from "../models/definitions.types";
import { HydratedDocument } from "mongoose";

function ListItem({ data, listId, handleDataChange, type }) {
    const [notes, setNotes] = useState(data.notes);
    const [showForm, setShowForm] = useState(false);

    async function handleDelete() {
        const fetchOptions = {
            method: 'POST',
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify({
                data: data,
                listId: listId
            }),
        };

        const updatedList = fetch('/api/remove-item', fetchOptions)
            .then(res => res.json());

        handleDataChange(await updatedList, data.name + ' removed from ');
    }

    async function handleNoteChange(e) {
        e.preventDefault();

        const itemInfo = {
            itemId: data._id,
            listId: listId,
            updatedNotes: e.target.notes.value
        }

        const fetchOptions = {
            method: 'POST',
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify(itemInfo),
        };

        fetch('/api/edit-list-item', fetchOptions)
            .then(response => response.json())
            .then((data) => {
                setNotes(data.notes);
                setShowForm(!showForm);
            });
    }

    if (type === "Movies") {
        return (
            <div className={styles.listItem} >
                <img className={styles.listItemArt} src={data.artURL} alt={data.name} />

                <div className={styles.listItemText}>
                    <p className={styles.itemInfo}> {data.name} </p>

                    {
                        !showForm && <p className={styles.notes}> Notes: {notes} </p>}
                    {
                        showForm ? <form onSubmit={handleNoteChange} className={styles.notesForm} >
                            <textarea name="notes" defaultValue={notes} className={styles.notesInput} />
                            <div className={styles.notesEditButtons}>
                                <button className={styles.button} type="submit" > Save </button>
                                <button className={styles.button} onClick={() => setShowForm(!showForm)
                                }> Cancel </button>
                            </div>
                        </form> : null}

                    {
                        !showForm && <div className={styles.listItemActions}>
                            <button className={styles.button} onClick={() => setShowForm(!showForm)
                            }> Edit </button>
                            <button className={styles.button} onClick={handleDelete} > Remove </button>
                        </div>}
                </div>
            </div >
        );
    } else if (type === "Books") {
        return (
            <div className={styles.listItem} >
                <img className={styles.listItemArt} src={data.artURL} alt={data.name} />

                <div className={styles.listItemText}>
                    <p className={styles.itemInfo}> {data.name} </p>
                    <p className={styles.artistRow} > {data.author}({data.year}) </p>

                    {
                        !showForm && <p className={styles.notes}> Notes: {notes} </p>}
                    {
                        showForm ? <form onSubmit={handleNoteChange} className={styles.notesForm} >
                            <textarea name="notes" defaultValue={notes} className={styles.notesInput} />
                            <div className={styles.notesEditButtons}>
                                <button className={styles.button} type="submit" > Save </button>
                                <button className={styles.button} onClick={() => setShowForm(!showForm)
                                }> Cancel </button>
                            </div>
                        </form> : null}

                    {
                        !showForm && <div className={styles.listItemActions}>
                            <button className={styles.button} onClick={() => setShowForm(!showForm)
                            }> Edit </button>
                            <button className={styles.button} onClick={handleDelete} > Remove </button>
                        </div>}
                </div>
            </div >
        );
    } else {
        return ( // Music
            <div className={styles.listItem} >
                <img className={styles.listItemArt} src={data.artURL} alt={data.name} />

                <div className={styles.listItemText}>
                    <p className={styles.itemInfo}> {data.name} </p>

                    {data.artist ?
                        <p className={styles.artistRow}> {data.artist} - {data.__t} </p>
                        : <p className={styles.artistRow}> {data.__t} </p>}


                    {!showForm && <p className={styles.notes}> Notes: {notes} </p>}

                    {
                        showForm ? <form onSubmit={handleNoteChange} className={styles.notesForm} >
                            <textarea name="notes" defaultValue={notes} className={styles.notesInput} />
                            <div className={styles.notesEditButtons}>
                                <button className={styles.button} type="submit" > Save </button>
                                <button className={styles.button} onClick={() => setShowForm(!showForm)
                                }> Cancel </button>
                            </div>
                        </form> : null}

                    {
                        !showForm && <div className={styles.listItemActions}>
                            <button className={styles.button} onClick={() => setShowForm(!showForm)
                            }> Edit </button>
                            <button className={styles.button} onClick={handleDelete} > Remove </button>
                        </div>}
                </div>
            </div >
        );
    }
}

export default ListItem;