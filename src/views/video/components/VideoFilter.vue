<template>
    <div class="video-filter">
        <h2 class="pb-2 mb-4">Filtrar resultados</h2>
        <el-form
            label-position="top"
            :disabled="inProgress"
        >

            <el-form-item label="Fecha y hora de creación (mínima)">
                <el-date-picker
                    v-model="filter['min_timestamp']"
                    type="datetime"
                    placeholder="Desde"
                    @change="onParamChange"
                ></el-date-picker>
            </el-form-item>

            <el-form-item label="Fecha y hora de creación (máxima)">
                <el-date-picker
                    v-model="filter['max_timestamp']"
                    type="datetime"
                    placeholder="Hasta"
                    @change="onParamChange"
                ></el-date-picker>
            </el-form-item>

            <el-form-item label="Duración (minutos)" class="range">
                <el-input-number 
                    v-model="filter['min_duration']"
                    placeholder="Mínima" 
                    :controls="false"
                    :min="0" 
                    :max="1000000"
                    @change="onParamChange"           
                ></el-input-number>
                <span class="range-separator">—</span>
                <el-input-number 
                    v-model="filter['max_duration']"
                    placeholder="Máxima" 
                    :controls="false"
                    :min="0" 
                    :max="1000000"
                    @change="onParamChange"               
                ></el-input-number>
            </el-form-item>

            <el-form-item 
                class="switch" 
                label="Con tareas en ejecución"
            >
                <el-switch
                    v-model="filter['tasks_running']"
                    @change="onParamChange"
                ></el-switch>
            </el-form-item>

            <el-button
                type="info"
                icon="el-icon-refresh"
                class="block mt-3"
                :disabled="inProgress"
                @click="onClearClick"             
            >
                Limpiar filtro
            </el-button>

        </el-form>
    </div>
</template>

<script>

export default {
    name: 'VideoFilter',
    data() {
        return {
            filter: Object.assign({}, this.$store.state.videos.filter), 
            inProgress: false
        }
    },

    methods: {
        onClearClick() {
            this.$store.dispatch('videos/resetFilter');
            this.filter = Object.assign({}, this.$store.state.videos.filter);
            this.$store.dispatch(
                'videos/fetchItems'
            );
        },
        onParamChange() {
            const filter = Object.assign({}, this.filter);

            filter['min_timestamp'] = filter['min_timestamp'] ? 
                filter['min_timestamp'].toISOString() : undefined;
            filter['max_timestamp'] = filter['max_timestamp'] ? 
                filter['max_timestamp'].toISOString() : undefined;
            filter['min_duration'] = filter['min_duration'] ? 
                filter['min_duration'] * 60 : undefined;
            filter['max_duration'] = filter['max_duration'] ? 
                filter['max_duration'] * 60 : undefined;

            this.$store.dispatch(
                'videos/changeFilterParam', 
                filter
            );
            this.$store.dispatch(
                'videos/fetchItems'
            );
        }
    }
};
</script>

<style lang="scss">

.video-filter {
    h2 {
        border-bottom: 2px solid #43a047;
    }
    .range .el-form-item__content {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
    .range-separator {
        padding: 0 4px;
    }
    .el-button {
        width: 100%;
    }
}

</style>
