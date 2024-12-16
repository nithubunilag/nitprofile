interface IKpiData {
    title: string
    metric: number
    icon: React.ReactNode | string
}

export const KpiCard = (props: IKpiData) => {
    const { icon, metric, title } = props

    return (
        <div className=" rounded-lg bg-white pl-5 pt-4 shadow-lg 2xl:pt-6">
            <h2 className="mb-6 text-xl font-medium text-[#676767]">{title}</h2>

            <div className="flex items-center justify-between">
                <p className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#2dad00] text-2xl font-medium text-[#101010]">
                    {metric}
                </p>

                {icon}
            </div>
        </div>
    )
}
