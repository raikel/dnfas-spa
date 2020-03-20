<template>

<div class="cameras-map">
    <div class="map-container">
        <div ref="map" class="map-wrapper"></div>

        <!-- <v-btn
            @click="updateMapView"
            fixed
            dark
            fab
            bottom
            right
            color="primary"
            style="margin-bottom: 62px"
        >
            <v-icon>my_location</v-icon>
        </v-btn>-->
    </div>

    <div class="map-actions">
        <el-autocomplete
            v-model="queryPlace"
            :fetch-suggestions="findPlaces"
            clearable
            placeholder="Busca un lugar"
            @select="onQueryPlaceSelected"
        >
            <template slot-scope="{ item }">
                {{ item.title }}, {{ item.address }}
            </template>
        </el-autocomplete>
    </div>
</div>

</template>

<script>
/* global H*/

import { mapGetters } from 'vuex';
import HereMap from '@/lib/heremaps';
import placeIcon from './map-marker.svg';
const minQueryLength = 2;

export default {
    name: 'CamerasMap',

    components: {
    },

    props: {
        location: {
            type: Object,
            default: () => {
                return {
                    lat: 22.7681394,
                    lng: -102.5745194
                };
            },
            required: false
        },
        zoomLevel: {
            type: Number,
            default: 16,
            required: false
        },
        focusId: {
            type: [Number, String],
            default: null
        }
    },

    data() {
        return {
            map: null,
            queryPlace: '',
            loadingPlaces: false,
            behavior: null,
            markerGroup: null,
            selIndex: null,
            markerIcon: null
        };
    },

    computed: {
        ...mapGetters({
            cameras: 'cameras/sortedItems'
        }),
        loading() {
            return this.$store.state.cameras.loading;
        }
    },

    watch: {
        'loading': function(newVal, oldVal) {
            if (!newVal && oldVal) {
                this.createMarkers();
            }
        }
    },

    created() {
        this.$store.dispatch('cameras/fetchItems');
    },

    mounted() {
        this.map = HereMap.createMap(
            this.$refs.map,
            this.zoomLevel,
            this.location
        );

        this.markerIcon = new H.map.Icon(placeIcon, {size: {w: 32, h: 52}});

        window.addEventListener(
            'resize', 
            () => this.map.getViewPort().resize()
        );

        this.behavior = new H.mapevents.Behavior(
            new H.mapevents.MapEvents(this.map)
        );
        H.ui.UI.createDefault(this.map, HereMap.getDefaultLayers(), 'es-ES');

        this.markerGroup = new H.map.Group();
        this.map.addObject(this.markerGroup);

        const self = this;
        this.markerGroup.addEventListener('tap', function(evt) {
            self.onMarkerClick(evt.target.getData());
            evt.stopPropagation();
        }, false);

        this.map.addEventListener('tap', function(evt) {
            if (!(evt.target instanceof H.map.Marker)) {
                self.onMarkerClick(null);                
            }
        }, false);

        this.map.addEventListener('pointermove', function(evt) {
            if (evt.target instanceof H.map.Marker) {
                self.map.getViewPort().element.style.cursor = 'pointer';
            } else {
                self.map.getViewPort().element.style.cursor = 'auto';
            }
        }, false);
        
        if (!this.loading) {
            this.createMarkers();
        }
    },

    destroy() {
        if (this.map) {
            this.map.dispose();
        }
        if (this.markerGroup) {
            this.markerGroup.dispose();
        }
    },

    methods: {

        onMarkerClick(cameraId) {
            const focusId = cameraId === this.focusId ? null : cameraId;
            this.$emit('update:focus-id', focusId);
        },

        onQueryPlaceSelected(place) {
            this.setView(place.location);            
        },

        createMarkers() {
            if (this.map && this.cameras) {                
                for (let i = 0; i < this.cameras.length; i++) {
                    const camera = this.cameras[i];
                    if (camera.locationLat && camera.locationLon) {
                        const marker = new H.map.Marker({ 
                            lat: camera.locationLat, 
                            lng: camera.locationLon
                        }, { 
                            icon: this.markerIcon
                        });
                        marker.setData(camera.id);
                        this.markerGroup.addObject(marker);
                    }                
                }
            }
        },

        setView(location) {            
            this.map.setCenter({
                lat: location.lat, 
                lng: location.lng
            }, true);            
            this.map.setZoom(this.zoomLevel, true);
        },

        findPlaces(query, cb) {
            if (query && query.length >= minQueryLength && !this.loadingPlaces) {
                this.loadingPlaces = true;
                
                HereMap.findPlaces(query, this.location).then(
                    ({ data }) => {
                        this.loadingPlaces = false;
                        var results = [];
                        if (data) {
                            results = data.results.map(place => {
                                const parts = place.vicinity.split(/<br\/>/);
                                const nparts = parts.length;
                                let address = '';

                                if (nparts > 1) {
                                    address =
                                        parts[nparts - 2] +
                                        ', ' +
                                        parts[nparts - 1];
                                } else {
                                    address = parts[nparts - 1];
                                }

                                return {
                                    title: place.title,
                                    highlightedTitle: place.highlightedTitle,
                                    address: address,
                                    location: {
                                        lat: place.position[0],
                                        lng: place.position[1]
                                    }
                                };
                            });
                        }
                        cb(results);
                    }
                );
            } else {
                cb([]);
            }
        }
    }
};
</script>

<style lang="scss">

.cameras-map {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .map-container {
        position: absolute;
        flex: 1;
        width: 100%;
        height: 100%;
        z-index: 10;
    }

    .map-actions {
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 11;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        .el-autocomplete {
            width: 280px;
        }
    }

    .map-wrapper {
        background: grey;
        flex-grow: 1;
        width: 100%;
        height: 100%;
    }

    .bottom-action-bar {
        flex-grow: 0;
        width: 100%;
    }
}
</style>
