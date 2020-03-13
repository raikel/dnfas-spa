<template>
    <div v-if="subject" class="subject-details">
        <div v-if="subject.image" class="main">
            <div class="frame-wraper">
                <div v-if="selFace && selFrame">
                    <img class="face-frame" :src="selFrame.image" alt="">
                    <div v-if="timestamp" class="frame-timestamp">
                        {{ timestamp }}
                    </div>
                    <focus-area
                        :box="selFace.box"
                        :highlight="true"
                    ></focus-area>
                </div>
                <div v-else-if="selFace">
                    <img class="face-frame" :src="selFace.image" alt="">
                    <div v-if="timestamp" class="frame-timestamp">{{ timestamp }}</div>
                </div>
            </div>            
            <thumbs-list
                v-model="selFaceIndex"
                :thumbs="thumbs"
                class="mt-3"
            ></thumbs-list>
        </div>

        <empty
            v-else
            title="Sin imágenes"
            message="Aún no se ha registrado ninguna imagen"
            icon="el-icon-camera-solid"
            icon-size="4em"
            height="600px"
            class="main"
        ></empty>

        <div class="control-panel ml-3">

            <div class="action-bar mb-3">
                <tool-button
                    class="mx-1"
                    tooltip="Actualizar en tiempo real" 
                    icon="el-icon-timer"
                    :active="autoUpdate"
                    @click="autoUpdate = !autoUpdate"
                ></tool-button>

                <tool-button
                    class="mx-1"
                    tooltip="Editar datos" 
                    icon="el-icon-edit-outline"
                    @click="showEditorDialog = true"
                ></tool-button>

                <tool-button
                    class="mx-1"
                    tooltip="Elimimar sujeto" 
                    icon="el-icon-delete"
                    @click="showDeleteDialog = true"
                ></tool-button> 
            </div>

            <h3 class="mb-2">Datos</h3>
            <el-card class="mb-3">                 
                <div class="info-item">
                    <div class="info-label">
                        <i class="el-icon-user-solid"></i>
                        Nombre
                    </div>
                    <div class="info-value">
                        {{ subject.fullName || 'No identificado' }}
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-label">
                        <i class="el-icon-s-claim"></i>
                        Edad
                    </div>
                    <div class="info-value">{{ subject.age | ageFilter }}</div>
                </div>
<!--                 <div v-if="source" class="info-item">
                    <div class="info-label">
                        <i class="el-icon-video-camera-solid"></i> 
                        {{ source.label }}
                    </div>
                    <div class="info-value">
                        <router-link 
                            :to="source.route"
                            class="link"
                        >
                            {{ source.value }}
                        </router-link>
                    </div>
                </div> -->
                <div v-if="selFace && timestamp" class="info-item">
                    <div class="info-label">
                        <i class="el-icon-date"></i> 
                        Marca de tiempo
                    </div>
                    <div class="info-value">{{ timestamp }}</div>
                </div>                
            </el-card>           
        </div>

        <el-dialog
            title="Advertencia"
            :visible.sync="showDeleteDialog"
            width="400px"
            center
        >
            <p>
                ¿Seguro deseas eliminar este registro de forma permanente? 
                Se eliminarán todos los datos asociados, incluyendo cualquier imagen.
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDeleteDialog = false">Cancelar</el-button>
                <el-button type="primary" @click="confirmDelete">Confirmar</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="Editar registro"
            :visible.sync="showEditorDialog"
            width="480px"
            center
        >
            <subject-editor
                :edit="true"
                @created="onSubjectEditorCreated"
                @cancel="showEditorDialog = false"
            ></subject-editor>
        </el-dialog>
    </div>
</template>

<script>

/* import StepButtons from '@/components/StepButtons'; */
import FocusArea from '@/components/FocusArea';
import ToolButton from '@/components/ToolButton';
import ThumbsList from '@/components/ThumbsList';
import Empty from '@/components/Empty';
import AutoUpdate from '@/mixins/AutoUpdate';
import SubjectEditor from './SubjectEditor';
import { toInteger } from '@/lib';
import filters from '@/filters';

