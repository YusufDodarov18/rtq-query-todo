import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosRequest } from "../utils/axiosRequest";
import { categories, category } from "../app/types";
import { toast } from "react-toastify";

const handleToast = (message: string, type?: string) => {
  if (type === "error") {
    toast.error(message, { autoClose: 2000 });
  } else {
    toast.success(message, { autoClose: 2000 });
  }
};

const baseUrlAPi = "/api/categories";

export const useGetGategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axiosRequest.get<categories>(baseUrlAPi);
      return data.data;
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosRequest.delete(`${baseUrlAPi}?id=${id}`);
    },

    onSuccess: () => {
      handleToast("category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },

    onError: () => {
      handleToast("Failed to delete category", "error");
    },
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      await axiosRequest.post(baseUrlAPi, { name });
    },

    onSuccess: () => {
      handleToast("category added successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      handleToast("error added category", "error");
    },
  });
};

export const useEditCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCategory: category) => {
      await axiosRequest.put(baseUrlAPi, {
        id: newCategory.id,
        name: newCategory.name,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
