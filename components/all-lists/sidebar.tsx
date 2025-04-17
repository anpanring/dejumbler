import { ListData } from '@/types/dejumbler-types';
import React, { useContext } from 'react';
import { ListBox } from './list-box';
import styles from '@/styles/AllLists.module.css';
import { CurrentListContext, mobileWidth } from '@/pages/all-lists';
import useWindowSize from '@/lib/useWindowSize';

interface SidebarProps {
  lists: ListData[];
  setListData: React.Dispatch<React.SetStateAction<ListData[]>>;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
  const { lists, setListData } = props;

  const currentListContext = useContext(CurrentListContext);
  if (!currentListContext) throw new Error('CurrentListContext is null');
  const { currentList } = currentListContext;

  const [width] = useWindowSize();

  return (
    <section
      className={`${styles.allListsContainer} ${
        currentList == null || width < mobileWidth ? styles.wide : ''
      }`}
    >
      {lists.map((list) => {
        return (
          <ListBox
            key={list._id}
            data={list}
            setListData={setListData}
            selected={
              width >= mobileWidth && list._id == currentList?.id ? true : false
            }
          />
        );
      })}
    </section>
  );
};