export default {
    name: 'SubjectDetails',

    components: {
        FocusArea,
        ToolButton,
        Empty,
        SubjectEditor,
        ThumbsList
    },

    mixins: [AutoUpdate],

    props: {
        subjectId: {
            type: [Number, String],
            required: true
        }
    },

    data: function() {
        return {
            selFaceIndex: 0,
            showEditorDialog: false,
            showDeleteDialog: false,
            autoUpdate: false
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
                this.subject.faces.forEach((faceId, ind) => {
                    this.$store.dispatch('faces/getItem', faceId);
                    const face = this.$store.state.faces.items[faceId];
                    if (face) {
                        faces[ind] = face;
                    }
                });
            }
            return faces;
        },
        selFace() {
            return this.faces[this.selFaceIndex];
        },
        selFrame() {
            const selFace = this.faces[this.selFaceIndex];
            if (selFace && selFace.frame) {
                const frameId = selFace.frame;
                this.$store.dispatch('frames/getItem', frameId);
                return this.$store.state.frames.items[frameId];
            }
            return undefined;
        },
        thumbs() {
            const thumbs = [];
            this.faces.forEach((face, ind) => {
                if (face && face.image) {
                    thumbs.push({
                        id: ind,
                        image: face.image
                    });
                }
            });
            return thumbs;
        },
        timestamp() {
            if (this.selFace) {
                return filters.dateTimeFilter(this.selFace.timestamp);
            }            
            return '';
        },
        source() {
            if (this.task) {
                const videoId = this.task['video'];
                const cameraId = this.task['camera'];
                if (toInteger(videoId)) {
                    return {
                        label: 'Registro de video ',
                        value: 'Registro de video ' + videoId,
                        route: {
                            name: 'VideoDetails', 
                            params: { videoId: videoId }
                        }
                    };
                } else if (toInteger(cameraId)) {
                    return {
                        label: 'Cámara ',
                        value: 'Cámara ' + cameraId,
                        route: {
                            name: 'CameraDetails', 
                            params: { cameraId: cameraId }
                        }
                    };
                }
            }
            return null;
        }
    },

    created() {
        this.update();
    },

    methods: {
        confirmDelete() {
            this.$store.dispatch(
                'subjects/destroyItem', this.subjectId
            ).then(() => {
                this.$router.push({ name: 'Subjects' });
            });
        },

        update() {
            this.$store.dispatch('subjects/retrieveItem', this.subjectId);
        },

        onSubjectEditorCreated() {
            this.showEditorDialog = false;
        },

        onFaceSelected(index) {
            this.selFaceIndex = index;
        }
    }
};
</script>

<style lang="scss">
.subject-details {

    display: flex;
    align-items: flex-start;

    .main {
        flex-grow: 1;
    }

    .frame-wraper {
        position: relative;
        width: 100%;
        
        .face-frame {
            width: 100%;
        }
        .frame-timestamp {
            position: absolute;
            bottom: 16px;
            left: 16px;
            color: white;
            padding: 2px 4px;
            border-radius: 4px;
            background: rgba($color: #000000, $alpha: 0.5);
            font-weight: 600;
            letter-spacing: 0.16em;
            font-size: 14px;
        }
    }

    .control-panel {
        width: 350px;
        flex-shrink: 0;
    }

    .action-bar {
        display: flex;
        flex-flow: row;
        justify-content: center;
        align-items: flex-start;
    }

    .info-item {
        margin-bottom: 16px;
        font-size: 14px;        
        &:last-child {
            margin-bottom: 0;
        }
    }

    .info-label {
        font-size: 16px;    
        margin-bottom: 6px;
        font-weight: 600;
        padding-bottom: 2px;
        border-bottom: 1px solid #43a047;
    }
}
</style>
