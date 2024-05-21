import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import styles from './navbar.module.css';

import Modal from "../Modal/modal";

import { useSession, signOut } from "next-auth/react";

import { addIcon, settingsIcon, profileIcon, listIcon } from "./icons";
const colors = ['red', 'orange', 'yellow', 'green', 'lightblue', 'indigo', 'violet'];

export default function Navbar({ changeMode }) {
    // can probably refactor to just one state
    const [showModal, setShowModal] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const [accentColor, setAccentColor] = useState('green');

    const { data } = useSession();

    const buttonRef = useRef();
    const containerRef = useRef<HTMLDivElement>(null);

    // have to do this on client side
    useEffect(() => {
        const check = localStorage.getItem('accent') as string;
        check && setAccentColor(localStorage.getItem('accent') ?? 'green');
    }, [])

    function toggleModal() {
        setShowModal(!showModal);
    }

    function changeAccentColor(color) {
        document.documentElement.style.setProperty('--accent-color', color);
        setAccentColor(color);
        localStorage.setItem('accent', color);
    }

    return (
        <nav className={styles.navbarBack}>
            <div className={styles.navbarContainer} ref={containerRef}>
                <div className={styles.navbar}>
                    {/* Logo / Dark mode toggler */}
                    <svg onClick={changeMode} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.5 283.5" className={styles.smallLogo}>
                        <path
                            d="M0 0v283.5h283.5V0H0Zm221.55 108.55h-16v-40h16v40Z"
                            style={{
                                strokeWidth: 0,
                            }}
                        />
                    </svg>

                    {/* All lists button */}
                    <Link className={styles.icon} href="/all-lists" aria-label="All Lists">
                        {listIcon}
                    </Link>

                    {/* Profile button */}
                    <div onClick={() => setShowProfile(!showProfile)} className={styles.icon} role="button">
                        {profileIcon}
                    </div>

                    {/* Settings button */}
                    <div onClick={() => setShowSettings(!showSettings)} className={styles.icon} role="button">
                        {settingsIcon}
                    </div>
                </div>
                {/* New list button */}
                <span onClick={() => setShowModal(!showModal)} className={styles.icon} role="button">
                    {addIcon}
                </span>
            </div>

            {/* New list modal */}
            {showModal && <Modal toggleModal={toggleModal}>
                <form className={`flex-column ${styles.form}`} action="/api/new-list" method="POST">
                    <button className={styles.formCloseButton} onClick={toggleModal}>X</button>
                    <div className={styles.formTypeRow}>
                        <label>Type: </label>
                        <select className={styles.formTypeSelect} id="types" name="type" required>
                            <option value="Music">Music</option>
                            <option value="Books">Books</option>
                            <option value="Movies">Movies</option>
                        </select>
                    </div>
                    <div className={styles.formRow}>
                        <label>Name: </label>
                        <input className={styles.formNameInput} type="text" name="name" required />
                    </div>
                    <div className={styles.formRow}>
                        <label>Description: </label>
                        <textarea className={styles.formDescriptionBox} name="description"></textarea>
                    </div>
                    <div className={styles.formRow}>
                        <input className={styles.formSubmitButton} type="submit" value="Create List" />
                    </div>
                </form>
            </Modal>}

            {/* Profile modal */}
            {showProfile && data &&
                <Modal toggleModal={() => setShowProfile(!showProfile)}>
                    <div className={`flex-column ${styles.loggedInWrapper}`}>
                        <p>Signed in as: <u><strong>{data.user.name}</strong></u></p>
                        <button onClick={() => signOut()} className={styles.signoutButton}>Sign out</button>
                    </div>
                </Modal>
            }

            {/* Settings modal */}
            {showSettings &&
                <Modal toggleModal={() => setShowSettings(!showSettings)}>
                    <div className={styles.settingsContainer}>
                        <div className={styles.darkMode}>
                            <p>Dark Mode</p>
                            <button onClick={changeMode} className={styles.toggleModeButton}>Toggle</button>
                        </div>
                        <div>
                            <p>Accent Color</p>
                            <div className={styles.colorPicker}>
                                {colors.map((color) => {
                                    return <div
                                        key={color}
                                        style={{ backgroundColor: color }}
                                        className={color === accentColor ? `${styles.colorSquare} ${styles.selectedColor}` : styles.colorSquare}
                                        onClick={() => changeAccentColor(color)}
                                        aria-label={color}>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                </Modal>
            }
        </nav>
    )
}