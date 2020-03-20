<template>

<div class="cameras-filter">
    <el-form
        label-position="top"
        size="small"
        :disabled="loading"
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

        <el-form-item label="Ubicación">
            <el-input
                clearable
                :value="filter.address"                    
                @input="val => onParamChange({address: val})"
            ></el-input>
        </el-form-item>
    </el-form>
</div>

</template>

<script>

import OrderSelect from '@/components/OrderSelect';
import { orderChoices } from './data';

export default {
    name: 'CamerasFilter',

    components: {
        OrderSelect
    },

    data() {
        return {
            loading: false,
            orderChoices: orderChoices
        };
    },

    computed: {
        filter() {
            return this.$store.state.cameras.filter;
        }
    },

    methods: {

        onParamChange(data) {
            this.$store.dispatch('cameras/setFilter', data);
            this.$store.dispatch('cameras/fetchItems');
        }
    }
};
</script>

<style lang="scss">
</style>
