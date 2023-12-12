import { useState, useCallback, useContext } from "react";
import { fetchData } from "../utils/apiUtil";
import { URL_SERVICES } from "@env";
import { AuthContext } from "../context/AuthContext";
import { CsrfResponse } from "../../types/types";
import useFetch from "./useFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
type HttpMethod = "POST" | "PUT";

interface FetchState<T, P> {
  loading: boolean;
  mutate: (bodyRequest: P) => Promise<{
    data?: Awaited<T>;
    isSuccess: boolean;
    error?: Error;
  }>;
}

const MAX_RETRIES = 2;

function useMutation<T, P = object>(
  initialUrl: string = "",
  queryParams?: object,
  method: HttpMethod = "POST"
): FetchState<T, P> {
  const [loading, setLoading] = useState<boolean>(true);
  const { signOut, refreshToken } = useContext(AuthContext);
  const { getData: getCsrfToken } = useFetch<CsrfResponse>("csrf-token");

  const mutateData = useCallback(
    async (bodyRequest: P, retryCount = 0) => {
      try {
        const result = await fetchData<T, P>(
          `${URL_SERVICES}/${initialUrl}`,
          { method, body: bodyRequest },
          queryParams
        );
        return { data: result, isSuccess: true };
      } catch (err) {
        if (err instanceof Error) {
          const errorMessage = err.message;
          if (errorMessage.includes("Error communicating with APP server")) {
            if (retryCount < MAX_RETRIES) {
              await refreshToken();
              return mutateData(bodyRequest, retryCount + 1);
            } else {
              await signOut();
            }
          }
          if (errorMessage.includes("APP session error")) {
            if (retryCount < MAX_RETRIES) {
              const csrfResponse = await getCsrfToken();
              if (csrfResponse) {
                await AsyncStorage.setItem("csrfToken", csrfResponse.csrfToken);
                return mutateData(bodyRequest, retryCount + 1);
              }
            } else {
              await signOut();
            }
          }
        }
        return { error: err as Error, isSuccess: false };
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialUrl]
  );

  const mutate = useCallback(
    async (bodyRequest: P) => {
      return mutateData(bodyRequest);
    },
    [mutateData]
  );

  return {
    loading,
    mutate,
  };
}

export default useMutation;
