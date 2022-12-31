import Head from 'next/head';
import Layout from "../../components/layout";
import List from '../../models/List';
import SearchBar from '../../components/SearchBar';

export default function ListPage({ listData }) {
    const data = JSON.parse(listData);

    return (
        <Layout>
            <Head>
                <title>{data.name}</title>
            </Head>
            <h2>{data.name} - {data.type}</h2>
            <SearchBar type={data.type} />
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
    const data = await List.find({ _id: params.id })
    console.log(data[0]);
    return {
        props: {
            listData: JSON.stringify(data[0]),
        },
    };
}