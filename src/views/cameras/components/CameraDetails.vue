<template>

<div v-if="camera" class="camera-details">
    <video-player 
        v-if="camera.streamUrl" 
        :src="camera.streamUrl"
        class="mb-3"
    ></video-player>

    <info-list :items="infoItems">
    </info-list>

    <div class="text-sm text-w6 color-g5 mb-1 mt-2">
        Mapa
    </div>
    <map-locate
        v-if="hasLocation"
        :edit="false"
        :value="{
            lat: camera.locationLat,
            lng: camera.locationLon
        }"
    ></map-locate>
</div>
    
</template>

<script>

import VideoPlayer from '@/components/VideoPlayer';
import MapLocate from '@/components/MapLocate';
import InfoList from '@/components/InfoList';

export default {
    name: 'CameraDetails',

    components: {
       VideoPlayer,
       MapLocate,
       InfoList
    },

    props: {
        cameraId: {
            type: [String, Number],
            required: true
        }
    },

    data() {
        return {
        };
    },

    computed: {
        camera() {
            this.$store.dispatch('cameras/getItem', this.cameraId);
            return this.$store.state.cameras.items[this.cameraId];
        },

        hasLocation() {
            return this.camera.locationLat && this.camera.locationLon;
        },

        infoItems() {
            const camera = this.camera;
            const location = `${camera.locationLat}, ${camera.locationLat}`;

            const info = [{
                name: 'Nombre',
                value: camera.name || 'No establecido'
            }, {
                name: 'Ubicación',
                value: camera.address || 'No establecida'
            }, {
                name: 'Localización geográfica',
                value: this.hasLocation ? location : 'No establecido'
            }, {
                name: 'Captura de vídeo',
                value: camera.streamUrl || 'No establecida'
            }];

            return info;
        }
    }
};
</script>

<style lang="scss">

.camera-details {
    .map-locate {
        width: 100%;
        height: 400px;
    }
}

</style>
