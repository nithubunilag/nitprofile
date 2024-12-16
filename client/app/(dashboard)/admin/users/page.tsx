"use client"
import { useEffect, useState } from "react"

import { ConditionalComponent } from "@/components/animation"
import { Button } from "@/components/ui/Button"
import { CSVViewer } from "@/components/ui/CSVViewer"
import { TableSkeletonLoader } from "@/components/ui/Loaders"
import { CreateUserModal } from "@/components/ui/Modals/CreateUserModal"
import { DropzoneModal } from "@/components/ui/Modals/DropzoneModal"
import { Search } from "@/components/ui/Search"
import { MemoizedUsersTable } from "@/components/ui/Table/Tables"
import { useCreateBulkUsers } from "@/hooks/useCreateBulkUsers"
import { useGetProgramUsersApi } from "@/services/programs/program-hooks/program-users"
import { IProgramUser } from "@/services/programs/program.interface"
import { programSlice, useAppDispatch, useAppSelector } from "@/state_management"
import { AiOutlinePlus } from "react-icons/ai"

const Users = () => {
    const dispatch = useAppDispatch()

    const { handler, loading } = useGetProgramUsersApi()

    const [allUsers, setAllUsers] = useState<IProgramUser[]>([])

    const [usersModal, setUsersModal] = useState({
        createBulkUsers: false,
        createSingleUser: false,
    })

    const { selectedProgram, programUsers } = useAppSelector((state) => state.programSlice)

    const {
        csvData,
        loading: bulkUsersCreating,
        deleteCSV,
        onSubmit,
        handleFileUpload,
        csvDeleted,
    } = useCreateBulkUsers(() => setUsersModal({ ...usersModal, createBulkUsers: false }))

    const { setProgramUsers } = programSlice.actions

    const getUsers = async (programiD: string) => {
        const users = await handler(programiD)

        if (!users) return

        dispatch(setProgramUsers(users.data))

        setAllUsers(users.data)
    }

    useEffect(() => {
        if (!selectedProgram) return

        getUsers(selectedProgram.program.id)
    }, [selectedProgram?.program])

    useEffect(() => {
        setAllUsers(programUsers)
    }, [programUsers])

    return (
        <main>
            <DropzoneModal
                header={"Upload Users CSV"}
                modalIsMounted={usersModal.createBulkUsers}
                handleClose={() => setUsersModal({ ...usersModal, createBulkUsers: false })}
                handleInputChange={handleFileUpload}
                fileDeleted={csvDeleted}
                accept={{
                    "text/*": [".csv"],
                }}
            >
                <div className="mb-4 block px-3">
                    <CSVViewer csvData={csvData} />
                </div>

                <div className=" items- flex justify-between">
                    <Button
                        variant="outlined"
                        label="Delete"
                        disabled={bulkUsersCreating}
                        onClick={() => deleteCSV()}
                    />
                    <Button variant="contained" label="Submit" loading={bulkUsersCreating} onClick={() => onSubmit()} />
                </div>
            </DropzoneModal>

            {/* Create User Modal */}
            <CreateUserModal
                modalIsMounted={usersModal.createSingleUser}
                handleClose={() => setUsersModal({ ...usersModal, createSingleUser: false })}
            />

            <div className="mb-5 flex flex-col items-center justify-between gap-4 md:flex-row">
                <Search
                    initialState={allUsers}
                    setState={setAllUsers}
                    conditionKeyword={"firstName"}
                    resetState={programUsers}
                />

                <div className="flex flex-col gap-4 md:flex-row">
                    <Button
                        label="Import CSV"
                        variant="outlined"
                        onClick={() => setUsersModal({ ...usersModal, createBulkUsers: true })}
                        disabled={loading}
                    />
                    <Button
                        label={
                            <div className="group flex items-center gap-2">
                                <AiOutlinePlus className="transition-all duration-300 ease-in-out group-hover:rotate-180" />
                                Create New User
                            </div>
                        }
                        variant="contained"
                        disabled={loading}
                        onClick={() => setUsersModal({ ...usersModal, createSingleUser: true })}
                    />
                </div>
            </div>

            <ConditionalComponent isMounted={loading} delay={100}>
                <TableSkeletonLoader />
            </ConditionalComponent>

            <ConditionalComponent isMounted={!loading} delay={100}>
                <MemoizedUsersTable users={allUsers} />
            </ConditionalComponent>
        </main>
    )
}

export default Users
