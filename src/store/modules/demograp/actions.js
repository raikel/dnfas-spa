import { mutTypes } from '../abstract/types';
import { demograpModel } from './models';
import { Api } from '../api';

const demograpApi = new Api('demograp/stats');

export function fetchStats(context, params) {
    const state = context.state;
    const filter = state.FILTER;
    const filterData = filter ? filter.apiPost(state.filter, false) : {};

    params = Object.assign({}, params, filterData);

    context.commit(mutTypes.SET_LOADING, true);

    return new Promise((resolve, reject) => {
        demograpApi.fetch(params).then(({ data }) => {
            const stats = demograpModel.apiGet(data);
            context.commit('SET_STATS', stats); 
            context.commit(mutTypes.SET_LOADING, false); 
            resolve(stats);
        }).catch(error => {
            context.commit(mutTypes.SET_LOADING, false);
            reject(error);
        });
    });
}

export {
    getItem,
    fetchItems,
    retrieveItem,
    setFilter,
    resetFilter,
    setOrder,
    setPage,
    setPageSize,
    fetchFile
} from '../abstract/actions';
