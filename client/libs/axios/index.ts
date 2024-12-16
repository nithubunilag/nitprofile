import { API_URL } from "@/constants/api_url"
import { makeToast } from "@/libs//react-toast"
import { authSlice, store } from "@/state_management"
import axios from "axios"

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

let retries = 3

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const LOGIN_ROUTE = "/auth/login"

        if (error.response && error.response.status === 401) {
            retries -= 1

            await fetch(`${API_URL}/auth/refresh-token`, {
                credentials: "include",
            })

            if (retries === 0) {
                makeToast({
                    id: "refresh-token-error",
                    message: "Your Session has Expired, Please Log in",
                    type: "error",
                })

                window.history.pushState(null, "", LOGIN_ROUTE)

                window.location.replace(LOGIN_ROUTE)

                retries = 3

                return store.dispatch(authSlice.actions.logout())
            }

            return axiosInstance.request(error.config)
        } else {
            return Promise.reject(error)
        }
    },
)

export { axios, axiosInstance }
