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

    <el-form-item 
        label="Fuente de video" 
        prop="videoSourceId"
    >
        <el-select
            v-model="videoSource"
            filterable
            remote
            clearable
            placeholder="Seleccione una fuente de video"                              
            :remote-method="queryVideoSource"
            :loading="querying"
            :automatic-dropdown="false"
        >
            <el-option
                v-for="source in videoSources"
                :key="source.id"
                :label="source.name"
                :value="source.id"
            >
                <span v-html="source.label"></span>
            </el-option>
        </el-select>
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

import { 
    videoSourceChoices as sourceChoices, 
    videoSourceOptions as sourceOptions 
} from './data';
import { videosApi } from '@/store/modules/videos';
import { camerasApi } from '@/store/modules/cameras';
import { vTaskConfigModel } from '@/store/modules/tasks/models';

const QUERY_MIN_LENGTH = 3;

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
            querying: false,
            alert: null,
            rules: rules,
            videoSources: []
        };
    },

    computed: {
        config() {
            const task = this.$store.state.tasks.items[this.taskId];
            return task ? task.config : null;
        },

        videoSource: {
            get() {
                return this.config.videoSourceId;
                /* if (this.config.videoSourceId) {
                    const sourceType = this.config.videoSourceType;
                    const id = this.config.videoSourceId;
                    switch (sourceType) {
                        case vTaskConfigModel.VIDEO_SOURCE_RECORD: {
                            this.$store.dispatch('videos/getItem', id);
                            const video = this.$store.state.videos.items[id];
                            if (video) {
                                return {
                                    name: video.name,
                                    label: video.name,
                                    id: video.id
                                };
                            }
                            break;
                        }
                        case vTaskConfigModel.VIDEO_SOURCE_CAMERA: {
                            this.$store.dispatch('cameras/getItem', id);
                            const camera = this.$store.state.cameras.items[id];
                            if (camera) {
                                return {
                                    name: camera.name,
                                    label: camera.name,
                                    id: camera.id
                                };
                            }
                            break;
                        }
                        default:
                            this.$log.error(`Invalid video source ${sourceType}`);
                            return null;
                    }
                }
                return null; */
            },

            set(value) {
                this.onParamChange({ videoSourceId: value });
                /* this.onParamChange({
                    videoSourceId: value ? value.id : null
                });  */             
            }      
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

        queryVideoSource(query) {
            this.videoSources = [];
            if (query && query.length >= QUERY_MIN_LENGTH && !this.querying) {                
                this.querying = true;
                const sourceType = this.config.videoSourceType;
                let api = null;
                switch (sourceType) {
                    case vTaskConfigModel.VIDEO_SOURCE_RECORD:
                        api = videosApi;
                        break;
                    case vTaskConfigModel.VIDEO_SOURCE_CAMERA:
                        api = camerasApi;
                        break;             
                    default:
                        this.$log.error(`Invalid video source ${sourceType}`);
                        this.querying = false;
                        return;
                }
                
                api.fetch({
                    name: query, 
                    fields: 'id,name'
                }).then(({ data }) => {
                    const results = data.results ? data.results : [];
                    const re = new RegExp(query, 'gi');
                    const queryBold = '<b>' + query + '</b>';
                    this.videoSources = results.map(source => {
                        return {
                            id: source.id,
                            name: source.name,
                            label: source.name.replace(re, queryBold)
                        };
                    });
                }).catch(error => {
                    this.$log.error(error);                   
                }).finally(() => {
                    this.querying = false;
                });                
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
