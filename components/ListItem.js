import React from "react";
import Router from 'next/router';
import styles from '../styles/ListPage.module.css';

class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.data = props.data;
        this.listId = props.listId;
        this.handleDelete = this.handleDelete.bind(this);
    }

    async handleDelete() {
        var itemInfo = this.data;
        itemInfo.listId = this.listId;
        console.log(itemInfo)

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

    render() {
        return (
            <div className={styles.listItem}>
                <img src={this.data.artURL} width={50} height={50} />
                <div className={styles.listItemText}>
                    <p>{this.data.name} {this.data.artist}</p>
                    <p className={styles.notes}>Notes: {this.data.notes}</p>
                    <div className={styles.listItemActions}>
                        <button className={styles.button}>Edit</button>
                        <button className={styles.button} onClick={this.handleDelete}>Remove</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ListItem;