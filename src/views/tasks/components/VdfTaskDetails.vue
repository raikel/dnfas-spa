<template>
    <div v-if="task" class="vdf-task-details">        

        <div class="main">
            <subjects-list
                :auto-update="autoUpdate"
            ></subjects-list>
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
                    tooltip="Editar tarea" 
                    icon="el-icon-edit"
                    @click="showEditorDialog = true"
                ></tool-button>

                <tool-button
                    class="mx-1"
                    tooltip="Elimimar cámara" 
                    icon="el-icon-delete"
                    @click="showDeleteDialog = true"
                ></tool-button>
            </div>

            <task-control :task-id="taskId" class="mb-2"></task-control>

            <el-card>
                <subjects-filter :params="{tasks: [taskId]}">                
                </subjects-filter>
            </el-card>
        </div>

        <el-dialog
            title="Editar Tarea"
            :visible.sync="showEditorDialog"
            width="450px"
            center
        >
            <task-editor
                :task-id="taskId"
                :edit="true"
                @confirm="onTaskEditorConfirm"
                @cancel="onTaskEditorCancel"
            ></task-editor>
        </el-dialog>

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
                <el-button type="primary" @click="onConfirmDelete">
                    Confirmar
                </el-button>
            </span>
        </el-dialog> 
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ToolButton from '@/components/ToolButton';
import SubjectsList from '../../subjects/components/SubjectsList';
import SubjectsFilter from '../../subjects/components/SubjectsFilter';
import TaskEditor from './TaskEditor';
import TaskControl from './TaskControl';

export default {
    name: 'VdfTaskDetails',

    components: {
        SubjectsList,
        SubjectsFilter,
        TaskEditor,
        TaskControl,
        ToolButton
    },
    
    props: {
        taskId: {
            type: [Number, String],
            required: true
        }
    },

    data() {
        return { 
            showEditorDialog: false,
            showDeleteDialog: false,
            autoUpdate: false
        };
    },

    computed: {
        ...mapGetters({
            subjects: 'subjects/sortedItems'
        }),
        
        task() {
            this.$store.dispatch('tasks/getItem', this.taskId);
            return this.$store.state.tasks.items[this.taskId];
        }
    },

    methods: {

        onTaskEditorConfirm() {
            this.showEditorDialog = false;
        },

        onTaskEditorCancel() {
            this.showEditorDialog = false;
        },

        onConfirmDelete() {
            this.$store.dispatch(
                'tasks/destroyItem', this.taskId
            ).then(() => {
                this.$router.push({ name: 'TasksIndex' });
            });
        }
    }
};
</script>

<style lang="scss">

.vdf-task-details {
    display: flex;
    align-items: flex-start;

    .control-panel {
        width: 300px;
        flex-basis: 300px;
        flex-shrink: 0;
        margin-left: 16px;
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
    
    .el-dialog {
        margin-bottom: 32px;
    } 
}

</style>
