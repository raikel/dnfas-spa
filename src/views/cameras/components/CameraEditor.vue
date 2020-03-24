<template>

<div v-if="camera" class="camera-editor">
    <div class="form mr-4">
        <el-form
            ref="form"
            size="small"
            label-position="top"
            :rules="rules"
            :show-message="false"
            :model="camera"            
            :disabled="loading"
            @validate="validate" 
        >
            <el-alert
                v-if="alert"
                :title="alert.text"
                :type="alert.type"
                show-icon
                class="mb-3"
            ></el-alert>

            <el-form-item label="Nombre de la cámara" prop="name">
                <el-input
                    :value="camera.name"                    
                    @input="val => onParamChange({ name: val })" 
                ></el-input>
            </el-form-item>

            <el-form-item label="Captura de video" prop="streamUrl">
                <el-input
                    :value="camera.streamUrl"                    
                    @input="val => onParamChange({ streamUrl: val })" 
                ></el-input>
            </el-form-item>

            <el-form-item label="Ubicación">
                <el-input
                    :value="camera.address"                    
                    @input="val => onParamChange({ address: val })" 
                ></el-input>
            </el-form-item>

            <el-form-item label="Latitud">
                <el-input-number
                    :controls="false"
                    :min="-90" 
                    :max="90"
                    :precision="8"
                    :step="0.001" 
                    :value="camera.locationLat"                    
                    @change="val => onParamChange({ locationLat: val })"
                ></el-input-number>
            </el-form-item>

            <el-form-item label="Longitud">
                <el-input-number
                    :controls="false"
                    :min="-180" 
                    :max="180"
                    :precision="8"
                    :step="0.001"
                    :value="camera.locationLon"                    
                    @change="val => onParamChange({ locationLon: val })"          
                ></el-input-number>
            </el-form-item>
        </el-form>           
    </div>
    <map-locate
        :location="initLocation"
        :value="{
            lat: camera.locationLat,
            lng: camera.locationLon
        }"
        @input="val => onParamChange({
            locationLat: val.lat,
            locationLon: val.lng
        })"
    ></map-locate>

    <div class="buttons mt-4 flex-row je ac">
        <el-button
            type="primary"
            size="small"
            icon="el-icon-check"
            :disabled="loading"
            @click.prevent="onConfirm"            
        >
            Confirmar
        </el-button>
    </div> 
</div>

</template>

<script>

import MapLocate from '@/components/MapLocate';

const initLocation = {
    lat: 22.7681394,
    lng: -102.5745194
};

const rules = {
    name: [{
        required: true,
        message: 'Por favor ingresa el nombre de la cámara',
        trigger: 'blur'
    }],
    streamUrl: [{
        required: true,
        message: 'Por favor ingresa la URL del stream de video de la cámara',
        trigger: 'blur'
    }]
};

export default {
    name: 'CameraEditor',

    components: {
        MapLocate
    },

    props: {
        cameraId: {
            type: [Number, String],
            required: true
        },
        edit: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            initLocation: initLocation,
            loading: false,
            alert: null,
            rules: rules
        };
    },

    computed: {
        camera() {
            this.$store.dispatch('cameras/getItem', this.cameraId);
            return this.$store.state.cameras.items[this.cameraId];
        }
    },

    methods: {

        onParamChange(data) {
            this.$store.dispatch('cameras/updateItem', {
                item: { id: this.cameraId, ...data }, 
                persist: false
            });
        },

        onConfirm() {
            const form = this.$refs.form;
            if (form) {
                form.validate((valid, fields) => {
                    if (valid) {
                        this.submit();
                    }
                }); 
            }
        },

        submit() {
            const action = this.edit ? 
                'cameras/updateItem' : 'cameras/createItem';
            this.$store.dispatch(action, {
                item: this.camera,
                persist: true
            }).then(camera => {                
                this.loading = false;
                this.$emit('confirm', camera.id);
            }).catch((error) => {                
                this.$log.error(error);
                this.loading = false;
            });
        },

        validate(prop, valid, errorMsg) {
            if (!valid) {
                this.alert = {
                    type: 'error',
                    text: errorMsg
                };
            } else {
                this.alert = null;
            }
        }
    }
};
</script>

<style lang="scss">

.camera-editor {
    .el-input-number input {
        text-align: left;
    }
    .map-locate {
        width: 100%;
        height: 400px;
    }
}

</style>
