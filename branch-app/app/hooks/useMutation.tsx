import { useState, useCallback, useRef } from "react";
import { fetchData } from "../utils/apiUtil";
type HttpMethod = "POST" | "PUT";

interface FetchState<T, P> {
  loading: boolean;
  mutate: (
    bodyRequest: P
  ) => Promise<{ data?: Awaited<T>; isSuccess: boolean; error?: Error }>;
  url: React.MutableRefObject<string>;
}

function useMutation<T, P = object>(
  initialUrl: string = "",
  queryParams?: object,
  method: HttpMethod = "POST"
): FetchState<T, P> {
  const url = useRef(initialUrl);
  const [loading, setLoading] = useState<boolean>(true);

  const mutateDate = useCallback(
    async (bodyRequest: P) => {
      try {
        const result = await fetchData<T, P>(
          url.current,
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
    [url.current]
  );

  return {
    loading,
    mutate: mutateDate,
    url,
  };
}

export default useMutation;
