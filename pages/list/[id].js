import dbConnect from '../../lib/mongodb';
import Head from 'next/head';
import Layout from "../../components/layout";
import List from '../../models/List';
import SearchBar from '../../components/SearchBar';
import styles from '../../styles/ListPage.module.css';

export default function ListPage({ listData, id }) {
    const data = JSON.parse(listData);

    return (
        <Layout>
            <Head>
                <title>{data.name}</title>
            </Head>
            <div className={styles.listTextWrapper}>
                <h2 className={styles.listTitle}>{data.name}</h2>
                <h3 className={styles.listType}>{data.type}</h3>
            </div>
            <SearchBar listId={id} />
            <div className={styles.resultsWrapper}>
                {data.items.map((item) => {
                    return (
                        <div key={item._id}>
                            <p>{item.name} - {item.status}</p>
                            <img src={item.artURL} width={50} height={50} />
                        </div>

                    );
                })}
            </div>
        </Layout>
    )
}

export async function getServerSideProps({ params }) {
    await dbConnect();

    const data = await List.findById(params.id);
    const listData = JSON.stringify(data);

    return { props: { listData, id: params.id } };
}