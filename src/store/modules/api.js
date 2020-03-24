import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Jwt from '@/jwt';
/* import settings from './settings'; */
import Qs from 'qs';

const API_URL = process.env.VUE_APP_API_URL;

const getHeader = function() {
    return { 
        Authorization: `Token ${Jwt.getToken()}` 
    };
};

const setHeader = function() {
    const token = `Token ${Jwt.getToken()}`;
    Vue.axios.defaults.headers.common['Authorization'] = token;
};

Vue.use(VueAxios, axios);

Vue.axios.defaults.baseURL = API_URL;

Vue.axios.defaults.paramsSerializer = (param) => {
    return Qs.stringify(param, { arrayFormat: 'repeat' });
};

class Api {
    constructor(path = '') {        
        if (path.length && path[path.length - 1] !== '/') {
            path += '/'; 
        }
        this.path = path;
        this.axios = Vue.axios;
    }

    fetch(params) {
        return this.axios.get(this.path, { params: params });
    }
    
    retrieve(id = '') {
        return this.axios.get(this.path + id + '/');
    }
    
    create(data) {
        return this.axios.post(this.path, data);
    }

    update(id, data) {
        return this.axios.patch(this.path + id + '/', data);
    }
    
    destroy(id) {
        return this.axios.delete(this.path + id + '/');
    }

    download(params) {
        return this.axios.get(this.path + 'export/', {
            responseType: 'blob',
            params: params
        });
    }
}

export {
    Api,
    getHeader,
    setHeader,
    API_URL
};
