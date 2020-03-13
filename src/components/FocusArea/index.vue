<template>
    <div 
        class="focus-area" 
        :class="{highlight: highlight, clickable: clickable}" 
        :style="pos"
        @click="$emit('click')"
    >
        <div class="corner tl"></div>
        <div class="corner tr"></div>
        <div class="corner br"></div>
        <div class="corner bl"></div> 
    </div>                       
</template>

<script>

export default {
    name: 'FocusArea',

    props: {
        box: {
            type: Array,
            required: true
        },
        size: {
            type: String,
            default: '12px'
        },
        highlight: {
            type: Boolean,
            default: false
        },
        clickable: {
            type: Boolean,
            default: true
        }
    },

    data: function() {
        return {
            selFaceIndex: 0,
            subjectIndex: this.index
        }
    },

    computed: {
        pos: function() {
            const box = this.box;
            let rect = [box[0], box[1], box[2] - box[0], box[3] - box[1]];
            rect = rect.map(val => { return (100 * val) + '%' });
            return {
                left: rect[0],
                top: rect[1],
                width: rect[2],
                height: rect[3]
            }
        }
    }
};
</script>

<style lang="scss">

.focus-area {
    position: absolute;
    z-index: 1;
/*     top: 0;
    left: 0;
    width: 100%;
    height: 100%; */

    $corner-size: 16px;

    &.clickable:hover {
        cursor: pointer;
    }

    &.highlight {
        z-index: 2;
    }

    background: rgba($color: #43a047, $alpha: 0.2);

    .corner {
        position: absolute;
        width: $corner-size;
        height: $corner-size;
        border: 2px none #00ff00;
        /* border-radius: 3px; */
    }

    &.highlight .corner {
        animation: breathing 1s ease-out infinite normal;
        border-color: red;
    }

    .tl {
        border-left-style: solid;
        border-top-style: solid;
        top: 0;
        left: 0;
    }

    .tr {
        border-right-style: solid;
        border-top-style: solid;
        top: 0;
        left: calc(100% - #{$corner-size});
    }

    .br {
        border-right-style: solid;
        border-bottom-style: solid;
        top: calc(100% - #{$corner-size});
        left: calc(100% - #{$corner-size});
    }

    .bl {
        border-left-style: solid;
        border-bottom-style: solid;
        top: calc(100% - #{$corner-size});
        left: 0;
    }

    @keyframes breathing {
        0% {
            transform: scale(1.0);
        }

        50% {
            transform: scale(1.2);
        }

        100% {
            transform: scale(1.0);
        }
    }
}
</style>
