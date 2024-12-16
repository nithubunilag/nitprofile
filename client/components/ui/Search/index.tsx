import React from "react"
import useSearch from "./useSearch"
import { CiSearch } from "react-icons/ci"

export interface ISearchProps<T extends Record<string, any>, K extends keyof T> {
    initialState: T[]
    setState: React.Dispatch<React.SetStateAction<T[]>>
    conditionKeyword: K
    resetState: T[]
}

export const Search = <T extends Record<string, any>, K extends keyof T>({
    initialState,
    setState,
    conditionKeyword,
    resetState,
}: ISearchProps<T, K>): JSX.Element => {
    const { handleSearch, searchKeyword } = useSearch({
        initialState,
        setState,
        conditionKeyword,
        resetState,
    })

    return (
        <div className="max-w-[400px]">
            <div className="flex items-center gap-2 rounded-lg border  border-[#676767] bg-white px-4 py-[10px] transition-all duration-300 ease-in-out focus-within:border-primary ">
                <CiSearch className="text-2xl" />

                <input
                    placeholder="Search ......"
                    value={searchKeyword}
                    onChange={(e) => handleSearch(e)}
                    className={` w-full text-base font-normal text-[#101010] outline-none placeholder:text-sm placeholder:text-[#676767]  `}
                />
            </div>
        </div>
    )
}
