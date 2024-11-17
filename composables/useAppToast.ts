import type { AppToastParams } from "~/types/interface/app_toast_param";

export const useAppToast = () => {
  const toast = useToast();

  return {
    toastSuccess: ({ title, description = null }: AppToastParams) => {
      toast.add({
        title,
        description: description ?? undefined, // Converte null para undefined
        icon: 'i-heroicons-check-circle',
        color: 'green',
      });
    },
    toastError: ({ title, description = null }: AppToastParams) => {
      toast.add({
        title,
        description: description ?? undefined, // Converte null para undefined
        icon: 'i-heroicons-exclamation-circle',
        color: 'red',
      });
    },
  };
};
