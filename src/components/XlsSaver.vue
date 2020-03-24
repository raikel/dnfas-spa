<template>

<div class="xls-saver">
    <el-form
        label-position="top"
        :disabled="loading"
        size="small"
    >
        <el-form-item label="Incluir columnas">
            <el-checkbox-group v-if="columns.length" v-model="selColumns">
                <el-checkbox 
                    v-for="(column, index) in columns" 
                    :key="index"
                    :label="column.value"
                    :checked="true"
                    class="mt-1"
                >{{ column.label }}</el-checkbox>
            </el-checkbox-group>          
        </el-form-item>

        <el-button
            v-loading="loading"
            size="small"
            class="block mt-3"
            icon="el-icon-download" 
            @click="onDownload"
        >
            Descargar
        </el-button>
    </el-form>
</div>

</template>

<script>
export default {
    name: 'XlsSaver',
    
    props: {
        columns: {
            type: Array,
            default: () => []
        },
        store: {
            type: String,
            required: true
        }
    },

    data() {
        return {
            loading: false,
            selColumns: []
        };
    },

    methods: {        
        onDownload() {
            this.loading = true;
            this.$store.dispatch(`${this.store}/fetchFile`, {
                columns: this.selColumns
            }).finally(() => {
                this.loading = false;
            });
        }
    }
};
</script>

<style lang="scss">
    .xls-saver {
        .el-checkbox {
            display: block;
            width: 100%;

        }
    }
</style>
