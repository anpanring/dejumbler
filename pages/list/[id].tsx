import { useState } from 'react';

import Head from 'next/head';

import Layout from '../../components/layout';
import ListItem from '../../components/list-item';
import SearchBar from '../../components/search';
import Snackbar from '../../components/snackbar';

import dbConnect from '../../lib/mongodb';
import List from '../../models/List';

import styles from '../../styles/ListPage.module.css';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';

import { ListMetadata, ListData } from '../../types/dejumbler-types';
import ListsLayout from '../../components/lists-layout';

export default function ListPage({ listData, listMetadata }: {
    listData: string,
    listMetadata: ListMetadata
}) {
    const [data, setData] = useState<ListData>(JSON.parse(listData));
    const [songAdded, setSongAdded] = useState(false);
    const [changeType, setChangeType] = useState('');

    function handleDataChange(changedData, changeType) {
        setData(changedData);               // all list items
        setSongAdded(true);                 // controls showing of snackbar
        setChangeType(changeType);          // when adding/removing items
    }

    return (
        <Layout>
            {/* <ListsLayout> */}
                <Head>
                    <title>{data.name}</title>
                </Head>

                <div className={styles.listInfo}>
                    <h2 className={styles.listTitle}>{data.name} </h2>
                    <h3 className={styles.listType}>{data.type} </h3>
                </div>

                {/* still need to pass in listId and listType b/c can't carry context between pages */}
                <SearchBar listContext={listMetadata} handleDataChange={handleDataChange} />

                <div className={styles.itemsContainer}>
                    {
                        data.items.map((item) => {
                            return (
                                <ListItem
                                    itemData={item}
                                    listMetadata={listMetadata}
                                    view="list"
                                    key={item.artURL || item.name}
                                    handleDataChange={handleDataChange}
                                />
                            );
                        })
                    }
                </div>
                {songAdded && <Snackbar message={`${changeType} ${data.name}`} toggleShow={setSongAdded} />}
            {/* </ListsLayout> */}
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
    const data = await List.findById(context.params.id);

    // verify list belongs to user
    if (session.user.id !== data.user.toString()) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const listData = JSON.stringify(data);
    return {
        props: {
            listData,
            listMetadata: {
                id: context.params.id,
                name: data.name,
                type: data.type,
            }
        }
    };
}