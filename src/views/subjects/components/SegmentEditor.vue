<template>
    <div class="segment-editor">
        <p class="mb-3">Se creará un nuevo segmento de reconocimiento con los {{ subjectsCount }} registros mostrados.</p>

        <el-form
            ref="form"
            :rules="rules"
            :model="segment"
            label-position="top"
            :disabled="inProgress"
        >
            <el-form-item label="Nombre del segmento" prop="title">
                <el-input
                    v-model="segment.title"
                ></el-input>
            </el-form-item>
        </el-form>
        
        <div class="buttons mt-6">
            <el-button 
                @click="onCancelClick"
            >
                Cancelar
            </el-button>

            <el-button 
                type="primary" 
                @click="onConfirmClick"
            >
                Confirmar
            </el-button>
        </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex';
import { SegmentsApi } from '@/api';

export default {
    name: 'SegmentEditor',

    data() {
        return {
            segment: {
                title: undefined
            },

            inProgress: false,

            rules: {
                title: [{
                    required: true,
                    message: 'Por favor completa este campo',
                    trigger: 'blur'
                }]
            }
        }
    },

    computed: {
        ...mapGetters([
            'subjectsCount'
        ])
    },

    methods: {

        onConfirmClick() {
            const self = this;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    const segment = Object.assign(
                        {'disk_cached': true}, 
                        self.$store.state.subjects.filter, 
                        self.segment
                    );
                    self.inProgress = true;
                    
                    SegmentsApi.create(segment)
                        .then(() => {
                            self.$emit('confirm');
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                        .finally(() => {
                            self.inProgress = false;
                        });
                }
            });
        },

        onCancelClick() {
            this.$emit('cancel');
        }
    }
};
</script>

<style lang="scss">

.segment-editor {
    .buttons {
        display: flex;
        justify-content: flex-end;
    }
}

</style>
