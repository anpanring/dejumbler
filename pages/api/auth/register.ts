import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

import bcrypt from 'bcrypt';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string }>
) {
    try {
        const { username, password } = req.body;

        await dbConnect();
        const check = await User.exists({ username: username });

        if (check !== null) {
            res.status(400).send({ message: "User already exists" });
        }

        else {
            bcrypt.genSalt(10, function (err, salt) {
                if(err) throw err;
                bcrypt.hash(password, salt, async function (err, hash) {
                    if(err) throw err;

                    // Store hash in your password DB.
                    const newUser = new User({
                        username: username,
                        password: hash,
                        lists: []
                    });

                    await newUser.save();
                    res.status(200).send({ message: "User created" });
                });
            });
        }
    } catch (err) {
        res.status(500).send({ message: err });
    }
}