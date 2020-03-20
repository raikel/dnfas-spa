<template>
    <div class="map-locate">
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

import HereMap from '@/lib/heremaps';
import placeIcon from './map-marker.svg';
const QUERY_PLACE_MIN_LENGTH = 3;
const EVENT_LOCATION_CHANGED = 'input';

export default {
    name: 'MapLocate',

    props: {
        value: {
            type: Object,
            default: () => {
                return {
                    lat: null,
                    lng: null
                };
            },
            required: false
        },
        location: {
            type: Object,
            default: () => {
                return {
                    lat: 0,
                    lng: 0
                };
            },
            required: false
        },
        zoomLevel: {
            type: Number,
            default: 16,
            required: false
        },
        edit: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            map: {},
            marker: null,
            markerIcon: undefined,
            queryPlace: '',
            loadingPlaces: false,
            behavior: null
        };
    },

    watch: {
        'value': {
            handler(newVal, oldVald) {
                if (this.validLocation(newVal)) {
                    const location = {
                        lat: newVal.lat, 
                        lng: newVal.lng
                    };

                    if (this.marker) {
                        this.setMarkerLocation(location);
                    } else {
                        this.createMarker(location);
                    }                                     
                    this.setView(location);
                } else {
                    if (this.marker) {
                        this.destroyMarker();
                    }                    
                }          
            },
            deep: true
        } 
    },

    mounted() {
        this.map = HereMap.createMap(
            this.$refs.map,
            this.zoomLevel,
            this.validLocation(this.value) ? this.value : this.location
        );

        this.markerIcon = new H.map.Icon(placeIcon, {size: {w: 32, h: 52}});        

        if (this.validLocation(this.value)) {
            this.createMarker(this.value);
        } 

        // MapEvents enables the event system
        // Behavior implements default interactions for pan/zoom
        this.behavior = new H.mapevents.Behavior(
            new H.mapevents.MapEvents(this.map)
        );
        // Create the default UI components
        H.ui.UI.createDefault(this.map, HereMap.getDefaultLayers(), 'es-ES');

        const self = this;

        if (this.edit) {
            this.map.addEventListener('dragstart', function(ev) {
                if (ev.target instanceof H.map.Marker) {
                    self.behavior.disable();
                }
            }, false);

            this.map.addEventListener('dragend', function(ev) {
                if (ev.target instanceof H.map.Marker) {
                    self.behavior.enable();
                    const position = self.marker.getPosition();
                    self.$emit(EVENT_LOCATION_CHANGED, {
                        lat: position.lat, 
                        lng: position.lng
                    });
                }
            }, false);

            this.map.addEventListener('drag', function(ev) {
                if (ev.target instanceof H.map.Marker) {
                    ev.target.setPosition(self.map.screenToGeo(
                        ev.currentPointer.viewportX, ev.currentPointer.viewportY)
                    );
                }
            }, false);

            this.map.addEventListener('dbltap', function(ev) {
                if (!self.marker) {
                    const location = self.map.screenToGeo(
                        ev.currentPointer.viewportX, 
                        ev.currentPointer.viewportY
                    );                
                    self.createMarker(location);             
                    self.setView(location);
                    self.$emit(EVENT_LOCATION_CHANGED, {
                        lat: location.lat, 
                        lng: location.lng
                    });
                }
            }, false);
        }        
    },

    destroy() {
        if (this.map) {
            this.map.dispose();
        }
    },

    methods: {

        validLocation(location) {
            return location && location.lat && location.lng;
        },

        createMarker(location) {
            this.marker = new H.map.Marker(
                location, 
                { icon: this.markerIcon }
            );
            this.marker.draggable = true;  
            this.map.addObject(this.marker);
        },

        destroyMarker(location) {            
            this.map.removeObject(this.marker);
            this.marker = null;
        },

        setMarkerLocation(location) {
            this.marker.setPosition({
                lat: location.lat, 
                lng: location.lng
            });
        },

        onQueryPlaceSelected(place) {
            const location = place.location;
            
            if (this.edit) {
                if (this.marker) {
                    this.$emit(EVENT_LOCATION_CHANGED, {
                        lat: location.lat, 
                        lng: location.lng
                    });
                    this.setMarkerLocation(location);
                } 
            }          
            
            this.setView(location);          
        },

        setView(location) {
            this.map.setCenter({
                lat: location.lat, 
                lng: location.lng
            }, true);
            
            this.map.setZoom(this.zoomLevel, true);
        },

        findPlaces(query, cb) {
            if (query && query.length >= QUERY_PLACE_MIN_LENGTH && !this.loadingPlaces) {
                this.loadingPlaces = true;
                const position = this.marker.getPosition();
                
                HereMap.findPlaces(query, {
                    lat: position.lat, 
                    lng: position.lng
                }).then(
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
        },

        updateMapView() {
            if (this.fromPlace && this.toPlace) {
                HereMap.buildRoute(
                    this.fromPlace.location,
                    this.toPlace.location
                ).then(routeLine => {
                    if (this.routeLine) {
                        this.map.removeObject(this.routeLine);
                    }
                    this.routeLine = routeLine;
                    this.map.addObject(routeLine);
                    this.map.setViewBounds(routeLine.getBounds(), true);
                });
            } else {
                const places = [this.fromPlace, this.toPlace];
                for (const place of places) {
                    if (place) {
                        this.map.setCenter(place.location, true);
                        break;
                    }
                }
            }
        }
    }
};
</script>

<style lang="scss">
/* .map-parent {
    position: relative;
} */

.map-locate {
    width: 100%;
    position: relative;
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
