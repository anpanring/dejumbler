import Image from 'next/image';
import React, { useState } from "react";
import styles from '../styles/ListPage.module.css';

function ListItem({ data, listId, handleDataChange }) {
    const [notes, setNotes] = useState(data.notes);
    const [showForm, setShowForm] = useState(false);

    async function handleDelete() {
        const itemInfo = data;
        itemInfo.listId = listId;

        const fetchOptions = {
            method: 'POST',
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify(itemInfo),
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
                toggleEditForm();
            });
    }

    function toggleEditForm() {
        setShowForm(!showForm);
    }

    return (
        <div className={styles.listItem}>
            <Image className={styles.listItemArt} src={data.artURL} width={50} height={50} alt={data.name} />

            <div className={styles.listItemText}>
                <p className={styles.itemInfo}>{data.name}</p>

                {data.artist ?
                    <p className={styles.artistRow}>{data.artist} - {data.__t}</p>
                    : <p className={styles.artistRow}>{data.__t}</p>}

                {!showForm && <p className={styles.notes}>Notes: {notes} </p>}
                {showForm ? <form onSubmit={handleNoteChange} className={styles.notesForm}>
                    <textarea type="text" name="notes" defaultValue={notes} className={styles.notesInput} />
                    <div className={styles.notesEditButtons}>
                        <button className={styles.button} type="submit">Save</button>
                        <button className={styles.button} onClick={toggleEditForm}>Cancel</button>
                    </div>
                </form> : null}

                {!showForm && <div className={styles.listItemActions}>
                    <button className={styles.button} onClick={toggleEditForm}>Edit</button>
                    <button className={styles.button} onClick={handleDelete}>Remove</button>
                </div>}
            </div>
        </div >
    );
}

export default ListItem;