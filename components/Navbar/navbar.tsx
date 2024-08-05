import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import styles from './navbar.module.css';

import Modal from "../modal/modal";

import { useSession, signOut } from "next-auth/react";

import { addIcon, settingsIcon, profileIcon, listIcon } from "./icons";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
const colors = ['red', 'orange', 'yellow', 'green', 'lightblue', 'indigo', 'violet'];

export default function Navbar({ changeMode }) {
  // can probably refactor to just one state
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [accentColor, setAccentColor] = useState('green');

  const { data } = useSession();

  const buttonRef = useRef();
  const containerRef = useRef<HTMLDivElement>(null);

  // have to do this on client side
  useEffect(() => {
    const check = localStorage.getItem('accent') as string;
    check && setAccentColor(localStorage.getItem('accent') ?? 'green');
  }, [])

  function toggleModal() {
    setShowModal(!showModal);
  }

  function changeAccentColor(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    setAccentColor(color);
    localStorage.setItem('accent', color);
  }

  return (
    <nav className={styles.navbarBack}>
      <div className={styles.navbarContainer} ref={containerRef}>
        <div className={styles.navbar}>
          {/* Logo / Dark mode toggler */}
          <svg onClick={changeMode} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.5 283.5" className={styles.smallLogo}>
            <path
              d="M0 0v283.5h283.5V0H0Zm221.55 108.55h-16v-40h16v40Z"
              style={{
                strokeWidth: 0,
              }}
            />
          </svg>

          {/* All lists button */}
          <Link className={styles.icon} href="/all-lists" aria-label="All Lists">
            {listIcon}
          </Link>

          {/* Profile button */}
          <Dialog>
            <DialogTrigger asChild className="self-end w-auto border-none hover:border-1 hover:bg-none">
              <div className={styles.icon} role="button">
                {profileIcon}
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[300px]">
              <div className={`flex-column ${styles.loggedInWrapper}`}>
                <p>Signed in as: <u><strong>{data?.user.name}</strong></u></p>
                <Button onClick={() => signOut()} variant="destructive">Sign out</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Settings button */}
          <Dialog>
            <DialogTrigger asChild className="self-end w-auto border-none hover:border-1 hover:bg-none">
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
                  <Button onClick={changeMode} className={styles.toggleModeButton} variant="ghost">Toggle</Button>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Accent Color</Label>
                  <div className="col-span-3 flex">
                    {colors.map((color) => {
                      return <div
                        key={color}
                        style={{ backgroundColor: color }}
                        className={color === accentColor ? `${styles.colorSquare} ${styles.selectedColor}` : styles.colorSquare}
                        onClick={() => changeAccentColor(color)}
                        aria-label={color}>
                      </div>
                    })}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* New list button */}
        <Dialog>
          <DialogTrigger asChild className="self-end w-auto border-none hover:border-1 hover:bg-none">
            <span className={styles.icon} role="button">
              {addIcon}
            </span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="m-0">Create List</DialogTitle>
              <DialogDescription>
                new list time!!!!
              </DialogDescription>
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
                    <SelectItem value="Movies">Books</SelectItem>
                    <SelectItem value="Books">Movies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Name: </Label>
                <Input className="col-span-3" type="text" name="name" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Description: </Label>
                <Textarea className="col-span-3" name="description"></Textarea>
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" variant="ghost">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Profile modal */}
      {showProfile && data &&
        <Modal toggleModal={() => setShowProfile(!showProfile)}>
          <div className={`flex-column ${styles.loggedInWrapper}`}>
            <p>Signed in as: <u><strong>{data.user.name}</strong></u></p>
            <button onClick={() => signOut()} className={styles.signoutButton}>Sign out</button>
          </div>
        </Modal>
      }
    </nav>
  )
}