import dbConnect from "../lib/mongodb";
import Layout from "../components/layout";
import Link from "next/link";
import List from "../models/List";
import Head from "next/head";

export default function AllLists({ lists }) {
    lists = JSON.parse(lists);
    return (
        <Layout>
            <Head>
                <title>All Lists</title>
            </Head>
            <h2>All Lists</h2>
            {lists.map((list) => {
                return <p key={list._id}>
                    <Link href={`/list/${list._id}`} >{list.name}</Link>
                </p>
            })}
        </Layout>
    );
}

export async function getServerSideProps() {
    await dbConnect();

    const results = await List.find({})
    const paths = results.map((doc) => {
        const listID = doc._id.toString();
        return {
            params: {
                id: listID,
            }
        }
    });

    /* find all the data in our database */
    const result = await List.find({})

    return { props: { lists: JSON.stringify(result) } }
}