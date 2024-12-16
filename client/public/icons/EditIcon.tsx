import React from "react"

export const EditIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <mask
                id="mask0_73_9713"
                style={{
                    maskType: "luminance",
                }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="18"
                height="18"
            >
                <path d="M1 17H17" stroke="white" strokeWidth="1.77778" strokeLinecap="round" strokeLinejoin="round" />
                <path
                    d="M2.7793 10.2089V13.4444H6.0313L15.2237 4.248L11.9771 1L2.7793 10.2089Z"
                    fill="white"
                    stroke="white"
                    strokeWidth="1.77778"
                    strokeLinejoin="round"
                />
            </mask>
            <g mask="url(#mask0_73_9713)">
                <path d="M-2.11035 -1.66687H19.223V19.6665H-2.11035V-1.66687Z" fill="black" fillOpacity="0.902" />
            </g>
        </svg>
    )
}
