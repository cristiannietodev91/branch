import { useState, useEffect } from "react";
import { URL_SERVICES } from "@env";

interface FetchState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"; // Add other methods as needed

interface RequestOptions {
  method: HttpMethod;
  body?: object;
}

async function fetchData<T>(
  url: string,
  options?: RequestOptions,
  queryParams?: object
): Promise<T> {
  try {
    const queryString = queryParams
      ? `?${Object.entries(queryParams)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          )
          .join("&")}`
      : "";

    const response = await fetch(`${URL_SERVICES}/${url}${queryString}`, {
      method: options?.method || "GET",
      headers: {
        "Content-Type": "application/json", // Adjust headers as needed
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: T = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
    throw new Error("Error fetching data");
  }
}

function useFetch<T>(
  url: string,
  options?: RequestOptions,
  queryParams?: object,
  dependencies: any[] = []
): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      setLoading(true);

      try {
        const result = await fetchData<T>(url, options, queryParams);
        setData(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromApi();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, error, loading };
}

export default useFetch;
