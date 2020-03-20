import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';
import { subjectModel, subjectFilter } from './models';
import { Api } from '../api';

const PAGE_SIZE = 24;

const subjectsApi = new Api('subjects/');

const state = {
    MODEL: subjectModel,
    API: subjectsApi,
    FILTER: subjectFilter,
    items: {},
    sortId: [],
    count: 0,
    pageNumber: 0,
    filter: subjectFilter.create(),
    orderBy: 'created_at',
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
    subjectsApi
};
