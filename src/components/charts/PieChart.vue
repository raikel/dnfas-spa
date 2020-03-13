<template>
    <div 
        :style="{ 
            height: `${2 * outerRadius + paddingBottom}px`, 
            width: `${2 * outerRadius + 0.3 * outerRadius}px` 
        }"
    >
    </div>
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import resize from './mixins/resize';

export default {
    mixins: [resize],
    props: {
        name: {
            type: String,
            default: ''
        },
        outerRadius: {
            type: Number,
            required: true
        },
        innerRadius: {
            type: Number,
            default: 0
        },
        paddingBottom: {
            type: Number,
            default: 0
        },
        chartData: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
        };
    },
    watch: {
        chartData: {
            deep: true,
            handler(val) {
                this.updateCharData();
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initChart();
        });
    },
    beforeDestroy() {
        if (this.chart) {
            this.chart.dispose();
            this.chart = null;
        }        
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$el, 'macarons');

            this.chart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    left: 'center',
                    bottom: 0
                },
                series: [
                    {
                        name: this.name,
                        type: 'pie',
                        radius: [this.innerRadius, this.outerRadius],
                        center: ['50%', this.outerRadius + 0.2 * this.outerRadius],
                        animationEasing: 'cubicInOut',
                        animationDuration: 2600,
                        label: {
                            show: false
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        }
                    }
                ]
            });
        },
        updateCharData() {
            if (this.chart) {
                this.chart.setOption({
                    legend: {
                        left: 'center',
                        bottom: 0,
                        data: this.chartData.map(data => data.name)
                    },
                    series: [{
                        data: this.chartData
                    }]
                });
            }            
        }
    }
};
</script>
