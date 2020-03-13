function SET_ITEMS(state, items) {
    state.items = items;
}

function ADD_ITEM(state, item) {
    state.items.push(item);
}

function UPDATE_ITEM(state, {id, data}) {
    const item = state.items.find(item => item.id === id);
    if (item) {
        item.setData(data);
    }
}

function SET_COUNT(state, count) {
    state.count = count;
}

function SET_LOADING(state, loading) {
    state.loading = loading;
}

function SET_PAGE(state, number) {
    state.pageNumber = number;
}

export {
    SET_ITEMS,
    ADD_ITEM,
    UPDATE_ITEM,
    SET_COUNT,
    SET_LOADING,
    SET_PAGE
};
