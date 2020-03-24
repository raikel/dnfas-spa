<template>
    <div class="week-days">
        <el-checkbox-group 
            :value="days"
            @input="onChange"
        >
            <el-checkbox-button                
                v-for="day in dayChoices" 
                :key="day.value"
                :label="day.value"
            >
                {{ day.label }}
            </el-checkbox-button>
        </el-checkbox-group>
    </div>
</template>

<script>

const dayChoices = [{
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
}];

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
            dayChoices: dayChoices            
        };
    },

    computed: {
        days() {
            return this.value.split('');
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

