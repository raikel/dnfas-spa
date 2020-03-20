<template>

<div v-if="subject" class="subject-editor">
    <div v-if="step === 0">
        <el-carousel 
            v-if="faces.length > 0"
            :autoplay="false" 
            height="300px"
        >
            <el-carousel-item                    
                v-for="face in faces" 
                :key="face.id"
            >
                <image-overlay 
                    :image="face.image" 
                    height="300px" 
                    width="100%"
                >
                    <el-button 
                        icon="el-icon-delete" 
                        type="text"
                        @click="onDeleteFace(face.id)"
                    >
                        Eliminar
                    </el-button>
                </image-overlay>
            </el-carousel-item>
        </el-carousel>
        <empty
            v-else
            v-loading="loading"
            element-loading-text="Analizando la imagen..."
            title="Imágenes"
            message="Selecciona una imagen"
            icon-size="3em"
            height="300px"
            icon="el-icon-camera-solid"
            background="#eee"
        ></empty>

        <el-alert
            v-if="alert"
            :title="alert.text"
            :type="alert.type"
            show-icon
            class="mt-3"
        ></el-alert>

        <el-upload                
            class="upload"
            drag
            multiple
            :name="imageUploadName"
            :action="imageUploadUrl"
            :headers="imageUploadHeader"                
            :before-upload="onBeforeUploadImage"
            :on-success="onSuccessImageUpload"
            :on-error="onImageUploadOnError"
            :disabled="loading"
            :show-file-list="false"
            accept="image/png, image/jpeg"
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
                Arrasta una imagen aquí o <em>haz click para seleccionar</em>
            </div>
        </el-upload>
    </div>

    <el-form
        v-else-if="step === 1"
        ref="step1"
        label-position="top"
        size="small"
        :show-message="false"
        :rules="rules.step1"
        :model="subject"
        :disabled="loading"
        @validate="validate"         
    >
        <el-form-item label="Nombre" prop="name">
            <el-input
                placeholder="Ingresa el nombre del sujeto"
                :value="subject.name"                    
                @input="val => onParamChange({name: val})"                    
            ></el-input>
        </el-form-item>

        <el-form-item label="Apellidos">
            <el-input
                placeholder="Ingresa los apellidos del sujeto"
                :value="subject.lastName"                    
                @input="val => onParamChange({lastName: val})"
            ></el-input>
        </el-form-item>

        <el-form-item label="Fecha de nacimiento" prop="birthdate">
            <el-date-picker
                type="date"
                placeholder="Selecciona una fecha"
                style="width: 100%;"
                :value="subject.birthdate"                    
                @input="val => onParamChange({birthdate: val})"
            ></el-date-picker>
        </el-form-item>

        <el-form-item 
            label="Sexo" 
            prop="sex"
        >
            <el-select
                :value="subject.sex"                    
                @change="val => onParamChange({sex: val})"
            >
                <el-option
                    v-for="sex in sexChoices"
                    :key="sex.value"
                    :label="sex.label"
                    :value="sex.value"
                ></el-option>
            </el-select>
        </el-form-item>

        <el-form-item 
            label="Color de piel" 
            prop="skin"
        >
            <el-select
                :value="subject.skin"                    
                @change="val => onParamChange({skin: val})"
            >
                <el-option
                    v-for="skin in skinChoices"
                    :key="skin.value"
                    :label="skin.label"
                    :value="skin.value"
                ></el-option>
            </el-select>
        </el-form-item>

    </el-form>

    <step-buttons 
        class="mt-5"
        :step="step"
        :n-steps="nSteps"
        :disabled="loading"
        size="small"
        @prev="onPrevStep"
        @next="onNextStep"
        @confirm="onNextStep"
    ></step-buttons>
</div>

</template>

<script>
import { API_URL, getHeader } from '@/api';
import Empty from '@/components/Empty';
import StepButtons from '@/components/StepButtons';
import ImageOverlay from '@/components/ImageOverlay';
import { sexChoices, skinChoices } from './data';

