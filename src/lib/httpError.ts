import axios from "axios";

export const extractApiErrorMessage = (error: unknown, fallback = "Something went wrong") => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.response?.data?.errorSources?.[0]?.message;
    if (message && typeof message === "string" && message.trim().length > 0) {
      return message.trim();
    }
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error.trim();
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message.trim();
  }

  return fallback;
};
