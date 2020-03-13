<template>

<div v-if="camera" class="camera-details">

    <div class="main">
        <video-player 
            v-if="camera.streamUrl" 
            :src="camera.streamUrl"
        ></video-player>
    </div>

    <div class="control-panel ml-3">

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
                tooltip="Editar cámara" 
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
    </div>

    <el-dialog
        title="Editar cámara"
        :visible.sync="showEditorDialog"
        width="900px"
        center
    >
        <camera-editor
            :edit="true"
            @confirm="onCameraEditorConfirm"
            @cancel="onCameraEditorCancel"
        ></camera-editor>
    </el-dialog>

    <el-dialog
        title="Advertencia"
        :visible.sync="showDeleteDialog"
        width="400px"
        center
    >
        <p>
            ¿Seguro deseas eliminar esta cámara de forma permanente? 
            Se eliminará cualquier dato asociados.
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

import CameraEditor from './CameraEditor';
import VideoPlayer from '@/components/VideoPlayer';
import ToolButton from '@/components/ToolButton';

export default {
    name: 'CameraDetails',

    components: {
       VideoPlayer,
       CameraEditor,
       ToolButton
    },

    props: {
        cameraId: {
            type: [String, Number],
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
        camera() {
            this.$store.dispatch('cameras/getItem', this.cameraId);
            return this.$store.state.cameras.items[this.cameraId];
        }
    },

    methods: {
        onCameraEditorConfirm() {
            this.showEditorDialog = false;
        },

        onCameraEditorCancel() {
            this.showEditorDialog = false;
        },

        onConfirmDelete() {
            this.$store.dispatch(
                'cameras/destroyItem', this.cameraId
            ).then(() => {
                this.$router.push({ name: 'CamerasIndex' });
            });
        }
    }
};
</script>

<style lang="scss">

.camera-details {

    display: flex;
    align-items: flex-start;

    .control-panel {
        width: 350px;
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
