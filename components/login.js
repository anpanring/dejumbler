import { useSession, signIn, signOut } from "next-auth/react"

export default function Login() {
    const { data, status } = useSession();
    console.log(data);

    if (data) {
        const userData = data.user;
        return (
            <div>
                {/* <img src={userData.image} width={40} height={40} /> */}
                Signed in as: {userData.name}<br />
                ID: {userData.email}<br />
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        )
    }
    return (
        <div>
            <button onClick={() => signIn()}>Sign in</button>
        </div>
    )
}