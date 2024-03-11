import { useState } from 'react';

import Head from 'next/head';

import Layout from "../../components/layout";
import ListItem from '../../components/list-item';
import SearchBar from '../../components/search';
import Snackbar from '../../components/snackbar';

import dbConnect from '../../lib/mongodb';
import List from '../../models/List';

import styles from '../../styles/ListPage.module.css';

import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';

import { IList } from '../../models/definitions.types';
import { HydratedDocument, Query } from "mongoose";

export default function ListPage({ listData, id }) {
    const session = useSession();

    const [data, setData] = useState<IList>(JSON.parse(listData));
    const [songAdded, setSongAdded] = useState(false);
    const [changeType, setChangeType] = useState('');

    function handleDataChange(changedData, changeType) {
        setData(changedData);               // all list items
        setSongAdded(true);                 // controls showing of snackbar
        setChangeType(changeType);          // when adding/removing items
    }

    return (
        <Layout>
            <Head>
                <title>{data.name}</title>
            </Head>

            <div className={styles.listInfo}>
                <h2 className={styles.listTitle}>{data.name} </h2>
                <h3 className={styles.listType}>{data.type} </h3>
            </div>

            <SearchBar listId={id} listType={data.type} handleDataChange={handleDataChange} />

            <div className={styles.itemWrapper}>
                {
                    data.items.map((item) => {
                        return (
                            <ListItem
                                data={item}
                                listId={id}
                                type={data.type}
                                key={item.artURL || item.name}
                                handleDataChange={handleDataChange}
                            />
                        );
                    })
                }
            </div>
            {songAdded && <Snackbar message={`${changeType} ${data.name}`} toggleShow={setSongAdded} />}
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);

    // redirect anyone not logged in
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    // fetch list
    await dbConnect();
    const data: IList = await List.findById(context.params.id);

    // verify list belongs to user
    if (session.user.email !== data.user.toString()) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const listData = JSON.stringify(data);
    return { props: { listData, id: context.params.id } };
}