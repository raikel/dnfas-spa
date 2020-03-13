<template>
    <div class="tool-button" :class="{active: active}">
        <el-tooltip
            v-if="tooltip"
            class="item" 
            effect="dark" 
            :content="tooltip" 
            placement="top-start"
            transition="el-opacity-transition"
        >
            <el-button
                :icon="icon"
                @click="$emit('click')"
            ></el-button>
        </el-tooltip>

        <el-button
            v-else
            :icon="icon"
            @click="$emit('click')"
        ></el-button>
    </div>
</template>

<script>
export default {
    name: 'ToolButton',

    props: {
        tooltip: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            default: false
        }
    },

    computed: {
    },

    methods: {
    }
};
</script>

<style lang="scss">

.tool-button {
    .el-button {
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        border-radius: 12px;
        padding: 12px 14px;
    }
    i {
        font-size: 24px;
    }
    &.active {
        .el-button {
            color: #FFFFFF;
            background-color: #43a047;
            border-color: #43a047;
        }
    }
}
</style>

