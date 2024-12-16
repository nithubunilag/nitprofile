import { IProgram } from "@/services/programs/program.interface"
import { programSlice, useAppDispatch, useAppSelector } from "@/state_management"
import { TfiClose } from "react-icons/tfi"
import { Button } from "../Button"
import { IBaseModalProps, ModalLayout } from "./ModalLayout"

interface IProgramsModalProps extends IBaseModalProps {
    createProgram: Function
    handleClose: Function
}

export const ProgramsModal = (props: IProgramsModalProps) => {
    const { modalIsMounted, handleClose, createProgram } = props

    const { data } = useAppSelector((state) => state.authSlice)

    const { allPrograms } = useAppSelector((state) => state.programSlice)

    const dispatch = useAppDispatch()

    const { setSelectedProgram } = programSlice.actions

    const selectProgram = (program: IProgram) => {
        dispatch(setSelectedProgram(program))
        handleClose()
    }

    return (
        <ModalLayout isMounted={modalIsMounted} onClose={handleClose}>
            <div className=" px-2 md:px-0">
                <div className="mb-4 flex items-center justify-between border-b-2 border-[#676767_0.5] pb-2 text-[#000000_0.5]">
                    <h2 className="text-lg font-semibold md:text-xl">Select a program</h2>

                    <TfiClose
                        className="cursor-pointer text-base transition-all duration-300 ease-in-out hover:rotate-180 md:text-xl"
                        onClick={() => handleClose()}
                    />
                </div>

                <div className="mb-8 flex max-h-[400px] flex-col gap-4 overflow-y-scroll">
                    {allPrograms.map((program, index) => (
                        <button
                            onClick={() => selectProgram(program)}
                            key={index}
                            className="group relative mx-auto inline-flex max-h-[50px] w-[98%] items-center justify-start overflow-hidden rounded bg-white py-6 pl-4 pr-12 text-sm font-normal capitalize text-[#101010] shadow-program_card transition-all  duration-300 ease-in-out hover:pl-10 hover:pr-6 md:text-base"
                        >
                            <span className="absolute left-0 top-0 h-[1px] w-full bg-primary transition-all duration-150 ease-in-out group-hover:h-full"></span>
                            <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12"></span>
                            <span className="absolute left-0 -translate-x-12 pl-2.5 duration-200 ease-out group-hover:translate-x-0"></span>
                            <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
                                {program.name}
                            </span>
                        </button>
                    ))}
                </div>

                {data?.role !== "USER" && (
                    <div className="flex items-end justify-end">
                        <Button variant="contained" label="Create Program" onClick={() => createProgram()} />
                    </div>
                )}
            </div>
        </ModalLayout>
    )
}
