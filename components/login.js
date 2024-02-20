import { useSession, signIn, signOut } from "next-auth/react";
import styles from "./login.module.css";
import { useState, useRef, useLayoutEffect } from "react";
import Modal from "./modal";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Login({ csrfToken }) {
    const { data, status } = useSession();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const loginRef = useRef();
    useGSAP(() => {
        gsap.from(loginRef.current, {
            y: "20",
            duration: 0.1,
        });

        return () => {
            gsap.to(loginRef.current, {
                y: "-20",
                duration: 0.1,
            });
        }
    }, [showForm]);

    function toggleModal() {
        console.log(showForm);
        setShowForm(!showForm);
        setError(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error, ok } = await signIn("credentials", { redirect: false, username: username, password: password });
        if (error) {
            setError(true);
            loginRef.current.reset();
        } else if (ok) {
            const theme = localStorage.getItem('theme');
            if (theme) {
                document.documentElement.setAttribute('data-theme', theme);
            }
        }
    }

    if (data) {
        const userData = data.user;
        return (
            <div className={styles.loggedInWrapper}>
                <p>Signed in as: {userData.name}</p>
                <a href="#" onClick={() => signOut()} className={styles.signoutButton}>Sign out</a>
            </div >
        )
    }
    return (
        <div className={styles.loginWrapper}>
            {!showForm && <div className={styles.loginOptions}>
                <a href="#" onClick={toggleModal}>Sign in</a>
                <p>or</p>
                <a href="#" onClick={() => signIn("credentials", { username: "user", password: "password" })}>Demo</a>
            </div>}
            {showForm && <a href="#" onClick={toggleModal}>← Back</a>}
            {showForm && <div className={styles.subLogin}>
                <form className={styles.form} ref={loginRef} onSubmit={handleSubmit}>
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                    <div className={styles.formSub}>
                        <input className={styles.box} name="username" type="text" placeholder="Username" required onChange={(e) => {
                            setUsername(e.target.value)
                            setError(false);
                        }} />
                    </div>
                    <div className={styles.formSub}>
                        <input className={styles.box} name="password" type="password" placeholder="Password" required onChange={(e) => {
                            setPassword(e.target.value);
                            setError(false);
                        }} />
                    </div>
                    <button className={styles.box} type="submit">Sign in</button>
                    {error && <p className={styles.error}>Invalid username or password</p>}
                </form>
            </div>}
            {/* <p>OR</p> */}
            <div className={styles.subLogin}>
                {/* <a href="#" onClick={() => signIn()} className={styles.button}>Register</a> */}
                {/* <p className={styles.divider}>|</p> */}
                {/* <a className={styles.demo} href="#" onClick={() => signIn("credentials", { username: "user", password: "password" })}>Demo</a> */}
                {/* <p style={{ fontSize: 11, marginLeft: 5 }}>(using public account)</p> */}
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    }
}