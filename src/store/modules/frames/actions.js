import { mutTypes } from '../abstract/types';

export function detectFaces(context, id) {
    const api = context.state.API;

    context.commit(mutTypes.SET_LOADING, true);

    return new Promise((resolve, reject) => {
        api.detectFaces(id).then(({ data }) => {    
            context.commit(mutTypes.SET_LOADING, false);
            resolve(data);
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
    destroyItem
} from '../abstract/actions';
