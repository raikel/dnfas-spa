<template>
    <div 
        class="notification-item"
        @click="onClick"
    >
        <div class="left">
            <div class="icon">
                <svg-icon 
                    :icon-class="icon.name" 
                    :style="{color: icon.color}"
                ></svg-icon>
            </div>
            <div class="body">
                <div class="title">
                    {{ notification.title }}
                </div>
                <div class="message">
                    {{ notification.message }}
                </div>
                <div class="elapsed">
                    hace {{ notification.timestamp | timeElapsedFilter }}
                </div>
            </div>
        </div>        
        <div 
            v-if="!notification.seen" 
            class="unseen"
        >
        </div>
    </div>    
</template>

<script>

import { Notification } from '@/store/modules/notifications/models';

const ICONS_CHOICES = {
    [Notification.DTYPE_ERROR]: {
        name: 'error', 
        color: '#f56c6c'
    },
    [Notification.DTYPE_WARN]: {
        name: 'warning', 
        color: '#e6a23c'
    },
    [Notification.DTYPE_INFO]: {
        name: 'info', 
        color: '#409eff'
    }
};

export default {
    name: 'NotificationItem',

    props: {
        notification: {
            type: Notification,
            required: true
        }
    },

    data() {
        return {
        };
    },

    computed: {
        icon() {
            return ICONS_CHOICES[this.notification.dtype];
        }
    },

    methods: {
        onClick() {
            this.$emit('click');
            if (this.notification.route) {                
                this.$router.push(this.notification.route);
            }            
        }
    }
};
</script>

<style lang="scss">

.notification-item {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    padding: 16px 12px;
    border-top: 1px solid #ccc;
    &:hover {
        cursor: pointer;
        background-color: #f4f4f4;
    }
    .left {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: flex-start;
        min-width: 0;
    }
    .icon {
        font-size: 28px;
        color: #ccc;
    }
    .body {
        margin: 0 16px;
        min-width: 0;
        .title {
            font-size: 14px;
            font-weight: 700;
            color: #000;
            margin-bottom: 2px;
        }
        .message {
            width: 100%;
            font-size: 13px;
            color: #666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 1px;
        }
        .elapsed {
            font-size: 12px;
            color: #999;
        }
    }
    .unseen {
        background-color: #43a047;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 12px;
        flex-shrink: 0;
    }
    .svg-icon {
        fill: #5a5e66;
        width: 24px;
        height: 24px;
    }
}

</style>
