import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

import bcrypt from 'bcrypt';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string }>
) {
    const { username, password } = req.body;

    await dbConnect();
    
    const check = await User.exists({ username: username });

    if (check !== null) {
        res.status(400).json({ message: "User already exists" });
        return;
    }

    else {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {

                // Store hash in your password DB.
                const newUser = new User({
                    username: username,
                    password: hash,
                    lists: []
                });

                await newUser.save();
                res.status(200).send({ message: "User created" });
                return;
            });
        });
    }
}