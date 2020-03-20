<template>

<div class="list-header">        
    <div class="info-count">
        Mostrando {{ showCount }} de {{ totalCount }} resultados
    </div>
    <el-button
        v-if="addButton"
        round 
        type="primary" 
        icon="el-icon-plus" 
        @click="$emit('create')"
    >
        {{ addText }}
    </el-button>  
</div>

</template>

<script>

export default {
    name: 'ListHeader',

    props: {
        showCount: {
            type: Number,
            required: true
        },
        addButton: {
            type: Boolean,
            default: true
        },
        totalCount: {
            type: Number,
            required: true
        },
        addText: {
            type: String,
            default: 'Nuevo'
        }
    },

    data() {
        return {
        };
    },

    methods: {
    }
};
</script>

<style lang="scss">

.list-header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
}

</style>
