"use client"

import React from "react"
import { Input } from "@/components/form"
import { Button } from "@/components/ui/Button"
import { useForgotPasswordApi } from "@/services/auth/auth-hooks"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { makeToast } from "@/libs/react-toast"

const schema = z.object({
    email: z.string().email(),
})

type schemaType = z.infer<typeof schema>

const ForgotPassword = () => {
    const { handler, loading } = useForgotPasswordApi()

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<schemaType>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: schemaType) => {
        const response = await handler(data)

        if (!response || !response.message) return

        makeToast({
            id: "forgot-password-success",
            message: response?.message,
            type: "success",
        })

        reset()
    }

    return (
        <>
            <h2 className="text-center text-lg font-semibold text-[#101010] md:text-2xl ">Forgot Password</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-4">
                <Input
                    required
                    name="email"
                    type="email"
                    label="Email Adddress"
                    register={register}
                    placeholder="Enter your Email Address"
                    error={errors?.email ? errors.email.message : undefined}
                />

                <Link href={"/auth/login"} className="mb-4 flex items-center justify-between">
                    <div className="text-sm font-medium tracking-tight text-primary underline">Back to Login?</div>
                </Link>

                <Button variant="contained" label="Forgot Password" loading={loading} type="submit" />
            </form>
        </>
    )
}

export default ForgotPassword
