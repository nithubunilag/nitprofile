import { useState } from "react";
import { ISearchProps } from "."

const useSearch = <T extends Record<string, any>, K extends keyof T>(props: ISearchProps<T, K>) => {
    const { conditionKeyword, initialState, setState, resetState } = props

    const [searchKeyword, setSearchKeyword] = useState("");
    const clearSearch = () => setSearchKeyword("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value);
        const searchKeyword = e.target.value.toLocaleLowerCase();
        const result: T[] = [];
        if (searchKeyword === '') {
            setState(resetState!)
            return
        } else {
            initialState.map((item) => {
                const currentItem = item[conditionKeyword]?.toLocaleLowerCase()?.split("");
                const searchKeywordArr = searchKeyword?.split("");

                if (searchAlgorithm(currentItem, searchKeywordArr)) {
                    result.push(item);
                }
            });

            setState(result);
        }

    };

    const searchAlgorithm = (arr1: string[], searchedKeywordArr: string[]) => {
        const set = new Set(arr1);

        for (const item of searchedKeywordArr) {
            if (set.has(item)) {
                return true;
            }
        }
        return false;
    };

    return {
        clearSearch,
        searchKeyword,
        handleSearch
    }

}

export default useSearch