<template>

<div v-if="task" class="task-control">
    <el-card>
        <div class="text-w7 text-lg mb-3">{{ task.name }}</div>

        <div class="mb-2">
            <div class="text-w3 text-sm mb-1">
                Creada el <span class="text-w4 pl-1">
                    {{ task.createdAt | dateTimeFilter }}
                </span>
            </div>
            <div class="status" :style="{background: taskData.color}">
                {{ taskData.status }}
            </div>
        </div>

        <div class="flex-row jb ac">
            <el-progress 
                :percentage="progress.value" 
                :class="progress.class"
                :show-text="false"
            ></el-progress>

            <div class="controls ml-2">
                <el-tooltip
                    v-if="isRunning"
                    effect="dark" 
                    content="Pausar ejecución" 
                    placement="left"
                    transition="el-opacity-transition"
                >
                    <el-button                    
                        icon="el-icon-video-pause"
                        :disabled="disableControls"
                        @click.stop="onPauseClick"
                    ></el-button>
                </el-tooltip>

                <el-tooltip
                    v-else
                    effect="dark" 
                    content="Reanudar ejecución" 
                    placement="left"
                >
                    <el-button                    
                        icon="el-icon-video-play"
                        :disabled="disableControls"
                        @click.stop="onResumeClick"
                    ></el-button>
                </el-tooltip>

                <el-tooltip
                    effect="dark" 
                    content="Detener ejecución" 
                    placement="left"
                    transition="el-opacity-transition"
                >
                    <el-button 
                        icon="el-icon-switch-button"
                        :disabled="disableControls"
                        @click.stop="onStopClick"
                    ></el-button>  
                </el-tooltip>
            </div>
        </div>
    </el-card>               
</div>

</template>

<script>

import { taskModel } from '@/store/modules/tasks/models';
import { typeOptions, statusOptions } from './data';

export default {
    name: 'TaskCard',

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

        linkRoute() {
            return {
                name: typeOptions[this.task.taskType].route, 
                params: { taskId: this.taskId }
            };
        },

        taskData() {
            const typeOption = typeOptions[this.task.taskType];
            const statusOption = statusOptions[this.task.status];
            return {
                type: typeOption.label,
                icon: typeOption.icon,
                status: statusOption.label,
                color: statusOption.color
            };
        },

        isRunning() {
            return this.task.status === taskModel.STATUS_RUNNING;
        },

        isActive() {
            return (
                this.task.status === taskModel.STATUS_RUNNING ||
                this.task.status === taskModel.STATUS_PAUSED
            );
        },

        disableControls() {
            return !this.isActive;
        },

        progress() {
            return {
                value: this.task.progress < 0 ? 0 : this.task.progress,
                class: {
                    'indeterminate': this.task.progress < 0 && this.isActive
                }
            };
        }
    },

    methods: {
        onPauseClick() {
            
        },
        onResumeClick() {
            
        },
        onStopClick() {
            
        }
    }
};
</script>

<style lang="scss">

.task-control {

    .status {
        font-size: 12px;
        color: #ffffff;
        border-radius: 3px;
        padding: 0 8px;
        display: inline-block;
    }

    .controls {
        .el-button {
            margin-left: 0;
            padding: 0;
            border: none;
        }
        i {
            font-size: 20px;
        }
    }

    .el-progress {
        flex-grow: 1;
    }
}
</style>
