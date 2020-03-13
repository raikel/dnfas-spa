import * as actions from './actions';
import * as mutations from './mutations';
import { frameModel } from './models';
import { Api } from '../api';

const PAGE_SIZE = 24;

class FramesApi extends Api {
    detectFaces(id = '') {
        return this.axios.post(this.path + id + '/detect_faces/', {});
    }
}

const framesApi = new FramesApi('frames/');

const state = {
    MODEL: frameModel,
    API: framesApi,
    FILTER: null,
    items: {},
    count: 0,
    pageNumber: 0,
    filter: null,
    orderBy: '',
    pageSize: PAGE_SIZE,
    loading: false
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
};
