import Layout from "../components/layout";
import { useSession } from "next-auth/react";
import styles from "../styles/CreateList.module.css";

export default function AllLists() {
    const session = useSession();

    if (!session.data) return (
        <Layout>
            <h2>You must be signed in to create lists.</h2>
        </Layout>
    );

    return (
        <Layout>
            <h2>Create List</h2>
            <form className={styles.form} action="/api/new-list" method="POST">
                <div className={styles.formRow}>
                    <label>Type: </label>
                    <select className={styles.type} id="types" list="types" name="type" required>
                        <option value="Any">Any</option>
                        <option value="Books">Books</option>
                        <option value="Movies">Movies</option>
                        <option value="Music">Music</option>
                    </select>
                </div>
                <div className={styles.formRow}>
                    <label>Name: </label>
                    <input className={styles.nameInput} type="text" name="name" required />
                </div>
                <div className={styles.formRow}>
                    <label>Description: </label>
                    <textarea type="text" name="description"></textarea>
                </div>
                <div className={styles.formRow}>
                    <input type="submit" value="Create List" />
                </div>
            </form>
        </Layout>
    )
}