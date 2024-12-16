"use client"

import { Input } from "@/components/form"
import { Button } from "@/components/ui/Button"
import { makeToast } from "@/libs/react-toast"
import { useAcceptAdminInviteApi } from "@/services/auth/auth-hooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z
    .object({
        firstName: z.string(),
        lastName: z.string(),
        password: z.string(),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirm"],
    })

type schemaType = z.infer<typeof schema>

const AcceptAdminInvitation = () => {
    const { handler, loading } = useAcceptAdminInviteApi()

    const searchParams = useSearchParams()

    const router = useRouter()

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<schemaType>({
        resolver: zodResolver(schema),
    })

    const getInvitationToken = () => {
        const invitationToken = searchParams.get("token")

        if (!invitationToken) {
            router.push("/auth")

            return makeToast({
                id: "accept-admin-invite-error",
                message: "Invalid Invitation Token. Please Contact Administrator for more details",
                type: "error",
            })
        }

        return invitationToken
    }

    const onSubmit = async (data: schemaType) => {
        const invitationToken = getInvitationToken()

        const { confirmPassword, ...payload } = data

        const response = await handler({
            payload,
            token: invitationToken,
        })

        if (!response || !response.data) return

        makeToast({
            id: "accept-admin-invite-success",
            message: "Admin Invited Successfully. Please Log in",
            type: "success",
        })

        router.push("/auth")

        makeToast({
            id: "accept-admin-invite-message",
            message: "Please Login with your new Credentials",
            type: "success",
        })
    }

    useEffect(() => {
        getInvitationToken()
    }, [])

    return (
        <>
            <h2 className="text-center text-lg font-semibold text-[#101010] md:text-2xl ">Create Admin Account</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-4">
                <Input
                    required
                    name="firstName"
                    label="First Name"
                    register={register}
                    placeholder="First Name"
                    error={errors?.firstName ? errors.firstName.message : undefined}
                />

                <Input
                    required
                    name="lastName"
                    label="Last Name"
                    register={register}
                    placeholder="Last Name"
                    error={errors?.lastName ? errors.lastName.message : undefined}
                />

                <Input
                    required
                    name="password"
                    type="password"
                    label="Password"
                    register={register}
                    placeholder="Enter your Password"
                    error={errors?.password ? errors.password.message : undefined}
                />

                <Input
                    required
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    register={register}
                    placeholder="Enter your Password"
                    error={errors?.confirmPassword ? errors.confirmPassword.message : undefined}
                />

                <Button variant="contained" label="Create" loading={loading} type="submit" />
            </form>
        </>
    )
}

export default AcceptAdminInvitation
