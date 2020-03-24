<template>

<div
    v-if="subject" 
    class="subject-card" 
    :class="{'focus': focus}" 
    @click="$emit('click')"
>
    <el-card>
        <image-overlay 
            :image="image"
            height="200px" 
            width="100%"
            background="rgba(0, 0, 0, 0.2)"
        ></image-overlay>

        <div class="info px-2 py-2">
            <div class="name pb-1">
                {{ name }}
            </div>
            <div class="date">
                {{ subject.timestamp | dateTimeFilter }}
            </div>

            <div class="stat-info small mr-2 mb-2">
                <div>
                    <i class="el-icon-camera-solid color-primary"></i>
                    <span class="value">
                        {{ subject.faces.length }}
                    </span>
                </div>
                <div class="label">rostros</div>                      
            </div>
        </div>
    </el-card>
</div>

</template>

<script>

import ImageOverlay from '@/components/ImageOverlay';
const defaultImage = require('@/assets/images/unknown-subject.jpg');

export default {
    name: 'SubjectCard',

    components: {
        ImageOverlay
    },

    props: {
        subjectId: {
            type: [Number, String],
            required: true
        },
        focus: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        name() {
            if (this.subject.name || this.subject.lastName) {
                return `${this.subject.name} ${this.subject.lastName}`;
            }
            return 'No identificado';
        },
        subject() {
            this.$store.dispatch('subjects/getItem', this.subjectId);
            return this.$store.state.subjects.items[this.subjectId];
        },        
        image() {
            return this.subject.image || defaultImage;
        }
    }
};

</script>

<style lang="scss">

.subject-card {
    &:hover {
        cursor: pointer;
    }

    &.focus .el-card {
        background-color: #ecf5ff;
    }    

    .el-card {
        border: none;
    }

    .el-card__body {
        padding: 0;
    }

    .name {
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 48px;
    }

    .info {
        position: relative;
    }

    .date {
        font-size: 14px;
    }

    .stat-info {
        position: absolute;
        right: 0;
        bottom: 0;
    }
}
</style>

