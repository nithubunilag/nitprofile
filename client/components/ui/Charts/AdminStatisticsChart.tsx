import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const datas = [
    {
        name: "Page A",
        uv: 4000,
        pv: 2400,
        // amt: 2400,
    },
    {
        name: "Page B",
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: "Page C",
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: "Page D",
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: "Page E",
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: "Page F",
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: "Page G",
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
]

const data = [
    { name: "Jan", noOfProfiles: 15, noOfCertificates: 10 },
    { name: "Feb", noOfProfiles: 23, noOfCertificates: 5 },
    { name: "Mar", noOfProfiles: 12, noOfCertificates: 18 },
    { name: "Apr", noOfProfiles: 7, noOfCertificates: 8 },
    { name: "May", noOfProfiles: 30, noOfCertificates: 12 },
    { name: "Jun", noOfProfiles: 20, noOfCertificates: 15 },
    { name: "Jul", noOfProfiles: 25, noOfCertificates: 7 },
    { name: "Aug", noOfProfiles: 10, noOfCertificates: 20 },
    { name: "Sep", noOfProfiles: 18, noOfCertificates: 14 },
    { name: "Oct", noOfProfiles: 35, noOfCertificates: 9 },
    { name: "Nov", noOfProfiles: 8, noOfCertificates: 25 },
    { name: "Dec", noOfProfiles: 45, noOfCertificates: 6 }
];


export const AdminStatisticsChart = () => {
    return (
        <div className="mt-8 rounded-lg bg-white px-5 py-6 shadow-lg">
            <h2 className="mb-10 text-xl font-medium text-[#676767]">Statistics</h2>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid stroke="#E4E9EC" />
                    <XAxis dataKey="name" />
                    <YAxis  />
                    <Tooltip />
                    <Legend  />
                    <Bar dataKey="noOfProfiles" fill="#63CE39" name="Number of Profiles Generated" />
                    <Bar dataKey="noOfCertificates" fill="#0E1836" name="Number of Certificates Generated" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
