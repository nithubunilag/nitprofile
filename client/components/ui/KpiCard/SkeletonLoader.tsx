import React from "react"

export const KpiSkeletonLoader = () => {
    return (
        <div className="animate-pulse rounded-lg bg-white pl-5 pt-4 shadow-lg 2xl:pt-6">
            <div className="mb-6 mt-3 h-5 w-32 bg-[#676767]"></div>

            <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-full bg-[#676767]" />

                <div className="h-[100px] w-[100px] rounded-md bg-[#939393]" />
            </div>
        </div>
    )
}
