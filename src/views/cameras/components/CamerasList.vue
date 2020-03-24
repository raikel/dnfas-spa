<template>

<div class="cameras-list">
    <el-row
        v-if="cameras.length" 
        :gutter="8"
    >
        <el-col
            v-for="camera in cameras"
            :key="camera.id"
            :xs="24" 
            :sm="12" 
            :md="8" 
            :lg="8" 
            :xl="4"                
        >
            <camera-card
                class="mb-2"
                :camera-id="camera.id"
                :focus="camera.id === focusId"
                @click="onCameraClick(camera.id)"                
            ></camera-card>
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
        :total="camerasCount"
        @current-change="updatePage"
    ></el-pagination>       
</div>

</template>

<script>

import { mapGetters } from 'vuex';
import AutoUpdate from '@/mixins/AutoUpdate';
import Empty from '@/components/Empty';
import CameraCard from './CameraCard';

export default {
    name: 'CamerasList',

    components: {
        CameraCard,
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
        return {};
    },

    computed: {
        ...mapGetters({
            cameras: 'cameras/sortedItems'
        }),
        camerasCount() {
            return this.$store.state.cameras.count;
        },
        pageNumber: function() {
            return this.$store.state.cameras.pageNumber + 1;
        },
        pageSize() {
            return this.$store.state.cameras.pageSize;
        }
    },

    methods: {       
        updatePage: function(number) {
            this.$store.dispatch('cameras/setPage', number - 1);
            this.updateList();
        },
        updateList: function() {
            this.$store.dispatch('cameras/fetchItems');
        },
        onCameraClick(cameraId) {
            const focusId = cameraId === this.focusId ? null : cameraId;
            this.$emit('update:focus-id', focusId);
        }
    }
};
</script>

<style lang="scss">
</style>
