<template>

<el-form
    v-if="config"
    ref="form"
    size="small"
    class="fcltask-config"
    label-position="top"
    :show-message="false"
    :rules="rules"
    :model="config"
    :disabled="loading"
    @validate="onValidate" 
>

    <el-form-item label="Etiquetas de tareas de entrada">
        <el-select
            multiple
            filterable
            clearable
            default-first-option
            placeholder="Selecciona una o varias etiquetas"
            :value="config.filterTasksTags"
            @change="val => onParamChange({filterTasksTags: val})"            
        >
            <el-option
                v-for="tag in tagsChoices"
                :key="tag.id"
                :label="tag.name"
                :value="tag.id"
            ></el-option>
        </el-select>
    </el-form-item>

    <el-form-item 
        label="Umbral de similitud" 
        prop="similarityThr"
    >
        <el-slider
            :min="0"                    
            :max="1"
            :step="0.01"
            :value="config.similarityThr"                    
            @input="val => onParamChange({similarityThr: val})"
        ></el-slider>
    </el-form-item>

    <el-form-item
        label="Memoria de seguimiento"
    >
        <el-input-number
            controls-position="right" 
            :min="0"
            :step="60"
            :value="config.memorySeconds"                    
            @change="val => onParamChange({memorySeconds: val})"
        >
        </el-input-number>
    </el-form-item>

    <el-form-item 
        label="Ventana de tiempo relativa"
        class="switch"
    >
        <el-switch
            v-model="relativeTime"                    
            @change="onRelativeTimeChange" 
        ></el-switch>
    </el-form-item>

    <el-form-item
        v-if="relativeTime"
        label="Ventana de tiempo"
        class="range"
    >
        <el-input-number
            placeholder="Semanas"
            :controls="false" 
            :min="0"
            :value="config.filterBackWeeks"                  
            @change="val => onParamChange({filterBackWeeks: val})"
        ></el-input-number>
        <el-input-number
            class="mx-1"
            placeholder="Días"
            :controls="false" 
            :min="0"
            :value="config.filterBackDays"                  
            @change="val => onParamChange({filterBackDays: val})"
        ></el-input-number>
        <el-input-number
            placeholder="Horas"
            :controls="false" 
            :min="0"
            :value="config.filterBackHours"                  
            @change="val => onParamChange({filterBackHours: val})"
        ></el-input-number>
    </el-form-item>

    <template v-else>
        <el-form-item
            label="Rango de fechas"
            class="range"
        >
            <el-date-picker
                type="date"
                placeholder="Desde"
                :value="config.filterMinDate"                    
                @input="val => onParamChange({filterMinDate: val})"
            ></el-date-picker>
            <span class="px-2">—</span>
            <el-date-picker
                arrow-control
                placeholder="Hasta"
                :value="config.filterMaxDate"                    
                @input="val => onParamChange({filterMaxDate: val})"
            ></el-date-picker>
        </el-form-item>

        <el-form-item
            label="Rango de tiempo"
            class="range"
        >
            <el-time-picker
                arrow-control
                placeholder="Desde"
                :value="config.filterMinTime"                    
                @input="val => onParamChange({filterMinTime: val})"
            ></el-time-picker>
            <span class="px-2">—</span>
            <el-time-picker
                arrow-control
                placeholder="Hasta"
                :value="config.filterMaxTime"                    
                @input="val => onParamChange({filterMaxTime: val})"
            ></el-time-picker>
        </el-form-item>
    </template>
    
</el-form>

</template>

<script>

import { tagModel } from '@/store/modules/tags/models';

const rules = {
};

export default {
    name: 'FclTaskConfig',

    props: {
        taskId: {
            type: [Number, String],
            required: true
        }
    },

    data() {
        return {
            loading: false,
            alert: null,
            rules: rules,
            relativeTime: true,
            tagsChoices: []
        };
    },

    computed: {
        config() {
            const task = this.$store.state.tasks.items[this.taskId];
            return task ? task.config : null;
        }
    },

    created() {
        this.getTags();
    },

    methods: {

        getTags() {
            this.$store.dispatch(
                'tags/fetchItems', {model: tagModel.MODEL_TASK}
            ).then(tags => {
                this.tagsChoices = tags;
            });
        },

        onParamChange(data) {
            const config = { ... this.config, ...data};
            this.$store.dispatch('tasks/updateItem', {
                item: { id: this.taskId, config: config }, 
                persist: false
            });
        },

        onValidate(prop, valid, errorMsg) {
            if (!valid) {
                this.alert = {
                    type: 'error',
                    text: errorMsg
                };
            } else {
                this.alert = null;
            }
        },

        validate(callback) {
            return this.$refs.form.validate(callback);
        },

        onRelativeTimeChange() {
            this.config.filterBackWeeks = undefined;
            this.config.filterBackDays = undefined;
            this.config.filterBackHours = undefined;
            this.config.filterMinDate = null;
            this.config.filterMaxDate = null;
            this.config.filterMinTime = null;
            this.config.filterMaxTime = null;
        }
    }
};
</script>

<style lang="scss">
</style>
