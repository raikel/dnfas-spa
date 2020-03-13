import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import app from './modules/app';
import settings from './modules/settings';
import user from './modules/user';
import videos from './modules/videos';
import subjects from './modules/subjects';
import subjectSegments from './modules/subject-segments';
import faces from './modules/faces';
import faceRecos from './modules/face-recos';
import frames from './modules/frames';
import cameras from './modules/cameras';
import tasks from './modules/tasks';
import stats from './modules/stats';
import system from './modules/system';
import notifications from './modules/notifications';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        app,
        settings,
        user,
        videos,
        subjects,
        subjectSegments,
        faces,
        faceRecos,
        frames,
        cameras,
        tasks,
        stats,
        system,
        notifications
    },
    getters
});

export default store;
