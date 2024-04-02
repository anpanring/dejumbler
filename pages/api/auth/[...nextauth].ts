import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
// import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";

import { compare, hash } from "bcrypt";

type LoggedInUser = {
    id: string;
    name: string;
    email: string;
    image: string;
}

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    session: {
        // Set to jwt in order to CredentialsProvider works properly
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    logger: {
        error(code, metadata) {
            console.log({ type: 'inside error logger', code, metadata });
        },
        warn(code) {
            console.log({ type: 'inside warn logger', code });
        },
        debug(code, metadata) {
            console.log({ type: 'inside debug logger', code, metadata });
        },
    },
    providers: [
        // GithubProvider({
        //     clientId: process.env.GITHUB_ID,
        //     clientSecret: process.env.GITHUB_SECRET,
        // }),
        CredentialsProvider({
            name: 'username and password',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req): Promise<LoggedInUser | null> {
                console.log("authorizing user...");

                await dbConnect();

                const user = await User.findOne({ username: credentials.username });

                if (!user) return null;

                const currUser: LoggedInUser = {
                    id: user._id,
                    name: user.username,
                    email: user._id,
                    image: ""
                }

                const match = await compare(credentials.password, user.password);
                if (match) return currUser;
                else return null;
            }
        })
    ],
    pages: {
        signIn: '/',
    },
    callbacks: {
        async jwt({ token, user, account, profile }) {
            console.log('jwt callback');
            console.log(token, user, account, profile);
            if (user) token.id = user.id;
            return token;
        },
        async session({ session, token, user }) {
            console.log('session callback');
            session.user.id = token.id;
            console.log(session, token, user);
            return session;
        }
    }
};

export default NextAuth(authOptions);