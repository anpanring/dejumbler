import { useState } from 'react';
import dbConnect from '../../lib/mongodb';
import Head from 'next/head';
import Layout from "../../components/layout";
import List from '../../models/List';
import ListItem from '../../components/list-item';
import SearchBar from '../../components/search';
import styles from '../../styles/ListPage.module.css';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';

export default function ListPage({ listData, id }) {
    const [data, setData] = useState(JSON.parse(listData));

    function handleDataChange(changedData) {
        setData(changedData);
    }

    return (
        <Layout>
            <Head>
                <title>{data.name}</title>
            </Head>

            <div className={styles.listInfo}>
                <h2 className={styles.listTitle}>{data.name}</h2>
                <h3 className={styles.listType}>{data.type}</h3>
            </div>

            <SearchBar listId={id} handleDataChange={handleDataChange} />

            <div className={styles.itemWrapper}>
                {data.items.map((item) => {
                    return (
                        <ListItem data={item} listId={id} key={item._id} />
                    );
                })}
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    await dbConnect();
    const data = await List.findById(context.params.id);
    const listData = JSON.stringify(data);
    return { props: { listData, id: context.params.id } };
}