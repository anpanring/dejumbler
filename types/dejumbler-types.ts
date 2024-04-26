export type ListMetadata = {
    id: string,
    name: string,
    type: string,
}

export type ListData = {
    _id: string,
    user: string,
    name: string,
    type: string,
    description: string,
    items: any[],
}

export type CurrentListContextType = {
    currentList: ListMetadata | null,
    setCurrentList: React.Dispatch<React.SetStateAction<ListMetadata | null>>
}

export type WindowContextType = { width: number, height: number };
