"use client"

import { RequireAuthentication } from "@/components/middlewares"
import { Navbar } from "@/components/ui"
import { Sidebar } from "@/components/ui/Sidebar"
import { useScreenSize } from "@/hooks/useScreenSize"
import { useGetProgramsApi } from "@/services/programs/program-hooks"
import { useGetProgramUserApi } from "@/services/programs/program-hooks/program-users/useGetProgramUserApi"
import { programSlice, useAppSelector } from "@/state_management"
import { getAllowedRoles } from "@/utils"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()

    const [programsFetching, setProgramsFetching] = useState(false)

    const { handler } = useGetProgramsApi()

    const { handler: getProgramUser } = useGetProgramUserApi()

    const dispatch = useDispatch()

    const { allPrograms, selectedProgram } = useAppSelector((state) => state.programSlice)

    const { data } = useAppSelector((state) => state.authSlice)

    const { initialize, setSelectedProgram, setUserPrograms, setUserProgram } = programSlice.actions

    useScreenSize()

    const getAllPrograms = async () => {
        setProgramsFetching(true)

        const programs = await handler(undefined)

        programs && dispatch(initialize(programs?.data))

        if (programs && programs?.data.length) {
            const selectedProgramId = localStorage.getItem("selected_program_id")

            if (selectedProgramId) {
                const selectedProgram = programs.data.find((item) => (item.id === selectedProgramId))

                selectedProgram && dispatch(setSelectedProgram(selectedProgram))
            } else {
                programs && programs?.data.length && dispatch(setSelectedProgram(programs?.data[0]))
            }
        }

        if (data && data.role === "USER") {
            const userPrograms = await getProgramUser(undefined)

            if (userPrograms?.data) {
                dispatch(setUserPrograms(userPrograms?.data))

                dispatch(setUserProgram())
            }
        }

        setProgramsFetching(false)
    }

    useEffect(() => {
        !allPrograms.length && getAllPrograms()
    }, [])

    useEffect(() => {
        dispatch(setUserProgram())
    }, [selectedProgram?.program])

    return (
        <RequireAuthentication loading={programsFetching} allowedRoles={getAllowedRoles(pathname)}>
            <div className="min-h-screen bg-[#ededee]">
                <Navbar />

                <div className="flex">
                    <Sidebar />

                    <main
                        id="main-content"
                        style={{
                            minHeight: "calc(100vh - 70px)",
                        }}
                        className="relative !z-0 w-full overflow-y-scroll  px-8 py-[40px] md:ml-[15rem] "
                    >
                        {children}
                    </main>
                </div>
            </div>
        </RequireAuthentication>
    )
}

export default DashboardLayout
