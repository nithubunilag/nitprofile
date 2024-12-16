"use client"

import { useAppSelector } from "@/state_management"
import { useRouter } from "next/navigation"

const Home = () => {
    const { data } = useAppSelector((state) => state.authSlice)

    const router = useRouter()

    if (!data) return null

    if (data.role === "USER") {
        return router.push("/student")
    }

    if (data.role === "ADMIN" || data.role === "SUPER ADMIN") {
        return router.push("/admin")
    }
}

export default Home
