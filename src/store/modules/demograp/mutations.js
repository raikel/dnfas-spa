export const SET_STATS = (state, stats) => {   
    state.stats = stats;
};

export {
    SET_ITEM,
    SET_ITEMS,
    SET_SORT,
    DEL_ITEM,
    SET_COUNT,
    SET_LOADING,
    SET_FILTER,
    RESET_FILTER,
    SET_ORDER,
    SET_PAGE,
    SET_PAGE_SIZE
} from '../abstract/mutations';
