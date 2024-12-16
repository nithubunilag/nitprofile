import { Users } from "@/auth/model"
import { BadRequestError, ForbiddenError, HttpStatus, UnAuthorizedError, config, imageUploadService, logger, type Context } from "@/core"
import { AppMessages } from "@/core/common"
import type { UpdateProfilePicturePayload } from "@/user/interfaces"
import fs from "fs"

class UpdateProfilePicture {
    constructor(private readonly dbUser: typeof Users) {}

    handle = async ({ files, user }: Context<UpdateProfilePicturePayload>) => {
        if (!files || !files.pfp || Array.isArray(files.pfp)) throw new ForbiddenError("Profile Image is required")

        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const existingUser = await this.dbUser.findOne({ where: { id: user.id } })

        if (!existingUser) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const imageBuffer = fs.readFileSync(files.pfp.tempFilePath)

        const profilePicture = { ...files.pfp, data: imageBuffer }

        const uploadedImage = await imageUploadService.imageUpload(config.cloudinary.assetsFolder, profilePicture)

        if (!uploadedImage) throw new BadRequestError("Error while updating Profile Picture. Please Try again later")

        existingUser.profilePicPublicId = uploadedImage.public_id
        existingUser.profilePicSecureUrl = uploadedImage.secure_url

        await existingUser.save()

        logger.info(`User with ID ${existingUser.id} updated successfully`)

        return {
            code: HttpStatus.OK,
            message: "Profile Pic Updated Successfully",
            data: {
                publicId: uploadedImage.public_id,
                secureUrl: uploadedImage.secure_url,
            },
        }
    }
}

export const updateProfilePicture = new UpdateProfilePicture(Users)
