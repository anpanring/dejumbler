import { createContext, useMemo, useState } from 'react';
import Layout from '@/components/layout';
import Head from 'next/head';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ListContainer } from '@/components/all-lists/list-container';

import {
  ListMetadata,
  ListData,
  CurrentListContextType,
} from '@/types/dejumbler-types';
import styles from '@/styles/AllLists.module.css';

import { useQuery } from '@tanstack/react-query';
import {
  QueryParamConfig,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';
import useWindowSize from '@/lib/useWindowSize';
import { Sidebar } from '@/components/all-lists/sidebar';

export const CurrentListContext = createContext<CurrentListContextType | null>(
  null,
);

export const mobileWidth = 600;

enum ListType {
  Any = 'All',
  Movies = 'Movie',
  Music = 'Music',
  Books = 'Book',
}

export interface AllListsPageQueryParams {
  type: ListType;
}

export default function AllLists() {
  const { data: lists, isLoading } = useQuery({
    queryKey: ['lists'],
    queryFn: (): Promise<ListData[]> =>
      fetch('/api/get-all-lists').then((res) => res.json()),
  });

  const [width] = useWindowSize();

  // state used for context!
  const [currentList, setCurrentList] = useState<ListMetadata | null>(null);

  // query params
  const [queryParams, setQueryParams] = useQueryParams({
    type: withDefault(StringParam, 'Any', false) as QueryParamConfig<string>,
  });

  const filteredLists = useMemo(
    () =>
      lists?.filter((list) => {
        if (queryParams.type == 'Any') return true;
        return list.type == queryParams.type;
      }),
    [lists, queryParams.type],
  );

  function toggleType(type: ListType) {
    // if the current list is not of the same type, close the current list container
    if (type !== ListType.Any && currentList && type !== currentList.type)
      setCurrentList(null);

    setQueryParams({ type });
  }

  return (
    <Layout>
      <Head>
        <title>Dejumbler - All Lists</title>
      </Head>

      <div className="flex items-center justify-between">
        {/* title */}
        <h2>
          {ListType[queryParams.type]} Lists{' '}
          {filteredLists ? `(${filteredLists?.length})` : ''}
        </h2>

        {/* list type filter */}
        <div>
          <Select
            onValueChange={toggleType}
            value={queryParams.type}
            defaultValue={queryParams.type}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Any">All</SelectItem>
              <SelectItem value="Music">Music</SelectItem>
              <SelectItem value="Movies">Movies</SelectItem>
              <SelectItem value="Books">Books</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && <h1>Loading...</h1>}

      <CurrentListContext.Provider value={{ currentList, setCurrentList }}>
        <div
          className={`${styles.wideview} ${
            width < mobileWidth ? styles.mobileview : ''
          }`}
        >
          {/* left sidebar showing all lists */}
          <Sidebar lists={filteredLists ?? []} setListData={() => {}} />
          {currentList && width >= mobileWidth && (
            <ListContainer currentList={currentList} setCurrentList={setCurrentList} />
          )}
        </div>
      </CurrentListContext.Provider>
    </Layout>
  );
}
