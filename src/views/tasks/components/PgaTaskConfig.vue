<template>

<el-form
    v-if="config"
    ref="form"
    size="small"
    class="pgatask-config"
    label-position="top"
    :show-message="false"
    :rules="rules"
    :model="config"
    :disabled="loading"
    @validate="onValidate" 
>
    <el-form-item
        label="Marca de tiempo mínima" 
        prop="minCreatedAt"
    >
        <el-date-picker     
            type="datetime"
            placeholder="Seleccionar fecha y hora"
            :value="config.minCreatedAt"                    
            @change="val => onParamChange({minCreatedAt: val})"
        ></el-date-picker>
    </el-form-item>

    <el-form-item
        label="Marca de tiempo máxima" 
        prop="maxCreatedAt"
    >
        <el-date-picker        
            type="datetime"
            placeholder="Seleccionar fecha y hora"
            :value="config.maxCreatedAt"                    
            @change="val => onParamChange({maxCreatedAt: val})"
        ></el-date-picker>
    </el-form-item>

    <el-form-item 
        label="Sobrescribir" 
        prop="overwrite"
        class="switch"
    >
        <el-switch
            :value="config.overwrite"                    
            @change="val => onParamChange({overwrite: val})" 
        ></el-switch>
    </el-form-item>
</el-form>

</template>

<script>

const rules = {
};

export default {
    name: 'PgaTaskConfig',

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
