import Image from "next/image"
import { getAsset } from "@/utils"

export const PageLoader = () => {
    return (
        <div className="z-[8] flex h-screen flex-col items-center justify-center bg-[#ededee]  ">
            <Image
                src={getAsset("nitprofile_logo.png", "icons")}
                alt="Logo"
                width={300}
                height={300}
                className="h-auto animate-[logo-spin_1s_alternate_infinite]"
                priority
            />
        </div>
    )
}
