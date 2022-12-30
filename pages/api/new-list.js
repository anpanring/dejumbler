import List from "../../models/List";

export default function handler(req, res) {
    const info = req.body;
    console.log('info: ', info);
    new List({
        user: null,
        name: info.name,
        type: info.type,
        description: info.description,
        createdAt: Date.now()
    }).save().then((savedDoc) => {
        res.redirect(`/list/${savedDoc._id}`);
    });
}