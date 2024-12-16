/* eslint-disable no-param-reassign */
import { IProgram, IProgramNode, IProgramUser, IUserProgram } from "@/services/programs/program.interface"
import { createSlice } from "@reduxjs/toolkit"

const dummyprograms = [
    {
        id: "b6834400-d1f6-11ee-a164-ad0737a3791c",
        createdBy: "622c4d4e-3786-4c19-b790-29e4c8c67463",
        name: "Hatchdev",
        startDate: "2024-07-28",
        endDate: "2024-08-29",
        isCompleted: false,
        profileFrameSecureUrl: null,
        profileFramePublicId: null,
        profileFrameHeight: null,
        profileFrameWidth: null,
        profileGenerationAvailable: false,
        certificateFrameSecureUrl: null,
        certificateFramePublicId: null,
        certificateFrameHeight: null,
        certificateFrameWidth: null,
        certificateGenerationAvailable: false,
    },
]

interface IInitialState {
    allPrograms: IProgram[]

    programUsers: IProgramUser[]

    userPrograms: IUserProgram[]

    selectedProgram: {
        program: IProgram
        programNodes: IProgramNode[]
        userProgram: IUserProgram | null
    } | null
}

const initialStateValue: IInitialState = {
    allPrograms: [],
    selectedProgram: null,
    programUsers: [],
    userPrograms: [],
}

export const programReduxSlice = createSlice({
    name: "Programs",
    initialState: initialStateValue,
    reducers: {
        initialize: (
            state,
            action: {
                payload: IProgram[]
            },
        ) => {
            state.allPrograms = action.payload
        },

        setUserPrograms: (
            state,
            action: {
                payload: IUserProgram[]
            },
        ) => {
            state.userPrograms = action.payload
        },

        setUserProgram: (state) => {
            if (!state.selectedProgram) return

            const userProgram = state.userPrograms.find(
                (userProgram) => userProgram.programId === state.selectedProgram?.program.id,
            )

            if (!userProgram) return

            state.selectedProgram = {
                ...state.selectedProgram,
                userProgram,
            }
        },

        setSelectedProgram: (
            state,
            action: {
                payload: IProgram
            },
        ) => {
            localStorage.setItem("selected_program_id", action.payload.id)

            const userProgram = state.userPrograms.find((program) => program.programId === action.payload.id) ?? null

            state.selectedProgram = {
                program: action.payload,
                programNodes: [],
                userProgram,
            }
        },

        setProgramNodes: (
            state,
            action: {
                payload: IProgramNode[]
            },
        ) => {
            if (!state.selectedProgram) return

            state.selectedProgram = {
                ...state.selectedProgram,
                programNodes: action.payload,
            }
        },

        setProgramUsers: (
            state,
            action: {
                payload: IProgramUser[]
            },
        ) => {
            if (!state.selectedProgram) return

            state.programUsers = action.payload
        },

        addProgramUser: (
            state,
            action: {
                payload: IProgramUser
            },
        ) => {
            state.programUsers = [...state.programUsers, action.payload]
        },

        addProgramUsers: (
            state,
            action: {
                payload: IProgramUser[]
            },
        ) => {
            state.programUsers = [...state.programUsers, ...action.payload]
        },

        addProgram: (
            state,
            action: {
                payload: IProgram
            },
        ) => {
            state.allPrograms = [...state.allPrograms, action.payload]
        },

        addProgramProfileFrame: (
            state,
            action: {
                payload: {
                    programId: string
                    profileFrameSecureUrl: string
                    profileFramePublicId: string
                    profileFrameHeight: string
                    profileFrameWidth: string
                }
            },
        ) => {
            state.allPrograms = state.allPrograms.map((program) => {
                if (program.id === action.payload.programId) {
                    program.profileFrameSecureUrl = action.payload.profileFrameSecureUrl
                    program.profileFramePublicId = action.payload.profileFramePublicId
                    program.profileFrameHeight = action.payload.profileFrameHeight
                    program.profileFrameWidth = action.payload.profileFrameWidth
                }

                return program
            })

            if (!state.selectedProgram) return

            state.selectedProgram.program.profileFrameSecureUrl = action.payload.profileFrameSecureUrl
            state.selectedProgram.program.profileFramePublicId = action.payload.profileFramePublicId
            state.selectedProgram.program.profileFrameHeight = action.payload.profileFrameHeight
            state.selectedProgram.program.profileFrameWidth = action.payload.profileFrameWidth
        },


        addProgramCertificateFrame: (
            state,
            action: {
                payload: {
                    programId: string
                    certificateFrameSecureUrl: string
                    certificateFramePublicId: string
                    certificateFrameHeight: string
                    certificateFrameWidth: string
                }
            },
        ) => {
            state.allPrograms = state.allPrograms.map((program) => {
                if (program.id === action.payload.programId) {
                    program.certificateFrameSecureUrl = action.payload.certificateFrameSecureUrl
                    program.certificateFramePublicId = action.payload.certificateFramePublicId
                    program.certificateFrameHeight = action.payload.certificateFrameHeight
                    program.certificateFrameWidth = action.payload.certificateFrameWidth
                }

                return program
            })

            if (!state.selectedProgram) return

            state.selectedProgram.program.certificateFrameSecureUrl = action.payload.certificateFrameSecureUrl
            state.selectedProgram.program.certificateFramePublicId = action.payload.certificateFramePublicId
            state.selectedProgram.program.certificateFrameHeight = action.payload.certificateFrameHeight
            state.selectedProgram.program.certificateFrameWidth = action.payload.certificateFrameWidth
        },

        updateGeneratedProfile: (
            state,
            action: {
                payload: {
                    profileUrl: string
                }
            },
        ) => {
            if (!state.selectedProgram || !state.selectedProgram.userProgram) return

            state.selectedProgram.userProgram.profileImageUrl = action.payload.profileUrl
        },

        updateGeneratedCertificate: (
            state,
            action: {
                payload: {
                    certificateImageUrl: string
                }
            },
        ) => {
            if (!state.selectedProgram || !state.selectedProgram.userProgram) return

            state.selectedProgram.userProgram.certificateImageUrl = action.payload.certificateImageUrl
        },

        deleteSelectedProgram: (state) => {
            if (!state.selectedProgram) return

            const filteredPrograms = state.allPrograms.filter((item) => item.id !== state.selectedProgram?.program.id)

            state.allPrograms = filteredPrograms

            state.selectedProgram = {
                program: filteredPrograms[0],
                programNodes: [],
                userProgram: null,
            }
        },

        enableProfileGeneration: (state) => {
            if (!state.selectedProgram) return

            state.selectedProgram.program.profileGenerationAvailable = true
        },

        enableCertificateGeneration: (state) => {
            if (!state.selectedProgram) return

            state.selectedProgram.program.certificateGenerationAvailable = true
        },

        clearPrograms: (state) => {
            state.allPrograms = []
            state.selectedProgram = null
        },
    },
})

export const programSlice = {
    reducer: programReduxSlice.reducer,
    actions: programReduxSlice.actions,
}
