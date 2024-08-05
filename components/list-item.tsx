/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

import styles from '../styles/ListPage.module.css';
import { ListMetadata } from "../types/dejumbler-types";
import { deleteIcon, editIcon } from "./navbar/icons";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

function ListItem({ itemData, listMetadata, handleDataChange, view }: {
  itemData: any,
  listMetadata: ListMetadata,
  handleDataChange: (updatedList: any, message: string) => void,
  view: "list" | "grid"
}) {
  const [notes, setNotes] = useState(itemData.notes);
  const [showNotesForm, setShowNotesForm] = useState(false);

  async function handleDelete() {
    const fetchOptions = {
      method: 'DELETE',
      headers: { "Content-Type": 'application/json' },
      // body: JSON.stringify({
      //     itemId: itemData._id,
      //     listId: listMetadata.id
      // }),
    };

    const response = await fetch(`/api/remove-item?list=${listMetadata.id}&item=${itemData._id}`, fetchOptions);
    const updatedList = await response.json();

    // set state in parent component
    handleDataChange(updatedList, itemData.name + ' removed from ');
  }

  async function handleNoteChange(e) {
    e.preventDefault();

    const itemInfo = {
      itemId: itemData._id,
      listId: listMetadata.id,
      updatedNotes: e.target.notes.value
    }

    const fetchOptions = {
      method: 'POST',
      headers: { "Content-Type": 'application/json' },
      body: JSON.stringify(itemInfo),
    };

    const response = await fetch('/api/edit-list-item', fetchOptions)
    const updatedData = await response.json();

    setNotes(updatedData.notes);
    setShowNotesForm(!showNotesForm);
  }

  let listInfoComponent;
  if (listMetadata.type === "Movies") {
    listInfoComponent = <>
      <p className={styles.itemInfo}> {itemData.name} </p>
      <p className={styles.listItemType}>{itemData.director && `Dir. ${itemData.director}`} {itemData.year && `(${itemData.year})`}</p>
    </>
  } else if (listMetadata.type === "Books") {
    listInfoComponent = <>
      <p className={styles.itemInfo}> {itemData.name} </p>
      <p className={styles.listItemType}>{itemData.author} ({itemData.year})</p>
    </>
  } else { // Music
    listInfoComponent = <>
      <p className={styles.itemInfo}> {itemData.name} </p>

      {itemData.artist ?
        <p className={styles.listItemType}> {itemData.artist} - {itemData.__t} </p>
        : <p className={styles.listItemType}> {itemData.__t} </p>}
    </>
  }

  return (
    <div className={styles.listItem}>
      <img className={styles.listItemArt} src={itemData.artURL} alt={itemData.name} loading="lazy" />

      <div className={styles.listItemText}>
        {listInfoComponent}

        {!showNotesForm && <p className={styles.listItemNotes}> Notes: {notes}</p>}

        {showNotesForm ? <form onSubmit={handleNoteChange} className={styles.notesForm} >
          <textarea name="notes" defaultValue={notes} className={styles.notesInput} />
          <div className={styles.notesEditButtons}>
            <Button className={styles.button} type="submit">Save</Button>
            <Button className={styles.button} onClick={() => setShowNotesForm(!showNotesForm)
            }>Cancel</Button>
          </div>
        </form> : null}

        {!showNotesForm && <div className={styles.listItemActions}>
          <div
            className={styles.editButton}
            onClick={() => setShowNotesForm(!showNotesForm)}
            role="button"
          >
            {editIcon}
            <p>edit</p>
          </div>
          <div
            className={styles.deleteButton}
            onClick={handleDelete}
            role="button"
          >
            {deleteIcon}
            <p>delete</p>
          </div>
        </div>}
      </div>
    </div >
  );
}

export default ListItem;