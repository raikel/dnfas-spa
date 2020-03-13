import { mutTypes } from '../abstract/types';
import { demograpModel } from './models';

export function fetchDemograp(context, params) {    
    const state = context.state;
    const filter = state.FILTER;
    const api = state.API;
    const filterData = filter ? filter.apiPost(state.filter, false) : {};

    params = Object.assign({}, params, filterData);

    context.commit(mutTypes.SET_LOADING, true);

    return new Promise((resolve, reject) => {
        api.demograp(params).then(({ data }) => {
            const demograp = demograpModel.apiGet(data);
            context.commit(mutTypes.SET_LOADING, false); 
            resolve(demograp);
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
    createItem,
    updateItem,
    destroyItem,
    setFilter,
    resetFilter,
    setOrder,
    setPage,
    setPageSize
} from '../abstract/actions';
