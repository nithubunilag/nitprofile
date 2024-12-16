import { NitdaLogo } from "@/public/icons"
import { Toolbar } from "@frame-editor/ui/components/Toolbar"
import Image from "next/image"
import { Button } from "../../Button"
import { useSceneLogic } from "./hooks"

export const FrameEditor = () => {
    const {
        canvas,
        handleCreateNode,
        frameImageRef,
        saveCustomization,
        frameImageLoading,
        onImageLoad,
        programFrame,
        saving,
    } = useSceneLogic()

    return (
        <div className=" flex h-screen w-screen flex-col items-center justify-between gap-4 overflow-hidden bg-white px-8 py-8">
            <div className=" b flex h-full w-full basis-[85%] justify-center rounded-md bg-[#ededee] p-5">
                <NitdaLogo width={150} height={50} className="absolute left-5 top-5" />
                <div className="relative">
                    {frameImageLoading && (
                        <div className="h-[400px] w-[300px] animate-pulse rounded-md bg-slate-400"></div>
                    )}

                    <Image
                        width={300}
                        height={300}
                        ref={frameImageRef}
                        src={programFrame.frame}
                        onLoad={onImageLoad}
                        alt="Frame Background"
                        className="h-full w-full "
                        priority
                    />
                    <div className="absolute left-0 top-0">
                        <canvas id="frame_editor" />
                    </div>
                </div>
            </div>
            <Button loading={saving} onClick={() => saveCustomization()} variant="contained" label="Save" />

            {canvas && (
                <div className="w-full max-w-[95%] basis-[20%] overflow-scroll rounded-md  bg-[#ededee] p-2">
                    <Toolbar create_node={handleCreateNode} />
                </div>
            )}
        </div>
    )
}
