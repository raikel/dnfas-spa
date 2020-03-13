import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';
import { taskModel, taskFilter } from './models';
import { Api } from '../api';

const PAGE_SIZE = 24;

const tasksApi = new Api('tasks/');

const state = {
    MODEL: taskModel,
    API: tasksApi,
    FILTER: taskFilter,
    items: {},
    sortId: [],
    count: 0,
    pageNumber: 0,
    filter: taskFilter.create(),
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
    tasksApi
};

