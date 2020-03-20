<template>

<split-view class="subject-recognition" :action-bar="false">
    <template v-slot:main>
        <div
            v-if="frame"
            v-loading="inProgress"
            element-loading-text="Analizando la imagen..."
            class="frame-wraper"
        >
            <div style="height: 100%; position: relative; display: inline-block">
                <img v-if="frame" :src="frame.image" alt="">
                <focus-area 
                    v-for="face in faces" 
                    :key="face.id" 
                    :box="face.box"
                    :highlight="face.id === selFaceId"
                    @click="onFocusAreaClick(face.id)"
                ></focus-area>
            </div>            
            <div class="laser"></div>
        </div>

        <empty
            v-else
            v-loading="inProgress"
            element-loading-text="Analizando la imagen..."
            title="Imagen de análisis"
            message="Carga una imagen para iniciar el análisis y obtener los resultados"
            icon-size="3em"
            height="490px"
            icon="el-icon-camera-solid"
            background="#eee"
        ></empty> 

        <el-upload                
            class="upload"
            drag
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

        <el-dialog
            v-if="matchData.subjectId"
            :visible.sync="showSubjectDialog"
            width="94%"
            center
        >
            <subject-details :subject-id="matchData.subjectId">
            </subject-details>
        </el-dialog>
    </template>

    <template v-slot:side-actions>
    </template>

    <template v-slot:side-content>
        <div class="output">
            <face-match                
                :left-image="matchData.faceImage"
                :right-image="matchData.subjectImage"
                :route="matchData.subjectRoute"
                right-text="Ninguna coincidencia"
                height="150px"
                width="120px"
                @next="onFaceMatchNext"
                @prev="onFaceMatchPrev"
                @view="onFaceMatchView()"
            >
            </face-match>

            <div class="subject-name">
                {{ matchData.subjectName }}
            </div>

            <div class="stats mt-3">
                <div class="stat">
                    <hexagon :color="matchData.colors.matchesCount" size="68px">                            
                        <div class="stat-value">
                            {{ matchData.matchesCount }}
                        </div>
                    </hexagon>
                    <div class="stat-label"> coincidencias </div>
                </div>

                <div class="stat">
                    <hexagon :color="matchData.colors.matchScore" size="68px">                            
                        <div class="stat-value">
                            {{ matchData.matchScore | percentFilter }}
                        </div>
                    </hexagon>
                    <div class="stat-label"> similitud </div>
                </div>

                <div class="stat">
                    <hexagon :color="matchData.colors.imagesCount" size="68px">                            
                        <div class="stat-value">
                            {{ matchData.imagesCount }}
                        </div>
                    </hexagon>
                    <div class="stat-label"> imágenes </div>
                </div>              
            </div>
        </div>

        <div class="search-size mt-3">
            El sistema ejecutará el reconocimiento facial analizando
            <b>{{ searchSize }}</b> personas registradas.
        </div>

        <div class="controls mt-3">
            <el-form
                ref="params"
                size="small"
                :model="params"
                label-position="top"
                :disabled="inProgress"
                class="mt-3"
            >
                <el-form-item label="Umbral de similitud" prop="threshold">
                    <el-slider
                        v-model="params.threshold" 
                        :min="0"                    
                        :max="100"
                    ></el-slider>
                </el-form-item>

                <el-form-item label="Máximo de coincidencias" prop="maxMatches">
                    <el-input-number 
                        v-model="params.maxMatches"
                        :min="1" 
                        :max="15"          
                    ></el-input-number>
                </el-form-item>
                
                <el-form-item label="Segmento" prop="segments">
                    <el-select
                        v-model="params.segments"
                        multiple
                        placeholder="Seleccionar uno o varios segmentos"
                    >
                        <el-option
                            v-for="(segment, index) in segmentsChoices"
                            :key="index"
                            :label="segment.title"
                            :value="segment.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-button 
                    class="block" 
                    type="primary" 
                    :disabled="inProgress || !frame"
                    @click="onAnalyzeClick"
                >
                    Analizar
                </el-button>
            </el-form>
        </div>
    </template>
</split-view>

</template>

<script>

import { API_URL, getHeader } from '@/api';
import FocusArea from '@/components/FocusArea';
import Hexagon from '@/components/Hexagon';
import Empty from '@/components/Empty';
import FaceMatch from './FaceMatch';
import SubjectDetails from './SubjectDetails';
import SplitView from '@/layout/components/SplitView';

