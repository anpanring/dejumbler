import { useSession, signIn, signOut } from "next-auth/react";
import styles from "./login.module.css";

export default function Login() {
    const { data, status } = useSession();
    if (status == "loading") return (
        <>
            <div className="loading-spinner"></div>
            <p>Loading...</p>
        </>
    );
    if (data) {
        const userData = data.user;
        return (
            <div className={styles.loginWrapper}>
                <p>Signed in as: {userData.name}</p>
                <a href="#" onClick={() => signOut()} className={styles.signoutButton}>Sign out</a>
            </div >
        )
    }
}