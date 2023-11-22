import { useState, useCallback } from "react";
import { fetchData } from "../utils/apiUtil";
type HttpMethod = "POST" | "PUT";

interface FetchState<T, P> {
  loading: boolean;
  mutate: (
    bodyRequest: P
  ) => Promise<{ data?: Awaited<T>; isSuccess: boolean; error?: Error }>;
}

function useMutation<T, P = object>(
  url: string,
  queryParams?: object,
  method: HttpMethod = "POST"
): FetchState<T, P> {
  const [loading, setLoading] = useState<boolean>(true);

  const mutateDate = useCallback(
    async (bodyRequest: P) => {
      try {
        const result = await fetchData<T, P>(
          url,
          { method, body: bodyRequest },
          queryParams
        );
        return { data: result, isSuccess: true };
      } catch (err) {
        return { error: err as Error, isSuccess: false };
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url]
  );

  return {
    loading,
    mutate: mutateDate,
  };
}

export default useMutation;
