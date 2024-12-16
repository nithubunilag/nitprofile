"use client"

import { ConditionalComponent } from "@/components/animation"
import { Button } from "@/components/ui/Button"
import { makeToast } from "@/libs/react-toast"
import { useGetProgramNodesApi } from "@/services/programs/program-hooks/program-nodes"
import {
    useEnableProfileCardGenerationApi,
    usePreviewProfileCard,
} from "@/services/programs/program-hooks/program-profile"
import { programSlice, useAppDispatch, useAppSelector } from "@/state_management"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { ProfileEmptyState } from "./emptyState"

const Profile = () => {
    const { selectedProgram } = useAppSelector((state) => state.programSlice)

    const { handler, loading } = usePreviewProfileCard()

    const router = useRouter()

    const dispatch = useAppDispatch()

    const { setProgramNodes, enableProfileGeneration: enableProfileGenerationRedux } = programSlice.actions

    const { handler: getProgramNodes, loading: programNodesFetching } = useGetProgramNodesApi()

    const [previewedProfile, setPreviewedProfile] = useState("")

    const programFrame = useMemo(() => {
        return selectedProgram?.program.profileFrameSecureUrl
    }, [selectedProgram?.program.profileFrameSecureUrl])

    const handleCustomizeFrame = async () => {
        if (!selectedProgram) return

        const programNodes = await getProgramNodes({
            programId: selectedProgram?.program.id,
            category: "profile",
        })

        programNodes && dispatch(setProgramNodes(programNodes.data))

        localStorage.setItem("node_type", "profile")

        router.push("/editor")
    }

    const previewProfile = async () => {
        const response = selectedProgram && (await handler(selectedProgram?.program.id))

        if (!response?.data) {
            return makeToast({
                id: "error-previewing-profile",
                message: "Error Previewing Profile",
                type: "error",
                duration: 3000,
            })
        }

        setPreviewedProfile(response?.data ?? "")
    }
    const { handler: enableProfileGenerationApi, loading: enablingProfileGeneration } =
        useEnableProfileCardGenerationApi()

    const enableProfileGeneration = async () => {
        if (!selectedProgram) return

        const response = await enableProfileGenerationApi(selectedProgram?.program?.id)

        if (response) dispatch(enableProfileGenerationRedux())
    }

    useEffect(() => {
        setPreviewedProfile("")
    }, [selectedProgram])

    return (
        <>
            {!programFrame && <ProfileEmptyState />}

            {programFrame && (
                <section className=" mx-auto h-full max-w-[1500px]">
                    <div className="mb-4 flex w-full items-end justify-end gap-4">
                        <Button
                            variant="outlined"
                            label={
                                selectedProgram?.program.profileGenerationAvailable
                                    ? "Profile Generation Enabled"
                                    : "Enable Profile Generation"
                            }
                            loading={enablingProfileGeneration}
                            disabled={selectedProgram?.program.profileGenerationAvailable}
                            onClick={() => enableProfileGeneration()}
                        />

                        <Button
                            variant="contained"
                            label="Customize"
                            loading={programNodesFetching}
                            onClick={() => handleCustomizeFrame()}
                            disabled={selectedProgram?.program.profileGenerationAvailable}
                        />
                    </div>

                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="w-full md:basis-[50%]">
                            <h2 className="mb-2 text-center text-lg font-semibold text-[#101010] md:text-xl">Frame</h2>
                            <Image
                                src={programFrame}
                                alt="Profile Frame"
                                width={100}
                                height={100}
                                className="w-full rounded-md"
                                unoptimized
                                priority
                            />
                        </div>

                        <div className="w-full md:basis-[50%]">
                            <h2 className="mb-2 text-center text-lg font-semibold text-primary md:text-xl">Preview</h2>

                            <ConditionalComponent isMounted={!previewedProfile} delay={100}>
                                <div className="flex flex-col items-center">
                                    <p className="my-6 max-w-[32rem] text-center">
                                        Click on the Button Below to Preview Profile
                                    </p>

                                    <Button
                                        label="Preview Profile"
                                        variant="contained"
                                        className="mx-auto"
                                        onClick={() => previewProfile()}
                                        loading={loading}
                                    />
                                </div>
                            </ConditionalComponent>

                            <ConditionalComponent isMounted={previewedProfile ? true : false} delay={100}>
                                <Image
                                    src={previewedProfile}
                                    alt="Profile Frame"
                                    width={100}
                                    height={100}
                                    className="w-full rounded-md"
                                    unoptimized
                                    priority
                                />
                            </ConditionalComponent>
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}
export default Profile
