import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import { compare, hash } from "bcryptjs";

async function hashPassword(password) {
    const hashedPassword = await hash(password, 12);
    return hashedPassword;
}

async function isPasswordValid(password, hashedPassword) {
    const isValid = await compare(password, hashedPassword);
    return isValid;
}

export const authOptions = {
    // Configure one or more authentication providers
    session: {
        // Set to jwt in order to CredentialsProvider works properly
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    // logger: {
    //     error(code, metadata) {
    //         console.log({ type: 'inside error logger', code, metadata });
    //     },
    //     warn(code) {
    //         console.log({ type: 'inside warn logger', code });
    //     },
    //     debug(code, metadata) {
    //         console.log({ type: 'inside debug logger', code, metadata });
    //     },
    // },
    providers: [
        // GithubProvider({
        //     clientId: process.env.GITHUB_ID,
        //     clientSecret: process.env.GITHUB_SECRET,
        // }),
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'username and password',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)

                await dbConnect();

                const user = await User.findOne({
                    username: credentials.username,
                })

                if (!user) return null;

                if (credentials.password == user.password) return {
                    name: user.username,
                    email: user._id,
                    image: ""
                };
                else return null;
            }
        })
    ]
};

export default NextAuth(authOptions)