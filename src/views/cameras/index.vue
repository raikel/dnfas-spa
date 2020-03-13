<template>

<div class="cameras-index">
    <div class="main mr-5">
        <cameras-list :auto-update="autoUpdate"></cameras-list>
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
                tooltip="Añadir nueva cámara" 
                icon="el-icon-video-camera"
                @click="onCreateCamera"
            ></tool-button>
        </div>

        <el-card>
            <cameras-filter>                
            </cameras-filter>
        </el-card>
    </div>

    <el-dialog
        title="Nueva Cámara"
        :visible.sync="showEditorDialog"
        width="900px"
        center
    >
        <camera-editor
            :camera-id="editCameraId"
            @confirm="onCameraEditorConfirm"
            @cancel="onCameraEditorCancel"
        ></camera-editor>
    </el-dialog>
</div>

</template>

<script>
import ToolButton from '@/components/ToolButton';
import { cameraModel } from '@/store/modules/cameras/models';
import CamerasList from './components/CamerasList';
import CamerasFilter from './components/CamerasFilter';
import CameraEditor from './components/CameraEditor';

const editCameraId = 'newId';

export default {
    name: 'CamerasIndex',

    components: {
        CamerasList,
        CamerasFilter,
        CameraEditor,
        ToolButton
    },

    data() {
        return {
            editCameraId: editCameraId,            
            showEditorDialog: false,
            autoUpdate: false
        };
    },

    created() {
        this.$store.dispatch('cameras/fetchItems');
    },

    methods: {

        onCreateCamera() {
            var camera = this.$store.state.cameras.items[this.editCameraId];
            if (!camera) {
                const camera = cameraModel.create();
                camera.id = this.editCameraId;
                this.$store.dispatch('cameras/createItem', {
                    item: camera,
                    persist: false
                }).then(() => {
                    this.showEditorDialog = true;
                });
            } else {
                this.showEditorDialog = true;
            }          
        },

        onCameraEditorConfirm() {
            this.showEditorDialog = false;
            this.clearCamera();
            this.$store.dispatch('cameras/fetchItems');
        },

        clearCamera() {
            const camera = cameraModel.create();
            camera.id = this.editCameraId;
            this.$store.dispatch('cameras/updateItem', {
                item: camera,
                persist: false
            });
        },

        onCameraEditorCancel() {
            this.showEditorDialog = false;
        }
    }
};
</script>

<style lang="scss">

.cameras-index {
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
