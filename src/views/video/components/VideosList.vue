<template>

<div class="videos-list">
    <list-header 
        class="mb-4"
        :show-count="videos.length"
        :total-count="videosCount"
        :order-options="orderOptions"
        @order-change="setOrder"
    ></list-header> 

    <el-row
        v-if="videos.length" 
        :gutter="8" 
        class="list"
    >
        <el-col
            v-for="video in videos" 
            :key="video.id"
            :xs="24" 
            :sm="12" 
            :md="8" 
            :lg="6" 
            :xl="4"                
        >
            <video-card class="mb-2" :video-id="video.id"></video-card>
        </el-col>
    </el-row>

    <empty
        v-else
        title="Sin elementos"
        message="No existe ningún registro de vídeo que coincida con los criterios de búsqueda"
        icon-size="3em"
        height="467px"
        icon="el-icon-video-camera"
        background="#eee"
    ></empty> 

    <el-pagination 
        :total="videosCount" 
        :page-size="pageSize" 
        :background="true"
        hide-on-single-page
        layout="prev, pager, next"
        class="mt-4"
        @current-change="updatePage"
    >
    </el-pagination>
</div>

</template>

<script>
import { mapGetters } from 'vuex';
import VideoCard from './VideoCard';
import Empty from '@/components/Empty';
import AutoUpdate from '@/mixins/AutoUpdate';
import ListHeader from '@/components/ListHeader';

const orderOptions = [    
    {
        label: 'Fecha y hora', 
        value: 'created_at'
    }, {
        label: 'Duración', 
        value: 'duration_seconds'
    }, {
        label: 'Tamaño', 
        value: 'size_bytes'
    }
];

export default {
    name: 'VideosList',

    components: {
        VideoCard,
        Empty,
        ListHeader
    },

    mixins: [AutoUpdate],

    props: {
        autoUpdate: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            orderOptions: orderOptions
        };
    },

    computed: {
        ...mapGetters({
            videos: 'videos/sortedItems'
        }),
        videosCount() {
            return this.$store.state.videos.count;
        },
        pageSize() {
            return this.$store.state.videos.pageSize;
        }
    },

    created() {
        this.updateList();
    },

    methods: {
        update() {
            this.updateList();
        },

        updatePage: function(number) {
            this.$store.dispatch('videos/setPage', number - 1);
            this.updateList();
        },

        setOrder(order) {
            this.$store.dispatch('videos/setOrder', order);
            this.updateList();
        },

        updateList: function() {
            this.$store.dispatch('videos/fetchItems');
        }
    }
};
</script>

<style lang="scss">
</style>
