<template>
    <div class="stat-card">
        <el-card class="info">
            <div class="info-body pb-3">
                <div class="title">{{ title }}</div>
                <div class="value">
                    {{ value }} <span v-if="units" class="units">{{ units }}</span>  
                </div>
            </div>
            <div v-if="footerText" class="info-footer pt-3">
                <i v-if="footerIcon" :class="footerIcon" class="pr-1"></i>
                {{ footerText }}
            </div>
        </el-card>
        <el-card 
            class="icon-box" 
            :style="{background: color}"
        >
            <i :class="icon"></i>
        </el-card>       
    </div>
</template>

<script>

export default {
    name: 'StatCard',

    components: {
    },

    props: {
        color: {
            type: String,
            default: '#43a047'
        },
        icon: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        units: {
            type: String,
            default: ''
        },
        footerText: {
            type: String,
            default: ''
        },
        footerIcon: {
            type: String,
            default: ''
        }
    },

    data() {
        return {
        };
    },

    computed: {
    },

    watch: {
    },

    methods: {
    }
};
</script>

<style lang="scss">
    .stat-card {
        width: 100%;
        position: relative;
        .el-card__body {
            padding: 16px;
        }
        .info {
            margin-top: 24px;
            .title {
                color: #999;
                font-size: 16px;
            }
            .value {
                font-size: 24px;
            }
            .units {
                color: #777;
                font-weight: 400;
                font-size: 65%;
            }
            .info-body {
                border-bottom: 1px solid #eee;
                text-align: right;
            }
            .info-footer {
                font-size: 12px;
                color: #999;
            }
        }
        .icon-box {
            box-shadow: 0px 12px 20px 0px rgba(0, 0, 0, 0.15);
            border: none;
            position: absolute;
            left: 20px;
            top: -20px;
            i {
                font-size: 42px;
                line-height: 56px;
                width: 56px;
                height: 56px;
                color: #ffffff;
                text-align: center;
            }
        }
    }
</style>
