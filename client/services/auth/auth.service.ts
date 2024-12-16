import { axiosInstance, axios } from "@/libs/axios"
import {
    IAcceptAdminInvitationRequest,
    IEmailOnlyRequest,
    ILoginRequest,
    IResetPasswordRequest,
    IVerifyAccountRequest,
} from "./auth.interface"
import { IBaseApiResponse } from "../types"
import { IUser } from "@/state_management"
import { API_URL } from "@/constants/api_url"

/**
 * Service class for handling authentication-related API requests.
 * If any of the requests yields a response of type @type {IBaseApiResponse} without a specified generic, the API solely provides a message string in the response.
 * @class
 */
class AuthService {
    /**
     * The base URL for authentication-related API endpoints.
     * @private
     * @type {string}
     */
    private authUrl!: string

    /**
     * Constructor for the AuthService class.
     *
     * @constructor
     * @param {string} baseURL - The base URL for the API.
     */
    constructor(baseURL: string) {
        this.authUrl = `${baseURL}/auth`
    }

    /**
     * Method to send a sign-in request.
     *
     * @async
     * @method
     * @param {ILoginRequest} data - The login request data.
     * @returns {Promise<IBaseApiResponse<IUser>>} - The API response with user data.
     */
    public async signin(data: ILoginRequest) {
        return await axios.post<IBaseApiResponse<IUser>>(`${this.authUrl}/sign-in`, data,{withCredentials:true})
    }

    /**
     * Method to send a forgot password request.
     *
     * @async
     * @method
     * @param {IEmailOnlyRequest} data - The email-only request data.
     * @returns {Promise<IBaseApiResponse>} - The API response.
     */
    public async forgot_password(data: IEmailOnlyRequest) {
        return await axios.post<IBaseApiResponse>(`${this.authUrl}/forgot-password`, data)
    }

    /**
     * Method to send a reset password request.
     *
     * @async
     * @method
     * @param {IResetPasswordRequest} data - The reset password request data.
     * @returns {Promise<IBaseApiResponse>} - The API response.
     */
    public async reset_password(data: IResetPasswordRequest) {
        return await axios.post<IBaseApiResponse>(`${this.authUrl}/reset-password`, data)
    }

    /**
     * Method to send an invite admin request.
     *
     * @async
     * @method
     * @param {IEmailOnlyRequest} data - The email-only request data.
     * @returns {Promise<IBaseApiResponse>} - The API response.
     */
    public async invite_admin(data: IEmailOnlyRequest) {
        return await axiosInstance.post<IBaseApiResponse>(`${this.authUrl}/invite-admin`, data)
    }

    /**
     * Method to send an accept admin invitation request.
     *
     * @async
     * @method
     * @param {IAcceptAdminInvitationRequest} data - The accept admin invitation request data.
     * @param {string} token - The invitation token.
     * @returns {Promise<IBaseApiResponse<IUser>>} - The API response with user data.
     */
    public async accept_admin_invitation(data: IAcceptAdminInvitationRequest, token: string) {
        return await axiosInstance.post<IBaseApiResponse<IUser>>(`${this.authUrl}/accept-admin-invite`, data, {
            params: { token },
        })
    }

    /**
     * Method to send a refresh token request.
     *
     * @async
     * @method
     * @returns {Promise<IBaseApiResponse>} - The API response.
     */
    public async refresh_token() {
        return await axiosInstance.get<IBaseApiResponse>(`${this.authUrl}/refresh-token`)
    }

    /**
     * Method to send a verify user account request.
     *
     * @async
     * @method
     * @param {IVerifyAccountRequest} data - The verify account request data.
     * @returns {Promise<IBaseApiResponse>} - The API response.
     */
    public async verify_user_account(data: IVerifyAccountRequest) {
        return await axiosInstance.post<IBaseApiResponse>(`${this.authUrl}/verify-account`, data)
    }

    /**
     * Method to send a sign-out request.
     *
     * @async
     * @method
     * @returns {Promise<void>} - The API response.
     */
    public async signout() {
        return await axiosInstance.post(`${this.authUrl}/sign-out`)
    }
}

export const authService = new AuthService(API_URL)
