<template>

<div class="subjects-filter">
    <h3 class="pb-2 mb-4">Filtrar resultados</h3>
    <el-form
        label-position="top"
        :disabled="inProgress"
        size="small"
    >
        <el-form-item label="Nombre">
            <el-input
                clearable
                :value="filter.name"                    
                @input="val => onParamChange({name: val})"
            ></el-input>
        </el-form-item>

        <el-form-item label="Edad" class="range">
            <el-input-number
                placeholder="Desde" 
                :controls="false"
                :min="1" 
                :max="100"
                :value="filter.minAge"
                @input="val => onParamChange({minAge: val})"           
            ></el-input-number>
            <span class="px-2">—</span>
            <el-input-number
                placeholder="Hasta" 
                :controls="false"
                :min="1" 
                :max="100"
                :value="filter.maxAge"
                @input="val => onParamChange({maxAge: val})"               
            ></el-input-number>
        </el-form-item>

        <el-form-item label="Fecha y hora mínima">
            <el-date-picker
                type="datetime"
                placeholder="Desde"
                :value="filter.minTimestamp"
                @input="val => onParamChange({minTimestamp: val})"  
            ></el-date-picker>
        </el-form-item>

        <el-form-item label="Fecha y hora máxima">
            <el-date-picker
                type="datetime"
                placeholder="Hasta"
                :value="filter.maxTimestamp"
                @input="val => onParamChange({maxTimestamp: val})"
            ></el-date-picker>
        </el-form-item>

        <el-form-item label="Tarea">

            <el-select
                v-model="tasks"
                multiple
                filterable
                remote
                clearable
                placeholder="Selecciona una tarea"                              
                :remote-method="queryTasks"
                :loading="querying"
                :automatic-dropdown="false"
            >
                <el-option
                    v-for="choice in tasksChoices"
                    :key="choice.id"
                    :label="choice.name"
                    :value="choice.id"
                >
                    <span v-html="choice.label"></span>
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item 
            label="Sexo"
        >
            <el-select
                clearable
                :value="filter.sex"
                @change="val => onParamChange({sex: val})"
            >
                <el-option
                    v-for="(sex, index) in sexOptions"
                    :key="index"
                    :label="sex.label"
                    :value="sex.value"
                ></el-option>
            </el-select>
        </el-form-item>

        <el-form-item 
            label="Color de piel" 
            prop="skin"
        >
            <el-select
                clearable
                :value="filter.skin"
                @change="val => onParamChange({skin: val})"
            >
                <el-option
                    v-for="(skin, index) in skinOptions"
                    :key="index"
                    :label="skin.label"
                    :value="skin.value"
                ></el-option>
            </el-select>
        </el-form-item>

        <el-button
            v-if="clearButton"
            type="info"
            icon="el-icon-refresh"
            class="block mt-3"
            :disabled="inProgress"
            @click="onClearClick"             
        >
            Limpiar
        </el-button>
    </el-form>
</div>

</template>

<script>

import { subjectModel } from '@/store/modules/subjects/models';
import { tasksApi } from '@/store/modules/tasks';

const SEX_OPTIONS = [{
    label: 'Hombre',
    value: subjectModel.SEX_MAN
}, {
    label: 'Mujer',
    value: subjectModel.SEX_WOMAN
}];

const SKIN_OPTIONS = [{
    label: 'Blanca',
    value: subjectModel.SKIN_WHITE
}, {
    label: 'Negra',
    value: subjectModel.SKIN_BLACK
}, {
    label: 'Morena',
    value: subjectModel.SKIN_BROWN
}];

const queryMinLength = 3;

export default {
    name: 'SubjectFilter',

    props: {
        clearButton: {
            type: Boolean,
            default: true
        },
        params: {
            type: Object,
            default: () => {}
        }
    },

    data() {
        return {
            inProgress: false,
            sexOptions: SEX_OPTIONS,
            skinOptions: SKIN_OPTIONS,
            querying: false,
            tasksChoices: []
        };
    },

    computed: {
        filter() {
            return this.$store.state.subjects.filter;
        },

        tasks: {
            get() {         
                return this.filter.tasks;
            },
            set(value) {
                this.onParamChange({tasks: value});              
            }      
        }
    },

    methods: {

        update() {
            this.$store.dispatch('subjects/fetchItems', this.params);
            this.$emit('change');
        },

        onParamChange(data) {
            this.$store.dispatch('subjects/setFilter', data);
            this.update();
        },

        onClearClick() {
            this.$store.dispatch('subjects/resetFilter');
            this.update();
        },
        
        queryTasks(query) {
            this.tasksChoices = [];
            if (query && query.length >= queryMinLength && !this.querying) {                
                this.querying = true;                
                tasksApi.fetch({
                    name: query, 
                    fields: 'id,name'
                }).then(({ data }) => {
                    const results = data.results ? data.results : [];
                    const re = new RegExp(query, 'gi');
                    const queryBold = '<b>' + query + '</b>';
                    this.tasksChoices = results.map(task => {
                        return {
                            id: task.id,
                            name: task.name,
                            label: task.name.replace(re, queryBold)
                        };
                    });
                }).catch(error => {
                    this.$log.error(error);                   
                }).finally(() => {
                    this.querying = false;
                });                
            }
        }
    }
};
</script>

<style lang="scss">

.subjects-filter {
    h3 {
        border-bottom: 1.3px solid #43a047;
    }
    .range .el-form-item__content {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
}

</style>
