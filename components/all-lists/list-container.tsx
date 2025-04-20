import { useContext, useMemo, useState } from 'react';

import { CurrentListContext, mobileWidth } from '@/pages/all-lists';
import { ListData, ListMetadata } from '@/types/dejumbler-types';
import useWindowSize from '@/lib/useWindowSize';

import styles from '@/styles/AllLists.module.css';
import { SearchBar } from '../search';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import ListItem from '../list-item';
import { Sidebar } from './sidebar';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useGetList from '@/lib/hooks/useGetList';

type SortType = 'added' | 'name' | 'director' | 'author';

interface ListContainerProps {
  currentList: ListMetadata;
  setCurrentList: React.Dispatch<React.SetStateAction<ListMetadata | null>>;
}

// List Container
export const ListContainer: React.FC<ListContainerProps> = ({
  currentList,
  setCurrentList,
}) => {
  // const currentListContext = useContext(CurrentListContext);
  // if (!currentListContext) throw new Error('CurrentListContext is null');
  // const { currentList, setCurrentList } = currentListContext;

  const [listView, setListView] = useState<'list' | 'grid'>('list');
  const [sort, setSort] = useState<SortType>('added');

  const { data, isLoading} = useGetList(currentList);
  
  const sortedListItems = useMemo(() => {
    if (data && sort === 'added') return data.items;
    const items = data?.items ? [...data?.items] : [];
    return items?.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'director') return a.director.localeCompare(b.director);
      if (sort === 'author') return a.author.localeCompare(b.author);
    });
  }, [data, sort]);

  return (
    data && (
      <section className={styles.currentListContainer} key={currentList.id}>
        <div className="flex justify-between">
          <SearchBar
            listContext={currentList}
          />

          <div className={styles.controlButtons}>
            {/* toggle sort */}
            <Select
              onValueChange={(val: SortType) => setSort(val)}
              defaultValue="added"
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="added">added</SelectItem>
                <SelectItem value="name">name</SelectItem>
                {currentList.type === 'Movies' && (
                  <SelectItem value="director">director</SelectItem>
                )}
                {currentList.type === 'Books' && (
                  <SelectItem value="author">author</SelectItem>
                )}
              </SelectContent>
            </Select>

            {/* toggle list view */}
            <Button
              className="h-8"
              onClick={() => setListView(listView === 'grid' ? 'list' : 'grid')}
              variant="ghost"
            >
              {listView === 'grid' ? 'list' : 'grid'} view
            </Button>

            {/* close current list */}
            <Button
              className="h-8"
              onClick={() => {
                if (setCurrentList) setCurrentList(null);
                // setCurrentListData(null);
              }}
              variant="destructive"
            >
              X
            </Button>
          </div>
        </div>

        <div
          className={
            listView === 'grid'
              ? styles.gridViewContainer
              : styles.listViewContainer
          }
        >
          {isLoading && <p>Loading...</p>}
          {sortedListItems?.map((item) => {
            return (
              <ListItem
                itemData={item}
                listMetadata={currentList}
                view={listView}
                key={item._id}
              />
            );
          })}
        </div>
      </section>
    )
  );
};
