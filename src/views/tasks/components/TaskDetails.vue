<template>
    <div v-if="task" class="task-details">
        <info-list :items="infoItems">            
        </info-list>
    </div>
</template>

<script>
import InfoList from '@/components/InfoList';
import { typeOptions, statusOptions } from './data';
import { taskModel } from '@/store/modules/tasks/models';
import filters from '@/filters';

export default {
    name: 'TaskDetails',

    components: {
        InfoList
    },
    
    props: {
        taskId: {
            type: [Number, String],
            required: true
        }
    },

    data() {
        return { 
        };
    },

    computed: {        
        task() {
            this.$store.dispatch('tasks/getItem', this.taskId);
            return this.$store.state.tasks.items[this.taskId];
        },
        infoItems() {
            const inf = this.task;

            const data = [{
                name: 'Nombre',
                value: inf.name
            }, {
                name: 'Tipo de tarea',
                value: typeOptions[inf.taskType].label
            }, {
                name: 'Estado',
                value: statusOptions[inf.status].label
            }, {
                name: 'Creación',
                value: filters.dateTimeFilter(inf.createdAt)
            }, {
                name: 'Actualización',
                value: filters.dateTimeFilter(inf.updatedAt)
            }, {
                name: 'Inicio de ejecución',
                value: filters.dateTimeFilter(inf.startedAt)
            }, {
                name: 'Fin de ejecución',
                value: filters.dateTimeFilter(inf.finishedAt),
                divider: true
            }];

            let data_ = [];
            switch (inf.taskType) {
                case taskModel.TYPE_FACE_CLUSTERING:
                    data_ = this.fclTaskInfo();
                    break;            
                default:
                    break;
            }

            return data.concat(data_);
        }
    }, 

    methods: {
        fclTaskInfo() {
            const inf = this.task.info;

            return [{
                name: 'Número de rostros',
                value: inf.facesCount || '' 
            }, {
                name: 'Tiempo de procesamiento',
                value: inf.processingTime ? 
                    filters.timeDurationFilter(inf.processingTime) : ''
            }];
        }
    }
};
</script>

<style lang="scss">
</style>
