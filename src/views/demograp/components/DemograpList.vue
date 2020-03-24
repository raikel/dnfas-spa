<template>

<div class="demograp-list">

    <div
        v-if="subjects.length"
        class="item-list"
    >
        <demograp-item
            v-for="subject in subjects"
            :key="subject.id"
            :subject="subject"
            class="p-1"          
        >
        </demograp-item>
    </div>

    <empty
        v-else
        title="Sin elementos"
        message="No existen resultados para mostrar"
        icon-size="3em"
        height="320px"
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
        :total="subjectCount"
        @current-change="updatePage"
    ></el-pagination>
</div> 

</template>

<script>

import { mapGetters } from 'vuex';
import Empty from '@/components/Empty';
import DemograpItem from './DemograpItem';

export default {
    name: 'DemograpList',

    components: {
        DemograpItem,
        Empty
    },

    props: {
    },

    data() {
        return {
        };
    },

    computed: {
        ...mapGetters({
            subjects: 'demograp/sortedItems'
        }),
        pageNumber: function() {
            return this.$store.state.demograp.pageNumber + 1;
        },
        pageSize: function() {
            return this.$store.state.demograp.pageSize;
        },
        subjectCount: function() {
            return this.$store.state.demograp.count;
        }
    },

    methods: {
        update() {
            this.updateList();
        },

        updatePage: function(number) {
            this.$store.dispatch('demograp/setPage', number - 1);
            this.updateList();
        },

        updateList: function() {
            this.$store.dispatch('demograp/fetchItems');
        }
    }
    
};
</script>

<style lang="scss">

.demograp-list {
    .item-list {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
    }
}

</style>

