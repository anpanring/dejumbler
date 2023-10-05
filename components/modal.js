import { useLayoutEffect, useRef } from "react";
import styles from "../styles/CreateList.module.css";
import { gsap, CSSPlugin } from "gsap";

export default function Modal({ show }) {
    const comp = useRef();
    const boxRef = useRef();
    gsap.registerPlugin(CSSPlugin);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            console.log(boxRef);
            gsap.to(boxRef.current, {
                width: "+=20",
                height: "+=20",
                duration: 0.1,
            });
        }, comp);
        return () => ctx.revert();
    });

    return show ? (
        <div className={styles.formContainer} ref={comp}>
            {show && <form className={styles.form} action="/api/new-list" method="POST" ref={boxRef}>
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
            </form>}
        </div>
    ) : <></>;
}