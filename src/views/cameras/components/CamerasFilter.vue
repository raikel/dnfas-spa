<template>

<div class="cameras-filter">
    <h2 class="text-lg mb-4">Buscar Cámaras</h2>
    <el-form
        label-position="top"
        :disabled="loading"
    >
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

export default {
    name: 'CamerasFilter',

    data() {
        return {
            loading: false
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
        },

        onClearClick() {
            this.$store.dispatch('cameras/resetFilter');
            this.$store.dispatch('cameras/fetchItems');
        }
    }
};
</script>

<style lang="scss">
</style>
