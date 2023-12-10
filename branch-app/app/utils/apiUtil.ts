import AsyncStorage from "@react-native-async-storage/async-storage";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"; // Add other methods as needed

interface RequestOptions<P> {
  method: HttpMethod;
  body?: P;
  headers?: Record<string, string | number>;
}

export async function fetchData<T, P = object>(
  url: string,
  options?: RequestOptions<P>,
  queryParams?: object
): Promise<T> {
  try {
    const sessionToken = await AsyncStorage.getItem("sessionToken");

    const storageCSRF = await AsyncStorage.getItem("csrfToken");

    const csrfToken =
      ["PUT", "POST", "DELETE"].includes(options?.method || "") && storageCSRF
        ? storageCSRF
        : null;

    const queryString = queryParams
      ? `?${Object.entries(queryParams)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          )
          .join("&")}`
      : "";

    const fetchOptions = {
      method: options?.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
        ...(sessionToken && { Authorization: `Bearer ${sessionToken}` }),
        ...(csrfToken && { "X-CSRF-TOKEN": csrfToken }),
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    };

    let response = await fetch(`${url}${queryString}`, fetchOptions);

    if (response.status === 401) {
      throw new Error("Error communicating with APP server");
    }

    if (response.status === 403) {
      throw new Error("APP session error");
    }

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorResponse: { error: string } = await response.json();
        throw new Error(errorResponse.error);
      }
      throw new Error("Contact to support.");
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data: T = await response.json();

      return data;
    }

    const data = await response.text();

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Error communicating with APP server")) {
        throw error;
      }
      throw new Error(`Error making request: ${error.message}`);
    }
    throw new Error("Error making request");
  }
}
