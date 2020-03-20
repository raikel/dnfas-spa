<template>
    <div class="split-view">
        <div class="main">
            <el-scrollbar wrap-class="scrollbar-wrapper">
                <div class="p-3 pr-4">
                    <slot name="main"></slot>
                </div>               
            </el-scrollbar>
        </div>

        <div v-if="sidePanel" class="side">
            <div v-if="actionBar" class="action-bar px-3 pb-2 pt-4">
                <slot name="side-actions"></slot>   
            </div>
            <el-scrollbar wrap-class="scrollbar-wrapper" :style="sideStyle">
                <div class="pl-3 pr-4 py-4">
                    <slot name="side-content"></slot>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>

export default {
    name: 'SplitView',

    props: {
        sidePanel: {
            type: Boolean,
            default: true
        },
        actionBar: {
            type: Boolean,
            default: true
        }
    },

    computed: {
        sideStyle() {
            return this.actionBar ? 
                { 'height': 'calc(100% - 70px)' } : { 'height': '100%'};
        }
    }
};
</script>

<style lang="scss">

.split-view {
    display: flex;
    height: 100%;

    .main {
        height: 100%;
        flex: auto;
        .el-scrollbar {
            height: 100%;
        }
    }

    .side {
        height: 100%;
        width: 350px;
        flex-shrink: 0;
        background-color: #fff;
    }

    .action-bar {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ccc;
    }

    .scrollbar-wrapper {
        overflow-x: hidden !important;
    }
}

</style>
