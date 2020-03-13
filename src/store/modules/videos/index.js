import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';
import { videoModel, videoFilter } from './models';
import { Api } from '../api';

const PAGE_SIZE = 24;

const videosApi = new Api('videos/');

const state = {
    MODEL: videoModel,
    API: videosApi,
    FILTER: videoFilter,
    items: {},
    sortId: [],
    count: 0,
    pageNumber: 0,
    filter: videoFilter.create(),
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
    videosApi
};
