export type ListMetadata = {
    id: string,
    name: string,
    type: "Movies" | "Books" | "Music",
}

export type ListData = {
    _id: string,
    user: string,
    name: string,
    type: "Movies" | "Books" | "Music",
    description: string,
    createdAt: string,
    slug: string,
    items: any[],
    __v: number,
}

export type CurrentListContextType = {
    currentList: ListMetadata | null,
    setCurrentList: React.Dispatch<React.SetStateAction<ListMetadata | null>>
}

export type WindowContextType = { width: number, height: number };
