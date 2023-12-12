import { useState, useCallback, useContext } from "react";
import { fetchData } from "../utils/apiUtil";
import { URL_SERVICES } from "@env";
import { AuthContext } from "../context/AuthContext";

interface FetchState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  getData: () => Promise<T | undefined>;
}

const MAX_RETRIES = 2;

function useFetch<T>(url: string, queryParams?: object): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { signOut, refreshToken } = useContext(AuthContext);

  const fetchDataFromApi = useCallback(
    async (retryCount = 0) => {
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
          const errorMessage = err.message;
          if (errorMessage.includes("Error communicating with APP server")) {
            if (retryCount < MAX_RETRIES) {
              await refreshToken();
              return fetchDataFromApi(retryCount + 1);
            } else {
              await signOut();
            }
          } else {
            setError(err);
          }
        }
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url]
  );

  const getData = useCallback(async () => {
    return fetchDataFromApi();
  }, [fetchDataFromApi]);

  return {
    data,
    error,
    loading,
    getData,
  };
}

export default useFetch;
