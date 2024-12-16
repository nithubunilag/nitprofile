"use client"

import { Input } from "@/components/form"
import { Button } from "@/components/ui/Button"
import { useLoginApi } from "@/services/auth/auth-hooks"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authSlice, useAppDispatch } from "@/state_management"
import { makeToast } from "@/libs/react-toast"

const schema = z.object({
    email: z.string().email(),
    password: z.string(),
})

type schemaType = z.infer<typeof schema>

const Login = () => {
    const { handler, loading } = useLoginApi()

    const router = useRouter()

    const dispatch = useAppDispatch()

    const { login } = authSlice.actions

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<schemaType>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: schemaType) => {
        const response = await handler(data)

        if (!response || !response.data) return

        makeToast({
            id: "Login-success",
            message: "Logged in Successfully",
            type: "success",
        })

        dispatch(login(response.data))

        router.push("/")
    }

    return (
        <>
            <h2 className="text-center text-lg font-semibold text-[#101010] md:text-2xl ">Welcome Back</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-4">
                <Input
                    required
                    name="email"
                    type="email"
                    label="Email Adddress"
                    register={register}
                    disabled={loading}
                    placeholder="Enter your Email Address"
                    error={errors?.email ? errors.email.message : undefined}
                />

                <Input
                    required
                    name="password"
                    label="Password"
                    type="password"
                    register={register}
                    disabled={loading}
                    placeholder="Enter your Password"
                    error={errors?.password ? errors.password.message : undefined}
                />

                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <input type="checkbox" className="cursor-pointer" />
                        <span className="text-sm font-light">Remember me</span>
                    </div>

                    <Link
                        href={"/auth/forgot-password"}
                        className="text-sm font-medium tracking-tight text-primary underline"
                    >
                        Forgot Password?
                    </Link>
                </div>

                <Button variant="contained" label="Login" loading={loading} type="submit" />
            </form>
        </>
    )
}

export default Login
