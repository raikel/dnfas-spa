<template>

<div class="tasks-filter">
    <h2 class="pb-2 mb-4 text-lg">Buscar Tareas</h2>
    <el-form
        label-position="top"
        :disabled="loading"
        size="small"
    >
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

        <el-button
            type="info"
            icon="el-icon-refresh"
            class="block mt-3"
            :disabled="loading"
            @click="onClearClick"             
        >
            Limpiar filtro
        </el-button>

    </el-form>
</div>

</template>

<script>

import { typeChoices, statusChoices } from './data';

export default {
    name: 'TasksFilter',

    data() {
        return {
            loading: false,
            typeChoices: typeChoices,
            statusChoices: statusChoices
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
        },

        onClearClick() {
            this.$store.dispatch('tasks/resetFilter');
            this.$store.dispatch('tasks/fetchItems');
        }
    }
};
</script>

<style lang="scss">

.tasks-filter {
    .range .el-form-item__content {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
}

</style>
