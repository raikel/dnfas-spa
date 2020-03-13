<template>
    <div 
        class="image-overlay" 
        :style="{width: width, height: height}"
        :class="{'always-show': alwaysShow}"
    >
        <img :src="image" alt="" class="main-image">
        <div class="hover" :style="{background: background}">
            <div class="content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'ImageOverlay',

    props: {
        image: {
            type: String,
            required: true
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '100%'
        },
        alwaysShow: {
            type: Boolean,
            default: false
        },
        background: {
            type: String,
            default: 'rgba(0, 0, 0, 0.5)'
        }
    }
};
</script>

<style lang="scss">

.image-overlay {
    position: relative;
    height: 100%;

    img.main-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .content {
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
    }

    .hover {
        position: absolute;
        top: 0;
        height: 100%;
        width: 100%;
        opacity: 0;
        transition: all 0.4s ease-in-out 0s;
    }

    &:hover .hover {
        opacity: 1;
    }

    &.always-show .hover {
        opacity: 1;
    }
}

</style>
