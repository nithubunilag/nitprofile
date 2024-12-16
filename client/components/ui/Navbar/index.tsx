"use client"

import { appSlice, useAppDispatch, useAppSelector } from "@/state_management"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { MdKeyboardArrowDown } from "react-icons/md"
import { RxHamburgerMenu } from "react-icons/rx"
import { CreateProgramModal } from "../Modals/CreateProgramModal"
import { ProgramsModal } from "../Modals/ProgramsModal"

/**
 * Navbar component for displaying navigation options and user information.
 * @returns {JSX.Element} Navbar component JSX.
 */
export const Navbar = () => {
    // State for managing the visibility of programs modal
    const [programsModal, setProgramsModal] = useState({
        showPrograms: false,
        createProgram: false,
    })

    const router = useRouter()

    const { setSidebar } = appSlice.actions

    const dispatch = useAppDispatch()

    // Gets the current pathname using the usePathname hook
    const pathname = usePathname()

    // Retrieves user data from the state
    const { data } = useAppSelector((state) => state.authSlice)

    // Retrieves selected Program data from the state
    const { selectedProgram, allPrograms } = useAppSelector((state) => state.programSlice)

    useEffect(() => {
        if (allPrograms.length <= 0) {
            setProgramsModal({ ...programsModal, createProgram: true })
        }
    }, [allPrograms])

    const handleClickProfile = () => {
        if (data?.role === "USER") {
            router.push("/student/settings")
        }

        if (data?.role === "ADMIN" || data?.role === "SUPER ADMIN") {
            router.push("/admin/settings")
        }
    }

    return (
        <nav className="flex items-center justify-between bg-white px-[20px] py-[15px] shadow-sm md:ml-[15rem]">
            {/* Programs Modal */}
            <ProgramsModal
                modalIsMounted={programsModal.showPrograms}
                createProgram={() => setProgramsModal({ createProgram: true, showPrograms: false })}
                handleClose={() => setProgramsModal({ ...programsModal, showPrograms: false })}
            />

            {/* Create Programs Modal */}
            <CreateProgramModal
                modalIsMounted={programsModal.createProgram}
                handleClose={() => setProgramsModal({ ...programsModal, createProgram: false })}
            />

            <RxHamburgerMenu
                className="text-3xl text-[#101010] md:hidden"
                onClick={() => {
                    dispatch(setSidebar(true))
                }}
            />

            {/* Current Page Title */}
            <h2 className="hidden flex-1 text-lg font-semibold capitalize text-[#101010] md:inline">
                {pathname.split("/")[2] ?? "Home"}
            </h2>

            {/* Nitprofile Dropdown */}
            <div
                onClick={() => setProgramsModal({ ...programsModal, showPrograms: true })}
                className="group flex max-w-[250px] flex-1 cursor-pointer items-center justify-between gap-4 rounded-md border border-[#676767] px-4 py-2 text-[14px] font-medium  text-[#101010]"
            >
                <p>{selectedProgram?.program.name ?? allPrograms[0]?.name ?? "Nitprofile"}</p>

                <MdKeyboardArrowDown className="text-2xl transition-all duration-300 ease-in-out group-hover:rotate-180" />
            </div>

            {/* User Information */}
            <button
                onClick={() => handleClickProfile()}
                className="hidden flex-1 cursor-pointer items-center justify-end gap-2 md:flex"
            >
                {data?.profilePicSecureUrl && (
                    <div className="h-[40px] w-[40px]">
                        <Image
                            src={data.profilePicSecureUrl ?? ""}
                            alt="Profile Picture"
                            width={40}
                            height={40}
                            className="h-full w-full rounded-full"
                        />
                    </div>
                )}

                {!data?.profilePicSecureUrl && <div className="h-[40px] w-[40px] rounded-full bg-gray-500" />}

                <div className="text-start">
                    <p className="text-sm font-normal text-[#101010]">{data?.firstName ?? "Chidi"}</p>

                    <p className="text-xs font-normal capitalize text-[#676767]">{data?.role ?? "Admin"}</p>
                </div>
            </button>
        </nav>
    )
}
