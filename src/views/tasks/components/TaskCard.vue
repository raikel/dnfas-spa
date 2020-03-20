<template>

<div 
    v-if="task" 
    class="task-card" 
    :class="{'focus': focus}" 
    @click="$emit('click')"
>
    <el-card>
        <div class="flex-row js as mb-2">
            <div class="task-icon mr-2">
                <svg-icon :icon-class="taskData.icon" class="">
                </svg-icon>
            </div>                    
            <div class="header">
                <div class="text-w7 text-lg title">
                    {{ task.name }}
                </div>
                <div class="text-sm text-w3">
                    {{ taskData.type }}
                </div>                    
            </div>                
        </div>

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

        <el-progress 
            :percentage="progress.value" 
            :class="progress.class"
            :show-text="false"
            class="mt-3"
        ></el-progress>
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
        },
        focus: {
            type: Boolean,
            default: false
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

        isActive() {
            return (
                this.task.status === taskModel.STATUS_RUNNING ||
                this.task.status === taskModel.STATUS_PAUSED
            );
        },

        progress() {
            return {
                value: this.task.progress < 0 ? 0 : this.task.progress,
                class: {
                    'indeterminate': this.task.progress < 0 && this.isActive
                }
            };
        }
    }
};
</script>

<style lang="scss">

.task-card {

    &:hover {
        cursor: pointer;
    }

    &.focus .el-card {
        background-color: #ecf6ed;
    }

    .task-icon {
        height: 56px;
        width: 56px;
        padding: 14px;
        border-radius: 50%;
        color: #ffffff;
        background-color: #ccc;
        display: flex;
        justify-content: center;
        align-items: center;
        .svg-icon {
            height: 100%;
            width: 100%;
        }
    }

    .header {
        flex: 1;
        min-width: 0;
    }

    .title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 1px;
        padding-right: 22px;
    }

    .status {
        font-size: 12px;
        color: #ffffff;
        border-radius: 3px;
        padding: 0 8px;
        display: inline-block;
    }

    .el-progress {
        flex-grow: 1;
    }
}
</style>
