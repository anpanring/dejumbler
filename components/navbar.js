import Link from "next/link";
import styles from './navbar.module.css';
import Modal from "./modal";
import { useRef, useState } from "react";
import { gsap } from "gsap";

export default function Navbar() {
    const [showModal, setShowModal] = useState(false);
    const buttonRef = useRef();

    function handleCreate() {
        setShowModal(!showModal);
        gsap.to(buttonRef, {
            rotate: 360
        });
    }

    return (
        <div className={styles.navbarContainer}>
            <div className={styles.navbar}>
                <Link href="/">Home</Link> |
                <Link href="/all-lists">All Lists</Link>
            </div>
            <button onClick={handleCreate} href="#" className={styles.createButton} ref={buttonRef}>+</button>
            <Modal className="modal" show={showModal} />
        </div>
    )
}