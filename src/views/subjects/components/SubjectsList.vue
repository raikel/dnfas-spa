<template>

<div class="subjects-list">
    <el-row
        v-if="subjects.length" 
        :gutter="8"
    >
        <el-col
            v-for="subject in subjects"
            :key="subject.id"
            :xs="24" 
            :sm="12" 
            :md="8" 
            :lg="6" 
            :xl="3"                 
        >
            <subject-card
                class="mb-2"
                :subject-id="subject.id"
                :focus="subject.id === focusId"
                @click="onSubjectClick(subject.id)"                
            ></subject-card>
        </el-col>
    </el-row>

    <empty
        v-else
        title="Sin elementos"
        message="No existen resultados para mostrar"
        icon-size="3em"
        height="383px"
        icon="el-icon-user"
        background="#eee"
    ></empty> 

    <el-pagination 
        hide-on-single-page
        layout="prev, pager, next"
        class="mt-4"
        :page-size="pageSize" 
        :background="true"
        :current-page="pageNumber"
        :total="subjectsCount"
        @current-change="updatePage"
    ></el-pagination>       
</div>

</template>

<script>

import { mapGetters } from 'vuex';
import Empty from '@/components/Empty';
import SubjectCard from './SubjectCard';

export default {
    name: 'SubjectsList',

    components: {
        SubjectCard,
        Empty
    },

    props: {
        autoUpdate: {
            type: Boolean,
            default: false
        },
        focusId: {
            type: [Number, String],
            default: null
        }
    },

    data() {
        return {
        };
    },

    computed: {
        ...mapGetters({
            subjects: 'subjects/sortedItems'
        }),
        subjectsCount() {
            return this.$store.state.subjects.count;
        },
        pageNumber: function() {
            return this.$store.state.subjects.pageNumber + 1;
        },
        pageSize() {
            return this.$store.state.subjects.pageSize;
        }
    },

    methods: {        
        update() {
            this.updateList();
        },        
        updatePage: function(number) {
            this.$store.dispatch('subjects/setPage', number - 1);
            this.updateList();
        },
        updateList: function() {
            this.$store.dispatch('subjects/fetchItems');
        },
        onSubjectClick(subjectId) {
            const focusId = subjectId === this.focusId ? null : subjectId;
            this.$emit('update:focus-id', focusId);
        }
    }
};
</script>

<style lang="scss">
</style>
