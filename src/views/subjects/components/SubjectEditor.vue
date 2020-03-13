<template>

<div class="subject-editor">
    <div v-if="activeStep === 0">
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
                        @click="onDeleteFaceClick(face.id)"
                    >
                        Eliminar
                    </el-button>
                </image-overlay>
            </el-carousel-item>
        </el-carousel>
        <empty
            v-else
            v-loading="inProgress"
            element-loading-text="Analizando la imagen..."
            title="Imagen de análisis"
            message="Carga una imagen para iniciar el análisis y obtener los resultados"
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
            :disabled="inProgress"
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
        v-else-if="activeStep === 1"
        ref="step1"
        label-position="top"
        :show-message="false"
        :rules="rules.step1"
        :model="subject"
        :disabled="inProgress"
        @validate="validate"         
    >
        <el-form-item label="Nombre Completo" prop="name">
            <el-input
                placeholder="Ingresa el nombre del sujeto"
                :value="subject.name"                    
                @input="val => onParamChange('name', val)"                    
            ></el-input>
        </el-form-item>

        <el-form-item label="Apellidos">
            <el-input
                placeholder="Ingresa los apellidos del sujeto"
                :value="subject.lastName"                    
                @input="val => onParamChange('lastName', val)"
            ></el-input>
        </el-form-item>

        <el-form-item label="Fecha de nacimiento" prop="birthdate">
            <el-date-picker
                type="date"
                placeholder="Selecciona una fecha"
                style="width: 100%;"
                :value="subject.birthdate"                    
                @input="val => onParamChange('birthdate', val)"
            ></el-date-picker>
        </el-form-item>

        <el-form-item 
            label="Sexo" 
            prop="sex"
        >
            <el-select
                :value="subject.sex"                    
                @change="val => onParamChange('sex', val)"
            >
                <el-option
                    v-for="(sex, index) in sexOptions"
                    :key="index"
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
                @change="val => onParamChange('skin', val)"
            >
                <el-option
                    v-for="(skin, index) in skinOptions"
                    :key="index"
                    :label="skin.label"
                    :value="skin.value"
                ></el-option>
            </el-select>
        </el-form-item>

    </el-form>

    <div class="step-buttons mt-4" :class="{'single': activeStep === 0}">
        <el-button
            v-if="activeStep > 0"
            :disabled="inProgress" 
            type="text"
            @click="prevStep"
        >
            <i class="el-icon-arrow-left"></i> Anterior                
        </el-button>

        <div>
            <el-button
                :disabled="inProgress"
                @click="onCancelClick"
            >
                Cancelar
            </el-button>

            <el-button
                v-if="activeStep !== (nSteps - 1)"
                :disabled="inProgress"
                type="primary"
                @click="nextStep"
            >
                Siguiente <i class="el-icon-arrow-right"></i>
            </el-button>

            <el-button
                v-else
                :disabled="inProgress"
                type="primary"
                @click="onConfirm"
            >
                <i class="el-icon-check"></i>
                Confirmar 
            </el-button>    
        </div>                    
    </div>
</div>

</template>

<script>
import { API_URL, getHeader } from '@/api';
import { subjectModel } from '@/store/modules/subjects/models';
import Empty from '@/components/Empty';
import ImageOverlay from '@/components/ImageOverlay';

const FORM_RULES = {
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
    }};

const SEX_OPTIONS = [{
    label: 'Hombre',
    value: subjectModel.SEX_MAN
}, {
    label: 'Mujer',
    value: subjectModel.SEX_WOMAN
}];

const SKIN_OPTIONS = [{
    label: 'Blanca',
    value: subjectModel.SKIN_WHITE
}, {
    label: 'Negra',
    value: subjectModel.SKIN_BLACK
}, {
    label: 'Morena',
    value: subjectModel.SKIN_BROWN
}];

const MULTI_FACE_MSG = 'Advertencia: se ha detectado más de un rostro en la ' + 
                    'imagen. Se asociará solo el primer rostro detectado.';
const NO_FACE_MSG = 'No se pudo detectar ningún rostro en la imagen. Por ' + 
                    'favor verifique el contenido de la imagen.';
const DETECT_ERROR_MSG = 'Ha ocurrido un error al cargar la imagen al servidor.';

export default {
    name: 'SubjectEditor',

    components: {
        Empty,
        ImageOverlay
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
            activeStep: 0,
            inProgress: false,
            alert: null,
            sexOptions: SEX_OPTIONS,
            skinOptions: SKIN_OPTIONS,
            rules: FORM_RULES
        };
    },

    computed: {
        subject() {
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

        onParamChange(key, value) {
            this.$store.dispatch('subjects/updateItem', {
                item: { 
                    id: this.subjectId, 
                    [key]: value 
                }, 
                persist: false
            });
        },

        onBeforeUploadImage(file) {
            this.inProgress = true;
        },

        onSuccessImageUpload(response, file) {
            this.$store.dispatch(
                'frames/detectFaces', response.id
            ).then((faces) => {
                if (faces.length) {
                    const facesId = [faces[0], ...this.subject.faces];
                    this.onParamChange('faces', facesId);
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
                this.inProgress = false;
            });       
        },

        onImageUploadOnError(error, file, fileList) {
            this.inProgress = false;
            this.$log(error);
        },

        onDeleteFaceClick(faceId) {
            this.inProgress = true;
            const facesId = this.subject.faces.filter(id => id === facesId);
            this.onParamChange('faces', facesId);
            this.$store.dispatch(
                'faces/destroyItem', faceId
            ).catch((error) => {                
                this.$log.error(error);
            })
            .finally(() => {
                this.inProgress = false;
            });
        },

        nextStep() {
            if (this.activeStep === 0) {
                this.activeStep++;
            } else {
                const form = this.$refs[`step${this.activeStep}`];
                const nextStep = Math.min(this.nSteps - 1, this.activeStep + 1);
                if (form) {
                    form.validate((valid) => {
                        if (valid) {
                            this.activeStep = nextStep;
                        }
                    }); 
                } else {
                    this.activeStep = nextStep;
                }   
            }
        },

        prevStep() {
            this.activeStep = Math.max(0, this.activeStep - 1);
        },

        onConfirm() {
            const action = this.edit ? 
                'subjects/updateItem' : 'subjects/createItem';
            this.$store.dispatch(action, {
                item: this.subject,
                persist: true
            }).then(() => {                
                this.inProgress = false;
                this.reset();
                this.$emit('confirm');
            }).catch((error) => {                
                this.$log.error(error);
                this.inProgress = false;
            });
        },

        onCancelClick() {
            this.reset();
            this.$emit('cancel');
        },

        reset() {
            this.alert = null;
            this.activeStep = 0;
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

    .upload {
        display: flex;
        flex-flow: column nowrap;
        margin-bottom: 25px;
    }
    .el-upload {
        border: none;
        width: 100%;
        height: auto;
        margin-top: 16px;
    }
    .el-upload-dragger {
        width: 100%;        
        height: 84px;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        line-height: initial;
    }
    .el-upload-list--picture-card {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
    }
    .el-upload-dragger .el-icon-upload {
        margin: 12px 0 8px 0;
        font-size: 32px;
        line-height: initial;
        /* display: none */
    }
    .step-buttons {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
    }
    .step-buttons.single {
        justify-content: flex-end;
    }
    .el-form-item__label {
        line-height: 1em;
        padding-bottom: 6px;
    }
}
</style>
