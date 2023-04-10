import Footer from './footer';
import styles from './layout.module.css';
import Link from 'next/link';
import Login from './login';
// import localFont from 'next/font/local';

// const myFont = localFont({ src: './Dejumbler-Regular.ttf' });

export default function Layout({ children }) {
    return (
        <div className={styles.wrapper}>
            <Login />
            {/* <div id="hd"> */}
            {/* <div>
                    <p>Logged in as: (<a href="/logout">Logout</a>)</p>
                </div>
                <div>
                    <p>Logged in to Spotify as: </p>
                </div> */}
            <h1 className={styles.dejumblerTitle}>Dejumbler</h1>
            {/* <img src="/dejumbler-text-logo.png" className={styles.dejumblerTitle}></img> */}
            {/* </div> */}
            <div className={styles.navbar}>
                <Link href="/">Home</Link> |
                <Link href="/all-lists">All Lists</Link> |
                <Link href="/create-list">Create a New List</Link>
            </div>
            <div>
                {children}
            </div>
            <Footer />
        </div>
    );
}