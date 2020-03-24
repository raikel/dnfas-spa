<template>

<el-form
    v-if="config"
    ref="form"
    size="small"
    class="vdftask-config"
    label-position="top"
    :show-message="false"
    :rules="rules"
    :model="config"
    :disabled="loading"
    @validate="onValidate" 
>
    <el-form-item 
        label="Tipo de Video" 
        prop="videoSourceType"
    >
        <el-radio-group
            :value="config.videoSourceType"                    
            @input="val => onParamChange({videoSourceType: val})"
        >
            <el-radio-button 
                v-for="source in sourceChoices"
                :key="source.value"
                :label="source.value"
            >
                {{ source.label }}
            </el-radio-button>
        </el-radio-group>
    </el-form-item>

    <el-form-item label="Fuente de video" prop="videoSourceId">
        <query-select
            :multiple="false"
            :store="sourceStore"
            :value="config.videoSourceId"
            @change="val => onParamChange({videoSourceId: val})"
        ></query-select>
    </el-form-item>

    <el-form-item 
        label="Umbral de similitud" 
        prop="similarityThresh"
    >
        <el-slider
            :min="0"                    
            :max="0.9999"
            :step="0.01"
            :value="config.similarityThresh"                    
            @input="val => onParamChange({similarityThresh: val})"
        ></el-slider>
    </el-form-item>

    <el-form-item
        label="Tamaño mínimo de los rostros (px)" 
        prop="detectionMinHeight"
    >
        <el-input-number
            controls-position="right" 
            :min="12" 
            :max="4096"
            :step="8"
            :value="config.detectionMinHeight"                    
            @change="val => onParamChange({detectionMinHeight: val})"
        >
        </el-input-number>
    </el-form-item>

    <el-form-item 
        label="Umbral de confidencia" 
        prop="detectionMinScore"
    >
        <el-slider
            :min="0.9"                    
            :max="1.0"
            :step="0.005"
            :value="config.detectionMinScore"                    
            @input="val => onParamChange({detectionMinScore: val})"                
        ></el-slider>
    </el-form-item>

    <el-form-item
        label="Intervalo de detección (segundos)" 
        prop="videoDetectInterval"
    >
        <el-input-number
            controls-position="right" 
            :min="0" 
            :max="3600"
            :step="1"
            :value="config.videoDetectInterval"                    
            @change="val => onParamChange({videoDetectInterval: val})" 
        >
        </el-input-number>
    </el-form-item>

    <el-form-item
        label="Memoria de rostros (segundos)" 
        prop="facesTimeMemory"
    >
        <el-input-number 
            controls-position="right" 
            :min="0" 
            :max="3600"
            :step="1"
            :value="config.facesTimeMemory"                    
            @change="val => onParamChange({facesTimeMemory: val})" 
        >
        </el-input-number>
    </el-form-item>

    <el-form-item 
        label="Registrar fotogramas" 
        prop="storeFaceFrames"
        class="switch"
    >
        <el-switch
            :value="config.storeFaceFrames"                    
            @change="val => onParamChange({storeFaceFrames: val})" 
        ></el-switch>
    </el-form-item>

    <el-form-item 
        label="Registrar solo rostros frontales" 
        prop="frontalFaces"
        class="switch"
    >
        <el-switch
            :value="config.frontalFaces"                    
            @change="val => onParamChange({frontalFaces: val})" 
        ></el-switch>
    </el-form-item>

    <el-form-item
        label="Tamaño máximo de los fotogramas (px)" 
        prop="maxFrameSize"
    >
        <el-input-number
            controls-position="right" 
            :min="256" 
            :max="4096"
            :step="256"
            :value="config.maxFrameSize"                    
            @change="val => onParamChange({maxFrameSize: val})" 
        >
        </el-input-number>
    </el-form-item>
</el-form>

</template>

<script>

import QuerySelect from '@/components/QuerySelect';
import { 
    videoSourceChoices as sourceChoices, 
    videoSourceOptions as sourceOptions 
} from './data';
import { vTaskConfigModel } from '@/store/modules/tasks/models';

const rules = {
    videoSourceType: [{
        required: true,
        message: 'Por selecciona el tipo de fuente de video',
        trigger: 'blur'
    }],
    videoSourceId: [{
        required: true,
        message: 'Por selecciona una fuente de video',
        trigger: 'blur'
    }]
};

export default {
    name: 'VdfTaskConfig',

    components: {
        QuerySelect
    },

    props: {
        taskId: {
            type: [Number, String],
            required: true
        }
    },

    data() {
        return {
            sourceOptions: sourceOptions,
            sourceChoices: sourceChoices,
            loading: false,
            alert: null,
            rules: rules
        };
    },

    computed: {
        config() {
            const task = this.$store.state.tasks.items[this.taskId];
            return task ? task.config : null;
        },

        sourceStore() {
            const sourceType = this.config.videoSourceType;
            switch (sourceType) {
                case vTaskConfigModel.VIDEO_SOURCE_RECORD:
                    return 'videos';
                case vTaskConfigModel.VIDEO_SOURCE_CAMERA:
                    return 'cameras';            
                default:
                    this.$log.error(`Invalid video source "${sourceType}"`);
            }
            return '';
        }
    },

    methods: {

        onParamChange(data) {
            if (data.videoSourceType && 
                data.videoSourceType !== this.config.videoSourceType
            ) {
                this.onParamChange({videoSourceId: null});
            }
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
        }
    }
};
</script>

<style lang="scss">
</style>
