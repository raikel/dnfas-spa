<template>

<div v-if="task" class="task-editor">
    <el-form
        v-if="showStep === 'init'"
        ref="init"
        size="small"
        label-position="top"
        :show-message="false"
        :rules="rules.step1"
        :model="task"
        :disabled="loading"
        @validate="validate"         
    >
        <el-form-item label="Nombre de la Tarea" prop="name">
            <el-input
                placeholder="Ingresa el nombre de la tarea"
                :value="task.name"                    
                @input="val => onParamChange({name: val})"                    
            ></el-input>
        </el-form-item>

        <el-form-item label="Etiquetas">
            <el-select
                multiple
                filterable
                clearable
                allow-create
                default-first-option
                placeholder="Selecciona una o varias etiquetas"
                :value="task.tags"
                @change="val => onParamChange({tags: val})"            
            >
                <el-option
                    v-for="tag in tagsChoices"
                    :key="tag.id"
                    :label="tag.name"
                    :value="tag.id"
                ></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="Tipo de Tarea" prop="taskType">
            <el-select
                :value="task.taskType"                    
                @change="val => onParamChange({taskType: val})"
            >
                <el-option
                    v-for="(type, index) in typeChoices"
                    :key="index"
                    :label="type.label"
                    :value="type.value"
                ></el-option>
            </el-select>
        </el-form-item>

        <el-form-item
            label="Programar inicio para" 
            prop="scheduleStartAt"
        >
            <el-date-picker     
                type="datetime"
                placeholder="Inmediatamente"
                :value="task.scheduleStartAt"                    
                @input="val => onParamChange({scheduleStartAt: val})"
            ></el-date-picker>
        </el-form-item>

        <el-form-item
            label="Programar terminación para" 
            prop="scheduleStopAt"
        >
            <el-date-picker        
                type="datetime"
                placeholder="Sin límite de tiempo"
                :value="task.scheduleStopAt"                    
                @input="val => onParamChange({scheduleStopAt: val})"
            ></el-date-picker>
        </el-form-item>

        <el-form-item
            label="Repetir días de la semana" 
            prop="repeatDays"
        >
            <week-days
                :value="task.repeatDays"                    
                @input="val => onParamChange({repeatDays: val})"
            ></week-days>
        </el-form-item>
    </el-form>

    <vdf-task-config
        v-else-if="showStep === 'vdf'"
        ref="vdf"        
        :task-id="taskId"
        @validate="validate"        
    ></vdf-task-config>

    <pga-task-config
        v-else-if="showStep === 'pga'"
        ref="pga"        
        :task-id="taskId"
        @validate="validate"
    ></pga-task-config>

    <fcl-task-config
        v-else-if="showStep === 'fcl'"
        ref="fcl"        
        :task-id="taskId"
        @validate="validate"
    ></fcl-task-config>

    <vhf-task-config
        v-else-if="showStep === 'vhf'"
        ref="vhf"        
        :task-id="taskId"
        @validate="validate"        
    ></vhf-task-config>

    <step-buttons 
        class="mt-5"
        :step="step"
        :n-steps="nSteps"
        :disabled="loading"
        size="small"
        @prev="onPrevStep"
        @next="onNextStep"
        @confirm="onNextStep"
    ></step-buttons>
    
</div>

</template>

<script>

import StepButtons from '@/components/StepButtons';
import WeekDays from '@/components/WeekDays';
import { 
    taskModel, 
    vdfTaskConfigModel,
    vhfTaskConfigModel,
    pgaTaskConfigModel,
    fclTaskConfigModel
} from '@/store/modules/tasks/models';
import { tagModel } from '@/store/modules/tags/models';
import VdfTaskConfig from './VdfTaskConfig';
import VhfTaskConfig from './VhfTaskConfig';
import PgaTaskConfig from './PgaTaskConfig';
import FclTaskConfig from './FclTaskConfig';
import { typeChoices, typeOptions } from './data';

const rules = {
    step1: {
        name: [{
            required: true,
            message: 'Por favor ingresa el nombre de la tarea',
            trigger: 'blur'
        }],
        taskType: [{
            required: true,
            message: 'Por selecciona el tipo de tarea',
            trigger: 'blur'
        }]
    }
};

