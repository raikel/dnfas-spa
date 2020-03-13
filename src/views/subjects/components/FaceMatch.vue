<template>
    <div class="face-match" :style="{height: height}">
        <el-button 
            plain 
            icon="el-icon-arrow-left" 
            type="primary" 
            @click="$emit('prev')"
        ></el-button>

        <img
            v-if="leftImage" 
            class="left-image" 
            :src="leftImage" 
            alt="" 
            :style="{width: width}"
        >
        <empty
            v-else
            message="detecciones"
            icon-size="2em"
            height="100%"
            icon="el-icon-user-solid"
            icon-margin="4px"
            background="#eee"
            :style="{width: width}"
        ></empty>

        <div v-if="rightImage">
            
        </div>

        <router-link
            v-if="rightImage && route"
            :to="route"
            :style="{width: width, height: '100%'}"
        >
            <image-overlay 
                :image="rightImage"
                height="100%" 
                :width="width"
                background="rgba(0, 0, 0, 0.2)"
            >
            </image-overlay>
        </router-link>
        
        <image-overlay
            v-else-if="rightImage && !route"
            :image="rightImage"
            height="100%" 
            :width="width"
            background="rgba(0, 0, 0, 0.2)"
        >
        </image-overlay>     

        <empty
            v-else
            message="coincidencias"
            icon-size="2em"
            height="100%"
            icon="el-icon-connection"
            background="#eee"
            icon-margin="4px"
            :style="{width: width}"
        ></empty> 
        <el-button 
            plain 
            icon="el-icon-arrow-right" 
            type="primary" 
            @click="$emit('next')"
        ></el-button>            
    </div>
</template>

<script>

import Empty from '@/components/Empty';
import ImageOverlay from '@/components/ImageOverlay';

export default {
    name: 'FaceMatch',

    components: {
        Empty,
        ImageOverlay
    },

    props: {
        route: {
            type: Object,
            default: null
        },
        leftImage: {
            type: String,
            default: ''
        },
        leftText: {
            type: String,
            default: 'Imagen no válida'
        },
        rightImage: {
            type: String,
            default: ''
        },
        rightText: {
            type: String,
            default: 'Imagen no válida'
        },
        height: {
            type: String,
            default: '160px'
        },
        width: {
            type: String,
            default: 'px'
        }
    }
};
</script>

<style lang="scss">

.face-match {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    .left-image {
        height: 100%;
        width: 100%;
        object-fit: cover;
        border-radius: 6px;
    }
    .image-overlay img.main-image {
        border-radius: 6px;
    }
    .empty-image {
        background: #000000;
        color: #ffffff;
        height: 100%;
        text-align: center;
        vertical-align: middle;
        font-size: 12px;
        padding: 16px;
        display: flex;
        align-items: center;
    }
    .el-button {
        padding: 2px;
        background: none;
    }
}

</style>
