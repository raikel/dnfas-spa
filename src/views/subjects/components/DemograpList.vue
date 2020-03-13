<template>

<div class="demograp-list">

    <list-header 
        class="mb-4"
        :show-count="subjects.length"
        :total-count="subjectCount"
        :order-options="orderOptions"
        @order-change="setOrder"
    ></list-header>  

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
        message="No existe ningún sujeto que coincida con los criterios de búsqueda"
        icon-size="3em"
        height="825px"
        icon="el-icon-user"
        background="#eee"
    ></empty> 

    <el-pagination 
        :total="subjectCount" 
        :page-size="pageSize" 
        :background="true"
        hide-on-single-page
        layout="prev, pager, next"
        class="mt-4"
        @current-change="updatePage"
    ></el-pagination>
</div> 

</template>

<script>

import { mapGetters } from 'vuex';
import AutoUpdate from '@/mixins/AutoUpdate';
import ListHeader from '@/components/ListHeader';
import Empty from '@/components/Empty';
import DemograpItem from './DemograpItem';

const ORDER_OPTIONS = [    
    {
        label: 'Fecha y hora', 
        value: 'created_at'
    }, {
        label: 'Nombre', 
        value: 'name'
    }, {
        label: 'Edad', 
        value: 'birthdate'
    }
];

export default {
    name: 'SubjectsList',

    components: {
        DemograpItem,
        ListHeader,
        Empty
    },

    mixins: [AutoUpdate],

    props: {
        autoUpdate: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            orderOptions: ORDER_OPTIONS
        };
    },

    computed: {
        ...mapGetters({
            subjects: 'subjects/sortedItems'
        }),
        pageSize: function() {
            return this.$store.state.subjects.pageSize;
        },
        subjectCount: function() {
            return this.$store.state.subjects.count;
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

        setOrder(order) {
            this.$store.dispatch('subjects/setOrder', order);
            this.updateList();
        },

        updateList: function() {
            this.$store.dispatch('subjects/fetchItems');
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

