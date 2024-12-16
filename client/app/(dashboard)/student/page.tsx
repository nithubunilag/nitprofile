import { KpiCard } from "@/components/ui/KpiCard"
import {
    CertificateAmountIllustration,
    ProfileAmountIllustration,
    VerifiedUsersAmountIllustration,
} from "@/public/illustrations"

const StudentHome = () => {
    const data = [
        {
            title: "Programs Completed",
            metric: 0,
            icon: <ProfileAmountIllustration height={100} />,
        },

        {
            title: "Programs Currently Enrolled in",
            metric: 1,
            icon: <VerifiedUsersAmountIllustration height={100} />,
        },

        {
            title: "Certificates Received",
            metric: 0,
            icon: <CertificateAmountIllustration height={100} />,
        },
    ]

    return (
        <div>
            <div className={`grid grid-cols-1 gap-4  lg:grid-cols-2 xl:grid-cols-3 `}>
                {data.map((item, index) => (
                    <KpiCard key={index} title={item.title} metric={item.metric} icon={item.icon} />
                ))}
            </div>
        </div>
    )
}

export default StudentHome
