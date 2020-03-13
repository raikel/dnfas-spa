import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';
import { cameraModel, cameraFilter } from './models';
import { Api } from '../api';

const PAGE_SIZE = 24;

const camerasApi = new Api('cameras/');

const state = {
    MODEL: cameraModel,
    API: camerasApi,
    FILTER: cameraFilter,
    items: {},
    sortId: [],
    count: 0,
    pageNumber: 0,
    filter: cameraFilter.create(),
    orderBy: 'name',
    pageSize: PAGE_SIZE,
    loading: false
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};

export {
    camerasApi
};
