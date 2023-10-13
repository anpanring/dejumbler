import Link from "next/link";
import styles from './navbar.module.css';
import Modal from "./modal";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useSession } from "next-auth/react";

export default function Navbar() {
    const [showModal, setShowModal] = useState(false);
    const buttonRef = useRef();
    const containerRef = useRef();
    const session = useSession();

    function toggleModal() {
        setShowModal(!showModal);
        // gsap.fromTo(buttonRef.current,
        //     {
        //         width: "-=5",
        //         height: "-=5",
        //         duration: 0.1,
        //     },
        //     {
        //         width: "+=5",
        //         height: "+=5",
        //         duration: 0.1,
        //     },
        // );
    }

    return (
        <div className={styles.navbarContainer} ref={containerRef}>
            <div className={styles.navbar}>
                <Link href="/">Home</Link> |
                <Link href="/all-lists">My Lists</Link>
            </div>
            {!showModal && <button
                onClick={toggleModal}
                href="#"
                className={styles.createButton}
                ref={buttonRef}>
                +
            </button>}
            <Modal className="modal" show={showModal} toggleModal={toggleModal}>
                <form className={styles.form} action="/api/new-list" method="POST">
                    <button className={styles.closeButton} onClick={toggleModal}>X</button>
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
                        <textarea className={styles.description} type="text" name="description"></textarea>
                    </div>
                    <div className={styles.formRow}>
                        <input className={styles.createButtonForm} type="submit" value="Create List" />
                    </div>
                </form>
            </Modal>
        </div>
    );
}