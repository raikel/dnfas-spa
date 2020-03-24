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

        <el-form-item label="Tareas (por nombre)">
            <query-select
                store="tasks"
                :value="filter.tasks"
                @change="val => onParamChange({tasks: val})"
            ></query-select>
        </el-form-item>

        <el-form-item label="Tareas (por etiqueta)">
            <query-select
                store="tags"
                :value="filter.tasksTags"
                :params="{model: 'task'}"
                @change="val => onParamChange({tasksTags: val})"
            ></query-select>
        </el-form-item>
    </el-form>
</div>

</template>

<script>

import OrderSelect from '@/components/OrderSelect';
import QuerySelect from '@/components/QuerySelect';
import { sexChoices, orderChoices } from './data';

export default {
    name: 'DemograpFilter',

    components: {
        OrderSelect,
        QuerySelect
    },

    data() {
        return {
            loading: false,
            sexChoices: sexChoices,
            orderChoices: orderChoices
        };
    },

    computed: {
        filter() {
            return this.$store.state.demograp.filter;
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
