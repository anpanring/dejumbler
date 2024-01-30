import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import styles from "../styles/CreateList.module.css";

export default function Modal({ show, toggleModal, children }) {
    const comp = useRef();
    const boxRef = useRef();

    useGSAP(() => {
        gsap.from(boxRef.current, {
            width: "-=20",
            height: "-=20",
            duration: 0.1,
        });
    }, [toggleModal])

    return show ? (
        <div ref={comp}>
            <div className={styles.overlay} onClick={toggleModal}></div>
            <div className={styles.modalContainer} ref={boxRef}>
                {children}
            </div>
        </div>
    ) : <></>;
}