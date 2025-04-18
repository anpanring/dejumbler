import { useMemo } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout';
import ListItem from '@/components/list-item';
import { SearchBar } from '@/components/search';
import styles from '@/styles/ListPage.module.css';
import { ListData } from '@/types/dejumbler-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from '@/components/ui/use-toast';

export default function ListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['get-list', router.query.id],
    queryFn: (): Promise<ListData> =>
      fetch(`/api/get-list?id=${router.query.id}`).then((res) => res.json()),
  });

  const listMetadata = useMemo(
    () => ({
      id: router.query.id as string,
      name: data?.name || '',
      type: data?.type || 'Music',
    }),
    [router.query.id, data],
  );

  function handleDataChange() {
    queryClient.invalidateQueries({ queryKey: ['get-list', router.query.id] });
    toast({
      title: 'successful',
    });
  }

  return (
    <Layout>
      <Head>
        <title>{data?.name}</title>
      </Head>

      <div className={styles.listInfo}>
        <h2 className={styles.listTitle}>{data?.name} </h2>
        <h3 className={styles.listType}>{data?.type} </h3>
      </div>

      {/* still need to pass in listId and listType b/c can't carry context between pages */}
      <SearchBar
        listContext={listMetadata}
        handleDataChange={handleDataChange}
      />

      <div className={styles.itemsContainer}>
        {data?.items.map((item) => {
          return (
            <ListItem
              itemData={item}
              listMetadata={listMetadata}
              view="list"
              key={item.artURL || item.name}
              handleDataChange={handleDataChange}
            />
          );
        })}
      </div>
    </Layout>
  );
}
