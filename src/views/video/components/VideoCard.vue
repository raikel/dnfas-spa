<template>

<div 
    v-if="video" 
    class="video-card" 
    :class="{'focus': focus}" 
    @click="$emit('click')"
>
    <el-card>
        <div class="thumb">
            <img
                alt="" 
                :src="thumb.image"
                @mouseover="startTimer"
                @mouseleave="stopTimer"
            >
            <div v-if="hasTasks" class="label bg-danger px-1 m-2">
                Analizando
            </div>
        </div>

        <div class="px-2 py-3">
            <div class="flex-row jb ae">
                <div class="mr-1">
                    <div class="date text-sm">
                        {{ video.createdAt | dateTimeFilter }}
                    </div>
                    <div class="duration text-md">
                        {{ video.durationSeconds | timeDurationFilter }}
                    </div>
                </div>
            </div>
        </div>
    </el-card>
</div>

</template>

<script>

export default {
    name: 'VideoCard',

    props: {
        videoId: {
            type: [Number, String],
            required: true
        },
        focus: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            thumbInd: 0,
            timer: null
        };
    },

    computed: {        
        video() {
            this.$store.dispatch('videos/getItem', this.videoId);
            return this.$store.state.videos.items[this.videoId];
        },
        thumb() {
            return this.video.thumbs[this.thumbInd];
        },
        hasTasks() {
            return this.video.runningTasks > 0;
        }
    },

    methods: {
        updateThumb() {
            const nThumbs = this.video.thumbs.length; 
            this.thumbInd = this.thumbInd === (nThumbs - 1) ? 
                0 : (this.thumbInd + 1);
        },

        startTimer() {
            this.stopTimer();
            this.timer = setInterval(this.updateThumb, 800);
        },

        stopTimer: function() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        }
    }

};
</script>

<style lang="scss">

.video-card {
    height: 260px;
    border: none;
    .thumb {
        display: block;
        height: 180px;
        width: 100%;
        background: #000000;
        position: relative;
        img {
            object-fit: cover;
            height: 100%;
            width: 100%;
            &:hover {
                cursor: pointer;
            }
        }
        label {
            position: absolute;
            top: 0;
            right: 0;
        }
    }
    .el-card__body {
        padding: 0;
    }
}

</style>
