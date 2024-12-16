"use client"

import { ConditionalComponent } from "@/components/animation"
import { Button } from "@/components/ui/Button"
import { makeToast } from "@/libs/react-toast"
import { useEnableCertificateGenerationApi } from "@/services/programs/program-hooks/program-certificate/useEnableCertificateGeneration"
import { usePreviewCertificateCard } from "@/services/programs/program-hooks/program-certificate/usePreviewCertificate"
import { useGetProgramNodesApi } from "@/services/programs/program-hooks/program-nodes"
import { programSlice, useAppDispatch, useAppSelector } from "@/state_management"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { CertificateEmptyState } from "./emptyState"

const Certificate = () => {
    const { selectedProgram } = useAppSelector((state) => state.programSlice)

    const { handler, loading } = usePreviewCertificateCard()
    const { handler: getProgramNodes, loading: programNodesFetching } = useGetProgramNodesApi()
    const { handler: enableCertificateGenerationApi, loading: enablingCertificateGeneration } =
        useEnableCertificateGenerationApi()

    const router = useRouter()

    const dispatch = useAppDispatch()

    const { setProgramNodes, enableCertificateGeneration: enableCertificateGenerationRedux } = programSlice.actions

    const [previewedCertificate, setPreviewedCertificate] = useState("")

    const programFrame = useMemo(() => {
        return selectedProgram?.program.certificateFrameSecureUrl
    }, [selectedProgram?.program.certificateFrameSecureUrl])

    const handleCustomizeFrame = async () => {
        if (!selectedProgram) return

        const programNodes = await getProgramNodes({
            programId: selectedProgram?.program.id,
            category: "certificate",
        })

        programNodes && dispatch(setProgramNodes(programNodes.data))

        localStorage.setItem("node_type", "certificate")

        router.push("/editor")
    }

    const previewCertificate = async () => {
        const response = selectedProgram && (await handler(selectedProgram?.program.id))

        if (!response?.data) {
            return makeToast({
                id: "error-previewing-certificate",
                message: "Error Previewing Certificate",
                type: "error",
                duration: 3000,
            })
        }

        setPreviewedCertificate(response?.data ?? "")
    }

    const enableCertificateGeneration = async () => {
        if (!selectedProgram) return

        const response = await enableCertificateGenerationApi(selectedProgram?.program?.id)

        if (response) dispatch(enableCertificateGenerationRedux())
    }

    useEffect(() => {
        setPreviewedCertificate("")
    }, [selectedProgram])

    return (
        <>
            {!programFrame && <CertificateEmptyState />}

            {programFrame && (
                <section className=" mx-auto h-full max-w-[1500px]">
                    <div className="mb-4 flex w-full items-end justify-end gap-4">
                        <Button
                            variant="outlined"
                            label={
                                selectedProgram?.program.certificateGenerationAvailable
                                    ? "Certificate Generation Enabled"
                                    : "Enable Certificate Generation"
                            }
                            loading={enablingCertificateGeneration}
                            disabled={selectedProgram?.program.certificateGenerationAvailable}
                            onClick={() => enableCertificateGeneration()}
                        />

                        <Button
                            variant="contained"
                            label="Customize"
                            loading={programNodesFetching}
                            onClick={() => handleCustomizeFrame()}
                            disabled={selectedProgram?.program.certificateGenerationAvailable}
                        />
                    </div>

                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="w-full md:basis-[50%]">
                            <h2 className="mb-2 text-center text-lg font-semibold text-[#101010] md:text-xl">Frame</h2>
                            <Image
                                src={programFrame}
                                alt="Certificate Frame"
                                width={100}
                                height={100}
                                className="w-full rounded-md"
                                unoptimized
                                priority
                            />
                        </div>

                        <div className="w-full md:basis-[50%]">
                            <h2 className="mb-2 text-center text-lg font-semibold text-primary md:text-xl">Preview</h2>

                            <ConditionalComponent isMounted={!previewedCertificate} delay={100}>
                                <div className="flex flex-col items-center">
                                    <p className="my-6 max-w-[32rem] text-center">
                                        Click on the Button Below to Preview Certificate
                                    </p>

                                    <Button
                                        label="Preview Certificate"
                                        variant="contained"
                                        className="mx-auto"
                                        onClick={() => previewCertificate()}
                                        loading={loading}
                                    />
                                </div>
                            </ConditionalComponent>

                            <ConditionalComponent isMounted={previewedCertificate ? true : false} delay={100}>
                                <Image
                                    src={previewedCertificate}
                                    alt="Certificate Frame"
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
export default Certificate
