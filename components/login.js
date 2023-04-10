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
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        )
    }
    return (
        <div className={styles.loginWrapper}>
            <button onClick={() => signIn()}>Sign in</button>
        </div>
    )
}