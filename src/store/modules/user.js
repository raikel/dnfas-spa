import Api from '@/api';
import Jwt from '@/jwt';
import { resetRouter } from '@/router';

const state = {
    errors: null,
    user: null,
    isAuthenticated: false
};

const actions = {

    login(context, credentials) {
        return new Promise((resolve, reject) => {
            Api.post('login/', credentials)
                .then(({ data }) => {
                    context.commit('SET_AUTH', data);
                    resolve(data);
                })
                .catch(() => {
                    context.commit('SET_ERROR', 'Error de autenticación');
                    reject('Error de autenticación');
                });
        });
    },

    logout(context) {
        context.commit('PURGE_AUTH');
        resetRouter();
    },

    checkAuth(context) {
        return new Promise((resolve, reject) => {
            try {
                if (Jwt.getToken()) {
                    Api.setHeader();
                    Api.query('users/')
                        .then(({ data }) => {
                            context.commit('SET_AUTH', data);
                            resolve(data);
                        })
                        .catch((response) => {
                            context.commit('SET_ERROR', 'Error de autenticación');
                            reject('Error de autenticación');
                        });
                } else {
                    context.commit('PURGE_AUTH');
                    reject('Error de autenticación');
                } 
            } catch (error) {
                reject(error);
            }            
        });
    }
};

const mutations = {

    SET_ERROR(state, error) {
        state.errors = error;
    },

    SET_AUTH(state, user) {
        state.isAuthenticated = true;
        state.user = user;
        state.errors = {};
        Jwt.saveToken(state.user.token);
    },

    PURGE_AUTH(state) {
        state.isAuthenticated = false;
        state.user = null;
        state.errors = null;
        Jwt.destroyToken();
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations    
};
