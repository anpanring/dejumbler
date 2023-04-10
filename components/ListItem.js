import Image from 'next/image';
import React from "react";
import Router from 'next/router';
import styles from '../styles/ListPage.module.css';

class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.data = props.data;
        this.state = { notes: this.data.notes, showForm: false };
        this.listId = props.listId;
        this.handleDelete = this.handleDelete.bind(this);
        this.handleNoteChange = this.handleNoteChange.bind(this);
        this.toggleEditForm = this.toggleEditForm.bind(this);
    }

    async handleDelete() {
        var itemInfo = this.data;
        itemInfo.listId = this.listId;
        // console.log(itemInfo)

        const fetchOptions = {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(itemInfo),
        };

        await fetch('/api/remove-item', fetchOptions);

        Router.push(`/list/${this.listId}`);
    }

    toggleEditForm() {
        this.state.showForm ? this.setState({ showForm: false }) : this.setState({ showForm: true });
        console.log(this.state.showForm);
    }

    async handleNoteChange(event) {
        event.preventDefault();

        var itemInfo = {
            itemId: this.data._id,
            listId: this.listId,
            updatedNotes: event.target.notes.value
        }

        const fetchOptions = {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(itemInfo),
        };

        await fetch('/api/edit-list-item', fetchOptions)
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                this.setState({ notes: data.notes });
                this.toggleEditForm();
            });
    }

    render() {
        return (
            <div className={styles.listItem}>
                <img src={this.data.artURL} width={50} height={50} />
                <div className={styles.listItemText}>
                    <p>{this.data.name} {this.data.artist}</p>
                    <p className={styles.notes}>Notes: {this.state.notes} </p>
                    {this.state.showForm ? <form onSubmit={this.handleNoteChange} className={styles.notesForm}>
                        <input type="text" name="notes" defaultValue={this.state.notes} />
                        <button className={styles.button} type="submit">Save</button>
                        <button className={styles.button} onClick={this.toggleEditForm}>Cancel</button>
                    </form> : null}
                    <div className={styles.listItemActions}>
                        <button className={styles.button} onClick={this.toggleEditForm}>Edit</button>
                        <button className={styles.button} onClick={this.handleDelete}>Remove</button>
                    </div>
                </div>
            </div >
        )
    }
}

export default ListItem;