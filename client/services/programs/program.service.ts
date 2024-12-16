import { Node } from "@/components/ui/Frame-Editor/logic"
import { axios, axiosInstance } from "@/libs/axios"
import { IUser } from "@/state_management"
import { IBaseApiResponse } from "../types"
import {
    IAdminAssignedToProgram,
    IAssignAdminToProgramPayload,
    ICreateProgramPayload,
    IProgram,
    IProgramMetrics,
    IProgramUser,
    IRegisterSingleUserForProgram,
    IUserProgram,
} from "./program.interface"
import { API_URL } from "@/constants/api_url"

/**
 * Service class for interacting with program-related API endpoints.
 */
class ProgramService {
    /**
     * URL of the program endpoint.
     * @private
     */
    private programUrl!: string

    /**
     * Constructs a new ProgramService instance.
     * @param {string} baseURL - Base URL for the API.
     */
    constructor(baseURL: string) {
        this.programUrl = `${baseURL}/programs`
    }

    /**
     * Retrieves a single program by its ID.
     * @param {string} programId - The ID of the program to retrieve.
     * @returns {Promise<IBaseApiResponse<IProgram>>} - A promise that resolves with the program data.
     */
    public async getSingleProgram(programId: string) {
        return await axiosInstance.get<IBaseApiResponse<IProgram>>(`${this.programUrl}?programId=${programId}`)
    }

    /**
     * Retrieves all programs.
     * @returns {Promise<IBaseApiResponse<IProgram[]>>} - A promise that resolves with an array of programs.
     */
    public async getAllPrograms() {
        return await axiosInstance.get<IBaseApiResponse<IProgram[]>>(`${this.programUrl}`)
    }

    /**
     * Creates a new program.
     * @param {ICreateProgramPayload} data - Data for creating the program.
     * @returns {Promise<IBaseApiResponse<IProgram>>} - A promise that resolves with the created program.
     */
    public async createProgram(data: ICreateProgramPayload) {
        return await axiosInstance.post<IBaseApiResponse<IProgram>>(`${this.programUrl}`, data)
    }

    /**
     * Updates an existing program.
     * @param {string} programId - The ID of the program to update.
     * @param {Partial<ICreateProgramPayload>} data - Data to update the program with.
     * @returns {Promise<any>} - A promise that resolves when the update is complete.
     */
    public async updateProgram(programId: string, data: Partial<ICreateProgramPayload>) {
        return await axiosInstance.put(`${this.programUrl}?programId=${programId}`, data)
    }

    public async deleteProgram(programId: string) {
        return await axiosInstance.delete(`${this.programUrl}?programId=${programId}`)
    }

    /**
     * Retrieves users registered for a program.
     * @param {string} programId - The ID of the program to retrieve users for.
     * @returns {Promise<IBaseApiResponse<IProgramUser[]>>} - A promise that resolves with an array of registered users.
     */
    public async getProgramRegisteredUsers(programId: string) {
        return await axiosInstance.get<IBaseApiResponse<IProgramUser[]>>(
            `${this.programUrl}/users?programId=${programId}`,
        )
    }

    public async getProgramRegisteredUser() {
        return await axiosInstance.get<IBaseApiResponse<IUserProgram>>(`${this.programUrl}/user`)
    }

    /**
     * Registers a single user for a program.
     * @param {string} programId - The ID of the program to register the user for.
     * @param {IRegisterSingleUserForProgram} data - Data for registering the user.
     * @returns {Promise<IBaseApiResponse<IUser>>} - A promise that resolves with the registered user data.
     */
    public async registerSingleUserForProgram(programId: string, data: IRegisterSingleUserForProgram) {
        return await axiosInstance.post<IBaseApiResponse<IUser>>(
            `${this.programUrl}/users?programId=${programId}`,
            data,
        )
    }

    /**
     * Registers multiple users for a program in bulk.
     * @param {string} programId - The ID of the program to register users for.
     * @param {FormData} data - Form data containing user information.
     * @returns {Promise<IBaseApiResponse>} - A promise that resolves when bulk registration is complete.
     */
    public async registerBulkUsersForProgram(programId: string, data: FormData) {
        return await axiosInstance.post<IBaseApiResponse>(`${this.programUrl}/users?programId=${programId}`, data)
    }

