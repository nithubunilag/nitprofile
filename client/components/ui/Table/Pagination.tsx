import { DeleteIcon } from "@/public/icons"
import Image from "next/image"

interface PaginationProps {
    rowsPerPage: number
    totalRows: number
    handleChangePage: (pageNumber: number) => void
    currentPage: number
    isLastPage: boolean
    isFirstPage: boolean
    goToNext: () => void
    goToPrev: () => void
}

const Pagination = ({
    rowsPerPage,
    totalRows,
    handleChangePage,
    currentPage,
    isLastPage,
    isFirstPage,
    goToNext,
    goToPrev,
}: PaginationProps) => {
    const totalPages = Math.ceil(totalRows / rowsPerPage)

    return (
        <footer className="relative z-10 flex w-full items-center justify-between border-t border-[#000]/30 bg-white p-5">
            <div className="flex items-center gap-2">
                <button
                    className={`${isFirstPage ? "text-gray-300" : "bg-white hover:text-primary"}  transition-all duration-100 ease-in-out disabled:cursor-not-allowed `}
                    disabled={isFirstPage}
                    onClick={goToPrev}
                >
                    Previous
                </button>
                {new Array(totalPages).fill("").map((_, index) => (
                    <button
                        key={index}
                        className={`h-[26px] w-[26px] rounded-[1px] border-[0.5px] border-[#E3E6E8] px-[4px] py-[2px] transition-all duration-100 ease-in-out ${currentPage === index + 1 ? "bg-[#F1F1F1]" : "bg-white"}`}
                        onClick={() => handleChangePage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className={`${isLastPage ? "text-gray-300" : "bg-white hover:text-primary"} transition-all duration-100 ease-in-out disabled:cursor-not-allowed `}
                    disabled={isLastPage}
                    onClick={goToNext}
                >
                    Next
                </button>
            </div>

            <button>
                <DeleteIcon />
            </button>
        </footer>
    )
}

export default Pagination
