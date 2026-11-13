import { QueryClient } from "@tanstack/react-query";

/** Cliente único do react-query; os dados dependem do workspace activo e são invalidados ao trocá-lo. */
export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
});
