<template>

<div class="subjects-filter">
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

        <el-form-item label="Edad" class="range">
            <el-input-number
                placeholder="Desde"
                :min="0"
                :max="100"
                :controls="false"
                :value="filter.minAge"
                @change="val => onParamChange({minAge: val})"           
            ></el-input-number>
            <span class="px-2">—</span>
            <el-input-number
                placeholder="Hasta" 
                :min="0"
                :max="100"
                :controls="false"
                :value="filter.maxAge"
                @change="val => onParamChange({maxAge: val})"
            ></el-input-number>
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

        <el-form-item 
            label="Sexo"
        >
            <el-select
                clearable
                :value="filter.sex"
                @change="val => onParamChange({sex: val})"
            >
                <el-option
                    v-for="sex in sexChoices"
                    :key="sex.value"
                    :label="sex.label"
                    :value="sex.value"
                ></el-option>
            </el-select>
        </el-form-item>

        <el-form-item 
            label="Color de piel" 
            prop="skin"
        >
            <el-select
                clearable
                :value="filter.skin"
                @change="val => onParamChange({skin: val})"
            >
                <el-option
                    v-for="skin in skinChoices"
                    :key="skin.value"
                    :label="skin.label"
                    :value="skin.value"
                ></el-option>
            </el-select>
        </el-form-item>
    </el-form>
</div>

</template>

<script>

import OrderSelect from '@/components/OrderSelect';
import QuerySelect from '@/components/QuerySelect';
import { sexChoices, skinChoices, orderChoices } from './data';

export default {
    name: 'SubjectFilter',

    components: {
        OrderSelect,
        QuerySelect
    },

    props: {
        params: {
            type: Object,
            default: () => {}
        }
    },

    data() {
        return {
            loading: false,
            sexChoices: sexChoices,
            skinChoices: skinChoices,
            orderChoices: orderChoices
        };
    },

    computed: {
        filter() {
            return this.$store.state.subjects.filter;
        }
    },

    methods: {

        update() {
            this.$store.dispatch('subjects/fetchItems', this.params);
            this.$emit('change');
        },

        onParamChange(data) {
            this.$store.dispatch('subjects/setFilter', data);
            this.update();
        }
    }
};
</script>

<style lang="scss">
</style>
