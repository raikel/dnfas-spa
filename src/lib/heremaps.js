import Vue from 'vue';
import config from '@/config';

/* global H*/
class HereMap {
    constructor() {
        if (!HereMap.instance) {
            this._platform = new H.service.Platform({
                'app_id': config.hereMaps.appId,
                'app_code': config.hereMaps.appCode
            });

            this._geocoder = this._platform.getGeocodingService();

            this._defaultLayers = null;

            HereMap.instance = this;
        }
        return HereMap.instance;
    }

    getPlataform() {
        return this._platform;
    }

    getGeocoder() {
        return this._geocoder;
    }

    getDefaultLayers() {
        if (this._defaultLayers === null) {
            const pixelRatio = window.devicePixelRatio || 1;
            this._defaultLayers = this._platform.createDefaultLayers({
                tileSize: pixelRatio === 1 ? 256 : 512,
                ppi: pixelRatio === 1 ? undefined : 320,
                lg: 'SPA'
            });
        }
        return this._defaultLayers;
    }

    createMap(domElement, zoomLevel, centerLocation) {
        return new H.Map(
            domElement,
            this.getDefaultLayers().normal.map, {
                zoom: zoomLevel,
                center: centerLocation
            }
        )
    }

    findPlaces(queryText, location) {
        const countryCode = config.hereMaps.countryCode;
        const stateCode = config.hereMaps.stateCode;

        const params = {
            app_id: config.hereMaps.appId,
            app_code: config.hereMaps.appCode,
            q: queryText,
            at: `${location.lat},${location.lng}`,
            result_types: 'address,place',
            addressFilter: `countryCode=${countryCode};stateCode=${stateCode}`
        }

        return Vue.axios.get(config.hereMaps.placesApiUrl, { params: params })
            .catch(error => {
                throw new Error(`HereMap ${error}`);
            });
    }

    buildRoute(fromLocation, toLocation) {
        const params = {
            app_id: config.hereMaps.appId,
            app_code: config.hereMaps.appCode,
            waypoint0: `geo!${fromLocation.lat},${fromLocation.lng}`,
            waypoint1: `geo!${toLocation.lat},${toLocation.lng}`,
            mode: 'fastest;car;traffic:disabled',
            representation: 'display'
        }

        return Vue.axios.get(config.hereMaps.routingApiUrl, { params: params })
            .then(({ data }) => {
                if (!data.response.route) {
                    return null
                }

                const route = data.response.route[0];
                const routeShape = route.shape;
                const linestring = new H.geo.LineString();

                routeShape.forEach(function(point) {
                    const coords = point.split(',');
                    linestring.pushLatLngAlt(coords[0], coords[1]);
                });

                var routeLine = new H.map.Polyline(linestring, {
                    style: { lineWidth: 5 },
                    arrows: { fillColor: 'white', frequency: 2, width: 0.8, length: 0.7 }
                });

                return routeLine
            });
    }
}

const instance = new HereMap();

export default instance;
