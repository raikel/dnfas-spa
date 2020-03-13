export default {

    props: {
        updateInterval: {
            type: Number,
            default: 1000
        }
    },

    data() {
        return {
            updateTimer: undefined
        };
    },

    watch: {
        'autoUpdate': function() {
            this.setTimer();
        }
    },

    created() {
        this.setTimer();
    },

    beforeDestroy() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = undefined;
        }
    },

    methods: {
        setTimer() {
            if (this.autoUpdate) {
                if (this.updateTimer) {
                    clearInterval(this.updateTimer);
                }
                const self = this;
                this.updateTimer = setInterval(() => {
                    self.update();
                }, this.updateInterval);
            } else {
                if (this.updateTimer) {
                    clearInterval(this.updateTimer);
                    this.updateTimer = undefined;
                }
            }
        }
    }
};
