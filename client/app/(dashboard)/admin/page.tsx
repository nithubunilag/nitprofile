"use client"
import { ConditionalComponent } from "@/components/animation"
import { AdminStatisticsChart } from "@/components/ui/Charts"
import { KpiCard } from "@/components/ui/KpiCard"
import { KpiSkeletonLoader } from "@/components/ui/KpiCard/SkeletonLoader"
import {
    CertificateAmountIllustration,
    ProfileAmountIllustration,
    VerifiedUsersAmountIllustration,
} from "@/public/illustrations"
import { useProgramMetricsApi } from "@/services/programs/program-hooks"
import { useAppSelector } from "@/state_management"
import { useEffect } from "react"

const AdminHome = () => {
    const { handler, loading, data: programMetrics } = useProgramMetricsApi()

    const { selectedProgram } = useAppSelector((state) => state.programSlice)

    const data = [
        {
            title: "No of Profiles generated",
            metric: programMetrics?.data?.noOfProfilesGenerated ?? 0,
            icon: <ProfileAmountIllustration height={100} />,
        },

        {
            title: "No of Users Verified",
            metric: programMetrics?.data?.noOfVerifiedUsers ?? 0,
            icon: <VerifiedUsersAmountIllustration height={100} />,
        },

        {
            title: "No of Certificates generated",
            metric: programMetrics?.data?.noOfCertificatesGenerated ?? 0,
            icon: <CertificateAmountIllustration height={100} />,
        },
    ]

    useEffect(() => {
        selectedProgram && handler(selectedProgram?.program?.id)
    }, [selectedProgram])

    return (
        <div>
            <ConditionalComponent delay={100} isMounted={loading}>
                <div className={`grid grid-cols-1 gap-4  lg:grid-cols-2 xl:grid-cols-3 `}>
                    <KpiSkeletonLoader />
                    <KpiSkeletonLoader />
                    <KpiSkeletonLoader />
                </div>
            </ConditionalComponent>

            <ConditionalComponent delay={100} isMounted={!loading}>
                <div className={`grid grid-cols-1 gap-4  lg:grid-cols-2 xl:grid-cols-3 `}>
                    {data.map((item, index) => (
                        <KpiCard key={index} title={item.title} metric={item.metric} icon={item.icon} />
                    ))}
                </div>
            </ConditionalComponent>

            <AdminStatisticsChart />
        </div>
    )
}

export default AdminHome
