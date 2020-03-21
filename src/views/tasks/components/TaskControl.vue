<template>

<div v-if="task" class="task-control flex-row">
    <tool-button
        v-if="!isRunning && !isPaused"
        class="mr-1"
        tooltip="Iniciar ejecución" 
        icon="el-icon-video-play"
        @click="onControl('start')"
    ></tool-button>

    <tool-button
        v-else-if="isRunning"
        class="mr-1"
        tooltip="Pausar ejecución" 
        icon="el-icon-video-pause"
        @click="onControl('pause')"
    ></tool-button>

    <tool-button
        v-else-if="isPaused"
        class="mr-1"
        tooltip="Reanudar ejecución" 
        icon="el-icon-video-play"
        @click="onControl('resume')"
    ></tool-button>

    <tool-button
        tooltip="Detener ejecución" 
        icon="el-icon-switch-button"
        :disabled="!isRunning && !isPaused"
        @click="onControl('stop')"
    ></tool-button>           
</div>

</template>

<script>

import { taskModel } from '@/store/modules/tasks/models';
import ToolButton from '@/components/ToolButton';

export default {
    name: 'TaskControl',

    components: {
        ToolButton
    },

    props: {
        taskId: {
            type: [Number, String],
            required: true
        }
    },

    data: function() {
        return {
        };
    },

    computed: {

        task() {
            this.$store.dispatch('tasks/getItem', this.taskId);
            return this.$store.state.tasks.items[this.taskId];
        },

        isRunning() {
            return this.task.status === taskModel.STATUS_RUNNING;
        },

        isPaused() {
            return this.task.status === taskModel.STATUS_PAUSED;
        }
    },

    methods: {
        onControl(name) {
            this.$store.dispatch(
                `tasks/${name}`, this.taskId
            ).then(() => {
                this.$emit('change', name);
            });            
        }
    }
};
</script>

<style lang="scss">
</style>
