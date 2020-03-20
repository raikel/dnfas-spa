<template>

<div class="tasks-filter">
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

        <el-form-item label="Nombre">
            <el-input
                clearable
                :value="filter.name"                    
                @input="val => onParamChange({name: val})"
            ></el-input>
        </el-form-item>

        <el-form-item label="Tipo de Tarea" prop="taskType">
            <el-select
                multiple
                :value="filter.taskType"                    
                @change="val => onParamChange({taskType: val})"
            >
                <el-option
                    v-for="type in typeChoices"
                    :key="type.value"
                    :label="type.label"
                    :value="type.value"
                ></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="Estado" prop="taskType">
            <el-select
                multiple
                :value="filter.status"                    
                @change="val => onParamChange({status: val})"
            >
                <el-option
                    v-for="status in statusChoices"
                    :key="status.value"
                    :label="status.label"
                    :value="status.value"
                ></el-option>
            </el-select>
        </el-form-item>
    </el-form>
</div>

</template>

<script>

import OrderSelect from '@/components/OrderSelect';
import { typeChoices, statusChoices, orderChoices } from './data';

export default {
    name: 'TasksFilter',

    components: {
        OrderSelect
    },

    data() {
        return {
            loading: false,
            typeChoices: typeChoices,
            statusChoices: statusChoices,
            orderChoices: orderChoices
        };
    },

    computed: {
        filter() {
            return this.$store.state.tasks.filter;
        }
    },

    methods: {
        onParamChange(data) {
            this.$store.dispatch('tasks/setFilter', data);
            this.$store.dispatch('tasks/fetchItems');
        }
    }
};
</script>

<style lang="scss">
</style>
