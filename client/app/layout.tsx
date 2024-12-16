import type { Metadata } from "next"
import { Spline_Sans } from "next/font/google"
import "../styles/globals.css"
import { CustomProvider } from "@/utils"

const splineSans = Spline_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: {
        template: "%s | Nitprofile",
        default: "Nitprofile",
    },
    description: "Generate and download your certificates all in one place!",
    applicationName: "Nitprofile",
    authors: [{ name: "Nithub", url: "https://nithub.unilag.edu.ng" }],
    generator: "Nitprofile",
    keywords: ["Profile Generation", "Certificate Generation", "Nithub", "Dynamic Image"],
    referrer: "origin-when-cross-origin",
    creator: "Nithub",
    publisher: "Nithub",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={splineSans.className}>
                <CustomProvider>{children}</CustomProvider>
                <div className="modal" id="modal"></div>
                <div id="canvas_portal"></div>
            </body>
        </html>
    )
}
