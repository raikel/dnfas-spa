<template>

<div v-if="subject" class="subject-faces">
    
    <div v-if="subject.image" class="main">
        <div class="frame-wraper">
            <div v-if="selFace && selFrame" class="frame">
                <img class="face-frame" :src="selFrame.image" alt="">
                <focus-area
                    :box="selFace.box"
                    :highlight="true"
                ></focus-area>
            </div>
            <div v-else-if="selFace" class="frame">
                <img class="face-frame" :src="selFace.image" alt="">
            </div>
            <div v-if="timestamp" class="frame-timestamp">
                {{ timestamp }}
            </div>
        </div>            
        <thumbs-list
            v-model="selFaceId"
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
</div>

</template>

<script>

/* import StepButtons from '@/components/StepButtons'; */
import FocusArea from '@/components/FocusArea';
import ThumbsList from '@/components/ThumbsList';
import Empty from '@/components/Empty';
import filters from '@/filters';

export default {
    name: 'SubjectFaces',

    components: {
        FocusArea,
        Empty,
        ThumbsList
    },

    props: {
        subjectId: {
            type: [Number, String],
            required: true
        }
    },

    data: function() {
        return {
            loading: false,
            selFaceId: null
        };
    },

    computed: {
        subject() {
            this.$store.dispatch('subjects/getItem', this.subjectId);
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
        selFace() {
            return this.$store.state.faces.items[this.selFaceId];
        },
        selFrame() {
            if (this.selFace && this.selFace.frame) {
                const frameId = this.selFace.frame;
                this.$store.dispatch('frames/getItem', frameId);
                return this.$store.state.frames.items[frameId];
            }
            return null;
        },
        thumbs() {
            const thumbs = [];
            this.faces.forEach(face => {
                if (face.image) {
                    thumbs.push({
                        id: face.id,
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
        }
    },

    created() {
        this.$store.dispatch(
            'subjects/getItem', this.subjectId
        ).then(subject => {
            if (subject.faces.length) {
                this.selFaceId = subject.faces[0];
            }
        });
    }
};
</script>

<style lang="scss">

.subject-faces {

    width: 100%;

    .frame-wraper {
        height: 490px;
        width: 100%;
        position: relative;        
        background: #000000;
        text-align: center;
        overflow: hidden;

        .frame {
            height: 100%; 
            position: relative; 
            display: inline-block
        }

        img {
            height: 100%;
            object-fit: contain;
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
}
</style>
