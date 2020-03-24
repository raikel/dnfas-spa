<template>

<el-form
    v-if="config"
    ref="form"
    size="small"
    class="vhftask-config"
    label-position="top"
    :show-message="false"
    :rules="rules"
    :model="config"
    :disabled="loading"
    @validate="onValidate" 
>

    <el-form-item label="Personas de interés" prop="huntedSubjects">
        <query-select
            store="subjects"
            :value="config.huntedSubjects"
            @change="val => onParamChange({huntedSubjects: val})"
        ></query-select>
    </el-form-item>
</el-form>

</template>

<script>

import QuerySelect from '@/components/QuerySelect';

const rules = {
};

export default {
    name: 'VhfTaskConfig',

    components: {
        QuerySelect
    },

    props: {
        taskId: {
            type: [Number, String],
            required: true
        }
    },

    data() {
        return {
            loading: false,
            alert: null,
            rules: rules
        };
    },

    computed: {
        config() {
            const task = this.$store.state.tasks.items[this.taskId];
            return task ? task.config : null;
        }
    },

    methods: {

        onParamChange(data) {
            const config = { ... this.config, ...data};
            this.$store.dispatch('tasks/updateItem', {
                item: { id: this.taskId, config: config }, 
                persist: false
            });
        },

        onValidate(prop, valid, errorMsg) {
            if (!valid) {
                this.alert = {
                    type: 'error',
                    text: errorMsg
                };
            } else {
                this.alert = null;
            }
        },

        validate(callback) {
            return this.$refs.form.validate(callback);
        }
    }
};
</script>

<style lang="scss">
</style>
