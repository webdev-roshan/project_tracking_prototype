"use client";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axios";


interface RegisterData {
    email: string
    password: string
    first_name?: string
    last_name?: string
    birth_date?: string
    gender?: "male" | "female" | "others"
}

interface LoginData {
    email: string
    password: string
}

const getMe = async () => {
    const { data } = await axiosInstance.get("/auth/me/");
    return data;
};

export const useMe = () => {
    return useQuery({
        queryKey: ["me"],
        queryFn: getMe,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
};

const loginUser = async (data: LoginData) => {
    const response = await axiosInstance.post("/auth/login/", data)
    return response.data
}

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
        },
    });
};


const registerUser = async (data: RegisterData) => {
    const response = await axiosInstance.post("/auth/register/", data)
    return response.data
}

export const useRegister = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
        },
    })
}

const logoutUser = async () => {
    const response = await axiosInstance.post("/auth/logout/")
    return response
}


export const useLogout = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['me'] })
        }
    })
}