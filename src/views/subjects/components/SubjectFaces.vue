<template>

<div v-if="subject" class="subject-faces">
    <div class="flex-row js as">
        <div class="face-images mr-3">
            <el-carousel 
                v-if="faces.length > 0"
                :autoplay="false" 
                height="200px"
                @change="ind => curFaceInd = ind"
            >
                <el-carousel-item                    
                    v-for="face in faces" 
                    :key="face.id"
                >
                    <image-overlay 
                        :image="face.image" 
                        height="200px" 
                        width="100%"
                    >
                        <el-button 
                            icon="el-icon-view" 
                            type="text"
                            @click="onViewFace(face.id)"
                        >
                            Eliminar
                        </el-button>
                    </image-overlay>
                </el-carousel-item>
            </el-carousel>
            <empty
                v-else
                v-loading="loading"
                title="Imágenes"
                message="Selecciona una imagen"
                icon-size="3em"
                height="200px"
                icon="el-icon-camera-solid"
                background="#eee"
            ></empty>
        </div>
        
        <info-list :items="infoItems">
        </info-list>  
    </div>
</div>

</template>

<script>

import InfoList from '@/components/InfoList';
import Empty from '@/components/Empty';
import ImageOverlay from '@/components/ImageOverlay';
import { sexChoices, skinChoices } from './data';
import filters from '@/filters';

export default {
    name: 'SubjectFaces',

    components: {
        Empty,
        ImageOverlay,
        InfoList
    },
    
    props: {
        subjectId: {
            type: [Number, String],
            required: true
        }
    },

    data() {
        return {
            loading: false,
            sexChoices: sexChoices,
            skinChoices: skinChoices,
            curFaceInd: 0
        };
    },

    computed: {
        subject() {
            return this.$store.state.subjects.items[this.subjectId];
        },
        faces() {
            const faces = [];
            this.subject.faces.forEach(faceId => {
                this.$store.dispatch('faces/getItem', faceId);
                const face = this.$store.state.faces.items[faceId];
                if (face) {
                    faces.push(face);
                }
            });
            return faces;
        },
        infoItems() {
            const face = this.faces.length ? 
                this.faces[this.curFaceInd] : {};

            const info = [{
                name: 'Sexo estimado',
                value: face.predSex ? sexChoices[face.predSex] : 'No establecido'
            }, {
                name: 'Edad estimada',
                value: face.predAge ? face.predAge.toFixed(1) : 'No establecida'
            }, {
                name: 'Marca de tiempo',
                value: filters.dateTimeFilter(face.createdAt)
            }];
            return info;
        }
    },

    methods: {
        onViewFace() {

        }
    }
};
</script>

<style lang="scss">

.subject-faces {
    .image-overlay img {
        height: 100%;
        width: 100%;
        background-color: #000000;
        object-fit: contain;
        border-radius: 8px;
    }
    .el-carousel__item {
        text-align: center;
    }
    .el-carousel__indicators {
        display: none;
    }
    .face-images {
        width: 150px;
        flex-shrink: 0;
    }
}

</style>
