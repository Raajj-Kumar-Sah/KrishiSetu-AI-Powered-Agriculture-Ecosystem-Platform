import { http } from "@/api/http";

export const axiosBaseQuery =
  () =>
  async ({ url, method = "GET", data, params, headers }) => {
    try {
      const response = await http({ url, method, data, params, headers });
      return { data: response.data?.data ?? response.data };
    } catch (error) {
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || { message: error.message },
        },
      };
    }
  };
