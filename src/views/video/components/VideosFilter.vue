<template>
    <div class="videos-filter">
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

            <el-form-item label="Creado después de">
                <el-date-picker
                    type="datetime"
                    placeholder="Seleccione una fecha y hora"
                    :value="filter.minCreatedAt"                    
                    @input="val => onParamChange({minCreatedAt: val})"
                ></el-date-picker>
            </el-form-item>

            <el-form-item label="Creado antes de">
                <el-date-picker
                    v-model="filter['max_timestamp']"
                    type="datetime"
                    placeholder="Seleccione una fecha y hora"
                    :value="filter.maxCreatedAt"                    
                    @input="val => onParamChange({maxCreatedAt: val})"
                ></el-date-picker>
            </el-form-item>

            <el-form-item label="Duración (minutos)" class="range">
                <el-input-number
                    placeholder="Mínima" 
                    :controls="false"
                    :min="0" 
                    :max="1000000"
                    :value="filter.minDuration"                    
                    @change="val => onParamChange({minDuration: val})"     
                ></el-input-number>
                <span class="range-separator">—</span>
                <el-input-number 
                    v-model="filter['max_duration']"
                    placeholder="Máxima" 
                    :controls="false"
                    :min="0" 
                    :max="1000000"
                    :value="filter.maxDuration"                    
                    @change="val => onParamChange({maxDuration: val})"                
                ></el-input-number>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

import OrderSelect from '@/components/OrderSelect';
import { orderChoices } from './data';

export default {
    name: 'VideosFilter',

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
            return this.$store.state.videos.filter;
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

.videos-filter {
    .range .el-form-item__content {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
    .range-separator {
        padding: 0 4px;
    }
}

</style>
