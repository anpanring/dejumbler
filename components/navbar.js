import Link from "next/link";
import styles from './navbar.module.css';
import Modal from "./modal";
import { useRef, useState } from "react";
import { gsap } from "gsap";

export default function Navbar() {
    const [showModal, setShowModal] = useState(false);
    const buttonRef = useRef();
    const containerRef = useRef();

    function handleCreate() {
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
            <button
                onClick={handleCreate}
                href="#"
                className={styles.createButton}
                ref={buttonRef}>
                +
            </button>
            <Modal className="modal" show={showModal} />
        </div>
    )
}