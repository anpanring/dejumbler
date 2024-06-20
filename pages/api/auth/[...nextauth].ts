import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";

import { compare } from "bcrypt";

type LoggedInUser = {
    id: string;
    name: string;
    email: string;
    image: string;
}

export const authOptions: NextAuthOptions = {
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
        CredentialsProvider({
            name: 'username and password',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req): Promise<LoggedInUser | null> {
                await dbConnect();

                const user = await User.findOne({ username: credentials?.username });

                if (!user) return null;

                const currUser: LoggedInUser = {
                    id: user._id,
                    name: user.username,
                    email: "",
                    image: ""
                }

                const match = await compare(credentials?.password, user.password);
                if (match) return currUser;
                else return null;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    pages: {
        signIn: '/',
    },
    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (user) token.id = user.id;
            return token;
        },
        async session({ session, token, user }) {
            session.user.id = token.id;
            return session;
        }
    }
};

export default NextAuth(authOptions);