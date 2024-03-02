import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";

import { compare, hash } from "bcryptjs";

type LoggedInUser = {
    id: string;
    name: string;
    email: string;
    image: string;
}

async function hashPassword(password) {
    const hashedPassword = await hash(password, 12);
    return hashedPassword;
}

async function isPasswordValid(password, hashedPassword) {
    const isValid = await compare(password, hashedPassword);
    return isValid;
}

export const authOptions: NextAuthOptions = {
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
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req): Promise<LoggedInUser | null> {
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

                const currUser : LoggedInUser = {
                    id: user._id,
                    name: user.username,
                    email: user._id,
                    image: ""
                }

                if (credentials.password == user.password) return currUser;

                else return null;
            }
        })
    ],
    pages: {
        signIn: '/',
    },
};

export default NextAuth(authOptions)