const API_BASE_URL = 'http://localhost:5000';

interface UserLoginPayload {
  email: string;
  password: string;
}

interface UserRegisterPayload {
  username: string;
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

interface RegisterResponse {
  id: number;
  username: string;
  email: string;
}


interface ErrorResponse {
  message: string;
  errors?: any; 
}



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
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data as LoginResponse;
};


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