const TableContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-max min-w-full overflow-hidden rounded-b-[14px] bg-white shadow-xl">
            {children}
        </div>
    )
}

export default TableContainer
