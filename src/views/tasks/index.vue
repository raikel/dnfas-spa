<template>
    <div class="tasks-index">

        <div class="main mr-4">
            <tasks-list
                :auto-update="autoUpdate"       
            ></tasks-list>
        </div>

        <div class="control-panel">

            <div class="action-bar mb-3">
                <tool-button
                    class="mx-1"
                    tooltip="Actualizar en tiempo real" 
                    icon="el-icon-timer"
                    :active="autoUpdate"
                    @click="autoUpdate = !autoUpdate"
                ></tool-button>

                <tool-button
                    class="mx-1"
                    tooltip="Añadir nueva tarea" 
                    icon="el-icon-plus"
                    @click="onCreateTask"
                ></tool-button>
            </div>

            <el-card>
                <tasks-filter>                
                </tasks-filter>
            </el-card>
        </div>

        <el-dialog
            title="Nueva Tarea"
            :visible.sync="showEditorDialog"
            width="450px"
            center
        >
            <task-editor
                :task-id="editTaskId"
                @confirm="onTaskEditorConfirm"
                @cancel="onTaskEditorCancel"
            ></task-editor>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ToolButton from '@/components/ToolButton';
import { taskModel } from '@/store/modules/tasks/models';
import TasksList from './components/TasksList';
import TasksFilter from './components/TasksFilter';
import TaskEditor from './components/TaskEditor';

const editTaskId = 'newId';

export default {
    name: 'TasksIndex',

    components: {
        TasksList,
        TasksFilter,
        TaskEditor,
        ToolButton
    },

    data() {
        return {
            editTaskId: editTaskId,            
            showEditorDialog: false,
            autoUpdate: false
        };
    },

    computed: {
        ...mapGetters({
            tasks: 'tasks/sortedItems'
        })
    },

    created() {
        this.$store.dispatch('tasks/fetchItems');
    },

    methods: {

        onCreateTask() {
            var task = this.$store.state.tasks.items[this.editTaskId];
            if (!task) {
                const task = taskModel.create();
                task.id = this.editTaskId;
                this.$store.dispatch('tasks/createItem', {
                    item: task,
                    persist: false
                }).then(() => {
                    this.showEditorDialog = true;
                });
            } else {
                this.showEditorDialog = true;
            }          
        },

        onTaskEditorConfirm() {
            this.showEditorDialog = false;
            this.clearTask();
            this.$store.dispatch('tasks/fetchItems');
        },

        clearTask() {
            const task = taskModel.create();
            task.id = this.editTaskId;
            this.$store.dispatch('tasks/updateItem', {
                item: task,
                persist: false
            });
        },

        onTaskEditorCancel() {
            this.showEditorDialog = false;
        }
    }
};
</script>

<style lang="scss">

.tasks-index {
    display: flex;
    align-items: flex-start;

    .control-panel {
        width: 300px;
        flex-shrink: 0;
    }

    .action-bar {
        display: flex;
        flex-flow: row;
        justify-content: center;
        align-items: flex-start;
    }

    .main {
        flex-grow: 1;
    }
}

</style>
