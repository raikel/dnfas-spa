import * as actions from './actions';
import * as mutations from './mutations';
import { subjectSegmentModel } from './models';
import { Api } from '../api';

const PAGE_SIZE = 24;

const subjectSegmentsApi = new Api('segments/');

const state = {
    MODEL: subjectSegmentModel,
    API: subjectSegmentsApi,
    FILTER: null,
    items: {},
    sortId: [],
    count: 0,
    pageNumber: 0,
    filter: null,
    orderBy: 'title',
    pageSize: PAGE_SIZE,
    loading: false
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
};