const formRules = {
    step1: {
        name: [{
            required: true,
            message: 'Por favor completa este campo',
            trigger: 'blur'
        }],
        birthdate: [{
            type: 'date',
            message: 'Por favor ingresa una fecha válida',
            trigger: 'blur'
        }]
    }
};

const MULTI_FACE_MSG = 'Advertencia: se ha detectado más de un rostro en la ' + 
                    'imagen. Se asociará solo el primer rostro detectado.';
const NO_FACE_MSG = 'No se pudo detectar ningún rostro en la imagen. Por ' + 
                    'favor verifique el contenido de la imagen.';
const DETECT_ERROR_MSG = 'Ha ocurrido un error al cargar la imagen al servidor.';

export default {
    name: 'SubjectEditor',

    components: {
        Empty,
        ImageOverlay,
        StepButtons
    },
    
    props: {
        subjectId: {
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
            imageUploadName: 'image',
            imageUploadUrl: API_URL + 'frames/',
            imageUploadHeader: getHeader(),
            nSteps: 2,
            step: 0,
            loading: false,
            alert: null,
            sexChoices: sexChoices,
            skinChoices: skinChoices,
            rules: formRules
        };
    },

    computed: {
        subject() {
            this.$store.dispatch('subjects/getItem', this.subjectId);
            return this.$store.state.subjects.items[this.subjectId];
        },
        faces() {
            const faces = [];
            if (this.subject) {
                this.subject.faces.forEach(faceId => {
                    this.$store.dispatch('faces/getItem', faceId);
                    const face = this.$store.state.faces.items[faceId];
                    if (face) {
                        faces.push(face);
                    }
                });
            }
            return faces;
        }
    },

    methods: {

        onParamChange(data) {
            this.$store.dispatch('subjects/updateItem', {
                item: { id: this.subjectId, ...data }, 
                persist: false
            });
        },

        onBeforeUploadImage(file) {
            this.loading = true;
        },

        onSuccessImageUpload(response, file) {
            this.$store.dispatch(
                'frames/detectFaces', response.id
            ).then((faces) => {
                if (faces.length) {
                    const facesId = [faces[0], ...this.subject.faces];
                    this.onParamChange({ faces: facesId});
                    if (faces.length > 1) {
                        this.alert = {
                            type: 'warning',
                            text: MULTI_FACE_MSG
                        };
                    }
                } else {
                    this.alert = {
                        type: 'error',
                        text: NO_FACE_MSG
                    };
                }
            }).catch((error) => {
                this.alert = {
                    type: 'error',
                    text: DETECT_ERROR_MSG
                };
                this.$log.error(error);
            }).finally(() => {
                this.loading = false;
            });       
        },

        onImageUploadOnError(error, file, fileList) {
            this.loading = false;
            this.$log(error);
        },

        onDeleteFace(faceId) {
            this.loading = true;
            const facesId = this.subject.faces.filter(id => id === facesId);
            this.onParamChange({faces: facesId});
            this.$store.dispatch(
                'faces/destroyItem', faceId
            ).catch((error) => {                
                this.$log.error(error);
            })
            .finally(() => {
                this.loading = false;
            });
        },

        onNextStep() {
            if (this.step === 0) {
                this.step++;
            } else {
                const form = this.$refs[`step${this.step}`];
                const nextStep = Math.min(this.nSteps - 1, this.step + 1);
                if (form) {
                    form.validate((valid) => {
                        if (this.step === this.nSteps - 1) {
                            this.submit();
                        } else {
                            this.step = nextStep;
                        }
                    }); 
                } else {
                    this.step = nextStep;
                }   
            }
        },

        onPrevStep() {
            this.step = Math.max(0, this.step - 1);
        },

        submit() {
            const action = this.edit ? 
                'subjects/updateItem' : 'subjects/createItem';
            this.$store.dispatch(action, {
                item: this.subject,
                persist: true
            }).then(subject => {                
                this.loading = false;
                this.$emit('confirm', subject.id);
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
.subject-editor {
    .image-overlay img {
        height: 100%;
        width: 100%;
        background-color: #000000;
        object-fit: contain;
    }
    .el-carousel__item {
        text-align: center;
    }
    .el-carousel__indicators {
        display: none;
    }
}
</style>
