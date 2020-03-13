<template>
    <div class="subjects-index">        

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
                    tooltip="Añadir nuevo registro" 
                    icon="el-icon-user-solid"
                    @click="onCreateSubject"
                ></tool-button>

                <tool-button
                    class="mx-1"
                    tooltip="Crear segmento de reconocimiento" 
                    icon="el-icon-c-scale-to-original"
                    @click="showSegmentDialog = true"
                ></tool-button> 
            </div>

            <el-card>
                <subjects-filter>                
                </subjects-filter>
            </el-card>
        </div>

        <el-dialog
            title="Nueva Persona"
            :visible.sync="showEditorDialog"
            width="480px"
            center
        >
            <subject-editor 
                :subject-id="createSubjectId"
                @confirm="onSubjectEditorConfirm"
                @cancel="showEditorDialog = false"
            ></subject-editor>
        </el-dialog>

        <el-dialog
            title="Nuevo Segmento"
            :visible.sync="showSegmentDialog"
            width="400px"
            center
            top="32px"
        >
            <segment-editor
                @confirm="showSegmentDialog = false"
                @cancel="showSegmentDialog = false"
            ></segment-editor>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ToolButton from '@/components/ToolButton';
import { subjectModel } from '@/store/modules/subjects/models';
import SubjectsList from './components/SubjectsList';
import SubjectsFilter from './components/SubjectsFilter';
import SubjectEditor from './components/SubjectEditor';
import SegmentEditor from './components/SegmentEditor';

const CREATE_SUBJECT_ID = 'newId';

export default {
    name: 'SubjectsIndex',

    components: {
        SubjectsList,
        SubjectsFilter,
        SubjectEditor,
        SegmentEditor,
        ToolButton
    },

    data() {
        return {
            createSubjectId: CREATE_SUBJECT_ID,
            showEditorDialog: false,
            showSegmentDialog: false,
            autoUpdate: false
        };
    },

    computed: {
        ...mapGetters({
            subjects: 'subjects/sortedItems'
        })
    },

    methods: {

        onCreateSubject() {
            var subject = this.$store.state.subjects.items[CREATE_SUBJECT_ID];
            if (!subject) {
                const subject = subjectModel.create();
                subject.id = CREATE_SUBJECT_ID;
                this.$store.dispatch('subjects/createItem', {
                    item: subject,
                    persist: false
                }).then(() => {
                    this.showEditorDialog = true;
                });
            } else {
                this.showEditorDialog = true;
            }          
        },

        onSubjectEditorConfirm() {
            this.showEditorDialog = false;
            this.clearSubject();
            this.$store.dispatch('subjects/fetchItems');
        },

        clearSubject() {
            const subject = subjectModel.create();
            subject.id = CREATE_SUBJECT_ID;
            this.$store.dispatch('subjects/updateItem', {
                item: subject,
                persist: false
            });
        }
    }
};
</script>

<style lang="scss">

.subjects-index {
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
