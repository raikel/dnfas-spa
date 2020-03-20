<template>

<div v-if="video" class="video-details">
    <video-player 
        v-if="video.url" 
        :src="video.url"
        class="mb-3"
    ></video-player>

    <info-list :items="infoItems">
    </info-list>
</div>
    
</template>

<script>

import VideoPlayer from '@/components/VideoPlayer';
import InfoList from '@/components/InfoList';
import filters from '@/filters';

export default {
    name: 'VideoDetails',

    components: {
       VideoPlayer,
       InfoList
    },

    props: {
        videoId: {
            type: [String, Number],
            required: true
        }
    },

    data() {
        return {
        };
    },

    computed: {
        video() {
            this.$store.dispatch('videos/getItem', this.videoId);
            return this.$store.state.videos.items[this.videoId];
        },

        infoItems() {
            const video = this.video;
            const resolution = video.frameWidth && video.frameHeight ?
                `${video.frameWidth} x ${video.frameHeight}` : '';

            const info = [{
                name: 'Nombre',
                value: video.name || 'No establecido'
            }, {
                name: 'Resolución',
                value: resolution || 'No establecida'
            }, {
                name: 'Tamaño',
                value: video.size || 'No establecido'
            }, {
                name: 'Duración',
                value: video.durationSeconds ? 
                    filters.timeFilter(video.durationSeconds) : 'No establecida'
            }, {
                name: 'Captura de vídeo',
                value: video.url || 'No establecida'
            }];

            return info;
        }
    }
};
</script>

<style lang="scss">
</style>
