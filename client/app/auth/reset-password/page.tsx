"use client"

import React, { useEffect } from "react"
import { Input } from "@/components/form"
import { Button } from "@/components/ui/Button"
import { useResetPasswordApi } from "@/services/auth/auth-hooks"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { makeToast } from "@/libs/react-toast"

const schema = z
    .object({
        password: z.string(),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirm"],
    })

type schemaType = z.infer<typeof schema>

const ResetPassword = () => {
    const { handler, loading } = useResetPasswordApi()

    const searchParams = useSearchParams()

    const router = useRouter()

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<schemaType>({
        resolver: zodResolver(schema),
    })

    const getResetToken = () => {
        const resetToken = searchParams.get("resetToken")

        if (!resetToken) {
            router.push("/auth")

            return makeToast({
                id: "reset-password-error",
                message: "Invalid Reset Token",
                type: "error",
            })
        }

        return resetToken
    }

    const onSubmit = async (data: schemaType) => {
        const resetToken = getResetToken()

        const response = await handler({
            password: data.password,
            resetToken: resetToken ?? "",
        })

        if (!response || !response.message) return

        makeToast({
            id: "reset-password-success",
            message: response?.message,
            type: "success",
        })

        router.push("/auth")

        makeToast({
            id: "reset-password-message",
            message: "Please Login with your new Credentials",
            type: "success",
        })
    }

    useEffect(() => {
        getResetToken()
    }, [])

    return (
        <>
            <h2 className="text-center text-lg font-semibold text-[#101010] md:text-2xl ">Reset Password</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-4">
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

                <Button variant="contained" label="Reset Password" loading={loading} type="submit" />
            </form>
        </>
    )
}

export default ResetPassword
