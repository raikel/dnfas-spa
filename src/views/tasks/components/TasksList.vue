<template>

<div class="tasks-list">
    <el-row
        v-if="tasks.length" 
        :gutter="8"
    >
        <el-col
            v-for="task in tasks"
            :key="task.id"
            :xs="24" 
            :sm="12" 
            :md="8" 
            :lg="8" 
            :xl="4"                
        >
            <task-card
                class="mb-2"
                :task-id="task.id"
                :focus="task.id === focusId"
                @click="onTaskClick(task.id)"                
            ></task-card>
        </el-col>
    </el-row>

    <empty
        v-else
        title="Sin elementos"
        message="No existen resultados para mostrar"
        icon-size="3em"
        height="383px"
        icon="el-icon-video-task"
        background="#eee"
    ></empty> 

    <el-pagination 
        hide-on-single-page
        layout="prev, pager, next"
        class="mt-4"
        :page-size="pageSize" 
        :background="true"
        :current-page="pageNumber"
        :total="tasksCount"
        @current-change="updatePage"
    ></el-pagination>       
</div>

</template>

<script>

import { mapGetters } from 'vuex';
import AutoUpdate from '@/mixins/AutoUpdate';
import Empty from '@/components/Empty';
import TaskCard from './TaskCard';

export default {
    name: 'TasksList',

    components: {
        TaskCard,
        Empty
    },

    mixins: [AutoUpdate],

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
            tasks: 'tasks/sortedItems'
        }),
        tasksCount() {
            return this.$store.state.tasks.count;
        },
        pageNumber: function() {
            return this.$store.state.tasks.pageNumber + 1;
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
        updateList: function() {
            this.$store.dispatch('tasks/fetchItems');
        },
        onTaskClick(taskId) {
            const focusId = taskId === this.focusId ? null : taskId;
            this.$emit('update:focus-id', focusId);
        }
    }
};
</script>

<style lang="scss">
</style>
