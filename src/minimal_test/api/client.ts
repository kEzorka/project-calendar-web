// Минимальная заглушка axios instance

interface ApiResponse<T = any> {
  data: T;
  status: number;
}

class MockApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = 'http://localhost:8080/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async get<T = any>(url: string): Promise<ApiResponse<T>> {
    console.log(`[MOCK API] GET ${this.baseURL}${url}`);
    // Возвращаем пустой массив по умолчанию
    return { data: [] as T, status: 200 };
  }

  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    console.log(`[MOCK API] POST ${this.baseURL}${url}`, data);
    return { data: {} as T, status: 200 };
  }

  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    console.log(`[MOCK API] PUT ${this.baseURL}${url}`, data);
    return { data: {} as T, status: 200 };
  }

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    console.log(`[MOCK API] DELETE ${this.baseURL}${url}`);
    return { data: {} as T, status: 200 };
  }
}

export const apiClient = new MockApiClient();
