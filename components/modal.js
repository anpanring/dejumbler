import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import styles from "../styles/CreateList.module.css";

export default function Modal({ show, toggleModal, children }) {
    const comp = useRef();
    const modal = useRef();

    gsap.config({
        nullTargetWarn: false,
    });

    useGSAP(() => {
        gsap.from(modal.current, {
            width: "-=20",
            height: "-=20",
            duration: 0.1,
        });
    }, [toggleModal]);

    return (
        <div ref={comp}>
            <div className={styles.overlay} onClick={toggleModal}></div>
            <div className={styles.modalContainer} ref={modal}>
                {children}
            </div>
        </div>
    );
}