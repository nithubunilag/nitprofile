"use client"
import { ConditionalComponent } from "@/components/animation"
import { Button } from "@/components/ui/Button"
import { TableSkeletonLoader } from "@/components/ui/Loaders"
import { CreateAdminModal } from "@/components/ui/Modals/CreateAdminModal"
import { Search } from "@/components/ui/Search"
import { useCreateBulkUsers } from "@/hooks/useCreateBulkUsers"
import { useGetProgramUsersApi } from "@/services/programs/program-hooks/program-users"
import { IProgramUser } from "@/services/programs/program.interface"
import { programSlice, useAppDispatch, useAppSelector } from "@/state_management"
import { useEffect, useState } from "react"
import { AiOutlinePlus } from "react-icons/ai"

const Admins = () => {
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
            {/* Create User Modal */}
            <CreateAdminModal
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

                <Button
                    label={
                        <div className="group flex items-center gap-2">
                            <AiOutlinePlus className="transition-all duration-300 ease-in-out group-hover:rotate-180" />
                            Create New Admin
                        </div>
                    }
                    variant="contained"
                    disabled={loading}
                    onClick={() => setUsersModal({ ...usersModal, createSingleUser: true })}
                />
            </div>

            <ConditionalComponent isMounted={loading} delay={100}>
                <TableSkeletonLoader />
            </ConditionalComponent>

            {/* <ConditionalComponent isMounted={!loading} delay={100}>
                <MemoizedAdminTable users={allUsers} />
            </ConditionalComponent> */}
        </main>
    )
}

export default Admins
