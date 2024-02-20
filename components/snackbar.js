import styles from "./snackbar.module.css";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Snackbar({ message, toggleShow }) {
    const comp = useRef();
    const boxRef = useRef();

    useGSAP(async () => {
        // const ctx = gsap.context(async () => {
        let tl = gsap.timeline();
        console.log('showing snackbar')
        await tl.from(boxRef.current, {
            y: 20,
            opacity: 100,
            duration: 0.1,
        });
        await tl.to(boxRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.1,
            delay: 2,
        });
        console.log('done');
        toggleShow(false);
    });

    return (
        <div className={styles.snack} ref={boxRef}>
            <p className={styles.message}>{message}</p>
        </div>
    );
}

