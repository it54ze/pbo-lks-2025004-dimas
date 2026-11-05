import { API_CONFIG } from './config.js';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      return data;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(
          'Tidak dapat terhubung ke API. Pastikan backend berjalan di ' +
          API_CONFIG.BASE_URL
        );
      }
      throw error;
    }
  }

  get(endpoint) { return this.request(endpoint, { method: 'GET' }); }
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body }); }
  put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}

export const api = new ApiClient(API_CONFIG.BASE_URL);

export const booksApi = {
  list: () => api.get('/books'),
  detail: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  destroy: (id) => api.delete(`/books/${id}`),
};

export const categoriesApi = {
  list: () => api.get('/categories'),
  detail: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  destroy: (id) => api.delete(`/categories/${id}`),
};