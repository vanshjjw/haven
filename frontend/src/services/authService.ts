const API_BASE_URL = 'http://localhost:5000'; // Assuming backend runs on port 5000

// Define interfaces for the expected request payloads based on backend schemas
interface UserLoginPayload {
  email: string;
  password: string;
}

interface UserRegisterPayload {
  username: string;
  email: string;
  password: string;
}

// Define interfaces for expected successful responses
interface LoginResponse {
  access_token: string;
}

interface RegisterResponse {
  id: number;
  username: string;
  email: string;
}

// Define a generic error response structure
interface ErrorResponse {
  message: string;
  errors?: any; // Pydantic validation errors can be complex
}

/**
 * Calls the backend login endpoint.
 */
export const login = async (payload: UserLoginPayload): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    // Throw an error with the message from the backend if available
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data as LoginResponse;
};

/**
 * Calls the backend register endpoint.
 */
export const register = async (payload: UserRegisterPayload): Promise<RegisterResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data as RegisterResponse;
}; 