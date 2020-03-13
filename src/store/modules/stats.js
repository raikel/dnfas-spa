import { StatsApi } from '@/api';
import { cloneDeep } from 'loadsh';

const PAGE_SIZE = 100;

const DEFAULT_STAT = {
    data: {
        label: [],
        value: []
    },
    total: 0,
    updatedAt: null
};

const STATS_NAMES = [
    'faces_count',
    'frames_count',
    'processing_time',
    'tasks_count',
    'stored_subjects',
    'stored_faces',
    'stored_frames',
    'stored_cameras',
    'stored_videos',
    'stored_tasks',
    'faces_image_size',
    'frames_image_size',
    'videos_size'
];

const DEFAULT_STATS = {};

for (const name of STATS_NAMES) {
    DEFAULT_STATS[name] = {
        day: cloneDeep(DEFAULT_STAT),
        hour: cloneDeep(DEFAULT_STAT),
        all: cloneDeep(DEFAULT_STAT)
    };
}

function buildStats(statsItems) {
    const stats = cloneDeep(DEFAULT_STATS);
    if (statsItems.length) {        
        for (const statItem of statsItems) {
            const name = statItem['name'];
            const resolution = statItem['resolution'];
            const value = statItem['value'];
            const timestamp = new Date(statItem['timestamp']);
            const updatedAt = new Date(statItem['updated_at']);

            if (stats[name]) {
                const stat = stats[name][resolution];

                const timeType = resolution === 'hour' ? 'timeStyle' : 'dateStyle';
                const formatedTimestamp = timestamp.toLocaleString(
                    'es-MX', {
                        timeZone: 'America/Mexico_City',
                        [timeType]: 'short'
                    }
                );
                stat.data.label.push(formatedTimestamp);
                stat.data.value.push(value);
                stat.total += value;
                if (!stat.updatedAt || updatedAt > stat.updatedAt) {
                    stat.updatedAt = updatedAt;
                }
            }            
        }
    }
    return stats;
}

const state = {
    items: DEFAULT_STATS,
    count: 0,
    loading: false
};

const mutations = {
    FETCH_STATS: (state, params = {}) => {
        
        params = Object.assign({}, {
            limit: PAGE_SIZE,
            order_by: 'timestamp'
        }, params);

        state.loading = true;
        const items = [];
        var count = 0;
        const requests = [];
        for (let i = 0; i < STATS_NAMES.length; i++) {
            params = Object.assign({}, params, {name: STATS_NAMES[i]});
            requests.push(StatsApi.query(params).then(({ data }) => {
                items.push(...(data.results ? data.results : []));
                count += data.count ? data.count : 0;
            }));
        }
        Promise.all(requests).then(() => {
            state.items = buildStats(items);
            state.count = count;
            state.loading = false;
        });
    }
};

const actions = {
    fetchStats({ commit }, params) {
        commit('FETCH_STATS', params);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
