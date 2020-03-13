<template>
    <div class="list-header">
        
        <div class="info-count">
            Mostrando {{ showCount }} de {{ totalCount }} resultados
        </div>

        <div>
            <el-select
                v-model="order"
                class="action-order"
                placeholder="Odernar por"
                @change="onOrderChange"
            >
                <el-option
                    v-for="option in orderOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                ></el-option>
            </el-select>
            <el-button
                :icon="sortDescent ? 'el-icon-bottom' : 'el-icon-top'"
                :disabled="!order"
                @click="onInvertOrderClick"
            ></el-button>
        </div>  
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
        totalCount: {
            type: Number,
            required: true
        },
        orderOptions: {
            type: Array,
            required: true
        }
    },

    data() {
        return {
            sortDescent: true,
            order: undefined
        };
    },

    methods: {
        onOrderChange() {
            if (this.order) {
                const order = this.sortDescent ? '-' + this.order : this.order;            
                this.$emit('order-change', order);
            }            
        },
        onInvertOrderClick() {
            this.sortDescent = !this.sortDescent;
            this.onOrderChange();
        }
    }
};
</script>

<style lang="scss">
    .list-header {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        .el-select {
            width: 300px;
        }
    }
</style>
