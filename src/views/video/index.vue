<template>

<div class="videos-index">
    <div class="main mr-4">
        <videos-list :auto-update="autoUpdate"></videos-list>
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
                tooltip="Añadir nuevo video" 
                icon="el-icon-video-camera"
                @click="showEditorDialog = true"
            ></tool-button>
        </div>

        <el-card>
            <video-filter>                
            </video-filter>
        </el-card>
    </div>

    <el-dialog
        title="Nuevo registro"
        :visible.sync="showEditorDialog"
        width="600px"
        center
    >
        <video-editor
            :video-id="editVideoId"
            @confirm="onVideoEditorConfirm"
            @cancel="onVideoEditorCancel"
        ></video-editor>
    </el-dialog>
</div>

</template>

<script>

import { videoModel } from '@/store/modules/videos/models';
import ToolButton from '@/components/ToolButton';
import VideosList from './components/VideosList';
import VideoEditor from './components/VideoEditor';
import VideoFilter from './components/VideoFilter';

const editVideoId = 'newId';

export default {
    name: 'VideosIndex',

    components: {
        VideosList,
        VideoEditor,
        VideoFilter,
        ToolButton
    },

    data() {
        return {
            editVideoId: editVideoId,
            autoUpdate: false,
            showEditorDialog: false
        };
    },

    created() {
        this.$store.dispatch('videos/fetchItems');
    },

    methods: {
        onCreateVideo() {
            var video = this.$store.state.videos.items[this.editVideoId];
            if (!video) {
                const video = videoModel.create();
                video.id = this.editVideoId;
                this.$store.dispatch('videos/createItem', {
                    item: video,
                    persist: false
                }).then(() => {
                    this.showEditorDialog = true;
                });
            } else {
                this.showEditorDialog = true;
            }          
        },

        onVideoEditorConfirm() {
            this.showEditorDialog = false;
            this.clearVideo();
            this.$store.dispatch('videos/fetchItems');
        },

        clearVideo() {
            const video = videoModel.create();
            video.id = this.editVideoId;
            this.$store.dispatch('videos/updateItem', {
                item: video,
                persist: false
            });
        },

        onVideoEditorCancel() {
            this.showEditorDialog = false;
        }
    }
};
</script>

<style lang="scss">

.videos-index {
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
