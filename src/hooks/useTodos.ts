import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosRequest } from "../utils/axiosRequest";
import { NewData, todos } from "../app/types";
import { toast } from "react-toastify";

const handleToast = (message: string, type?: string) => {
  if (type === "error") {
    toast.error(message, { autoClose: 2000 });
  } else {
    toast.success(message, { autoClose: 2000 });
  }
};

const baseUrlAPi = "/api/to-dos";

export const useTodos = () => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data } = await axiosRequest.get<todos>(
        `${baseUrlAPi}?PageSize=${100}`,
      );
      return data.data;
    },
  });
};

export const useAddTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTodo: FormData) => {
      const { data } = await axiosRequest.post(`${baseUrlAPi}`, newTodo, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },

    onSuccess: () => {
      handleToast("Todo added successfully!");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },

    onError: () => {
      handleToast("Failed to add todo", "error");
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await axiosRequest.delete(`${baseUrlAPi}?id=${id}`);
    },

    onSuccess: () => {
      handleToast("Todo Deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },

    onError: () => {
      handleToast("Failed to delete todo", "error");
    },
  });
};

export const useCompletedTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await axiosRequest.put(`/completed/?id=${id}`);
    },
    onSuccess: () => {
      handleToast("Todo completed successfully!");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: () => {
      handleToast("Failed to completed todo", "error");
    },
  });
};

export const useEditTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newData: { newData: NewData }) => {
      await axiosRequest.put(`${baseUrlAPi}`, newData);
    },
    onSuccess: () => {
      toast.info("Todo updated successfully!", { autoClose: 2000 });
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: () => {
      handleToast("Failed to updated todo", "error");
    },
  });
};
