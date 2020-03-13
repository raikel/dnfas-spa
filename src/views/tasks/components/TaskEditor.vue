<template>

<div class="task-editor">
    <el-form
        v-if="step === 0"
        ref="step0"
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
                @change="val => onParamChange({scheduleStartAt: val})"
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
                @change="val => onParamChange({scheduleStopAt: val})"
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
        v-else-if="step === 1 && task.taskType === 'video_detect_faces'"
        ref="step1"        
        :task-id="taskId"
        @validate="validate"        
    ></vdf-task-config>

    <pga-task-config
        v-else-if="step === 1 && task.taskType === 'predict_genderage'"
        ref="step1"        
        :task-id="taskId"
        @validate="validate"
    ></pga-task-config>

    <step-buttons 
        class="mt-5"
        :step="step"
        :n-steps="nSteps"
        :disabled="loading"
        @prev="onPrevStep"
        @next="onNextStep"
        @cancel="onCancel"
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
    pgaTaskConfigModel
} from '@/store/modules/tasks/models';
import VdfTaskConfig from './VdfTaskConfig';
import PgaTaskConfig from './PgaTaskConfig';
import { typeChoices } from './data';

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
        PgaTaskConfig
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
            step: 0,
            nSteps: 2,
            loading: false,
            alert: null,
            rules: rules
        };
    },

    computed: {
        task() {
            return this.$store.state.tasks.items[this.taskId];
        }
    },

    methods: {

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
                default:
                    break;
            }
            
            this.$store.dispatch('tasks/updateItem', {
                item: { id: this.taskId, ...data }, 
                persist: false
            });
        },

        onNextStep() {
            const form = this.$refs[`step${this.step}`];
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
            }).then(() => {                
                this.loading = false;
                this.$emit('confirm');
            }).catch((error) => {                
                this.$log.error(error);
                this.loading = false;
            });
        },

        onCancel() {
            this.$emit('cancel');
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
