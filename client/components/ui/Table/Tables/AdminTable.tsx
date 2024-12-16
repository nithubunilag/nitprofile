"use client"
import React, { useState } from "react"

import {
    Pagination,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableCell,
    TableCheckBox,
    TableMoreMenu,
    TableRow,
} from "@/components/ui"
import useTable from "@/hooks/useTable"
import { DeleteIcon } from "@/public/icons"
import { IUser } from "@/state_management"
interface IAdminProps {
    admins: IUser[]
}

export const AdminTable = (props: IAdminProps) => {
    const { admins } = props

    const rowsPerPage = 10

    const { currentPage, currentPageData, handleChangePage, isLastPage, isFirstPage, goToNext, goToPrev } = useTable(
        admins,
        rowsPerPage,
    )

    const [selectedAdmins, setSelectedAdmins] = useState<string[]>([])

    const handleCheckboxChange = (userId: string) => {
        if (selectedAdmins.includes(userId)) {
            const filteredUsers = selectedAdmins.filter((id) => id !== userId)
            return setSelectedAdmins(filteredUsers)
        }

        setSelectedAdmins([...selectedAdmins, userId])
    }

    const handleDeleteUser = (id: string) => {}

    const handleResendVerificationMail = (id: string) => {}

    const bulkDeleteUsers = () => {}

    return (
        <TableContainer>
            <Table>
                <TableHead items={["", "First Name", "Last Name", "Email", "Role", ""]} />
                <TableBody>
                    {currentPageData.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <TableCheckBox
                                    handleCheckboxChange={() => handleCheckboxChange(row.id)}
                                    checked={selectedAdmins.includes(row.id)}
                                />
                            </TableCell>
                            <TableCell>{row.firstName}</TableCell>
                            <TableCell>{row.lastName}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{row.role}</TableCell>
                            <TableCell>
                                <TableMoreMenu
                                    actions={
                                        <div className="mx-auto flex w-[150px] flex-col gap-5 rounded-lg border-[0.5px] border-[#E3E6E8] bg-white shadow-sm">
                                            <button
                                                className="flex items-center gap-2 px-5 py-2 text-sm  transition-all duration-300 ease-in-out hover:bg-[#E3E6E8]"
                                                onClick={() => handleDeleteUser(row.id)}
                                            >
                                                <DeleteIcon width={17} height={17} />

                                                <span>Remove Admin</span>
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
                totalRows={admins.length}
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

export const MemoizedAdminTable = React.memo(AdminTable)
