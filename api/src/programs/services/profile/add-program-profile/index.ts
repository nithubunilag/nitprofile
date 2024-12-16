import { type Context, HttpStatus, BadRequestError, logger, imageUploadService, ForbiddenError, config } from "@/core"
import { AppMessages } from "@/core/common"
import { Program } from "@/programs/models"
import { type AddProgramProfileFramePayload } from "@/programs/payload_interfaces"
import fs from "fs"

class AddProgramProfileFrame {
    constructor(private readonly dbPrograms: typeof Program) {}

    handle = async ({ input, query, files }: Context<AddProgramProfileFramePayload>) => {
        if (!files || !files.frame || Array.isArray(files.frame)) throw new ForbiddenError("Profile Frame is required")

        const { profileFrameHeight, profileFrameWidth } = input

        const width = parseInt(profileFrameWidth)

        const height = parseInt(profileFrameHeight)

        const program = await this.dbPrograms.findOne({
            where: { id: query.programId },
        })

        if (!program) throw new BadRequestError(AppMessages.FAILURE.INVALID_PROGRAM)

        const imageBuffer = fs.readFileSync(files.frame.tempFilePath)

        const profileFrame = { ...files.frame, data: imageBuffer }

        const uploadedImage = await imageUploadService.imageUpload(config.cloudinary.profileFrameFolder, profileFrame)

        if (!uploadedImage) throw new BadRequestError("Error while uploading Frame. Please Try again later")

        program.profileFrameHeight = height

        program.profileFrameWidth = width

        program.profileFramePublicId = uploadedImage.public_id

        program.profileFrameSecureUrl = uploadedImage.secure_url

        await program.save()

        logger.info(`Program with ID ${program.id} updated successfully`)

        return {
            code: HttpStatus.OK,
            message: AppMessages.SUCCESS.PROGRAM_UPDATED,
            data: program,
        }
    }
}

export const addProgramProfileFrame = new AddProgramProfileFrame(Program)
