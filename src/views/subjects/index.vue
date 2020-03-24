<template>

<split-view class="subjects-index">
    <template v-slot:main>
        <template v-if="panel === 'search'">
            <list-header 
                class="mb-4"
                :show-count="subjects.length"
                :total-count="subjectsCount"
                add-text="Nuevo Sujeto"
                @create="onCreateSubject"
            ></list-header>

            <subjects-list 
                :auto-update="autoUpdate"
                :focus-id="curSubjectId"
                @update:focus-id="onSubjectListChange"
            ></subjects-list>
        </template>

        <template v-else-if="panel === 'details'">
            <subject-faces
                :subject-id="curSubjectId"
            ></subject-faces>
        </template>

        <el-dialog
            title="Advertencia"
            :visible.sync="showDeleteDialog"
            width="400px"
            center
        >
            <p>
                ¿Seguro deseas eliminar este registro de forma permanente? 
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
                <tool-button
                    class="ml-1"
                    tooltip="Editar sujeto" 
                    icon="el-icon-edit"
                    @click="onSubjectEdit"
                ></tool-button>
                <tool-button
                    class="ml-1"
                    tooltip="Eliminar sujeto" 
                    icon="el-icon-delete"
                    @click="showDeleteDialog = true"
                ></tool-button>
                <tool-button
                    class="ml-1"
                    tooltip="Volver al listado" 
                    icon="el-icon-close"
                    @click="onCloseDetails"
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
                    @click="onCancelSubjectEdit"
                ></tool-button>
            </div>                    
        </template>
    </template>

    <template v-slot:side-content>
        <subjects-filter 
            v-if="panel === 'search'"
        ></subjects-filter>

        <subject-details
            v-else-if="panel === 'details'"
            :subject-id="curSubjectId"
        ></subject-details>

        <subject-editor
            v-else-if="panel === 'editor'"
            :edit="curSubjectId !== newSubjectId" 
            :subject-id="curSubjectId"
            @confirm="onSubjectEditorConfirm"
        ></subject-editor>
    </template>
</split-view>

</template>

<script>
import { mapGetters } from 'vuex';
import ToolButton from '@/components/ToolButton';
import { subjectModel } from '@/store/modules/subjects/models';
import ListHeader from '@/components/ListHeader';
import SplitView from '@/layout/components/SplitView';
import SubjectsList from './components/SubjectsList';
import SubjectsFilter from './components/SubjectsFilter';
import SubjectEditor from './components/SubjectEditor';
import SubjectDetails from './components/SubjectDetails';
import SubjectFaces from './components/SubjectFaces';

const newSubjectId = 'newId';

export default {
    name: 'SubjectsIndex',

    components: {
        SplitView,
        SubjectsList,
        SubjectsFilter,
        ListHeader,
        SubjectEditor,
        SubjectDetails,
        ToolButton,
        SubjectFaces
    },

    data() {
        return {
            newSubjectId: newSubjectId,
            autoUpdate: false,
            panel: 'search',
            curSubjectId: null,
            showDeleteDialog: false,
            loading: false
        };
    },

    computed: {
        ...mapGetters({
            subjects: 'subjects/sortedItems'
        }),
        subjectsCount() {
            return this.$store.state.subjects.count;
        }
    },

    created() {
        this.$store.dispatch('subjects/fetchItems');
    },

    methods: {

        onSubjectEdit() {
            if (this.curSubjectId !== null) {
                this.panel = 'editor';
            }            
        },

        onCreateSubject() {
            const subject = subjectModel.create();
            subject.id = this.newSubjectId;
            this.$store.dispatch('subjects/createItem', {
                item: subject,
                persist: false
            }).then(() => {
                this.curSubjectId = this.newSubjectId;
                this.panel = 'editor';
            });          
        },

        onSubjectEditorConfirm(subjectId) {
            if (this.panel === 'editor' && this.curSubjectId !== null) {
                this.curSubjectId = subjectId;
                this.panel = 'details';           
                this.$store.dispatch('subjects/fetchItems');
            }            
        },

        onCancelSubjectEdit() {
            if (this.panel === 'editor' && this.curSubjectId !== null) {                
                if (this.curSubjectId === newSubjectId) {
                    this.curSubjectId = null;
                    this.panel = 'search';
                } else {
                    this.panel = 'details';
                } 
            }
        },

        onSubjectListChange(subjectId) {            
            this.panel = subjectId === null ? 'search' : 'details';
            this.curSubjectId = subjectId;
        },

        onClearFilterClick() {
            this.$store.dispatch('subjects/resetFilter');
            this.$store.dispatch('subjects/fetchItems');
        },

        onConfirmDelete() {
            if (this.curSubjectId !== null && this.panel === 'details') {
                this.loading = true;
                this.$store.dispatch(
                    'subjects/destroyItem', this.curSubjectId
                ).then(() => {
                    this.loading = false;
                    this.curSubjectId = null;
                    this.panel = 'search';
                    this.showDeleteDialog = false;
                    this.$store.dispatch('subjects/fetchItems');
                });
            }
        },

        onCloseDetails() {
            this.panel = 'search';
            this.curSubjectId = null;
        }
    }
};
</script>

<style lang="scss">
</style>
