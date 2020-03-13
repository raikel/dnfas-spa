<template>

<div class="cameras-list">

    <list-header 
        class="mb-4"
        :show-count="cameras.length"
        :total-count="camerasCount"
        :order-options="orderOptions"
        @order-change="setOrder"
    ></list-header> 

    <el-row
        v-if="cameras.length" 
        :gutter="8"
    >
        <el-col
            v-for="(camera, index) in cameras"
            :key="index"
            :xs="24" 
            :sm="12" 
            :md="8" 
            :lg="8" 
            :xl="4"                
        >
            <camera-card class="mb-2" :camera-id="camera.id"></camera-card>
        </el-col>
    </el-row>

    <empty
        v-else
        title="Sin elementos"
        message="No existe ninguna cámara que coincida con los criterios de búsqueda"
        icon-size="3em"
        height="383px"
        icon="el-icon-video-camera"
        background="#eee"
    ></empty> 

    <el-pagination 
        :total="camerasCount" 
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
import CameraCard from './CameraCard';

const orderOptions = [    
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
    name: 'CamerasList',

    components: {
        CameraCard,
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
            orderOptions: orderOptions
        };
    },

    computed: {
        ...mapGetters({
            cameras: 'cameras/sortedItems'
        }),
        camerasCount() {
            return this.$store.state.cameras.count;
        },
        pageSize() {
            return this.$store.state.cameras.pageSize;
        }
    },

    methods: {        
        update() {
            this.updateList();
        },

        updatePage: function(number) {
            this.$store.dispatch('cameras/setPage', number - 1);
            this.updateList();
        },

        setOrder(order) {
            this.$store.dispatch('cameras/setOrder', order);
            this.updateList();
        },

        updateList: function() {
            this.$store.dispatch('cameras/fetchItems');
        }
    }
};
</script>

<style lang="scss">
</style>
