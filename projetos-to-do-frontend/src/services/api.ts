export const URL_BASE = process.env.NEXT_PUBLIC_URL_BASE!;

type ApiRequestOptions = RequestInit & { isBlob?: boolean };

export async function apiRequest(endpoint: string, options: ApiRequestOptions) {
  const { isBlob, ...fetchOptions } = options;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    ...(fetchOptions.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(`${URL_BASE}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    let data;

    if (isBlob) {
      data = await response.blob();
    } else {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message:
          data?.error ||
          data?.message ||
          `Erro ${response.status}: ${response.statusText}`,
      };
    }

    return { status: response.status, data };
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "message" in error) {
      const err = error as { message: string; status: number };
      throw err.status
        ? err
        : { status: 500, message: "Erro ao conectar à API" };
    }
  }
}
