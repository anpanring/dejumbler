import { useLayoutEffect, useRef } from "react";
import styles from "../styles/CreateList.module.css";
import { gsap } from "gsap";

export default function Modal({ show, toggleModal, children }) {
    const comp = useRef();
    const boxRef = useRef();

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // console.log(boxRef);
            gsap.to(boxRef.current, {
                width: "+=20",
                height: "+=20",
                duration: 0.1,
            });
        }, comp);
        return () => ctx.revert();
    });

    return show ? (
        <div ref={comp}>
            <div className={styles.overlay} onClick={toggleModal}></div>
            <div className={styles.modalContainer} ref={boxRef}>
                {children}
            </div>
        </div>
    ) : <></>;
}