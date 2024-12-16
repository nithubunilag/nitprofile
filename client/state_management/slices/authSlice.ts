/* eslint-disable no-param-reassign */
import { IUpdateProfilePictureResponse, IUpdateProfileRequest } from "@/services/profile/profile.interface"
import { createSlice } from "@reduxjs/toolkit"

export type IRole = "ADMIN" | "SUPER ADMIN" | "USER"

export interface IUser {
    id: string
    firstName: string
    lastName: string
    otherName?: string
    email: string
    emailVerified: boolean
    profilePicPublicId: string | null
    resetToken: string | null
    profilePicSecureUrl: string | null
    isVerified: boolean
    role: IRole
}

interface IInitialState {
    data: IUser | null
    isAuthenticated: boolean
    persistExpDate: Date | null
}

const initialState: IInitialState = {
    data: null,
    isAuthenticated: false,
    persistExpDate: null,
}

const authReduxSlice = createSlice({
    name: "Auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false
            state.data = null
        },

        login: (state, action: { payload: IUser }) => {
            state.isAuthenticated = true
            state.data = action.payload

            // const expDate = moment().add(1, "minute").toDate()
            // state.persistExpDate = expDate
        },

        updateProfile: (state, action: { payload: IUpdateProfileRequest }) => {
            state.data = Object.assign({}, state.data, action.payload)
        },

        updateProfilePicture: (state, action: { payload: IUpdateProfilePictureResponse }) => {
            const { publicId, secureUrl } = action.payload
            if (state.data) {
                state.data.profilePicPublicId = publicId ?? ""
                state.data.profilePicSecureUrl = secureUrl ?? ""
            }
        },
    },
})

export const authSlice = {
    reducer: authReduxSlice.reducer,
    actions: authReduxSlice.actions,
}
