import { useContext, useMemo, useState } from 'react';

import { CurrentListContext, mobileWidth } from '@/pages/all-lists';
import { ListData } from '@/types/dejumbler-types';
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

type SortType = 'added' | 'name' | 'director' | 'author';

interface ListContainerProps {
  lists: ListData[];
  setListData: React.Dispatch<React.SetStateAction<ListData[]>>;
}

// List Container
export const ListContainer: React.FC<ListContainerProps> = ({
  lists,
  setListData,
}) => {
  const currentListContext = useContext(CurrentListContext);
  if (!currentListContext) throw new Error('CurrentListContext is null');
  const { currentList, setCurrentList } = currentListContext;

  // detecting wide mode
  const [width] = useWindowSize();

  const [listView, setListView] = useState<'list' | 'grid'>('list');
  const [sort, setSort] = useState<SortType>('added');

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['get-list', currentList?.id],
    queryFn: async (): Promise<ListData> => {
      if (!currentList) return Promise.resolve({} as ListData);
      return fetch(`/api/get-list?id=${currentList?.id}`).then((res) =>
        res.json(),
      );
    },
  });

  function handleDataChange() {
    // setCurrentListData(changedData); // all list items
    queryClient.invalidateQueries({ queryKey: ['get-list', currentList?.id] });
    // toast to show song added or removed
  }

  // sorted lists
  const showListItems = useMemo(() => {
    if (data && sort === 'added') return data.items;
    const items = data?.items ? [...data?.items] : [];
    return items?.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'director') return a.director.localeCompare(b.director);
      if (sort === 'author') return a.author.localeCompare(b.author);
    });
  }, [data, sort]);

  return (
    <div
      className={`${styles.wideview} ${
        width < mobileWidth ? styles.mobileview : ''
      }`}
    >
      {/* left sidebar showing all lists */}
      <Sidebar lists={lists} setListData={setListData} />

      {/* right section showing current list 
          show if currentList is not null and width is wide enough */}
      {currentList && width >= mobileWidth && data && (
        <section className={styles.currentListContainer} key={currentList.id}>
          <div className="flex justify-between">
            <SearchBar
              listContext={currentList}
              handleDataChange={handleDataChange}
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
                onClick={() =>
                  setListView(listView === 'grid' ? 'list' : 'grid')
                }
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

          {/* current list */}
          <div
            className={
              listView === 'grid'
                ? styles.gridViewContainer
                : styles.listViewContainer
            }
          >
            {isLoading && <p>Loading...</p>}
            {showListItems?.map((item) => {
              return (
                <ListItem
                  itemData={item}
                  listMetadata={currentList}
                  view={listView}
                  key={item._id}
                  handleDataChange={handleDataChange} // for editing and deleting
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
