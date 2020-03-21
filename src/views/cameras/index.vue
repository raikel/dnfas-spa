<template>

<split-view class="cameras-index">
    <template v-slot:main>
        <template v-if="main === 'list'">
            <list-header 
                class="mb-4"
                :show-count="cameras.length"
                :total-count="camerasCount"
                add-text="Nueva Cámara"
                @create="onCreateCamera"
            ></list-header>

            <cameras-list            
                :auto-update="autoUpdate"
                :focus-id="curCameraId"
                @update:focus-id="onCameraListChange"
            ></cameras-list>
        </template>

        <template v-else-if="main === 'map'">
            <cameras-map
                :focus-id="curCameraId"
                @update:focus-id="onCameraListChange"
            ></cameras-map>
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
            <div class="flex-row">
                <tool-button
                    class="ml-1"
                    tooltip="Restablecer filtro" 
                    icon="el-icon-refresh"
                    @click="onClearFilterClick"
                ></tool-button>
                <tool-button
                    v-if="main === 'list'"
                    class="ml-1"
                    tooltip="Vista de mapa" 
                    icon="el-icon-map-location"
                    @click="main = 'map'"
                ></tool-button>
                <tool-button
                    v-if="main === 'map'"
                    class="ml-1"
                    tooltip="Volver al listado" 
                    icon="el-icon-s-grid"
                    @click="main = 'list'"
                ></tool-button>
            </div>            
        </template>

        <template v-else-if="panel === 'details'">
            <div class="text-lg text-w6">Detalles</div>
            <div class="flex-row">
                <tool-button
                    class="ml-1"
                    tooltip="Editar cámara" 
                    icon="el-icon-edit"
                    @click="onCameraEdit"
                ></tool-button>
                <tool-button
                    class="ml-1"
                    tooltip="Eliminar cámara" 
                    icon="el-icon-delete"
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
                    @click="onCancelCameraEdit"
                ></tool-button>
            </div>                    
        </template>
    </template>

    <template v-slot:side-content>
        <cameras-filter 
            v-if="panel === 'search'"
        ></cameras-filter>

        <camera-details
            v-else-if="panel === 'details'"
            :camera-id="curCameraId"
        ></camera-details>

        <camera-editor
            v-else-if="panel === 'editor'"
            :edit="curCameraId !== newCameraId" 
            :camera-id="curCameraId"
            @confirm="onCameraEditorConfirm"
        ></camera-editor>
    </template>
</split-view>

</template>

<script>
import { mapGetters } from 'vuex';
import ToolButton from '@/components/ToolButton';
import { cameraModel } from '@/store/modules/cameras/models';
import ListHeader from '@/components/ListHeader';
import SplitView from '@/layout/components/SplitView';
import CamerasList from './components/CamerasList';
import CamerasFilter from './components/CamerasFilter';
import CameraEditor from './components/CameraEditor';
import CameraDetails from './components/CameraDetails';
import CamerasMap from './components/CamerasMap';

const newCameraId = 'newId';

export default {
    name: 'CamerasIndex',

    components: {
        SplitView,
        CamerasList,
        CamerasFilter,
        ListHeader,
        CameraEditor,
        CameraDetails,
        ToolButton,
        CamerasMap
    },

    data() {
        return {
            autoUpdate: false,
            main: 'list',
            panel: 'search',
            curCameraId: null,
            showDeleteDialog: false,
            loading: false,
            newCameraId: newCameraId
        };
    },

    computed: {
        ...mapGetters({
            cameras: 'cameras/sortedItems'
        }),
        camerasCount() {
            return this.$store.state.cameras.count;
        }
    },

    created() {
        this.$store.dispatch('cameras/fetchItems');
    },

    methods: {

        onCameraEdit() {
            if (this.curCameraId !== null) {
                this.panel = 'editor';
            }            
        },

        onCreateCamera() {
            const camera = cameraModel.create();
            camera.id = newCameraId;
            this.$store.dispatch('cameras/createItem', {
                item: camera,
                persist: false
            }).then(() => {
                this.curCameraId = newCameraId;
                this.panel = 'editor';
            });          
        },

        onCameraEditorConfirm(cameraId) {
            if (this.panel === 'editor' && this.curCameraId !== null) {
                this.curCameraId = cameraId;
                this.panel = 'details';            
                this.$store.dispatch('cameras/fetchItems');
            }            
        },

        onCancelCameraEdit() {
            if (this.panel === 'editor' && this.curCameraId !== null) {                
                if (this.curCameraId === newCameraId) {
                    this.curCameraId = null;
                    this.panel = 'search';
                } else {
                    this.panel = 'details';
                } 
            }
        },

        onCameraListChange(cameraId) {            
            this.panel = cameraId === null ? 'search' : 'details';
            this.curCameraId = cameraId;
        },

        onClearFilterClick() {
            this.$store.dispatch('cameras/resetFilter');
            this.$store.dispatch('cameras/fetchItems');
        },

        onConfirmDelete() {
            if (this.curCameraId !== null && this.panel === 'details') {
                this.loading = true;
                this.$store.dispatch(
                    'cameras/destroyItem', this.curCameraId
                ).then(() => {
                    this.loading = false;
                    this.curCameraId = null;
                    this.panel = 'search';
                    this.showDeleteDialog = false;
                    this.$store.dispatch('cameras/fetchItems');
                });
            }
        }
    }
};
</script>

<style lang="scss">
</style>
