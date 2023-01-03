import styles from './layout.module.css';
import Link from 'next/link';

export default function Layout({ children }) {
    return (
        <div id="wrapper">
            <div id="hd">
                <div>
                    <p>Logged in as: (<a href="/logout">Logout</a>)</p>
                </div>
                <div>
                    <p>Logged in to Spotify as: </p>
                </div>
                <h1 className='dejumbler-title'>Dejumbler</h1>
            </div>
            <div className={styles.navbar}>
                <Link href="/">Home</Link> |
                <Link href="/all-lists">All Lists</Link> |
                <Link href="/create-list">Create a New List</Link>
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}