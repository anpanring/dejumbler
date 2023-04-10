import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <hr className={styles.hr} />
            <ul className={styles.navItems}>
                {/* <li className={styles.navItem}>
                    <a href="" target="_blank" rel="noreferrer">Documentation</a>
                </li>
                <li className={styles.navItem}>
                    <a href="" target="_blank" rel="noreferrer">NPM</a>
                </li> */}
                <li className={styles.navItem}>
                    <a href="https://github.com/anpanring/dejumbler" target="_blank" rel="noreferrer">GitHub</a>
                </li>
            </ul>
        </footer>
    );
}