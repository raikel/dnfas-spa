<template>
    <div class="week-days">
        <el-checkbox-group 
            v-model="selDays"
            @change="onChange"
        >
            <el-checkbox-button                
                v-for="(day, index) in days" 
                :key="index"
                :label="day.value"
            >
                {{ day.label }}
            </el-checkbox-button>
        </el-checkbox-group>
    </div>
</template>

<script>
export default {
    name: 'WeekDays',

    props: {
        value: {
            type: String,
            default: ''
        }
    },

    data: function() {
        return {
            selDays: [],
            days: [{
                label: 'L',
                value: '0'
            }, {
                label: 'M',
                value: '1'
            }, {
                label: 'M',
                value: '2'
            }, {
                label: 'J',
                value: '3'
            }, {
                label: 'V',
                value: '4'
            }, {
                label: 'S',
                value: '5'
            }, {
                label: 'D',
                value: '6'
            }]                
        };
    },

    watch: {
        value(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.selDays = newVal.split('');
            }            
        }
    },

    methods: {
        onChange(val) {
            this.$emit('input', val.join(''));
        }
    }
};
</script>

<style lang="scss">
</style>

