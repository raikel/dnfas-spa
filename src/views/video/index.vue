<template>

<split-view class="videos-index">
    <template v-slot:main>
        <list-header 
            class="mb-4"
            :show-count="videos.length"
            :total-count="videosCount"
            add-text="Nuevo Video"
            @create="onCreateVideo"
        ></list-header>

        <videos-list            
            :auto-update="autoUpdate"
            :focus-id="curVideoId"
            @update:focus-id="onVideoListChange"
        ></videos-list>

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
                    tooltip="Editar video" 
                    icon="el-icon-edit"
                    @click="onVideoEdit"
                ></tool-button>
                <tool-button
                    class="ml-1"
                    tooltip="Eliminar video" 
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
                    @click="onCancelVideoEdit"
                ></tool-button>
            </div>                    
        </template>
    </template>

    <template v-slot:side-content>
        <videos-filter 
            v-if="panel === 'search'"
        ></videos-filter>

        <video-details
            v-else-if="panel === 'details'"
            :video-id="curVideoId"
        ></video-details>

        <video-editor
            v-else-if="panel === 'editor'"
            :edit="curVideoId !== newVideoId" 
            :video-id="curVideoId"
            @confirm="onVideoEditorConfirm"
        ></video-editor>
    </template>
</split-view>

</template>

<script>
import { mapGetters } from 'vuex';
import ToolButton from '@/components/ToolButton';
import { videoModel } from '@/store/modules/videos/models';
import ListHeader from '@/components/ListHeader';
import SplitView from '@/layout/components/SplitView';
import VideosList from './components/VideosList';
import VideosFilter from './components/VideosFilter';
import VideoEditor from './components/VideoEditor';
import VideoDetails from './components/VideoDetails';

const newVideoId = 'newId';

export default {
    name: 'VideosIndex',

    components: {
        SplitView,
        VideosList,
        VideosFilter,
        ListHeader,
        VideoEditor,
        VideoDetails,
        ToolButton
    },

    data() {
        return {
            autoUpdate: false,
            panel: 'search',
            curVideoId: null,
            showDeleteDialog: false,
            loading: false,
            newVideoId: newVideoId
        };
    },

    computed: {
        ...mapGetters({
            videos: 'videos/sortedItems'
        }),
        videosCount() {
            return this.$store.state.videos.count;
        }
    },

    created() {
        this.$store.dispatch('videos/fetchItems');
    },

    methods: {

        onVideoEdit() {
            if (this.curVideoId !== null) {
                this.panel = 'editor';
            }            
        },

        onCreateVideo() {
            const video = videoModel.create();
            video.id = newVideoId;
            this.$store.dispatch('videos/createItem', {
                item: video,
                persist: false
            }).then(() => {
                this.curVideoId = newVideoId;
                this.panel = 'editor';
            });          
        },

        onVideoEditorConfirm(videoId) {
            if (this.panel === 'editor' && this.curVideoId !== null) {
                this.curVideoId = videoId;
                this.panel = 'details';            
                this.$store.dispatch('videos/fetchItems');
            }            
        },

        onCancelVideoEdit() {
            if (this.panel === 'editor' && this.curVideoId !== null) {                
                if (this.curVideoId === newVideoId) {
                    this.curVideoId = null;
                    this.panel = 'search';
                } else {
                    this.panel = 'details';
                } 
            }
        },

        onVideoListChange(videoId) {            
            this.panel = videoId === null ? 'search' : 'details';
            this.curVideoId = videoId;
        },

        onClearFilterClick() {
            this.$store.dispatch('videos/resetFilter');
            this.$store.dispatch('videos/fetchItems');
        },

        onConfirmDelete() {
            if (this.curVideoId !== null && this.panel === 'details') {
                this.loading = true;
                this.$store.dispatch(
                    'videos/destroyItem', this.curVideoId
                ).then(() => {
                    this.loading = false;
                    this.curVideoId = null;
                    this.panel = 'search';
                    this.showDeleteDialog = false;
                    this.$store.dispatch('videos/fetchItems');
                });
            }
        }
    }
};
</script>

<style lang="scss">
</style>
