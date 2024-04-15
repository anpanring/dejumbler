import { useEffect, useRef } from "react";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import styles from "./modal.module.css";

export default function Modal({ toggleModal, children }) {
    const comp = useRef<HTMLDivElement>(null);
    const modal = useRef <HTMLDivElement>(null);

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

    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if(e.key === "Escape") toggleModal();
        });

        return () => {
            document.removeEventListener("keydown", (e) => {
                if(e.key === "Escape") toggleModal();
            });
        }
    })

    return (
        <div ref={comp}>
            <div className={styles.overlay} onClick={toggleModal}></div>
            <div className={styles.modalContainer} ref={modal}>
                {children}
            </div>
        </div>
    );
}