import styles from "./snackbar.module.css";
import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

export default function Snackbar({ message, toggleShow }) {
    const comp = useRef();
    const boxRef = useRef();

    useLayoutEffect(() => {
        const ctx = gsap.context(async () => {
            let tl = gsap.timeline();
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
            toggleShow(false);
        }, comp);
        return () => {
            ctx.revert();
        }
    });

    return (
        <div className={styles.snack} ref={boxRef}>
            <p className={styles.message}>{message}</p>
        </div>
    );
}

