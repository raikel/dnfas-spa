import * as actions from './actions';
import * as mutations from './mutations';
import { faceModel } from './models';
import { Api } from '../api';

const PAGE_SIZE = 24;

const facesApi = new Api('faces/');

const state = {
    MODEL: faceModel,
    API: facesApi,
    FILTER: null,
    items: {},
    count: 0,
    pageNumber: 0,
    filter: null,
    orderBy: 'created_at',
    pageSize: PAGE_SIZE,
    loading: false
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
};
