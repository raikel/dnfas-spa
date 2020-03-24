<template>

<div class="demograp-filter">
    <el-form
        label-position="top"
        :disabled="loading"
        size="small"
    >
        <el-form-item label="Ordenar por">
            <order-select
                :order-choices="orderChoices"
                :value="filter.orderBy"                    
                @change="val => onParamChange({orderBy: val})"
            ></order-select>
        </el-form-item>

        <el-form-item label="Edad estimada" class="range">
            <el-input-number
                placeholder="Desde" 
                :controls="false"
                :min="1" 
                :max="100"
                :value="filter.minPredAge"
                @change="val => onParamChange({minPredAge: val})"           
            ></el-input-number>
            <span class="px-2">—</span>
            <el-input-number
                placeholder="Hasta" 
                :controls="false"
                :min="1" 
                :max="100"
                :value="filter.maxPredAge"
                @change="val => onParamChange({maxPredAge: val})"               
            ></el-input-number>
        </el-form-item>

        <el-form-item 
            label="Género estimado"
        >
            <el-select
                clearable
                :value="filter.predSex"
                @change="val => onParamChange({predSex: val})"
            >
                <el-option
                    v-for="sex in sexChoices"
                    :key="sex.value"
                    :label="sex.label"
                    :value="sex.value"
                ></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="Fecha y hora mínima">
            <el-date-picker
                type="datetime"
                placeholder="Desde"
                :value="filter.minTimestamp"
                @input="val => onParamChange({minTimestamp: val})"  
            ></el-date-picker>
        </el-form-item>

        <el-form-item label="Fecha y hora máxima">
            <el-date-picker
                type="datetime"
                placeholder="Hasta"
                :value="filter.maxTimestamp"
                @input="val => onParamChange({maxTimestamp: val})"
            ></el-date-picker>
        </el-form-item>

        <el-form-item label="Tarea">

            <el-select
                v-model="tasks"
                multiple
                filterable
                remote
                clearable
                placeholder="Selecciona una tarea"                              
                :remote-method="queryTasks"
                :loading="querying"
                :automatic-dropdown="false"
            >
                <el-option
                    v-for="choice in tasksChoices"
                    :key="choice.id"
                    :label="choice.name"
                    :value="choice.id"
                >
                    <span v-html="choice.label"></span>
                </el-option>
            </el-select>
        </el-form-item>
    </el-form>
</div>

</template>

<script>

import OrderSelect from '@/components/OrderSelect';
import { tasksApi } from '@/store/modules/tasks';
import { sexChoices, orderChoices } from './data';

const queryMinLength = 3;

export default {
    name: 'DemograpFilter',

    components: {
        OrderSelect
    },

    data() {
        return {
            loading: false,
            sexChoices: sexChoices,
            orderChoices: orderChoices,
            querying: false,
            tasksChoices: []
        };
    },

    computed: {
        filter() {
            return this.$store.state.demograp.filter;
        },

        tasks: {
            get() {         
                return this.filter.tasks;
            },
            set(value) {
                this.onParamChange({tasks: value});              
            }      
        }
    },

    methods: {

        update() {
            this.$store.dispatch('demograp/fetchStats');
            this.$store.dispatch('demograp/fetchItems');
        },

        onParamChange(data) {
            this.$store.dispatch('demograp/setFilter', data);
            this.update();
        },
        
        queryTasks(query) {
            this.tasksChoices = [];
            if (query && query.length >= queryMinLength && !this.querying) {                
                this.querying = true;                
                tasksApi.fetch({
                    name: query, 
                    fields: 'id,name'
                }).then(({ data }) => {
                    const results = data.results ? data.results : [];
                    const re = new RegExp(query, 'gi');
                    const queryBold = '<b>' + query + '</b>';
                    this.tasksChoices = results.map(task => {
                        return {
                            id: task.id,
                            name: task.name,
                            label: task.name.replace(re, queryBold)
                        };
                    });
                }).catch(error => {
                    this.$log.error(error);                   
                }).finally(() => {
                    this.querying = false;
                });                
            }
        }
    }
};
</script>

<style lang="scss">

.demograp-filter {
    .range .el-form-item__content {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
}

</style>
