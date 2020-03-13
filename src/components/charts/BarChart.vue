<template>
    <div :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import resize from './mixins/resize';
import { changeBright } from '@/lib/colors';

const defaultColor = '#555555';
const defaultName = 'Datos';

export default {
    name: 'BarChart',

    mixins: [resize],

    props: {
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '250px'
        },
        color: {
            type: String,
            default: '#555555'
        },
        autoResize: {
            type: Boolean,
            default: true
        },
        chartData: {
            type: Object,
            required: true
        },
        name: {
            type: String,
            default: 'Datos'
        },
        max: {
            type: Number,
            default: undefined
        },
        yGrid: {
            type: Boolean,
            default: true
        },
        xlabel: {
            type: String,
            default: ''
        },
        ylabel: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            chart: null
        };
    },
    watch: {
        chartData: {
            deep: true,
            handler(val) {
                this.updateCharData();
            }
        },
        max() {
            this.updateCharData();
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
            this.setOptions();
        },
        setOptions() {
            const series = [];
            this.chartData.series.forEach((data, index) => {
                const color = data.color || defaultColor;

                const normal = new echarts.graphic.LinearGradient(
                    0, 0, 0, 1, [
                        {offset: 0, color: changeBright(color, 40)},
                        {offset: 0.5, color: changeBright(color, 20)},
                        {offset: 1, color: color}
                    ]
                );

                const emphasis = new echarts.graphic.LinearGradient(
                    0, 0, 0, 1, [
                        {offset: 0, color: changeBright(color, -40)},
                        {offset: 0.7, color: color},
                        {offset: 1, color: color}
                    ]
                );

                series.push({
                    itemStyle: {
                        
                        normal: { color: normal, barBorderRadius: 4 },
                        emphasis: { color: emphasis, barBorderRadius: 4 }                        
                    },
                    type: 'bar',
                    animationDuration: 1000,
                    animationEasing: 'cubicInOut',
                    name: data.name || defaultName + index,
                    data: data.value
                });
            });

            this.chart.setOption({
                xAxis: {
                    name: this.xlabel,
                    nameLocation: 'center',
                    nameTextStyle: {
                        color: '#777'
                    },
                    nameGap: 24,
                    axisLabel: {
                        textStyle: {
                            color: '#999'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    z: 10,
                    data: this.chartData.label
                },
                grid: {
                    show: false,
                    left: 44,
                    right: 10,
                    bottom: 40,
                    top: 10,
                    containLabel: false
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    padding: [5, 10]
                },
                yAxis: {
                    name: this.ylabel,
                    nameLocation: 'center',
                    nameTextStyle: {
                        color: '#777'
                    },
                    nameGap: 30,
                    splitLine: {
                        show: this.yGrid
                    },
                    splitArea: {
                        show: this.yGrid
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#999'
                        }
                    },
                    min: 0,
                    max: Math.ceil(this.max)
                },
                series: series
            });
        },

        updateCharData() {
            if (this.chart) {
                const series = [];
                this.chartData.series.forEach((data, index) => {
                    series.push({
                        name: data.name || defaultName + index,
                        data: data.value
                    });
                });

                this.chart.setOption({
                    xAxis: {
                        data: this.chartData.label
                    },
                    yAxis: {
                        min: 0,
                        max: Math.ceil(this.max)
                    },
                    series: series
                });
            }            
        }
    }
};
</script>
