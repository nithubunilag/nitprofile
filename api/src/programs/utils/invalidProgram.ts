import type { Program } from "@/programs/models/program.model"

export const isProgramProfileValid = (program: Program): boolean => {
    const { profileFramePublicId, certificateFramePublicId } = program

    return profileFramePublicId || certificateFramePublicId ? true : false
}



