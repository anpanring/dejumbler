import { CurrentListContext, mobileWidth } from '@/pages/all-lists';
import { ListData } from '@/types/dejumbler-types';
import { useContext, useState } from 'react';
import { WindowSizeContext } from '../layout';
import { useToast } from '../ui/use-toast';

import styles from '@/styles/AllLists.module.css';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

interface ListBoxProps {
  data: ListData;
  setListData: React.Dispatch<React.SetStateAction<ListData[]>>;
  selected: boolean;
}

export const ListBox: React.FC<ListBoxProps> = ({
  data,
  setListData,
  selected,
}) => {
  // kinda messy, refactor to make sure never null
  const currentListContext = useContext(CurrentListContext);
  if (!currentListContext) throw new Error('CurrentListContext is null');
  const { setCurrentList } = currentListContext;

  const { width } = useContext(WindowSizeContext) ?? {
    width: 1200,
    height: 800,
  };

  // list name and description
  const [name, setName] = useState<string>(data.name);
  const [description, setDescription] = useState<string>(data.description);
  const [expandDescription, setExpandDescription] = useState(false);

  const { toast } = useToast();

  async function handleDelete(e) {
    e.preventDefault();

    try {
      const response = await fetch(`/api/delete-list?id=${data._id}`, {
        method: 'DELETE',
      });
      const updatedData = await response.json();
      setListData(updatedData); // in order to update lists instantly
      toast({
        title: 'Deleted',
        description: 'Friday, February 10, 2023 at 5:57 PM',
      });
      if (selected) setCurrentList && setCurrentList(null);
    } catch (error) {
      alert('Failed to delete list.');
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();

    const itemInfo = {
      listId: data._id,
      updatedName: e.target.name.value,
      updatedDescription: e.target.description.value,
    };

    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemInfo),
    };

    const res = await fetch('/api/edit-list', fetchOptions);
    const updatedData = await res.json();
    setName(updatedData.name);
    setDescription(updatedData.description);

    toast({
      title: 'Updated',
      description: 'Friday, February 10, 2023 at 5:57 PM',
    });
  }

  return (
    <div
      key={data._id}
      className={`${styles.listInfo} ${
        selected && width >= mobileWidth ? styles.selected : ''
      }`}
    >
      <p>
        <Link
          href={width < mobileWidth ? `/list/${data._id}` : '#'}
          onClick={() =>
            setCurrentList &&
            setCurrentList({ id: data._id, name: data.name, type: data.type })
          }
        >
          {name}
        </Link>{' '}
        ({data.items.length}) - {data.type}
      </p>
      {/* currentlistdata is changing later than selected */}
      {data.description && (
        <p className="font-cursive text-sm">
          {expandDescription ? (
            <span>
              {description}{' '}
              <a onClick={() => setExpandDescription(false)}>Show less</a>
            </span>
          ) : description.length > 100 ? (
            <span>
              {description.slice(0, 100)}...{' '}
              <a onClick={() => setExpandDescription(true)}>Show more</a>
            </span>
          ) : (
            description
          )}
        </p>
      )}
      {selected && <div className={styles.selected}></div>}

      {/* List options modal */}
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="self-end w-auto border-none hover:border-1 hover:bg-none"
        >
          {/* Kebab */}
          <svg
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            className="self-end border-none h-6 p-1 
              fill-[var(--main-text-color)] 
              hover:fill-[var(--accent-color)] hover:cursor-pointer"
          >
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* nested dialog */}

          <DropdownMenuGroup>
            <Dialog>
              <DialogTrigger
                asChild
                className="self-end w-auto hover:border-1 hover:bg-none"
              >
                {/* <DropdownMenuItem> */}
                <p>Edit list</p>
                {/* </DropdownMenuItem> */}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Description</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you are
                    done.
                  </DialogDescription>
                </DialogHeader>
                <form
                  className={`flex-column ${styles.form}`}
                  onSubmit={handleUpdate}
                  method="POST"
                >
                  <div className={styles.formRow}>
                    <Label className="mb-1">Name</Label>
                    <Input
                      // className={styles.formInput}
                      type="text"
                      name="name"
                      defaultValue={name}
                      required
                    />
                  </div>
                  <div className={styles.formRow}>
                    <Label className="mb-1">Description</Label>
                    <Textarea name="description" defaultValue={description} />
                  </div>
                  <DialogFooter>
                    <DialogClose>
                      <div className={styles.formRow}>
                        <Button type="submit" variant="ghost">
                          Save edits
                        </Button>
                      </div>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger
                asChild
                className="self-end w-auto hover:border-1 hover:bg-none"
              >
                {/* <DropdownMenuItem className="hover:bg-red-600 hover:text-white"> */}
                <p>Delete list</p>
                {/* </DropdownMenuItem> */}
                {/* </Button> */}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    <p>
                      Are you sure you want to delete{' '}
                      <u>
                        <strong>{name}</strong>
                      </u>
                      ?
                    </p>
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 items-center text-center">
                  <Button
                    onClick={handleDelete}
                    className="text-base w-[100%] text-red-600"
                    variant="ghost"
                  >
                    Yes, delete list
                  </Button>

                  <DialogClose asChild>
                    <Button className="w-[100%]" type="button" variant="ghost">
                      No, close
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
