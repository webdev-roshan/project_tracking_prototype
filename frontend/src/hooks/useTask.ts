import axiosInstance from "@/api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Task {
    id: number;
    project: number;
    owner: number;
    title: string;
    description: string;
    status: string;
    due_date: string | null;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
}

interface CreateTaskInput {
    title: string;
    description: string;
    status: string;
    due_date?: string;
}

export interface UpdateTaskInput {
    id: number;
    title: string;
    description: string;
    status: string;
    due_date?: string;
}

const getTasks = async (projectId: number): Promise<Task[]> => {
    const response = await axiosInstance.get(`/v1/projects/${projectId}/tasks/`);
    return response.data;
};

export const useGetTasks = (projectId: number) => {
    return useQuery<Task[]>({
        queryKey: ["tasks", projectId],
        queryFn: () => getTasks(projectId),
        staleTime: 5 * 60 * 1000,
        retry: false,
        enabled: !!projectId,
    });
};

const createTask = async (projectId: number, data: CreateTaskInput): Promise<Task> => {
    const response = await axiosInstance.post(`/v1/projects/${projectId}/tasks/`, {
        ...data,
        project: projectId
    });
    return response.data;
};

export const useCreateTask = (projectId: number) => {
    const queryClient = useQueryClient();

    return useMutation<Task, Error, CreateTaskInput>({
        mutationFn: (data) => createTask(projectId, data),
        onSuccess: (newTask) => {
            queryClient.setQueryData<Task[]>(["tasks", projectId], (oldData = []) => [...oldData, newTask]);
        },
    });
};

export const useUpdateTask = (projectId: number) => {
    const queryClient = useQueryClient();

    return useMutation<Task, Error, UpdateTaskInput>({
        mutationFn: async (data) => {
            const response = await axiosInstance.put(`/v1/projects/${projectId}/tasks/${data.id}/`, {
                ...data,
                project: projectId
            });
            return response.data;
        },
        onSuccess: (updatedTask) => {
            queryClient.setQueryData<Task[]>(["tasks", projectId], (oldData = []) =>
                oldData.map((task) => (task.id === updatedTask.id ? updatedTask : task))
            );
        },
    });
};

const deleteTask = async (projectId: number, id: number): Promise<{ id: number }> => {
    await axiosInstance.delete(`/v1/projects/${projectId}/tasks/${id}/`);
    return { id };
};

export const useDeleteTask = (projectId: number) => {
    const queryClient = useQueryClient();

    return useMutation<{ id: number }, Error, number>({
        mutationFn: (id) => deleteTask(projectId, id),
        onSuccess: ({ id }) => {
            queryClient.setQueryData<Task[]>(["tasks", projectId], (oldData = []) =>
                oldData.filter((task) => task.id !== id)
            );
        },
    });
};
