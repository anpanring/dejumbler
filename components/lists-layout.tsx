import styles from '../styles/AllLists.module.css';
import useWindowSize from '../lib/useWindowSize';
import { createContext, useState } from 'react';

const mobileWidth = 600;

export default function ListsLayout({ children }) {
  const [width] = useWindowSize();
  // const [currentList, setCurrentList] = useState<ListMetadata | null>(null);

  return (
    <section>
      <p>{width}</p>
      {children}
    </section>
  );
}
