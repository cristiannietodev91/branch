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
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    };

    const response = await fetch(`${url}${queryString}`, fetchOptions);

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
      throw new Error(`Error making request: ${error.message}`);
    }
    throw new Error("Error making request");
  }
}
