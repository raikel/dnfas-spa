<template>

<div v-if="video" class="video-editor">
    <el-alert
        v-if="alert"
        :title="alert.text"
        :type="alert.type"
        show-icon
        class="mb-3"
    ></el-alert>

    <p class="info-text mb-3">
        Indica la ruta de un archivo o directorio del sistema. 
        En caso de indicar un directorio, la aplicación buscará los 
        archivos de video de forma recursiva dentro de este directorio.
    </p>

    <el-form
        ref="form"
        size="small"
        :rules="rules"
        :model="video"
        label-position="top"
        :disabled="loading"
    >
        <el-form-item label="Ruta del archivo o directorio" prop="path">
            <el-input
                :value="video.path"                    
                @input="val => onParamChange({ path: val })" 
            ></el-input>
        </el-form-item>

        <div class="buttons mt-6">
            <el-button
                :disabled="loading"
                size="small"
                type="primary"
                icon="el-icon-check" 
                @click="onConfirm"
            >
                Confirmar
            </el-button>
        </div>
    </el-form>
</div>

</template>

<script>

const rules = {
    path: [{
        required: true,
        message: 'Por favor ingresa la ruta del archivo o directorio',
        trigger: 'blur'
    }]
};

export default {
    name: 'VideoEditor',

    props: {
        videoId: {
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
            alert: null,
            loading: false,
            rules: rules
        };
    },

    computed: {
        video() {
            this.$store.dispatch('videos/getItem', this.videoId);
            return this.$store.state.videos.items[this.videoId];
        }
    },

    methods: {

        onParamChange(data) {
            this.$store.dispatch('videos/updateItem', {
                item: { id: this.videoId, ...data }, 
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
                'videos/updateItem' : 'videos/createItem';
            this.$store.dispatch(action, {
                item: this.video,
                persist: true
            }).then(video => {                
                this.loading = false;
                this.$emit('confirm', video.id);
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

.video-editor {
    .buttons {
        display: flex;
        justify-content: flex-end;
    }
}

</style>
