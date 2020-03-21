<template>

<split-view class="tasks-index">
    <template v-slot:main>
        <list-header 
            class="mb-4"
            :show-count="tasks.length"
            :total-count="tasksCount"
            add-text="Nueva Tarea"
            @create="onCreateTask"
        ></list-header>

        <tasks-list
            :auto-update="autoUpdate"
            :focus-id="curTaskId"
            @update:focus-id="onTaskListChange"
        ></tasks-list>

        <el-dialog
            title="Advertencia"
            :visible.sync="showDeleteDialog"
            width="400px"
            center
        >
            <p>
                ¿Seguro deseas eliminar esta tarea de forma permanente? 
                Se eliminará cualquier dato asociado.
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDeleteDialog = false">
                    Cancelar
                </el-button>
                <el-button 
                    type="primary" 
                    :disabled="loading"
                    @click="onConfirmDelete"
                >
                    Confirmar
                </el-button>
            </span>
        </el-dialog>
    </template>

    <template v-slot:side-actions>
        <template v-if="panel === 'search'">
            <div class="text-lg text-w6">Búsqueda</div>
            <tool-button
                class="ml-1"
                tooltip="Restablecer filtro" 
                icon="el-icon-refresh"
                @click="onClearFilterClick"
            ></tool-button>
        </template>

        <template v-else-if="panel === 'details'">
            <div class="text-lg text-w6">Detalles</div>
            <div class="flex-row">
                <task-control 
                    :task-id="curTaskId" 
                    class="mr-2"
                    @change="onTaskControl"
                ></task-control>
                <tool-button
                    class="ml-1"
                    tooltip="Editar tarea" 
                    icon="el-icon-edit"
                    :disabled="!canEdit"
                    @click="onTaskEdit"
                ></tool-button>
                <tool-button
                    class="ml-1"
                    tooltip="Eliminar tarea" 
                    icon="el-icon-delete"
                    :disabled="!canEdit"
                    @click="showDeleteDialog = true"
                ></tool-button>
            </div>                    
        </template>

        <template v-else-if="panel === 'editor'">
            <div class="text-lg text-w6">Editor</div>
            <div class="flex-row">
                <tool-button
                    class="mx-1"
                    tooltip="Cancelar edición" 
                    icon="el-icon-close"
                    @click="onCancelTaskEdit"
                ></tool-button>
            </div>                    
        </template>
    </template>

    <template v-slot:side-content>
        <tasks-filter 
            v-if="panel === 'search'"
        ></tasks-filter>

        <task-details
            v-else-if="panel === 'details'"
            :task-id="curTaskId"
        ></task-details>

        <task-editor
            v-else-if="panel === 'editor'"
            :edit="curTaskId !== newTaskId" 
            :task-id="curTaskId"
            @confirm="onTaskEditorConfirm"
        ></task-editor>
    </template>
</split-view>

</template>

<script>
import { mapGetters } from 'vuex';
import ToolButton from '@/components/ToolButton';
import { taskModel } from '@/store/modules/tasks/models';
import ListHeader from '@/components/ListHeader';
import SplitView from '@/layout/components/SplitView';
import TasksList from './components/TasksList';
import TasksFilter from './components/TasksFilter';
import TaskEditor from './components/TaskEditor';
import TaskDetails from './components/TaskDetails';
import TaskControl from './components/TaskControl';

const newTaskId = 'newId';

export default {
    name: 'TasksIndex',

    components: {
        SplitView,
        TasksList,
        TasksFilter,
        ListHeader,
        TaskEditor,
        TaskDetails,
        ToolButton,
        TaskControl
    },

    data() {
        return {
            newTaskId: newTaskId,
            autoUpdate: false,
            panel: 'search',
            editNew: false, 
            curTaskId: null,
            showDeleteDialog: false,
            loading: false
        };
    },

    computed: {
        ...mapGetters({
            tasks: 'tasks/sortedItems'
        }),
        tasksCount() {
            return this.$store.state.tasks.count;
        },
        curTask() {
            if (this.curTaskId !== null) {
                this.$store.dispatch('tasks/getItem', this.curTaskId);
                return this.$store.state.tasks.items[this.curTaskId];
            }
            return null;
        },
        canEdit() {
            if (this.curTask) {
                const status = this.curTask.status;
                return (
                    status !== taskModel.STATUS_RUNNING && 
                    status !== taskModel.STATUS_PAUSED
                );
            }
            return false;
        }
    },

    created() {
        this.$store.dispatch('tasks/fetchItems');
    },

    methods: {

        onTaskControl() {
            this.$store.dispatch('tasks/fetchItems');
        },

        onTaskEdit() {
            if (this.curTaskId !== null) {
                this.panel = 'editor';
            }            
        },

        onCreateTask() {
            const task = taskModel.create();
            task.id = this.newTaskId;
            this.$store.dispatch('tasks/createItem', {
                item: task,
                persist: false
            }).then(() => {
                this.curTaskId = this.newTaskId;
                this.panel = 'editor';
            });          
        },

        onTaskEditorConfirm(taskId) {
            if (this.panel === 'editor' && this.curTaskId !== null) {
                this.curTaskId = taskId;
                this.panel = 'details';             
                this.$store.dispatch('tasks/fetchItems');
            }            
        },

        onCancelTaskEdit() {
            if (this.panel === 'editor' && this.curTaskId !== null) {                
                if (this.curTaskId === newTaskId) {
                    this.curTaskId = null;
                    this.panel = 'search';
                } else {
                    this.panel = 'details';
                } 
            }
        },

        onTaskListChange(taskId) {            
            this.panel = taskId === null ? 'search' : 'details';
            this.curTaskId = taskId;
        },

        onClearFilterClick() {
            this.$store.dispatch('tasks/resetFilter');
            this.$store.dispatch('tasks/fetchItems');
        },

        onConfirmDelete() {
            if (this.curTaskId !== null && this.panel === 'details') {
                this.loading = true;
                this.$store.dispatch(
                    'tasks/destroyItem', this.curTaskId
                ).then(() => {
                    this.loading = false;
                    this.curTaskId = null;
                    this.panel = 'search';
                    this.showDeleteDialog = false;
                    this.$store.dispatch('tasks/fetchItems');
                });
            }
        }
    }
};
</script>

<style lang="scss">
</style>
