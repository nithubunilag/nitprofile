"use client"
import { Input } from "@/components/form"
import { Button } from "@/components/ui/Button"
import { DropzoneModal } from "@/components/ui/Modals/DropzoneModal"
import { useUserSettings } from "@/hooks/useUserSettings"
import { useAppSelector } from "@/state_management"
import { getAsset } from "@/utils"
import Image from "next/image"
import { BsPencil } from "react-icons/bs"

const Profile = () => {
    const { form, onSubmit, profileMode, setProfileMode, updating, profilePicture } = useUserSettings()

    const {
        avatarSettings,
        deleteFile,
        handleFileForm,
        handleUpdateProfilePicture,
        setUploadAvatarModal,
        uploadAvatarModal,
        updatingProfilePicture,
    } = profilePicture

    const { data } = useAppSelector((state) => state.authSlice)

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = form

    return (
        <div>
            <DropzoneModal
                header={"Upload Avatar"}
                modalIsMounted={uploadAvatarModal}
                handleClose={() => setUploadAvatarModal(false)}
                handleInputChange={handleFileForm}
                fileDeleted={avatarSettings.deleted}
                accept={{
                    "image/*": [".jpeg", ".png", ".jpeg"],
                }}
            >
                <div className="mx-auto mb-4 block max-h-[500px] w-full overflow-y-scroll border px-3">
                    <Image
                        src={avatarSettings.streamUrl ?? ""}
                        alt="Uploaded Avatar"
                        width={400}
                        height={400}
                        className="mx-auto"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Button
                        variant="outlined"
                        label="Delete"
                        disabled={updatingProfilePicture}
                        onClick={() => deleteFile()}
                    />
                    <Button
                        variant="contained"
                        label="Submit"
                        loading={updatingProfilePicture}
                        onClick={() => handleUpdateProfilePicture()}
                    />
                </div>
            </DropzoneModal>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-6">
                    <div className="relative mb-4 h-[150px] w-[150px]">
                        {data?.profilePicSecureUrl && (
                            <div className="h-[150px] w-[150px]">
                                <Image
                                    src={data?.profilePicSecureUrl}
                                    alt="Avatar"
                                    width={150}
                                    height={150}
                                    className="h-full w-full rounded-full shadow-md"
                                />
                            </div>
                        )}

                        {!data?.profilePicSecureUrl && (
                            <Image
                                src={getAsset("dummyAvatar.png", "images")}
                                alt="Avatar"
                                width={150}
                                height={150}
                                className="rounded-full shadow-md"
                            />
                        )}

                        <button
                            type="button"
                            onClick={() => setUploadAvatarModal(true)}
                            className="absolute -bottom-1 right-5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border bg-white drop-shadow-md transition-all duration-300 ease-in-out hover:border-primary hover:bg-transparent"
                        >
                            <BsPencil className="text-base text-primary" />
                        </button>
                    </div>

                    <div className="text-[#505050]">
                        <h2 className="text-xl font-semibold ">
                            {data?.firstName ?? "Victor"} {data?.lastName ?? "Odumuyiwa"}
                        </h2>

                        <p className="text-xs font-light text-[#676767_0.5]">
                            Email: {data?.email ?? "johnDoe@gmail.com"}
                        </p>
                    </div>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-primary">Personal Information</h3>

                <div className="mb-6 flex flex-col justify-between gap-4 md:grid md:grid-cols-2  ">
                    <Input
                        required
                        name="firstName"
                        label="First Name"
                        register={register}
                        placeholder="Enter your first name"
                        error={errors?.firstName ? errors.firstName.message : undefined}
                        readOnly={profileMode === "view" ? true : false}
                    />

                    <Input
                        required
                        name="lastName"
                        label="Last Name"
                        register={register}
                        placeholder="Enter your last name"
                        error={errors?.lastName ? errors.lastName.message : undefined}
                        readOnly={profileMode === "view" ? true : false}
                    />

                    <Input
                        name="otherName"
                        label="Other Name"
                        register={register}
                        placeholder="Enter your Other name"
                        error={errors?.otherName ? errors.otherName.message : undefined}
                        readOnly={profileMode === "view" ? true : false}
                    />

                    <Input
                        name="email"
                        type="email"
                        label="Email Adddress"
                        register={register}
                        placeholder="Enter your Email Address"
                        error={errors?.email ? errors.email.message : undefined}
                        disabled
                    />
                </div>

                {profileMode === "edit" && (
                    <div className="flex items-center gap-4">
                        <Button variant="contained" label="Save Changes" type="submit" loading={updating} />

                        <Button
                            variant="outlined"
                            label="Cancel"
                            disabled={updating}
                            onClick={() => {
                                setProfileMode("view")
                            }}
                        />
                    </div>
                )}

                {profileMode === "view" && (
                    <div className="flex items-center gap-4 ">
                        <Button
                            variant="contained"
                            label="Edit Profile"
                            onClick={() => {
                                setProfileMode("edit")
                            }}
                        />
                    </div>
                )}
            </form>
        </div>
    )
}

export default Profile
