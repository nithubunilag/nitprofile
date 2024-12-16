import { currentOrigin, logger } from "@/core"
import { programAcceptanceMail, sendEmail } from "@/mails"
import type { SendEmailRequestInterface } from "@/mails/dto"
import { UserPrograms } from "../models"

export interface ISendUsersEmail {
    programName: string
    firstName: string
    lastName: string
    token: string
    email: string
    userId: string
    programId: string
}

class SendUserEmail {
    constructor(private readonly dbUserPrograms: typeof UserPrograms) {}

    handle = async (input: ISendUsersEmail[]) => {
        const sentMails: Promise<SendEmailRequestInterface>[] = []

        try {
            await Promise.all(
                input.map(async (user) => {
                    const { firstName, lastName, programName, token, email } = user

                    const sentMail = sendEmail({
                        to: email,
                        subject: "Confirmation Email",
                        body: programAcceptanceMail({
                            lastName,
                            firstName,
                            programName,
                            link: `${currentOrigin}/auth/verify-account?token=${token}`,
                        }),
                    })

                    sentMails.push(sentMail)
                }),
            )

            const results = await Promise.allSettled(sentMails)

            results.forEach((result) => {
                if (result.status === "fulfilled") {
                    const user = input.find((item) => (item.email = result.value.to))

                    this.dbUserPrograms.update({ acceptanceMailSent: true }, { where: { userId: user?.userId, programId: user?.programId } })
                }
            })
        } catch (error: any) {
            logger.error(error?.message)

            throw new Error("Internal Server Error")
        }
    }
}

export const sendNewUserMail = new SendUserEmail(UserPrograms)
