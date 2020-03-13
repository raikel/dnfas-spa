const prefix = 'notifications/';

const actions = {
    FETCH_ITEMS: 'fetchItems',
    DELETE_ITEM: 'deleteItem',
    SEE_ALL: 'seeAll',    
    SET_PAGE: 'setPage'
};

Object.keys(actions).forEach(key => {
    actions[key] = prefix + actions[key];
});

export default actions;
