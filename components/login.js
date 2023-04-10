import { useSession, signIn, signOut } from "next-auth/react";
import styles from "./login.module.css";

export default function Login() {
    const { data, status } = useSession();
    if (status == "loading") return <p>Loading</p>;
    if (data) {
        const userData = data.user;
        return (
            <div className={styles.loginWrapper}>
                {/* <img src={userData.image} width={40} height={40} /> */}
                <p>Signed in as: {userData.name}</p>
                {/* <p>ID: {userData.email}</p> */}
                <a href="#" onClick={() => signOut()} className={styles.signoutButton}>Sign out</a>
            </div >
        )
    }
    return (
        <div className={styles.loginWrapper}>
            <a href="#" onClick={() => signIn()} className={styles.button}>Sign in</a>
        </div>
    )
}