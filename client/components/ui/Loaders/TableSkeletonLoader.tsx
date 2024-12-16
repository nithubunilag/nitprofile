import React from "react"

export const TableSkeletonLoader = () => {
    const NO_OF_ROWS = 7
    return (
        <div className="h-full min-h-[400px] w-full rounded-bl-lg rounded-br-lg bg-white shadow-lg">
            <div className="flex h-[50px] w-full animate-pulse items-center justify-around bg-[#D4D2D2]">
                <div className="h-[15px] w-[15%] bg-[#101010]/60" />
                <div className="h-[15px] w-[15%] bg-[#101010]/60" />
                <div className="h-[15px] w-[15%] bg-[#101010]/60" />
                <div className="h-[15px] w-[15%] bg-[#101010]/60" />
            </div>
            <div className="">
                {new Array(NO_OF_ROWS).fill("").map((_, index) => (
                    <div key={index} className="flex h-[50px] items-center justify-around border-b border-[#676767]/50">
                        <div className="h-[15px] w-[15%] bg-[#101010]/30" />
                        <div className="h-[15px] w-[15%] bg-[#101010]/30" />
                        <div className="h-[15px] w-[15%] bg-[#101010]/30" />
                        <div className="h-[15px] w-[15%] bg-[#101010]/30" />
                    </div>
                ))}
            </div>
            <div className="flex h-[50px] items-center gap-4 px-12">
                <div className="h-[15px] w-[100px] bg-[#101010]/30" />
                <div className="flex items-center gap-2">
                    <div className=" h-[26px] w-[26px] rounded border-[0.5px] border-[#E3E6E8] bg-[#101010]/10 " />
                    <div className=" h-[26px] w-[26px] rounded border-[0.5px] border-[#E3E6E8] bg-[#101010]/10 " />
                    <div className=" h-[26px] w-[26px] rounded border-[0.5px] border-[#E3E6E8] bg-[#101010]/10 " />
                </div>
                <div className="h-[15px] w-[100px] bg-[#101010]/30" />
            </div>
        </div>
    )
}
