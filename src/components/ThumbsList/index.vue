<template>
    <div 
        v-if="thumbs.length" 
        class="thumbs-list" 
        :style="{height: height}"
    >
        <img
            v-for="thumb in thumbs"
            :key="thumb.id"                 
            :src="thumb.image"
            :style="{width: width, height: height}"            
            :class="{'selected': value === thumb.id}"
            class="thumb"
            @click="onThumbClick(thumb.id)"
        >          
    </div>    
</template>

<script>

export default {
    name: 'ThumbsList',

    props: {
        height: {
            type: String,
            default: '72px'
        },
        width: {
            type: String,
            default: '60px'
        },
        thumbs: {
            type: Array,
            default: () => []
        },
        value: {
            type: Number,
            default: 0
        }
    },

    data() {
        return {
        };
    },

    methods: {
        onThumbClick(index) {
            this.$emit('input', index);
        }
    }
};
</script>

<style lang="scss">

.thumbs-list  {
    width: 100%;  
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: flex-start;
    .thumb {
        object-fit: cover;
        cursor: pointer;
        margin-right: 8px;
        &.selected {
            border: 2px solid #43a047;
        }
    }
}

</style>
