<template>

<div class="step-buttons" :class="{'single': step === 0}">
    <el-button
        v-if="step > 0"
        :disabled="disabled"
        :size="size"  
        type="text"
        @click="$emit('prev')"
    >
        <i class="el-icon-arrow-left"></i> Anterior                
    </el-button>

    <el-button
        v-if="cancel"
        icon="el-icon-close"
        :disabled="disabled" 
        :size="size" 
        @click="$emit('cancel')"
    >
        Cancelar
    </el-button>

    <el-button
        v-if="step !== (nSteps - 1)"
        :disabled="disabled"
        :size="size"
        type="primary"
        @click="$emit('next')"
    >
        Siguiente <i class="el-icon-arrow-right"></i>
    </el-button>

    <el-button
        v-else
        :disabled="disabled"
        :size="size"
        type="primary"
        @click="$emit('confirm')"
    >
        <i class="el-icon-check"></i>
        Confirmar 
    </el-button>
</div>
</template>

<script>

export default {
    name: 'StepButtons',
    
    props: {
        step: {
            type: Number,
            required: true
        },
        nSteps: {
            type: Number,
            required: true
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },
        size: {
            type: String,
            default: 'medium'
        },
        cancel: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style lang="scss">

.step-buttons {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    &.single {
        justify-content: flex-end;
    }
}

</style>
