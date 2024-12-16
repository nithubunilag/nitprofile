"use client"
import React, { useState } from "react"

import {
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableCheckBox,
    TableContainer,
    TableHead,
    TableMoreMenu,
    TableRow,
} from "@/components/ui"
import useTable from "@/hooks/useTable"
import { makeToast } from "@/libs/react-toast"
import { DeleteIcon, EditIcon } from "@/public/icons"
import { useResendProgramUserVerificationMailApi } from "@/services/programs/program-hooks/program-users"
import { IProgramUser } from "@/services/programs/program.interface"
import { useAppSelector } from "@/state_management"
interface IUserProps {
    users: IProgramUser[]
}

export const UsersTable = (props: IUserProps) => {
    const { users } = props

    const rowsPerPage = 7

    const { currentPage, currentPageData, handleChangePage, isLastPage, isFirstPage, goToNext, goToPrev } = useTable(
        users,
        rowsPerPage,
    )

    const [selectedUsers, setSelectedUsers] = useState<string[]>([])

    const handleCheckboxChange = (userId: string) => {
        if (selectedUsers.includes(userId)) {
            const filteredUsers = selectedUsers.filter((id) => id !== userId)
            return setSelectedUsers(filteredUsers)
        }

        setSelectedUsers([...selectedUsers, userId])
    }

    const handleDeleteUser = (id: string) => {}

    const { handler: resendVerificationMail, loading: resendingMail } = useResendProgramUserVerificationMailApi()

    const { selectedProgram } = useAppSelector((state) => state.programSlice)

    const handleResendVerificationMail = async (email: string) => {
        if (!selectedProgram) return

        const response = await resendVerificationMail({
            email,
            programId: selectedProgram.program.id,
        })

        if (!response) return

        makeToast({
            id: "sent-verification-mail",
            message: "Mail Sent Successfully",
            type: "success",
        })
    }

    const bulkDeleteUsers = () => {}

    return (
        <TableContainer>
            <Table>
                <TableHead items={["", "First Name", "Other Name", "Last Name", "Email", ""]} />
                <TableBody>
                    {currentPageData.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <TableCheckBox
                                    handleCheckboxChange={() => handleCheckboxChange(row.id)}
                                    checked={selectedUsers.includes(row.id)}
                                />
                            </TableCell>
                            <TableCell>{row.firstName}</TableCell>
                            <TableCell>{row.otherName ?? "-"}</TableCell>
                            <TableCell>{row.lastName}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>
                                <TableMoreMenu
                                    actions={
                                        <div className="mx-auto flex w-[150px] flex-col gap-5 rounded-lg border-[0.5px] border-[#E3E6E8] bg-white shadow-sm">
                                            {!row.isVerified && (
                                                <button
                                                    disabled={resendingMail}
                                                    className="flex items-center gap-2 px-5 py-2 text-sm text-primary transition-all duration-300 ease-in-out hover:bg-[#E3E6E8]"
                                                    onClick={() => handleResendVerificationMail(row.email)}
                                                >
                                                    <EditIcon width={17} height={17} />

                                                    <span>{resendingMail ? "Resending..." : "Resend Mail"}</span>
                                                </button>
                                            )}

                                            <button
                                                className="flex items-center gap-2 px-5 py-2 text-sm  transition-all duration-300 ease-in-out hover:bg-[#E3E6E8]"
                                                onClick={() => handleDeleteUser(row.id)}
                                            >
                                                <DeleteIcon width={17} height={17} />

                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination
                rowsPerPage={rowsPerPage}
                totalRows={users.length}
                handleChangePage={handleChangePage}
                currentPage={currentPage}
                isFirstPage={isFirstPage}
                isLastPage={isLastPage}
                goToNext={goToNext}
                goToPrev={goToPrev}
            />
        </TableContainer>
    )
}

export const MemoizedUsersTable = React.memo(UsersTable)
