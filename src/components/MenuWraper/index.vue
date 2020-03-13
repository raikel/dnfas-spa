<template>
    <div class="menu-wraper">
        <el-popover
            width="160"
            placement="right-end"
            :visible-arrow="false"
            trigger="click"
        >
            <div class="menu-button" slot="reference" @clicks.stop>
                <i class="el-icon-more"></i>
            </div>
        </el-popover>        
        <div class="menu">menu</div>
        <slot></slot>
    </div>
</template>

<script>

export default {
    name: 'MenuWraper',

    components: {
    },

    props: {
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
    $menu-button-size: 27px;
    .menu-wraper {
        transition-duration: 200ms;
        transition-property: border;
        border-radius: 12px;
        position: relative;
        .menu-button {
            background-color: #fff;
            border-radius: 100%;
            box-shadow: 0 2px rgba(12, 12, 13, 0.1);
            cursor: pointer;
            height: $menu-button-size; 
            width: $menu-button-size;          
            opacity: 0;
            position: absolute;
            right: calc( -1 * #{$menu-button-size} / 2);
            top: calc( -1 * #{$menu-button-size} / 2);
            transform: scale(0.25);
            transition-duration: 150ms;
            transition-property: transform, opacity;            
            text-align: center;
        }
        .menu {
            position: absolute;
            right: 0;
            top: 0;
            display: none;
        }
        &:hover {
            .menu-button {
                opacity: 1;
                transform: scale(1);
            }
            border: 3px solid rgba(30, 30, 30, 0.1);
        }
    }
</style>
