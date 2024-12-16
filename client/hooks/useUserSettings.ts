import { IImageProperties } from "@/app/(dashboard)/admin/profile/emptyState"
import { makeToast } from "@/libs/react-toast"
import { useUpdateProfileApi, useUpdateProfilePictureApi } from "@/services/profile/profile-hooks"
import { authSlice, useAppDispatch, useAppSelector } from "@/state_management"
import { getDirtyValues } from "@/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { IDropZoneHandlerProps } from "./useDropZone"

const schema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    otherName: z.string().optional(),
    email: z.string().email().optional(),
})

type schemaType = z.infer<typeof schema>

export const useUserSettings = () => {
    const pathname = usePathname()

    // Profile Update

    const { handler, loading } = useUpdateProfileApi()

    const { data } = useAppSelector((state) => state.authSlice)

    const [profileMode, setProfileMode] = useState<"edit" | "view">("edit")

    const dispatch = useAppDispatch()

    const { updateProfile,updateProfilePicture } = authSlice.actions

    const form = useForm<schemaType>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: data?.email ?? "",
            firstName: data?.firstName ?? "",
            otherName: data?.otherName ?? "",
            lastName: data?.lastName ?? "",
        },
    })

    const onSubmit: SubmitHandler<schemaType> = async (data) => {
        const dirtyFields = getDirtyValues(data, form.formState.dirtyFields)

        if (Object.keys(dirtyFields).length === 0) {
            return makeToast({
                id: "user-update-error",
                message: "Please Make a change before Updating",
                type: "error",
            })
        }

        const response = await handler(dirtyFields)

        if (!response) return

        form.reset()

        makeToast({
            id: "user-update-success",
            message: "Updated Profile Successfully",
            type: "success",
        })

        setProfileMode("view")

        dispatch(updateProfile(dirtyFields))
    }

    useEffect(() => {
        const allPaths = pathname.split("/")

        if (allPaths.includes("edit")) {
            setProfileMode("edit")
        } else {
            setProfileMode("view")
        }
    }, [pathname])

    useEffect(() => {
        if (data) {
            form.reset({
                email: data?.email,
                firstName: data?.firstName,
                lastName: data?.lastName,
                otherName: data?.otherName,
            })
        }
    }, [data])

    // Profile Picture Update

    const { handler: updateProfilePictureApi, loading: updatingProfilePicture } = useUpdateProfilePictureApi()

    const [uploadAvatarModal, setUploadAvatarModal] = useState(false)

    const [avatarSettings, setAvatarImageSettings] = useState<IImageProperties>({
        streamUrl: "",
        fileObj: null,
        deleted: false,
    })

    const handleFileForm = (file: IDropZoneHandlerProps) => {
        setAvatarImageSettings({
            streamUrl: file.stream ?? "",
            fileObj: file.file ?? null,
            deleted: false,
        })
    }

    const handleUpdateProfilePicture = async () => {
        const formData = new FormData()

        if (!avatarSettings.fileObj) return

        formData.append("pfp", avatarSettings.fileObj!)

        const response = await updateProfilePictureApi(formData)

        console.log(response)

        if (!response || !response.data) return

        makeToast({
            id: "user-pfp-update-success",
            message: "Updated Profile Picture Successfully",
            type: "success",
        })

        setAvatarImageSettings({
            streamUrl: "",
            fileObj: null,
            deleted: false,
        })

        setUploadAvatarModal(false)

        dispatch(updateProfilePicture(response.data))
    }

    const deleteFile = () => {
        setAvatarImageSettings({
            streamUrl: "",
            fileObj: null,
            deleted: true,
        })
    }

    return {
        form,
        onSubmit,
        profileMode,
        setProfileMode,
        updating: loading,

        profilePicture: {
            uploadAvatarModal,
            setUploadAvatarModal,
            avatarSettings,
            handleFileForm,
            handleUpdateProfilePicture,
            deleteFile,
            updatingProfilePicture,
        },
    }
}
