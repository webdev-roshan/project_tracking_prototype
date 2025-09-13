import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,

    headers: {
        "Content-Type": "application/json"
    }
})


axiosInstance.interceptors.response.use(
    res => res,
    async err => {
        if (err.response?.status === 401) {
            // Only try to refresh if we're not already on the login page
            if (window.location.pathname !== '/login') {
                try {
                    await axiosInstance.post("/auth/refresh/");
                    return axiosInstance(err.config);
                } catch (refreshError) {
                    // Clear cookies and redirect to login
                    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    window.location.href = "/login";
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(err);
    }
);

export default axiosInstance