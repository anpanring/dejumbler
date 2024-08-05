import React, { Dispatch, SetStateAction } from "react";

interface Props {
    showEditOptions: boolean,
    setShowEditOptions: Dispatch<SetStateAction<boolean>>,
}

export const Kebab: React.FC<Props> = (props) => {
    const { showEditOptions, setShowEditOptions } = props;

    return (
        <svg
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            className="self-end border-none h-6 p-1 
            fill-[var(--main-text-color)] 
            hover:fill-[var(--accent-color)] hover:cursor-pointer"
            onClick={() => setShowEditOptions(!showEditOptions)}
        >
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
        </svg>
    )
}