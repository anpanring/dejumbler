import { useState } from 'react';
import dbConnect from '../../lib/mongodb';
import Head from 'next/head';
import Layout from "../../components/layout";
import List from '../../models/List';
import ListItem from '../../components/list-item';
import SearchBar from '../../components/search';
import Snackbar from '../../components/snackbar';
import styles from '../../styles/ListPage.module.css';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';

export default function ListPage({ listData, id }) {
    const [data, setData] = useState(JSON.parse(listData));
    const [songAdded, setSongAdded] = useState(false);
    const [changeType, setChangeType] = useState('');

    function handleDataChange(changedData, changeType) {
        console.log(changeType);
        setData(changedData);
        setSongAdded(true);
        setChangeType(changeType);
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

            <SearchBar listId={id} listType={data.type} handleDataChange={handleDataChange} />

            <div className={styles.itemWrapper}>
                {data.items.map((item) => {
                    return (
                        <ListItem
                            data={item}
                            listId={id}
                            key={item._id}
                            handleDataChange={handleDataChange}
                        />
                    );
                })}
            </div>
            {songAdded && <Snackbar message={`${changeType} ${data.name}`} toggleShow={setSongAdded} />}
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