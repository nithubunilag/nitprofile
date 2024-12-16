import { BadRequestError, ForbiddenError, HttpStatus, config, imageUploadService, logger, type Context } from "@/core"
import { AppMessages } from "@/core/common"
import { Program } from "@/programs/models"
import { AddProgramCertificateFramePayload } from "@/programs/payload_interfaces"
import fs from "fs"

class AddProgramCertificateFrame {
    constructor(private readonly dbPrograms: typeof Program) {}

    handle = async ({ input, query, files }: Context<AddProgramCertificateFramePayload>) => {
        if (!files || !files.frame || Array.isArray(files.frame)) throw new ForbiddenError("Profile Frame is required")

        const { certificateFrameHeight, certificateFrameWidth } = input

        const width = parseInt(certificateFrameWidth)

        const height = parseInt(certificateFrameHeight)

        const program = await this.dbPrograms.findOne({
            where: { id: query.programId },
        })

        if (!program) throw new BadRequestError(AppMessages.FAILURE.INVALID_PROGRAM)

        const imageBuffer = fs.readFileSync(files.frame.tempFilePath)

        const ceritificateFrame = { ...files.frame, data: imageBuffer }

        const uploadedImage = await imageUploadService.imageUpload(config.cloudinary.certificateFrameFolder, ceritificateFrame)

        if (!uploadedImage) throw new BadRequestError("Error while uploading Frame. Please Try again later")

        program.certificateFrameHeight = height

        program.certificateFrameWidth = width

        program.certificateFramePublicId = uploadedImage.public_id

        program.certificateFrameSecureUrl = uploadedImage.secure_url

        await program.save()

        logger.info(`Program with ID ${program.id} updated successfully`)

        return {
            code: HttpStatus.OK,
            message: AppMessages.SUCCESS.PROGRAM_UPDATED,
            data: program,
        }
    }
}

export const addProgramCertificateFrame = new AddProgramCertificateFrame(Program)
