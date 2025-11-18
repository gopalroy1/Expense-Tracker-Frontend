import { useState } from "react";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const callApi = async (apiCall: () => Promise<any>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall(); 
      console.log("Response in the useApi hook", response);
      return response; // axios gives .data

    } catch (err: any) {
      console.error("Error in the useApi hook", err);
      setError(err?.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { callApi, loading, error };
}
