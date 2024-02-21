import Link from "next/link";
import styles from './navbar.module.css';
import Modal from "./modal";
import { useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";

const colors = ['red', 'orange', 'yellow', 'green', 'lightblue', 'indigo', 'violet'];

export default function Navbar({ changeMode }) {
    const [showModal, setShowModal] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [accentColor, setAccentColor] = useState('green');

    const { data, status } = useSession();

    const buttonRef = useRef();
    const containerRef = useRef();

    function toggleModal() {
        setShowModal(!showModal);
    }

    function changeAccentColor(color) {
        document.documentElement.style.setProperty('--accent-color', color);
        setAccentColor(color);
    }

    return (
        <div className={styles.navbarBack}>
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
                    {/* <Link className={styles.link} href="/">
                        <span className={`material-symbols-outlined ${styles.icon}`}>
                            home
                        </span>
                    </Link> */}
                    <Link className={styles.link} href="/all-lists">
                        <span className={`material-symbols-outlined ${styles.icon}`}>
                            format_list_bulleted
                        </span>
                    </Link>
                    <span onClick={() => setShowProfile(!showProfile)} className={`material-symbols-outlined ${styles.icon}`}>
                        person
                    </span>
                    <span onClick={() => setShowSettings(!showSettings)} className={`material-symbols-outlined ${styles.icon}`}>
                        settings
                    </span>
                </div>
                <span
                    onClick={toggleModal}
                    ref={buttonRef}
                    className={`material-symbols-outlined ${styles.icon}`}>
                    add
                </span>
            </div>
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
            {showProfile && data &&
                <Modal toggleModal={() => setShowProfile(!showProfile)}>
                    <div className={styles.loggedInWrapper}>
                        <p>Signed in as: <u><strong>{data.user.name}</strong></u></p>
                        <button href="#" onClick={() => signOut()} className={styles.signoutButton}>Sign out</button>
                    </div>
                </Modal>
            }
            {showSettings &&
                <Modal toggleModal={() => setShowSettings(!showSettings)}>
                    <div>
                        <p>Accent Color</p>
                        <div className={styles.colorPicker}>
                            {colors.map((color) => {
                                if(color === accentColor) {
                                    return <div key={color} style={{ backgroundColor: color}} className={`${styles.color} ${styles.selectedColor}`} onClick={() => changeAccentColor(color)}></div>
                                }
                                return <div key={color} style={{ backgroundColor: color}} className={styles.color} onClick={() => changeAccentColor(color)}></div>
                            })}
                        </div>
                    </div>
                </Modal>
            }

        </div>

    )
}