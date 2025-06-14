import { useAuthStore } from '../store/authStore';

const API_URL = 'http://127.0.0.1:5000/api';

const apiRequest = async (url, method, body = null) => {
    const token = useAuthStore.getState().token;
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(url, config);

    if (response.status === 401) {
        useAuthStore.getState().logout();
    }
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.status === 204 ? null : response.json();
};

// AUTH
export const apiLogin = (credentials) => apiRequest(`${API_URL}/auth/login`, 'POST', credentials);
export const apiRegister = (userData) => apiRequest(`${API_URL}/auth/register`, 'POST', userData);

// PROJECTS
export const fetchProjects = () => apiRequest(`${API_URL}/projects`, 'GET');
export const createProject = (projectData) => apiRequest(`${API_URL}/projects`, 'POST', projectData);
export const deleteProject = (projectId) => apiRequest(`${API_URL}/projects/${projectId}`, 'DELETE');

// Add other API functions (users, tasks) here as needed.
