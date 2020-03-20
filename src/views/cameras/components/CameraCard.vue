<template>

<div 
    v-if="camera" 
    class="camera-card" 
    :class="{'focus': focus}" 
    @click="$emit('click')"
>
    <el-card>        
        <div class="header mb-3">
            <div class="text-lg">{{ camera.name }}</div>
            <div class="led" :class="{active: hasTasks}"></div>
        </div>
        <div class="body">
            <div class="flex-column jb">
                <div class="stat-info big mb-2">
                    <i class="el-icon-camera-solid"></i>
                    <div>
                        <div class="value">
                            {{ camera.framesCount | bigNumberFilter }}
                        </div>
                        <div class="label">Fotogramas</div>
                    </div>                        
                </div>
                <div class="info-line">
                    <div class="label">Ultimo análisis</div> 
                    <div class="date">
                        {{ camera.lastTaskAt | dateTimeFilter }}
                    </div>                        
                </div>
            </div>
            <div>
                <div class="stat-info small time mb-2">
                    <div>
                        <i class="el-icon-time color-success"></i>
                        <span class="value">
                            {{ (camera.processingTime / 3600) | bigNumberFilter }}
                        </span>
                    </div>
                    <div class="label">horas</div>                      
                </div>                    
                <div class="info-item small fps">
                    <div>
                        <i class="el-icon-odometer color-primary"></i>
                        <span class="value">
                            {{ camera.frameRate.toFixed(2) }}
                        </span>
                    </div>
                    <div class="label">FPS</div>                      
                </div>
            </div>
        </div> 
    </el-card>              
</div>

</template>

<script>

export default {
    name: 'CameraCard',

    props: {
        cameraId: {
            type: [Number, String],
            required: true
        },
        focus: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        camera() {
            this.$store.dispatch('cameras/getItem', this.cameraId);
            return this.$store.state.cameras.items[this.cameraId];
        },

        hasTasks() {
            return this.camera.runningTasks > 0;
        }
    }
};
</script>

<style lang="scss">

$background-color:#ffffff;

.camera-card {
     &:hover {
        cursor: pointer;
    }

    &.focus .el-card {
        background-color: #ecf6ed;
    }

    .el-card {
        border: none;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .el-card .body {
        padding: 0px;
        display: flex;
        justify-content: space-between;
    }

    .info-line {
        .label {
            margin-bottom: 4px;
        }
        .date {
            font-size: 14px;
            font-weight: bold;
        }
    }

    .label {
        font-size: 12px;
        font-weight: 300;
    }
}
</style>
