import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import styles from './navbar.module.css';

import { useSession, signOut } from 'next-auth/react';

import { addIcon, settingsIcon, profileIcon, listIcon } from './icons';
import { Button } from './ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';

const colors = [
  'red',
  'orange',
  'yellow',
  'green',
  'lightblue',
  'indigo',
  'violet',
];
const fonts = ['Epilogue', 'cursive', 'monospace', 'sans-serif', 'serif'];

export default function Navbar({ changeMode }) {
  const [accentColor, setAccentColor] = useState('green');
  const [font, setFont] = useState('cursive');

  const { data } = useSession();

  const containerRef = useRef<HTMLDivElement>(null);

  // have to do this on client side
  useEffect(() => {
    const check = localStorage.getItem('accent') as string;
    const font = localStorage.getItem('font') as string;
    check && setAccentColor(localStorage.getItem('accent') ?? 'green');
    font && setFont(localStorage.getItem('font') ?? 'Epilogue');
  }, []);

  function changeAccentColor(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    setAccentColor(color);
    localStorage.setItem('accent', color);
  }

  function changeFont(font) {
    document.documentElement.style.setProperty('--secondary-font', font);
    setFont(font);
    localStorage.setItem('font', font);
  }

  return (
    <nav className={styles.navbarBack}>
      <div className={styles.navbarContainer} ref={containerRef}>
        <div className={styles.navbar}>
          {/* Logo / Dark mode toggler */}
          <svg
            onClick={changeMode}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 283.5 283.5"
            className={styles.smallLogo}
          >
            <path
              d="M0 0v283.5h283.5V0H0Zm221.55 108.55h-16v-40h16v40Z"
              style={{
                strokeWidth: 0,
              }}
            />
          </svg>

          {/* All lists button */}
          <Link
            className={styles.icon}
            href="/all-lists"
            aria-label="All Lists"
          >
            {listIcon}
          </Link>

          {/* Profile dialog */}
          <Dialog>
            <DialogTrigger
              asChild
              className="self-end w-auto border-none hover:border-1 hover:bg-none"
            >
              <div className={styles.icon} role="button">
                {profileIcon}
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[300px]">
              <DialogTitle>Profile</DialogTitle>
              <div className={`flex-column ${styles.loggedInWrapper}`}>
                <p>
                  Signed in as:{' '}
                  <u>
                    <strong>{data?.user.name}</strong>
                  </u>
                </p>
                <Button onClick={() => signOut({ callbackUrl: '/' })} variant="destructive">
                  Sign out
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Settings dialog */}
          <Dialog>
            <DialogTrigger
              asChild
              className="self-end w-auto border-none hover:border-1 hover:bg-none"
            >
              <div className={styles.icon} role="button">
                {settingsIcon}
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="m-0">Settings</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Dark Mode</Label>
                  <Button onClick={changeMode} variant="ghost">
                    Toggle
                  </Button>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Accent Color</Label>
                  <div className="col-span-3 flex">
                    {colors.map((color) => {
                      return (
                        <div
                          key={color}
                          style={{ backgroundColor: color }}
                          className={
                            color === accentColor
                              ? `${styles.colorSquare} ${styles.selectedColor}`
                              : styles.colorSquare
                          }
                          onClick={() => changeAccentColor(color)}
                          aria-label={color}
                        ></div>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Font</Label>
                  <Select
                    name="type"
                    defaultValue={font}
                    onValueChange={(val) => changeFont(val)}
                  >
                    <SelectTrigger className="col-span-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map((font) => {
                        return (
                          <SelectItem
                            key={font}
                            value={font}
                            style={{
                              fontFamily: font,
                            }}
                          >
                            {font}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* New list button */}
        <Dialog>
          <DialogTrigger
            asChild
            className="self-end w-auto border-none hover:border-1 hover:bg-none"
          >
            <span className={styles.icon} role="button">
              {addIcon}
            </span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="m-0">Create List</DialogTitle>
              <DialogDescription>new list time!!!!</DialogDescription>
            </DialogHeader>
            <form className="grid gap-4" action="/api/new-list" method="POST">
              {/* <button className={styles.formCloseButton} onClick={toggleModal}>X</button> */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Type: </Label>
                <Select name="type" defaultValue="Music" required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Movies">Movies</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Name: </Label>
                <Input
                  className="col-span-3"
                  type="text"
                  name="name"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Description: </Label>
                <Textarea className="col-span-3" name="description"></Textarea>
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" variant="ghost">
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
}
