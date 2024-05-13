'use client';

import { signIn, getCsrfToken } from "next-auth/react";

import styles from "./login.module.css";

import { useState, useRef, useEffect } from "react";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { useRouter } from "next/router";

enum Mode {
    LOGGED_OUT,
    SIGN_IN,
    REGISTER,
}

export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [csrfToken, setCsrfToken] = useState("");

    const [mode, setMode] = useState<Mode>(Mode.LOGGED_OUT);

    const router = useRouter();

    useEffect(() => {
        const getCsrf = async () => {
            const token = await getCsrfToken();
            setCsrfToken(token ?? "");
        }
        getCsrf();
    }, []);

    const loginRef = useRef<HTMLFormElement | null>(null);
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
    }, [mode]);

    function back() {
        setMode(Mode.LOGGED_OUT);
        setError("");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const signInResponse = await signIn(
            "credentials",
            {
                username: username,
                password: password,
                // callbackUrl: '/all-lists',
                redirect: false,
            });
        if (signInResponse?.error) {
            setError("Invalid username or password");
            loginRef.current?.reset();
        } else if (signInResponse?.ok) {
            router.push("/all-lists");
            const theme = localStorage.getItem('theme');
            if (theme) document.documentElement.setAttribute('data-theme', theme);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });
        if (response.status === 200) {
            const signInResponse = await signIn(
                "credentials",
                {
                    username: username,
                    password: password,
                    // callbackUrl: '/all-lists',
                    redirect: false,
                });
            if (signInResponse?.error) {
                setError(error);
                loginRef.current?.reset();
            } else if (signInResponse?.ok) {
                router.push("/all-lists");
                const theme = localStorage.getItem('theme');
                if (theme) document.documentElement.setAttribute('data-theme', theme);
            }
        } else {
            setError("User already exists");
            loginRef.current?.reset();
        }
    }

    return (
        <div className={styles.loginContainer}>
            {mode === Mode.LOGGED_OUT && <div className={styles.loginOptions}>
                <button className={styles.linkButton} onClick={() => setMode(Mode.SIGN_IN)}>Sign in</button>
                <p>or</p>
                <button className={styles.linkButton} onClick={() => setMode(Mode.REGISTER)}>Register</button>
                <p>or</p>
                <button className={styles.linkButton} onClick={() => signIn("credentials", {
                    username: "user",
                    password: "password",
                    // redirect: false,
                })}>Demo</button>
            </div>}

            {mode === Mode.SIGN_IN && <div className={styles.subLoginContainer}>
                <button className={`${styles.linkButton} ${styles.backButton}`} onClick={back}>← Back</button>
                <form className={styles.form} ref={loginRef} onSubmit={handleSubmit}>
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                    <div className={styles.formSub}>
                        <input className={styles.box} name="username" type="text" placeholder="Username" required onChange={(e) => {
                            setUsername(e.target.value)
                            setError("");
                        }} />
                    </div>
                    <div className={styles.formSub}>
                        <input className={styles.box} name="password" type="password" placeholder="Password" required onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                        }} />
                    </div>
                    <button className={styles.box} type="submit">Sign in</button>
                    {error !== "" && <p className={styles.error}>{error}</p>}
                </form>
            </div>}

            {mode === Mode.REGISTER && <div className={styles.subLoginContainer}>
                <button className={`${styles.linkButton} ${styles.backButton}`} onClick={back}>← Back</button>
                <form className={styles.form} ref={loginRef} onSubmit={handleRegister}>
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                    <div className={styles.formSub}>
                        <input className={styles.box} name="username" type="text" placeholder="Username" required onChange={(e) => {
                            setUsername(e.target.value);
                            setError("");
                        }} />
                    </div>
                    <div className={styles.formSub}>
                        <input className={styles.box} name="password" type="password" placeholder="Password" required onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                        }} />
                    </div>
                    <button className={styles.box} type="submit">Register</button>
                    {error !== "" && <p className={styles.error}>{error}</p>}
                </form>
            </div>}
        </div>
    );
}