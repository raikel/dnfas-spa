import * as actions from './actions';
import * as mutations from './mutations';

const PAGE_SIZE = 5;

const state = {
    items: [],
    count: 0,
    pageNumber: 0,
    orderBy: null,
    pageSize: PAGE_SIZE,
    loading: false
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
};