const NO_FACE_MSG = 'No se ha detectado ningún rostro en la imagen ' + 
                    'proporcionada. Prueba reajustar los parámetros de ' + 
                    'análisis para obtener un resultado diferente.';
    
const DETECT_ERROR_MSG = 'Ha ocurrido un error al cargar la imagen al servidor.';

export default {
    name: 'SubjectRecognition',

    components: {
        FocusArea,
        FaceMatch,
        SubjectDetails,
        Hexagon,
        Empty,
        SplitView
    },

    data() {
        return {
            facesId: [],
            selFaceId: null,
            matches: {},
            selMatchInd: 0,            
            frame: null,
            imageUploadName: 'image',
            imageUploadUrl: API_URL + 'frames/',
            imageUploadHeader: getHeader(),
            inProgress: false,
            showSubjectDialog: false,
            params: {
                threshold: 50,
                segments: [],
                maxMatches: 5
            },
            segmentsChoices: []
        };
    },

    computed: {

        searchSize() {
            if (this.params.segments.length === 0) {
                return this.$store.state.subjects.count;
            }
            var size = 0;
            this.params.segments.forEach(segmentId => {
                const segment = this.segmentsChoices.find(s => s['id'] === segmentId);
                size += segment['count'];
            });                
            return size;
        },

        faces() {
            const faces = [];
            this.facesId.forEach(faceId => {
                const face = this.$store.state.faces.items[faceId];
                if (face) {
                    faces.push(face);
                }
            });
            return faces;
        },

        matchData() {
            const data = {
                faceImage: '',
                subjectId: null,
                subjectImage: '',
                subjectRoute: null,
                subjectName: 'No identificado',
                matchesCount: 0,
                imagesCount: 0,
                matchScore: 0,                
                colors: {
                    matchesCount: '#ccc',
                    imagesCount: '#ccc',
                    matchScore: '#ccc'
                }
            };

            const faces = this.$store.state.faces.items;
            const subjects = this.$store.state.subjects.items;

            if (this.selFaceId !== null) {
                const face = faces[this.selFaceId];
                if (face) {
                    data.faceImage = face.image;
                    const matches = this.matches[this.selFaceId];
                    if (matches && matches.length) {
                        data.matchesCount = matches.length;
                        data.colors = {
                            matchesCount: '#e6a23c',
                            imagesCount: '#409eff',
                            matchScore: '#f56c6c'
                        };
                        matches.forEach(match => {
                            const sub = subjects[match.subject];
                            if (sub) {
                                data.imagesCount += sub.faces.length;
                            }
                        });
                        const match = matches[this.selMatchInd];
                        if (match) {
                            data.matchScore = match.score;
                            const subject = subjects[match.subject];
                            if (subject) {
                                data.subjectImage = subject.image;
                                data.subjectId = subject.id;
                                data.subjectName = subject.fullName || 'Persona sin nombre';
                                data.subjectRoute = {
                                    name: 'SubjectDetails',
                                    params: { subjectId: subject.id }
                                };
                            }
                        }
                    }
                }
            }
            return data;
        }
    },

    created() {
        const self = this;
        this.$store.dispatch('subjects/fetchItems');
        this.$store.dispatch('subjectSegments/fetchItems', {
            fields: 'id,title'
        }).then(segments => {
            self.segmentsChoices = segments;
        });
    },

    methods: {

        reset() {
            this.facesId = [];
            this.selFaceId = null;
            this.matches = [];
            this.selMatchInd = 0;
            this.inProgress = false;
        },

        onBeforeUploadImage(file) {
            this.inProgress = true;            
        },

        onSuccessImageUpload(response, file) {
            this.reset();
            this.frame = response;
            this.detectFaces();    
        },

        onImageUploadOnError(err, file, fileList) {
            this.inProgress = false;
            console.log(err);
        },

        onAnalyzeClick() {
            this.reset();
            this.detectFaces();
        },

        detectFaces() {
            this.inProgress = true;

            this.$store.dispatch(
                'frames/detectFaces', this.frame.id
            ).then(facesId => {
                if (facesId.length) {
                    this.facesId = facesId;
                    this.facesId.forEach(faceId => {
                        this.$store.dispatch('faces/getItem', faceId);
                    });                    
                    this.selFaceId = this.facesId[0];
                    this.recognize();
                } else {
                    this.$alert(NO_FACE_MSG, 'Advertencia', {
                        confirmButtonText: 'Aceptar'
                    });
                }
            }).catch((error) => {
                this.$alert(DETECT_ERROR_MSG, 'Error', {
                    confirmButtonText: 'Aceptar'
                });
                this.$log.error(error);
            }).finally(() => {
                this.inProgress = false;
            });
        },

        recognize() {
            if (this.facesId.length === 0) {
                return;
            }

            var nRecognitions = 0;
            this.inProgress = true;
            this.facesId.forEach(faceId => {
                this.$store.dispatch('faceRecos/createItem', {
                    item: {
                        face: faceId,
                        simThresh: this.params.threshold / 100,
                        segments: this.params.segments,
                        maxMatches: this.params.maxMatches
                    },
                    persist: true
                }).then(faceReco => {
                    this.$set(this.matches, faceReco.face, faceReco.matches);
                    faceReco.matches.forEach(match => {
                        this.$store.dispatch('subjects/getItem', match.subject);
                    });
                }).catch(error => {                
                    console.error(error);
                }).finally(() => {
                    nRecognitions++;
                    if (nRecognitions === this.facesId.length) {
                        this.inProgress = false;
                    }                    
                });
            });
        },

        onFocusAreaClick(faceId) {
            this.selFaceId = faceId;
            this.selMatchInd = 0;
        },

        onFaceMatchPrev() {
            if (this.selFaceId !== null) {
                const matches = this.matches[this.selFaceId];
                if (matches) {
                    this.selMatchInd = this.selMatchInd - 1 >= 0 ? 
                        this.selMatchInd - 1 : matches.length - 1;
                }
            }
        },
        onFaceMatchNext() {
            if (this.selFaceId !== null) {
                const matches = this.matches[this.selFaceId];
                if (matches) {
                    this.selMatchInd = this.selMatchInd + 1 < matches.length ? 
                        this.selMatchInd + 1 : 0;
                }
            }            
        },

        onFaceMatchView() {
            this.showSubjectDialog = true;
            /* this.$router.push({
                name: 'SubjectDetails', 
                params: {
                    index: index
                }
            }); */
        }        
    }
};
</script>

