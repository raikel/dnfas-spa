<template>
    <div v-if="video" class="video-details">
        <div class="main">
            <video-player 
                v-if="video.url" 
                :src="video.url"
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

<!--                 <tool-button
                    class="mx-1"
                    tooltip="Editar registro de video" 
                    icon="el-icon-edit-outline"
                    @click="showEditorDialog = true"
                ></tool-button> -->

                <tool-button
                    class="mx-1"
                    tooltip="Elimimar registro de video" 
                    icon="el-icon-delete"
                    @click="showDeleteDialog = true"
                ></tool-button> 
            </div>
        </div>

        <el-dialog
            title="Editar registro de video"
            :visible.sync="showEditorDialog"
            width="900px"
            center
        >
<!--             <video-editor
                :edit="true"
                @confirm="onVideoEditorConfirm"
                @cancel="onVideoEditorCancel"
            ></video-editor> -->
        </el-dialog>

        <el-dialog
            title="Advertencia"
            :visible.sync="showDeleteDialog"
            width="400px"
            center
        >
            <p>
                ¿Seguro deseas eliminar este archivo de video de forma permanente? 
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

import VideoPlayer from '@/components/VideoPlayer';
/* import VideoEditor from './VideoEditor'; */
import ToolButton from '@/components/ToolButton';

export default {
    name: 'VideoDetails',

    components: {
       VideoPlayer,
       ToolButton
    },

    props: {
        videoId: {
            type: [String, Number],
            required: true
        }
    },

    data() {
        return {
            videoError: false,
            showEditorDialog: false,
            showDeleteDialog: false,
            autoUpdate: false
        };
    },

    computed: {
        video() {
            this.$store.dispatch('videos/getItem', this.videoId);
            return this.$store.state.videos.items[this.videoId];
        }
    },

    methods: {
        onVideoError() {
            this.videoError = true;
        },

        onVideoEditorConfirm() {
            this.showEditorDialog = false;
        },

        onVideoEditorCancel() {
            this.showEditorDialog = false;
        },

        onConfirmDelete() {
            this.$store.dispatch(
                'videos/deleteItem', this.videoId
            ).then(() => {
                this.$router.push({ name: 'VideosIndex' });
            });
        }
    }
};
</script>

<style lang="scss">

.video-details {

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
    
    .el-dialog {
        margin-bottom: 32px;
    }
    
    /* .video-wrap {
        flex-grow: 1;
        position: relative;
        .video {
            position: absolute;
            top: 0;
            left: 0;
        }
        .video-error {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
            color: #ffffff;
            background: transparent;
            i {
                display: block;
                font-size: 3em;
            }
            .error-title {
                font-size: 1.5em;
                font-weight: 600;
            }
            .error-message {
                font-size: 0.8em;
            }
        }
    } */
}

</style>
