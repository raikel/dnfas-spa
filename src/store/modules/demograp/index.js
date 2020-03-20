import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';
import { demograpFilter, demograpModel } from './models';
import { subjectModel } from '../subjects/models';
import { Api } from '../api';

const PAGE_SIZE = 24;

const demograpApi = new Api('demograp/');

const state = {
    MODEL: subjectModel,
    API: demograpApi,
    FILTER: demograpFilter,
    items: {},
    stats: demograpModel.create(),
    sortId: [],
    count: 0,
    pageNumber: 0,
    filter: demograpFilter.create(),
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
    demograpApi
};