<style lang="scss">

.subject-recognition {

    .frame-wraper {
        height: 490px;
        width: 100%;
        position: relative;        
        background: #000000;
        text-align: center;
        overflow: hidden;
        img {
            height: 100%;
            object-fit: contain;
        }
    }

    .output {
        .faces-empty {
            background: #000000;
            height: 250px;
            margin-bottom: 12px;
        }
        .face-match {
            margin-bottom: 12px;
        }
        .subject-name {
            font-weight: 600;
            text-align: center;
            font-size: 14px;
        }
        .stats {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-around;
        }
        .stat-value {
            font-size: 24px;
            font-weight: 600;
            padding-bottom: 2px;
            color: #fff;
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
        }
        .stat-label {
            font-size: 12px;
            text-align: center;
        }

    }

    .search-size {
        width: 100%;
        padding: 6px 8px;
        background-color: #43a0481e;
        font-size: 12px;
        border-radius: 6px;
    }

/*     .laser {
        display: block;
        position: absolute;
        left: 0px;
        top: 50%;
        height: 3px;
        width: 100%;
        background: linear-gradient(to bottom, #43a047, rgb(255, 213, 116), #43a047);
        box-shadow: 0px 0px 10px 4px rgba($color: #43a047, $alpha: 0.5);
        animation: scan 3s ease infinite;
    }
    
    @keyframes scan {
        0% {
            top: 0;
        }
        50% {
            top: 100%;
        }
        100% {
            top: 0;
        }
    } */

    /* .laser {
        display: block;
        position: absolute;
        left: 0px;
        top: 0;
        width: 100%;
        height: 50%;
        background: rgba($color: #000000, $alpha: 0.7);
        border-bottom: 1px solid #00ff00;
        box-shadow: 0px 4px 8px -2px rgba($color: #00ff00, $alpha: 0.5);
        animation: scan 3s ease infinite;
    }

    @keyframes scan {
        0% {
            height: 0;
        }
        50% {
            height: 100%;
        }
        100% {
            height: 0;
        }
    } */
}
</style>
