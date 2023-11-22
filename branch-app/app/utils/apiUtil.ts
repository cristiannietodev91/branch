import { URL_SERVICES } from "@env";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"; // Add other methods as needed

interface RequestOptions<P> {
  method: HttpMethod;
  body?: P;
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
