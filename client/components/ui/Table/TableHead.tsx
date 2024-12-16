const TableHead = ({ items }: { items: string[] }) => {
    return (
        <thead className=" bg-[#D4D2D2] !py-5" style={{ borderTopRightRadius: "14px" }}>
            <tr className="h-[50px] rounded-[14px] ">
                {items.map((item, index) => (
                    <th
                        key={index}
                        className={`text-md text-left font-semibold capitalize leading-normal text-[#04091E] first-of-type:pl-4`}
                    >
                        {item}
                    </th>
                ))}
            </tr>
        </thead>
    )
}

export default TableHead
