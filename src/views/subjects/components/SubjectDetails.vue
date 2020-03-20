<template>

<div v-if="subject" class="subject-details">
    <info-list :items="infoItems">
    </info-list>
</div>

</template>

<script>

import InfoList from '@/components/InfoList';
import filters from '@/filters';
import { sexOptions, skinOptions } from './data';

export default {
    name: 'SubjectDetails',

    components: {
        InfoList
    },

    props: {
        subjectId: {
            type: [Number, String],
            required: true
        }
    },

    data: function() {
        return {
        };
    },

    computed: {
        subject() {
            this.$store.dispatch('subjects/getItem', this.subjectId);
            return this.$store.state.subjects.items[this.subjectId];
        },
        infoItems() {
            const subject = this.subject;
            const info = [{
                name: 'Nombre',
                value: subject.fullName,
                default: 'No establecido'
            }, {
                name: 'Fecha de nacimiento',
                value: subject.birthdate ? 
                    filters.dateFilter(subject.birthdate) : 'No establecida'
            }, {
                name: 'Sexo',
                value: subject.sex ? 
                    sexOptions[subject.sex].label : 'No establecido'
            }, {
                name: 'Color de piel',
                value: subject.skin ? 
                    skinOptions[subject.skin].label : 'No establecido'
            }, {
                name: 'Sexo estimado',
                value: subject.predSex ? 
                    sexOptions[subject.predSex].label : 'No establecido'
            }, {
                name: 'Edad estimada',
                value: subject.predAge ? 
                    subject.predAge.toFixed(1) : 'No establecida'
            }, {
                name: 'Fecha de creación',
                value: subject.createdAt ? 
                    filters.dateTimeFilter(subject.createdAt) : 'No establecida'
            }, {
                name: 'Fecha de actualización',
                value: subject.updatedAt ? 
                    filters.dateTimeFilter(subject.updatedAt) : 'No establecida'
            }];

            return info;
        }
    }
};
</script>

<style lang="scss">
</style>
