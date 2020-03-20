import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';
import { tagModel } from './models';
import { Api } from '../api';

const PAGE_SIZE = 24;

const tagsApi = new Api('tags/');

const state = {
    MODEL: tagModel,
    API: tagsApi,
    FILTER: null,
    items: {},
    sortId: [],
    count: 0,
    pageNumber: 0,
    filter: null,
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
    tagsApi
};

