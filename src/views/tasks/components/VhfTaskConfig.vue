<template>

<el-form
    v-if="config"
    ref="form"
    size="small"
    class="vhftask-config"
    label-position="top"
    :show-message="false"
    :rules="rules"
    :model="config"
    :disabled="loading"
    @validate="onValidate" 
>
    <el-form-item                        
        label="Personas de interés"
        prop="huntedSubjects"
    >
        <el-select
            v-model="huntedSubjects"
            filterable
            multiple
            remote
            clearable
            placeholder="Ingresa el nombre una persona"                            
            :remote-method="querySubjectsChoices"
            :loading="querying"
            :automatic-dropdown="false"
        >
            <el-option
                v-for="choice in subjectsChoices"
                :key="choice.id"
                :label="choice.name"
                :value="choice.id"
            >
                <span v-html="choice.label"></span>
            </el-option>
        </el-select>
    </el-form-item>
</el-form>

</template>

<script>

import { subjectsApi } from '@/store/modules/subjects';

const queryMinLength = 2;

const rules = {
};

export default {
    name: 'VhfTaskConfig',

    props: {
        taskId: {
            type: [Number, String],
            required: true
        }
    },

    data() {
        return {
            loading: false,
            querying: false,
            alert: null,
            rules: rules,
            subjectsChoices: []
        };
    },

    computed: {
        config() {
            const task = this.$store.state.tasks.items[this.taskId];
            return task ? task.config : null;
        },

        huntedSubjects: {
            get() {
                return this.config.huntedSubjects;
                /* const values = [];
                this.config.huntedSubjects.forEach(id => {
                    this.$store.dispatch('subjects/getItem', id);
                    const subject = this.$store.state.subjects.items[id];
                    if (subject) {
                        values.push({
                            id: subject.id,
                            name: subject.name,
                            label: subject.name
                        });
                    }
                });
                return values; */
            },

            set(values) {
                this.onParamChange({
                    huntedSubjects: values
                });
                /* this.onParamChange({
                    huntedSubjects: values.map(val => val.id)
                }); */              
            }      
        }
    },

/*     created() {
        this.$store.dispatch('tasks/getItem').then(task => {
            this.subjectsChoices = [];
            task.config.huntedSubjects.forEach(id => {
                this.$store.dispatch(
                    'subjects/getItem', id
                ).then(subject => {
                    this.subjectsChoices.push({
                        id: subject.id,
                        name: subject.name,
                        label: subject.name
                    });
                });
            });
        });
    }, */

    methods: {

        onParamChange(data) {
            const config = { ... this.config, ...data};
            this.$store.dispatch('tasks/updateItem', {
                item: { id: this.taskId, config: config }, 
                persist: false
            });
        },

        onValidate(prop, valid, errorMsg) {
            if (!valid) {
                this.alert = {
                    type: 'error',
                    text: errorMsg
                };
            } else {
                this.alert = null;
            }
        },

        querySubjectsChoices(query) {
            this.subjectsChoices = [];
            if (query && query.length >= queryMinLength && !this.querying) {                
                this.querying = true;                
                subjectsApi.fetch({
                    name: query, 
                    fields: 'id,name'
                }).then(({ data }) => {
                    const results = data.results ? data.results : [];
                    const re = new RegExp(query, 'gi');
                    const queryBold = '<b>' + query + '</b>';
                    this.subjectsChoices = results.map(subject => {
                        return {
                            id: subject.id,
                            name: subject.name,
                            label: subject.name.replace(re, queryBold)
                        };
                    });
                }).catch(error => {
                    this.$log.error(error);                   
                }).finally(() => {
                    this.querying = false;
                });                
            }
        },

        validate(callback) {
            return this.$refs.form.validate(callback);
        }
    }
};
</script>

<style lang="scss">
</style>
