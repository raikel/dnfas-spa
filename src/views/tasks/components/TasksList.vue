<template>

<div class="tasks-list">

    <list-header 
        class="mb-4"
        :show-count="tasks.length"
        :total-count="tasksCount"
        :order-options="orderOptions"
        @order-change="setOrder"
    ></list-header> 

    <el-row
        v-if="tasks.length" 
        :gutter="8"
    >
        <el-col
            v-for="(task, index) in tasks"
            :key="index"
            :xs="24" 
            :sm="12" 
            :md="8" 
            :lg="8" 
            :xl="4"                
        >
            <task-card
                class="mb-2"
                :task-id="task.id"                  
            ></task-card>
        </el-col>
    </el-row>

    <empty
        v-else
        title="Sin elementos"
        message="No existe ninguna cámara que coincida con los criterios de búsqueda"
        icon-size="3em"
        height="383px"
        icon="el-icon-video-task"
        background="#eee"
    ></empty> 

    <el-pagination 
        :total="tasksCount" 
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
import Empty from '@/components/Empty';
import ListHeader from '@/components/ListHeader';
import TaskCard from './TaskCard';

const ORDER_OPTIONS = [    
    {
        label: 'Fecha y hora', 
        value: 'created_at'
    }, {
        label: 'Nombre', 
        value: 'name'
    }, {
        label: 'Ubicación', 
        value: 'address'
    }
];

export default {
    name: 'TasksList',

    components: {
        TaskCard,
        Empty,
        ListHeader
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
            tasks: 'tasks/sortedItems'
        }),
        tasksCount() {
            return this.$store.state.tasks.count;
        },
        pageSize() {
            return this.$store.state.tasks.pageSize;
        }
    },

    methods: {        
        update() {
            this.updateList();
        },

        updatePage: function(number) {
            this.$store.dispatch('tasks/setPage', number - 1);
            this.updateList();
        },

        setOrder(order) {
            this.$store.dispatch('tasks/setOrder', order);
            this.updateList();
        },

        updateList: function() {
            this.$store.dispatch('tasks/fetchItems');
        }
    }
};
</script>

<style lang="scss">
</style>
