import { mutTypes } from './types';
const FileSaver = require('file-saver');

function getItem(context, id) {
    const items = context.state.items;
    if (items[id] !== undefined) {
        return new Promise((resolve) => {
            resolve(items[id]);
        });
    } else {
        return context.dispatch('retrieveItem', id);
    }
}

function fetchItems(context, params) {
    const state = context.state;
    const model = state.MODEL;
    const filter = state.FILTER;
    const api = state.API;
    const filterData = filter ? filter.apiPost(state.filter, false) : {};

    params = Object.assign({}, params, filterData, {
        limit: state.pageSize,
        offset: state.pageNumber * state.pageSize
    });

    context.commit(mutTypes.SET_LOADING, true);

    return new Promise((resolve, reject) => {
        api.fetch(params).then(({ data }) => {
            const results = data.results ? data.results : [];
            const count = data.count ? data.count : 0;
            const items = {};
            const sortId = []; 
            results.forEach(itemData => {
                const item = model.apiGet(itemData);
                items[item.id] = item;
                sortId.push(item.id);
            });   
            context.commit(mutTypes.SET_ITEMS, items);
            context.commit(mutTypes.SET_SORT, sortId);
            context.commit(mutTypes.SET_COUNT, count);
            context.commit(mutTypes.SET_LOADING, false); 
            resolve(items);
        }).catch(error => {
            context.commit(mutTypes.SET_LOADING, false);
            reject(error);
        });
    });
}

function retrieveItem(context, id) {
    const model = context.state.MODEL;
    const api = context.state.API;

    context.commit(mutTypes.SET_LOADING, true);
    
    return new Promise((resolve, reject) => {
        api.retrieve(id).then(({ data }) => {
            const item = model.apiGet(data);
            context.commit(mutTypes.SET_ITEM, item);
            context.commit(mutTypes.SET_LOADING, false);
            resolve(item);
        }).catch(error => {
            context.commit(mutTypes.SET_LOADING, false);
            reject(error);
        });
    });
}

function createItem(context, { item, persist = true }) {
    const model = context.state.MODEL;
    const api = context.state.API;

    if (!persist) {
        return new Promise((resolve) => {
            context.commit(mutTypes.SET_ITEM, item);
            resolve(item);     
        });
    } else {
        context.commit(mutTypes.SET_LOADING, true);
        return new Promise((resolve, reject) => {
            const payload = model.apiPost(item);
            api.create(payload).then(({ data }) => {
                const newItem = model.apiGet(data);
                context.commit(mutTypes.SET_ITEM, newItem);       
                context.commit(mutTypes.SET_LOADING, false);
                resolve(newItem);
            }).catch(error => {
                context.commit(mutTypes.SET_LOADING, false);
                reject(error);
            });       
        });
    }
}

function updateItem(context, { item, persist = true }) {
    const model = context.state.MODEL;
    const api = context.state.API;

    context.commit(mutTypes.SET_ITEM, item);

    if (!persist) {
        return new Promise((resolve) => {
            resolve(item);     
        });
    } else {
        context.commit(mutTypes.SET_LOADING, true);
        return new Promise((resolve, reject) => {
            const payload = model.apiPost(item);
            api.update(item.id, payload).then(({ data }) => {
                const newItem = model.apiGet(data);
                context.commit(mutTypes.SET_ITEM, newItem);            
                context.commit(mutTypes.SET_LOADING, false);
                resolve(newItem);
            }).catch(error => {
                context.commit(mutTypes.SET_LOADING, false);
                reject(error);
            });
        });
    }
}

function destroyItem(context, id) {
    const api = context.state.API;

    context.commit(mutTypes.SET_LOADING, true);
    context.commit(mutTypes.DEL_ITEM, id); 
    return new Promise((resolve, reject) => {
        api.destroy(id).then(() => {                     
            context.commit(mutTypes.SET_LOADING, false);
            resolve();
        }).catch(error => {
            context.commit(mutTypes.SET_LOADING, false);
            reject(error);
        });
    });
}

function setFilter({ commit }, filter) {
    commit(mutTypes.SET_FILTER, filter);
}

function resetFilter({ commit }) {
    commit(mutTypes.RESET_FILTER);
}

function setOrder({ commit }, order) {
    commit(mutTypes.SET_ORDER, order);
}

function setPage({ commit }, number) {
    commit(mutTypes.SET_PAGE, number);
}

function setPageSize({ commit }, size) {
    commit(mutTypes.SET_PAGE_SIZE, size);
}

function fetchFile(context, params) {
    const state = context.state;
    const filter = state.FILTER;
    const api = state.API;
    const filterData = filter ? filter.apiPost(state.filter, false) : {};

    params = Object.assign({}, params, filterData);

    context.commit(mutTypes.SET_LOADING, true);

    return new Promise((resolve, reject) => {
        api.download(params).then((response) => {
            const fileNameHeader = 'filename';
            const fileName = response.headers[fileNameHeader];
            // Let the user save the file.
            FileSaver.saveAs(response.data, fileName || 'export.xls');
            context.commit(mutTypes.SET_LOADING, false);
            resolve();
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
    setPageSize,
    fetchFile
};
