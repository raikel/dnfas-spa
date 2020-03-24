<template>

<div class="videos-list">
    <el-row
        v-if="videos.length" 
        :gutter="8"
    >
        <el-col
            v-for="video in videos"
            :key="video.id"
            :xs="24" 
            :sm="12" 
            :md="8" 
            :lg="8" 
            :xl="4"                
        >
            <video-card
                class="mb-2"
                :video-id="video.id"
                :focus="video.id === focusId"
                @click="onVideoClick(video.id)"                
            ></video-card>
        </el-col>
    </el-row>

    <empty
        v-else
        title="Sin elementos"
        message="No existen resultados para mostrar"
        icon-size="3em"
        height="383px"
        icon="el-icon-user"
        background="#eee"
    ></empty> 

    <el-pagination 
        hide-on-single-page
        layout="prev, pager, next"
        class="mt-4"
        :page-size="pageSize" 
        :background="true"
        :current-page="pageNumber"
        :total="videosCount"
        @current-change="updatePage"
    ></el-pagination>       
</div>

</template>

<script>

import { mapGetters } from 'vuex';
import AutoUpdate from '@/mixins/AutoUpdate';
import Empty from '@/components/Empty';
import VideoCard from './VideoCard';

export default {
    name: 'VideosList',

    components: {
        VideoCard,
        Empty
    },

    mixins: [AutoUpdate],

    props: {
        autoUpdate: {
            type: Boolean,
            default: false
        },
        focusId: {
            type: [Number, String],
            default: null
        }
    },

    data() {
        return {};
    },

    computed: {
        ...mapGetters({
            videos: 'videos/sortedItems'
        }),
        videosCount() {
            return this.$store.state.videos.count;
        },
        pageNumber: function() {
            return this.$store.state.videos.pageNumber + 1;
        },
        pageSize() {
            return this.$store.state.videos.pageSize;
        }
    },

    methods: {        
        update() {
            this.updateList();
        },        
        updatePage: function(number) {
            this.$store.dispatch('videos/setPage', number - 1);
            this.updateList();
        },
        updateList: function() {
            this.$store.dispatch('videos/fetchItems');
        },
        onVideoClick(videoId) {
            const focusId = videoId === this.focusId ? null : videoId;
            this.$emit('update:focus-id', focusId);
        }
    }
};
</script>

<style lang="scss">
</style>
