import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Jwt from '@/jwt';
/* import settings from './settings'; */
import Qs from 'qs';

export const API_URL = process.env.VUE_APP_API_URL;

Vue.use(VueAxios, axios);
Vue.axios.defaults.baseURL = API_URL;

export const getHeader = function() {
    return { Authorization: `Token ${Jwt.getToken()}` };
};

const Api = {
    
    setHeader() {
        Vue.axios.defaults.headers.common[
            'Authorization'
        ] = `Token ${Jwt.getToken()}`;
    },
    
    query(resource, params) {
        return Vue.axios.get(
            resource, 
            {
                params: params,
                paramsSerializer: (p) => {
                    return Qs.stringify(p, { arrayFormat: 'repeat' });
                }
            }
        );
    },
    
    retrieve(resource, id = '') {
        return Vue.axios.get(resource + id + '/');
    },
    
    post(resource, params) {
        return Vue.axios.post(resource, params);
    },
    
    update(resource, id, params) {
        return Vue.axios.put(resource + id + '/', params);
    },

    partialUpdate(resource, id, params) {
        return Vue.axios.patch(resource + id + '/', params);
    },
    
    put(resource, params) {
        return Vue.axios.put(`${resource}`, params);
    },
    
    delete(resource, id) {
        return Vue.axios.delete(resource + id + '/');
    }
};

export default Api;

export const SubjectsApi = {
    URL: API_URL + 'subjects/',
    BASE_URL: 'subjects/',
    
    query(params) {
        return Api.query(this.BASE_URL, params);
    },
    retrieve(id) {
        return Api.retrieve(this.BASE_URL, id);
    },
    create(subject) {
        return Api.post(this.BASE_URL, subject);
    },
    update(id, subject) {
        return Api.partialUpdate(this.BASE_URL, id, subject);
    },
    destroy(id) {
        return Api.delete(this.BASE_URL, id);
    },
    train() {
        return Api.post(this.BASE_URL + 'train/', {});
    }
};

export const FramesApi = {
    URL: API_URL + 'frames/',
    BASE_URL: 'frames/',

    create(frame) {
        return Api.post(this.BASE_URL, frame);
    },

    detectFaces(id) {
        return Api.post(this.BASE_URL + id + '/detect_faces/', {});
    },

    destroy(id) {
        return Api.delete(this.BASE_URL, id);
    }
};

export const FacesApi = {
    URL: API_URL + 'faces/',
    BASE_URL: 'faces/',
    
    query(params) {
        return Api.query(this.BASE_URL, params);
    },
    retrieve(id) {
        return Api.retrieve(this.BASE_URL, id);
    },
    create(face) {
        return Api.post(this.BASE_URL, face);
    },
    update(id, face) {
        return Api.update(this.BASE_URL, id, face);
    },
    partialUpdate(id, face) {
        return Api.partialUpdate(this.BASE_URL, id, face);
    },
    destroy(id) {
        return Api.delete(this.BASE_URL, id);
    },
    recognize(id, params = {}) {
        return Api.query(this.BASE_URL + `${id}/recognize/`, params);
    }
};

export const RecognitionApi = {
    URL: API_URL + 'recognition/',
    BASE_URL: 'recognition/',
    create(recognition) {
        return Api.post(this.BASE_URL, recognition);
    }
};

export const VideosApi = {
    URL: API_URL + 'videos/',
    BASE_URL: 'videos/',
    
    query(params) {
        return Api.query(this.BASE_URL, params);
    },
    create(video) {
        return Api.post(this.BASE_URL, video);
    },
    retrieve(id) {
        return Api.retrieve(this.BASE_URL, id);
    },
    destroy(id) {
        return Api.delete(this.BASE_URL, id);
    }
};

export const CamerasApi = {
    BASE_URL: 'cameras/',
    URL: API_URL + 'cameras/',    
    
    query(params) {
        return Api.query(this.BASE_URL, params);
    },
    retrieve(id) {
        return Api.retrieve(this.BASE_URL, id);
    },
    create(camera) {
        return Api.post(this.BASE_URL, camera);
    },
    update(id, camera) {
        return Api.partialUpdate(this.BASE_URL, id, camera);
    },
    destroy(id) {
        return Api.delete(this.BASE_URL, id);
    }
};

export const TasksApi = {
    BASE_URL: 'tasks/',
    URL: API_URL + 'tasks/',    
    
    query(params) {
        return Api.query(this.BASE_URL, params);
    },
    retrieve(id) {
        return Api.retrieve(this.BASE_URL, id);
    },
    create(task) {
        return Api.post(this.BASE_URL, task);
    },
    destroy(id) {
        return Api.delete(this.BASE_URL, id);
    },
    pause(id) {
        return Api.post(this.BASE_URL + id + '/pause/', {});
    },
    resume(id) {
        return Api.post(this.BASE_URL + id + '/resume/', {});
    },
    stop(id) {
        return Api.post(this.BASE_URL + id + '/stop/', {});
    }
};

export const SegmentsApi = {
    URL: API_URL + 'segments/',
    BASE_URL: 'segments/',

    create(segment) {
        return Api.post(this.BASE_URL, segment);
    },

    query(params) {
        return Api.query(this.BASE_URL, params);
    }
};

export const StatsApi = {
    URL: API_URL + 'stats/',
    BASE_URL: 'stats/',

    query(params) {
        return Api.query(this.BASE_URL, params);
    }
};

export const SystemApi = {
    URL: API_URL + 'system/',
    BASE_URL: 'system/',

    query(params) {
        return Api.query(this.BASE_URL, params);
    }
};

export const NotificationsApi = {
    BASE_URL: 'notifications/',
    URL: API_URL + 'notifications/',

    query(params) {
        return Api.query(this.BASE_URL, params);
    },
    destroy(id) {
        return Api.delete(this.BASE_URL, id);
    },
    see(id) {
        return Api.post(this.BASE_URL + id + '/see/', {});
    }
};

