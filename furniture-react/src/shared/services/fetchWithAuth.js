const API_URL = process.env.API_URL;
export const createFetchWithAuth = (req = null) => {
  return async (endpoint, options = {}) => {

    
      const isFormData = options.body instanceof FormData;

      const headers = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      };

      if (req?.headers?.cookie) {
        headers.cookie = req.headers.cookie;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include",
      });
     

if (response.status === 401) {
  throw {
    status: 401,
    message: "Unauthorized",
  };
}

  

      if (response.status === 403) {
        return { error: "forbidden", status: 403 };
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
          error: error.error || "request_failed",
          status: response.status,
        };
      }

    const data = await response.json();
          

      
      return data

    
  };
};