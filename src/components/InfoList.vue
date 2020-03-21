<template>

<div class="info-list">
    <div 
        v-for="(item, index) in nonEmpty" 
        :key="index"
        class="info-item py-2"
        :class="{divider: item.divider}"
    >
        <template v-if="item.value || item.default">
            <div class="text-sm text-w6 color-g5 mb-1 label">
                {{ item.name }}
            </div>
            <div class="text-xs text-w3 value">
                {{ item.value || item.default }}
            </div>
        </template>                
    </div>
</div>

</template>

<script>
export default {
    name: 'InfoList',
    
    props: {
        items: {
            type: Array,
            default: () => []
        }
    },

    computed: {        
        nonEmpty() {
            return this.items.filter(item => {
                return (
                    item.value || item.value === 0 || 
                    item.default || item.default === 0
                );
            });
        }
    }
};
</script>

<style lang="scss">
    .info-list {
        width: 100%;
        .label, .value {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .divider {
            border-bottom: 1px solid #dcdfe6;
        }
    }
</style>
