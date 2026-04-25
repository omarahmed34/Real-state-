const BASE_URL = 'api.php';

export const api = {
    async request(action, method = 'POST', data = null, params = {}) {
        let url = `${BASE_URL}?action=${action}`;
        Object.keys(params).forEach(key => url += `&${key}=${params[key]}`);

        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };

        if (data) options.body = JSON.stringify(data);

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            return result; // Returns {status, message, data}
        } catch (error) {
            console.error(`API Error (${action}):`, error);
            return { status: 'error', message: error.message };
        }
    },

    login(email, password) {
        return this.request('login', 'POST', { email, password });
    },

    getInitialData(userId, role) {
        return this.request('get_initial_data', 'GET', null, { userId, role });
    },

    addUser(userData) {
        return this.request('add_user', 'POST', userData);
    },

    saveTask(taskData) {
        return this.request('save_task', 'POST', taskData);
    },

    saveLead(leadData) {
        return this.request('save_lead', 'POST', leadData);
    },

    saveProperty(propData) {
        return this.request('save_property', 'POST', propData);
    },
    
    saveFile(fileData) {
        return this.request('save_file', 'POST', fileData);
    },

    deleteFile(id) {
        return this.request('delete_file', 'POST', { id });
    },

    updateTaskStatus(id, status) {
        return this.request('update_task_status', 'POST', { id, status });
    },

    sendMessage(messageData) {
        return this.request('save_message', 'POST', messageData);
    },

    markMessageSeen(id) {
        return this.request('mark_message_seen', 'POST', { id });
    },

    updateProfile(id, userData) {
        return this.request('update_user', 'POST', { id, ...userData });
    },

    deleteProperty(id) {
        return this.request('delete_property', 'POST', { id });
    }
};