export default {
    name: 'TaskEditor',

    components: {
        StepButtons,
        WeekDays,
        VdfTaskConfig,
        VhfTaskConfig,
        PgaTaskConfig,
        FclTaskConfig
    },

    props: {
        taskId: {
            type: [Number, String],
            required: true
        },
        edit: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            typeChoices: typeChoices,
            tagsChoices: [],
            step: 0,
            loading: false,
            alert: null,
            rules: rules
        };
    },

    computed: {
        task() {
            this.$store.dispatch('tasks/getItem', this.taskId);
            return this.$store.state.tasks.items[this.taskId];
        },
        nSteps() {
            const taskType = this.task.taskType;
            if (taskType) {
                return typeOptions[taskType].nsteps;
            } else {
                return 0;
            }            
        },
        showStep() {
            const taskType = this.task.taskType;
            if (this.step === 0) {
                return 'init';
            } else if (this.step === 1 && (
                taskType === taskModel.TYPE_VIDEO_DETECT_FACES || 
                taskType === taskModel.TYPE_VIDEO_HUNT_FACES 
            )) {
                return 'vdf';
            } else if (this.step === 1 && 
                taskType === taskModel.TYPE_PREDICT_GENDERAGE
            ) {
                return 'pga';
            } else if (this.step === 1 && 
                taskType === taskModel.TYPE_FACE_CLUSTERING
            ) {
                return 'fcl';
            } else if (this.step === 2 && 
                taskType === taskModel.TYPE_VIDEO_HUNT_FACES
            ) {
                return 'vhf';
            }
            return null;
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
            switch (data.taskType) {
                case taskModel.TYPE_VIDEO_DETECT_FACES:
                    this.$store.dispatch('tasks/updateItem', {
                        item: { 
                            id: this.taskId, 
                            config: vdfTaskConfigModel.create() 
                        }, 
                        persist: false
                    });
                    break;
                case taskModel.TYPE_VIDEO_HUNT_FACES:
                    this.$store.dispatch('tasks/updateItem', {
                        item: { 
                            id: this.taskId, 
                            config: vhfTaskConfigModel.create() 
                        }, 
                        persist: false
                    });
                    break;
                case taskModel.TYPE_PREDICT_GENDERAGE:
                    this.$store.dispatch('tasks/updateItem', {
                        item: { 
                            id: this.taskId, 
                            config: pgaTaskConfigModel.create() 
                        }, 
                        persist: false
                    });
                    break;
                case taskModel.TYPE_FACE_CLUSTERING:
                    this.$store.dispatch('tasks/updateItem', {
                        item: { 
                            id: this.taskId, 
                            config: fclTaskConfigModel.create() 
                        }, 
                        persist: false
                    });
                    break;     
                default:
                    break;
            }

            if (data.tags) {                
                const tags = [];
                data.tags.forEach(tag => {
                    if (!this.$store.state.tags.items[tag]) {
                        this.$store.dispatch('tags/createItem', {
                            item: { 
                                name: tag, 
                                model: tagModel.MODEL_TASK
                            }, 
                            persist: true
                        }).then(tag => {
                            this.getTags();
                            this.$store.dispatch('tasks/updateItem', {
                                item: { 
                                    id: this.taskId, 
                                    tags: [...this.task.tags, tag.id]
                                }, 
                                persist: false
                            });
                        });
                    } else {
                        tags.push(tag);
                    }
                });
                data.tags = tags;
            }
            
            this.$store.dispatch('tasks/updateItem', {
                item: { id: this.taskId, ...data }, 
                persist: false
            });
        },

        onNextStep() {
            const form = this.$refs[this.showStep];
            const nextStep = Math.min(this.nSteps - 1, this.step + 1);
            if (form) {
                form.validate((valid) => {
                    if (valid) {                        
                        if (this.step === this.nSteps - 1) {
                            this.submit();
                        } else {
                            this.step = nextStep;
                        }
                    }
                }); 
            } else {
                this.step = nextStep;
            }
        },

        onPrevStep() {
            this.step = Math.max(0, this.step - 1);
        },

        submit() {
            const action = this.edit ? 
                'tasks/updateItem' : 'tasks/createItem';
            this.$store.dispatch(action, {
                item: this.task,
                persist: true
            }).then(task => {                
                this.loading = false;
                this.$emit('confirm', task.id);
            }).catch((error) => {                
                this.$log.error(error);
                this.loading = false;
            });
        },

        validate(prop, valid, errorMsg) {
            if (!valid) {
                this.alert = {
                    type: 'error',
                    text: errorMsg
                };
            } else {
                this.alert = null;
            }
        }
    }
};
</script>

<style lang="scss">

.task-editor {
    .labeled-switch {
        display: flex;
        justify-content: space-between;
    }
    .buttons {
        display: flex;
        justify-content: flex-end;
    }
}

</style>
