import Link from "next/link";
import styles from './navbar.module.css';
import Modal from "./modal";
import { useRef, useState } from "react";
import { gsap } from "gsap";

export default function Navbar({ changeMode, showProfile, setShowProfile }) {
    const [showModal, setShowModal] = useState(false);
    const buttonRef = useRef();
    const containerRef = useRef();

    function toggleModal() {
        setShowModal(!showModal);
    }

    return (
        <div className={styles.navbarContainer} ref={containerRef}>
            <div className={styles.navbar}>
                <svg onClick={changeMode} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.5 283.5" className={styles.smallLogo}>
                    <path
                        d="M0 0v283.5h283.5V0H0Zm221.55 108.55h-16v-40h16v40Z"
                        style={{
                            strokeWidth: 0,
                        }}
                    />
                </svg>
                <Link className={styles.link} href="/">
                    <span className={`material-symbols-outlined ${styles.icon}`}>
                        home
                    </span>
                </Link>
                <Link className={styles.link} href="/all-lists">
                    <span className={`material-symbols-outlined ${styles.icon}`}>
                        format_list_bulleted
                    </span>
                </Link>
                <span onClick={() => setShowProfile(!showProfile)} className={`material-symbols-outlined ${styles.icon}`}>
                    person
                </span>
                <span className={`material-symbols-outlined ${styles.icon}`}>
                    settings
                </span>
            </div>
            {!showModal &&
                <span
                    onClick={toggleModal}
                    ref={buttonRef}
                    className={`material-symbols-outlined ${styles.icon}`}>
                    add
                </span>}

            {showModal && <Modal className="modal" toggleModal={toggleModal}>
                <form className={styles.form} action="/api/new-list" method="POST">
                    <button className={styles.closeButton} onClick={toggleModal}>X</button>
                    <div className={styles.formTypeRow}>
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
                        <textarea className={styles.description} type="text" name="description"></textarea>
                    </div>
                    <div className={styles.formRow}>
                        <input className={styles.submitButton} type="submit" value="Create List" />
                    </div>
                </form>
            </Modal>}
        </div>
    )
}