    /**
     * Resends the program user mail.
     * @param {string} programId - The ID of the program whose user mail needs to be resent.
     * @param {string} email - The email address of the user.
     * @returns {Promise<IBaseApiResponse>} - A promise that resolves when the mail is resent.
     */
    public async resendProgramUserMail(programId: string, email: string) {
        return await axiosInstance.put<IBaseApiResponse>(`${this.programUrl}/users?programId=${programId}`, { email })
    }

    /**
     * Assigns an admin to a program.
     * @param {IAssignAdminToProgramPayload} data - Data for assigning admin to the program.
     * @returns {Promise<any>} - A promise that resolves when the admin is assigned.
     */
    public async assignAdminToProgram(data: IAssignAdminToProgramPayload) {
        return await axios.post(`${this.programUrl}/assign-admin`, data)
    }

    /**
     * Retrieves admins assigned to a program.
     * @param {string} programId - The ID of the program to retrieve admins for.
     * @returns {Promise<IBaseApiResponse<IAdminAssignedToProgram[]>>} - A promise that resolves with an array of assigned admins.
     */
    public async getAdminsAssignedToProgram(programId: string) {
        return await axiosInstance.get<IBaseApiResponse<IAdminAssignedToProgram[]>>(
            `${this.programUrl}/assign-admin?programId=${programId}`,
        )
    }

    /**
     * Uploads a program frame.
     * @param {string} programId - The ID of the program to upload the frame for.
     * @param {FormData} data - Form data containing the frame information.
     * @returns {Promise<IBaseApiResponse<IProgram>>} - A promise that resolves when the frame is uploaded.
     */
    public async uploadProfileFrame(programId: string, data: FormData) {
        return await axiosInstance.post<IBaseApiResponse<IProgram>>(
            `${this.programUrl}/profile?programId=${programId}`,
            data,
        )
    }

    public async uploadCertificateFrame(programId: string, data: FormData) {
        return await axiosInstance.post<IBaseApiResponse<IProgram>>(
            `${this.programUrl}/certificate?programId=${programId}`,
            data,
        )
    }

    /**
     * Enables profile generation for a program.
     * @param {string} programId - The ID of the program to enable profile generation for.
     * @param {FormData} data - Form data containing the necessary information.
     * @returns {Promise<IBaseApiResponse<IProgram>>} - A promise that resolves when profile generation is enabled.
     */
    public async enableProfileGeneration(programId: string) {
        return await axiosInstance.put<IBaseApiResponse<IProgram>>(`${this.programUrl}/profile?programId=${programId}`)
    }

    public async enableCertificateGeneration(programId: string) {
        return await axiosInstance.put<IBaseApiResponse<IProgram>>(`${this.programUrl}/certificate?programId=${programId}`)
    }

    /**
     * Generates a profile for a program.
     * @param {string} programId - The ID of the program to generate the profile for.
     * @returns {Promise<IBaseApiResponse>} - A promise that resolves with the generated profile.
     */
    public async generateProfile(programId: string) {
        return await axiosInstance.get<IBaseApiResponse>(`${this.programUrl}/profile?programId=${programId}`)
    }

    public async generateCertificate(programId: string) {
        return await axiosInstance.get<IBaseApiResponse>(`${this.programUrl}/certificate?programId=${programId}`)
    }

    public async previewProfile(programId: string) {
        return await axiosInstance.get<IBaseApiResponse>(`${this.programUrl}/profile/preview?programId=${programId}`)
    }

    public async previewCertificate(programId: string) {
        return await axiosInstance.get<IBaseApiResponse>(`${this.programUrl}/certificate/preview?programId=${programId}`)
    }

    public async createProgramNode(programId: string, data: { nodes: Node[]; category: "profile" | "certificate" }) {
        return await axiosInstance.post<IBaseApiResponse>(`${this.programUrl}/node?programId=${programId}`, data)
    }

    public async getProgramNodes(programId: string, category: "profile" | "certificate") {
        return await axiosInstance.get<IBaseApiResponse>(`${this.programUrl}/node`, {
            params: {
                programId,
                category,
            },
        })
    }
    public async getProgramMetrics(programId: string) {
        return await axiosInstance.get<IBaseApiResponse<IProgramMetrics>>(
            `${this.programUrl}/metrics?programId=${programId}`,
        )
    }
}

export const programService = new ProgramService(API_URL)
