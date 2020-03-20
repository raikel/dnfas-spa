
import { mutTypes } from '../abstract/types';

function control(context, action, id) {
    const model = context.state.MODEL;
    const api = context.state.API;

    context.commit(mutTypes.SET_LOADING, true);
    return new Promise((resolve, reject) => {
        api[action](id).then(({ data }) => {
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

export function start(context, id) {
    return control(context, 'start', id);
}

export function pause(context, id) {
    return control(context, 'pause', id);
}

export function resume(context, id) {
    return control(context, 'resume', id);
}

export function stop(context, id) {
    return control(context, 'stop', id);
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
    setPage
} from '../abstract/actions';

