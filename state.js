import { api } from './api.js?v=1.1.2';

// State management with API integration
const initialData = {
  language: 'en',
  users: [],
  properties: [], 
  mapLocations: [], 
  files: [], 
  tasks: [], 
  messages: [], 
  leads: [], 
  currentUser: null
};

export const state = {
  // Sync lookup for current user session
  getSync(key) {
    try {
      const data = localStorage.getItem(`mapcom_${key}`);
      if (data) return JSON.parse(data);
    } catch (e) { console.error("Get Error:", key); }
    return initialData[key];
  },

  setSync(key, value) {
    try { localStorage.setItem(`mapcom_${key}`, JSON.stringify(value)); }
    catch (e) { console.error("Set Error:", key); }
  },

  // Async data fetching from Backend
  async fetchAll() {
    const user = this.getCurrentUser();
    if (!user) return;

    try {
      const response = await api.getInitialData(user.id, user.role);
      
      if (response.status === 'success') {
        const d = response.data;
        
        // Helper to safe-parse JSON
        const safeParse = (val) => {
            if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
                try { return JSON.parse(val); } catch (e) { return val; }
            }
            return val;
        };

        const parsedProperties = (d.properties || []).map(p => ({
            ...p,
            images: safeParse(p.images) || [],
            polygon: safeParse(p.polygon),
            centroid: safeParse(p.centroid)
        }));

        this.setSync('properties', parsedProperties);
        this.setSync('tasks', d.tasks || []);
        this.setSync('leads', d.leads || []);
        this.setSync('messages', d.messages || []);
        this.setSync('files', d.files || []);
        this.setSync('users', d.users || []);
        this.setSync('mapLocations', parsedProperties);
      }

    } catch (e) {
      console.error("Fetch Data Error:", e);
    }
  },

  get(key) {
    return this.getSync(key);
  },

  set(key, value) {
    this.setSync(key, value);
  },

  init() {
    return this.fetchAll();
  },

  async login(email, password) {
    const result = await api.login(email, password);
    if (result.status === 'success') {
      this.setSync('currentUser', result.data);
      await this.fetchAll(); 
    }
    return result;
  },

  logout() { 
    this.setSync('currentUser', null);
    localStorage.removeItem('mapcom_currentUser');
    window.location.hash = '/login';
  },

  getCurrentUser() { return this.getSync('currentUser'); },

  async saveData(resource, data) {
    let result;
    
    switch (resource) {
        case 'properties':
            result = await api.saveProperty(data);
            break;
        case 'tasks':
            if (data.id) result = await api.updateTaskStatus(data.id, data.status);
            else result = await api.saveTask(data);
            break;
        case 'leads':
            result = await api.saveLead(data);
            break;
        case 'users':
            result = await api.addUser(data);
            break;
        case 'messages':
            if (data.action === 'markSeen') result = await api.markMessageSeen(data.id);
            else result = await api.sendMessage(data);
            break;
        case 'files':
            result = await api.saveFile(data);
            break;
        default:
            console.warn("Unknown resource for saveData:", resource);
            return { status: 'error', message: 'Unknown resource' };
    }
    
    if (result.status === 'success') {
        await this.fetchAll(); 
    }
    return result;
  },

  async updateProfile(userData) {
    const user = this.getCurrentUser();
    if (!user) return false;
    const result = await api.updateProfile(user.id, userData);
    if (result.status === 'success') {
        const updatedUser = { ...user, ...userData };
        this.setSync('currentUser', updatedUser);
        return true;
    }
    return false;
  },

  async deleteData(resource, id) {
    let result;
    if (resource === 'properties') {
        result = await api.deleteProperty(id);
    } else if (resource === 'files') {
        result = await api.deleteFile(id);
    } else {
        console.error("Delete operation is not supported for resource:", resource);
        return false;
    }

    if (result && result.status === 'success') {
        await this.fetchAll();
        return true;
    }
    return false;
  }
};




