import { useState, useCallback } from "react";
import { fetchData } from "../utils/apiUtil";
import { URL_SERVICES } from "@env";

interface FetchState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  getData: () => Promise<T | undefined>;
}

function useFetch<T>(url: string, queryParams?: object): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDataFromApi = useCallback(async () => {
    try {
      const result = await fetchData<T>(
        `${URL_SERVICES}/${url}`,
        { method: "GET" },
        queryParams
      );
      setData(result);
      return result;
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return {
    data,
    error,
    loading,
    getData: fetchDataFromApi,
  };
}

export default useFetch;
