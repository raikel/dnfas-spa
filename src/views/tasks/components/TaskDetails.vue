<template>
    <div v-if="task" class="task-details">
        <info-list :items="infoItems">            
        </info-list>
    </div>
</template>

<script>
import InfoList from '@/components/InfoList';
import { typeOptions, statusOptions } from './data';
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
            const info = [{
                name: 'Nombre',
                value: this.task.name
            }, {
                name: 'Tipo de tarea',
                value: typeOptions[this.task.taskType].label
            }, {
                name: 'Estado',
                value: statusOptions[this.task.status].label
            }, {
                name: 'Creada',
                value: filters.dateTimeFilter(this.task.createdAt)
            }, {
                name: 'Actualizada',
                value: filters.dateTimeFilter(this.task.updatedAt)
            }, {
                name: 'Inicio de ejecución',
                value: filters.dateTimeFilter(this.task.startedAt)
            }];

            return info;
        }
    }
};
</script>

<style lang="scss">
</style>
