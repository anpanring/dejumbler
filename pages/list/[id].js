import Head from 'next/head';
import Layout from "../../components/layout";
import List from '../../models/List';
import SearchBar from '../../components/SearchBar';
import dbConnect from '../../lib/mongodb';

export default function ListPage({ listData, id }) {
    const data = JSON.parse(listData);

    return (
        <Layout>
            <Head>
                <title>{data.name}</title>
            </Head>
            <h2>{data.name} - {data.type}</h2>
            <SearchBar listId={id} />
            {data.items.map((item) => {
                return (
                    <div key={item._id}>
                        <p>{item.name} - {item.status}</p>
                        <img src={item.artURL} width={50} height={50} />
                    </div>

                );
            })}
        </Layout>
    )
}

export async function getServerSideProps({ params }) {
    await dbConnect();

    const data = await List.findById(params.id);
    const listData = JSON.stringify(data);

    return { props: { listData, id: params.id } };
}