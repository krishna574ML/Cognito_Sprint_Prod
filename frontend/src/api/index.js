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

    if (response.status === 204 || response.headers.get("content-length") === "0") {
        return null;
    }
    return response.json();
};

// --- AUTHENTICATION ---
export const apiLogin = (credentials) => apiRequest(`${API_URL}/auth/login`, 'POST', credentials);
export const apiRegister = (userData) => apiRequest(`${API_URL}/auth/register`, 'POST', userData);

// --- PROJECTS ---
export const fetchProjects = () => apiRequest(`${API_URL}/projects`, 'GET');
export const updateProjectStatus = (projectId, data) => apiRequest(`${API_URL}/projects/${projectId}`, 'PUT', data);
export const createProject = (projectData) => apiRequest(`${API_URL}/projects`, 'POST', projectData);

// --- TASKS ---
export const fetchTasksForProject = (projectId) => apiRequest(`${API_URL}/projects/${projectId}/tasks`, 'GET');
export const createTask = (projectId, taskData) => apiRequest(`${API_URL}/projects/${projectId}/tasks`, 'POST', taskData);
export const updateTask = (taskId, taskData) => apiRequest(`${API_URL}/tasks/${taskId}`, 'PUT', taskData);
export const deleteTask = (taskId) => apiRequest(`${API_URL}/tasks/${taskId}`, 'DELETE');

// --- USERS & MEMBERSHIP ---
export const fetchAllUsers = () => apiRequest(`${API_URL}/users`, 'GET');
export const addMemberToProject = (projectId, userId) => apiRequest(`${API_URL}/projects/${projectId}/members`, 'POST', { user_id: userId });
export const removeMemberFromProject = (projectId, userId) => apiRequest(`${API_URL}/projects/${projectId}/members/${userId}`, 'DELETE');

// --- ACTIVITIES (New) ---
export const fetchActivitiesForProject = (projectId) => apiRequest(`${API_URL}/projects/${projectId}/activities`, 'GET');
