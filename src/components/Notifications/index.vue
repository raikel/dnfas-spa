<template>
    <div class="notifications">
        <el-popover
            v-model="visible"
            placement="bottom"
            width="380"
            trigger="click"
            popper-class="notification-popover"
            @after-leave="onAfterLeave"
        >
            <div class="list">
                <div class="header">
                    <div class="title">Notificaciones</div> 
                    <div 
                        v-if="unseenCount !== 0"
                        class="unseen-count"
                    >
                        {{ unseenCount }}
                    </div>
                </div>
                <div
                    v-if="notifications.length" 
                    class="notification-items"
                >
                    <notification-item
                        v-for="(notification, index) in notifications"
                        :key="index"
                        :notification="notification"
                        @click="visible = false"
                    ></notification-item>
                </div>
                <empty
                    v-else
                    message="No existen notificaciones pendientes"
                    icon-size="2em"
                    height="100px"
                    icon=""
                    background="#f0f0f0"
                ></empty> 
            </div>

            <div 
                slot="reference" 
                class="icon-wrap"
            >
                <svg-icon icon-class="bell"></svg-icon>
                <div v-if="unseenCount !== 0" class="unseen">
                </div>
            </div>            

        </el-popover>         
    </div>    
</template>

<script>

import NotificationItem from './components/NotificationItem';
import Empty from '@/components/Empty';
import notificationsActs from '@/store/modules/notifications/actions.type';

export default {
    name: 'Notifications',

    components: {
        NotificationItem,
        Empty
    },

    data() {
        return {
            visible: false
        };
    },

    computed: {
        notifications() {
            return this.$store.state.notifications.items;
        },
        unseenCount() {
            var count = 0;
            this.notifications.forEach((notification) => {
                count += !notification.seen;
            });
            return count;
        }
    },

    created() {
        this.$store.dispatch(notificationsActs.FETCH_ITEMS);
    },

    methods: {
        onAfterLeave() {
            this.$store.dispatch(notificationsActs.SEE_ALL);
        }
    }
};
</script>

<style lang="scss">

.notifications {
    .svg-icon {
        display: inline-block;
        cursor: pointer;
        fill: #5a5e66;
        width: 20px;
        height: 20px;
        vertical-align: 10px;
    }
    .icon-wrap {
        position: relative;
    }
    .unseen {
        position: absolute;
        top: 10px;
        right: 0;
        background-color: #43a047;
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }
}

.notification-popover {
    padding: 0;
    .header {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        padding: 24px 0;
        .title {
            font-size: 18px;
            font-weight: 700;
            color: #999;      
        }        
        .unseen-count {
            padding: 1px 8px;
            text-align: center;
            border-radius: 8px;
            margin-left: 16px;
            font-weight: 700;
            font-size: 12px;
            color: #fff;
            background-color: #43a047;
        }
    }
}

</style>
