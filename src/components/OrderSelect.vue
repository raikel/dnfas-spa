<template>

<div class="order-select">
    <div class="flex-row">
        <el-select
            :value="orderBy"
            @change="onChangeOrder"
        >
            <el-option
                v-for="choice in orderChoices"
                :key="choice.value"
                :label="choice.label"
                :value="choice.value"
            ></el-option>
        </el-select>
        <el-button
            :icon="orderDirIcon"
            :disabled="!orderBy"
            class="ml-1"
            size="small"
            @click="onInvertDir"
        ></el-button>
    </div>
</div>

</template>

<script>

export default {
    name: 'OrderSelect',

    props: {
        orderChoices: {
            type: Array,
            default: () => []
        },
        value: {
            type: String,
            default: ''
        }
    },

    data() {
        return {
        };
    },

    computed: {
        orderBy() {
            const orderBy = this.value;
            return this.sortDesc ? orderBy.slice(1) : orderBy;
        },
        sortDesc() {
            return this.value[0] === '-';
        },
        orderDirIcon() {
            return this.sortDesc ? 'el-icon-bottom' : 'el-icon-top';
        }
    },

    methods: {
        onChangeOrder(value) {
            const dir = this.sortDesc ? '-' : '';
            this.$emit('change', dir + value);
        },
        onInvertDir() {
            const dir = this.sortDesc ? '' : '-';
            this.$emit('change', dir + this.orderBy);
        }
    }
};
</script>

<style lang="scss">
</style>
