const Table = ({ children, height }: { children: React.ReactNode; height?: number }) => {
    return (
        <div
            style={{
                minHeight: `${height ?? 400}px`,
            }}
            className="overflow-y-auto"
        >
            <table className="relative w-full ">{children}</table>
        </div>
    )
}

export default Table
