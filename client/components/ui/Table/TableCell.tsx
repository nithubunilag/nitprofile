import Image from "next/image"
import { PopOver } from "../Popover"
import { KebabIcon } from "@/public/icons"

interface ITableCell {
    children: string | React.ReactNode
    alignment?: "text-left" | "text-center" | "text-right"
}

const TableCell = ({ children, alignment = "text-left" }: ITableCell) => {
    return (
        <td className={`${alignment} text-left text-[16px] font-normal leading-normal first-of-type:pl-4 `}>
            {children}
        </td>
    )
}

interface TableMoreMenuProps {
    actions: React.ReactNode
}

export const TableMoreMenu = ({ actions }: TableMoreMenuProps) => {
    return (
        <>
            <PopOver location="bottom" content={actions}>
                <KebabIcon
                    className="h-[16px] w-[16px] transition-all duration-300 ease-in-out hover:text-primary"
                />
            </PopOver>
        </>
    )
}

export default TableCell

interface MenuItemProps {
    children: React.ReactNode | string
    handleClick: () => void
}
