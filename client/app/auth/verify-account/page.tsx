"use client"

import React, { useEffect } from "react"
import { Input } from "@/components/form"
import { Button } from "@/components/ui/Button"
import { useVerifyAccountApi } from "@/services/auth/auth-hooks"
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

const VerifyAccount = () => {
    const { handler, loading } = useVerifyAccountApi()

    const searchParams = useSearchParams()

    const router = useRouter()

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<schemaType>({
        resolver: zodResolver(schema),
    })

    const getVerificationToken = () => {
        const verificationToken = searchParams.get("token")

        if (!verificationToken) {
            router.push("/auth")

            return makeToast({
                id: "verify-accounut-error",
                message: "Invalid Verification Token",
                type: "error",
            })
        }

        return verificationToken
    }

    const onSubmit = async (data: schemaType) => {
        const verificationToken = getVerificationToken()

        const response = await handler({
            password: data.password,
            token: verificationToken ?? "",
        })

        if (!response || !response.message) return

        makeToast({
            id: "verify-account-success",
            message: response?.message,
            type: "success",
        })

        router.push("/auth")

        makeToast({
            id: "verify-account-message",
            message: "Please Login with your new Credentials",
            type: "success",
        })
    }

    useEffect(() => {
        getVerificationToken()
    }, [])

    return (
        <>
            <h2 className="text-center text-lg font-semibold text-[#101010] md:text-2xl ">Verify Account</h2>

            <p className="text-center text-sm text-[#676767]">
                Please create a new password to be used when authenticating
            </p>

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

                <Button variant="contained" label="Verify Account" loading={loading} type="submit" />
            </form>
        </>
    )
}

export default VerifyAccount
