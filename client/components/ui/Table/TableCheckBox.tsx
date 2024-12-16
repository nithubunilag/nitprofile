import { InputHTMLAttributes } from "react"

type TableCheckBoxProps = {
    handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void
} & InputHTMLAttributes<HTMLInputElement>

const TableCheckBox = ({ handleCheckboxChange, ...others }: TableCheckBoxProps) => {
    return (
        <label className="ml-5 flex items-center space-x-2">
            <input
                type="checkbox"
                onChange={handleCheckboxChange}
                {...others}
                className="h-[18px] w-[18px] cursor-pointer appearance-none rounded-sm border-[2px] border-[#49454F] transition-all duration-300 ease-in-out checked:border-transparent checked:bg-green-500 focus:outline-none"
            />
        </label>
    )
}

export default TableCheckBox
