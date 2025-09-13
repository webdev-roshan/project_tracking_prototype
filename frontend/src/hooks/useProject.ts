import axiosInstance from "@/api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Project {
    id: number;
    owner: number;
    name: string;
    description: string;
    categories: string;
    is_owner: boolean;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
}

interface CreateProjectInput {
    name: string;
    description: string;
    categories: string;
}

export interface UpdateProjectInput {
    id: number;
    name: string;
    description: string;
    categories: string;
}


const getProjects = async (): Promise<Project[]> => {
    const response = await axiosInstance.get("/v1/projects");
    return response.data;
};

export const useGetProjects = () => {
    return useQuery<Project[]>({
        queryKey: ["projects"],
        queryFn: getProjects,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
};

const createProject = async (data: CreateProjectInput): Promise<Project> => {
    const response = await axiosInstance.post("/v1/projects/", data);
    return response.data;
};

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation<Project, Error, CreateProjectInput>({
        mutationFn: createProject,
        onSuccess: (newProject) => {
            queryClient.setQueryData<Project[]>(["projects"], (oldData = []) => [...oldData, newProject]);
        },
    });
};


export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation<Project, Error, UpdateProjectInput>({
        mutationFn: async (data) => {
            const response = await axiosInstance.put(`/v1/projects/${data.id}/`, data);
            return response.data;
        },
        onSuccess: (updatedProject) => {
            queryClient.setQueryData<Project[]>(["projects"], (oldData = []) =>
                oldData.map((proj) => (proj.id === updatedProject.id ? updatedProject : proj))
            );
        },
    });
};


const deleteProject = async (id: number): Promise<{ id: number }> => {
    await axiosInstance.delete(`/v1/projects/${id}/ `);
    return { id };
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation<{ id: number }, Error, number>({
        mutationFn: deleteProject,
        onSuccess: ({ id }) => {
            queryClient.setQueryData<Project[]>(["projects"], (oldData = []) =>
                oldData.filter((proj) => proj.id !== id)
            );
        },
    });
};
