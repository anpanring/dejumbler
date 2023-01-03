import React from "react";
import styles from '../styles/ListPage.module.css';

class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.data = props.data;
    }

    render() {
        return (
            <div className={styles.listItem}>
                <img src={this.data.artURL} width={50} height={50} />
                <div className={styles.listItemText}>
                    <p>{this.data.name}</p>
                    <div className={styles.listItemActions}>
                        <a href='google.com'>Edit</a>
                        <a href='google.com'>Remove</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default ListItem;