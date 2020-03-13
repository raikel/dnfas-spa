import { NotificationsApi } from '@/api';
import { Notification } from './models';
import muts from './mutations.type';
import acts from './actions.type';

function fetchItems(context, params) {
    const state = context.state;

    params = Object.assign({}, {
        limit: state.pageSize,
        offset: state.pageNumber * state.pageSize
    }, {
        order_by: state.orderBy
    },
        params
    );
    context.commit(muts.SET_LOADING, true);

    return new Promise((resolve, reject) => {
        NotificationsApi.query(params).then(({ data }) => {
            const items = data.results ? data.results : [];
            const count = data.count ? data.count : 0;
            const notifications = items.map(item => new Notification(item));
            context.commit(muts.SET_ITEMS, notifications);
            context.commit(muts.SET_COUNT, count);
            context.commit(muts.SET_LOADING, false);
            resolve(state.items);
        }).catch(error => {
            context.commit(muts.SET_LOADING, false);
            reject(error);
        });
    });
}

function deleteItem(context, id) {
    return new Promise((resolve, reject) => {
        NotificationsApi.destroy(id).then(() => {
            context.dispatch(acts.FETCH_ITEMS);
            resolve();
        }).catch(error => {
            reject(error);
        });
    });
}

function seeAll(context) {
    context.state.items.forEach((item) => {
        NotificationsApi.see(item.id).then(() => {
            context.commit(muts.UPDATE_ITEM, {
                id: item.id,
                data: {seen: true}
            });
        });
    });
}

function setPage({ commit }, number) {
    commit(muts.SET_PAGE, number);
}

export {
    fetchItems,
    seeAll,
    deleteItem,
    setPage
};
