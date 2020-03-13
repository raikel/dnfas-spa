<template>
    <div :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import resize from './mixins/resize';

export default {
    name: 'TimeSeriesChart',

    mixins: [resize],

    props: {
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '100%'
        },
        color: {
            type: String,
            default: '#00f'
        },
        areaColor: {
            type: String,
            default: 'rgba(255, 0, 0, 0.1)'
        },
        autoResize: {
            type: Boolean,
            default: true
        },
        chartData: {
            type: Object,
            required: true,
            validator: (prop) => {
                /* console.log(prop); */
                if (!prop.value || !prop.label) {
                    return false;
                }
                return true;
            }
        },
        name: {
            type: String,
            default: ''
        },
        max: {
            type: Number,
            default: null
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
        color: function() {
            this.updateColor();
        },
        xlabel: function() {
            this.updateXlabel();
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
            this.chart.setOption({
                xAxis: {
                    /* type: 'time', */
                    name: this.xlabel,
                    data: this.chartData.label,
                    nameLocation: 'center',
                    nameTextStyle: {
                        color: '#777'
                    },
                    nameGap: 32,
                    axisLabel: {
                        textStyle: {
                            color: '#999'
                        }/* ,
                        formatter(value) {
                            if (value) {
                                return Number(value).toFixed(0);
                            }
                            return value;
                        } */
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    z: 10,
                    boundaryGap: false                 
                },
                grid: {
                    show: false,
                    left: 44,
                    right: 10,
                    bottom: 48,
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
                    type: 'value',
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
                    min: 0
                    /* max: Math.ceil(this.max) */
                },
                series: [{
                    symbol: 'none',
                    itemStyle: {
                        color: this.color,
                        lineStyle: {                                
                            width: 4
                        }
                    },
                    areaStyle: {
                        color: this.areaColor
                    },
                    smooth: true,
                    type: 'line',
                    animationDuration: 1000,
                    animationEasing: 'cubicInOut',
                    name: this.name,
                    data: this.chartData.value
                }]
            });
        },

        updateCharData() {
            if (this.chart) {
                if (this.chartData.label.length !== this.chartData.value.length) {
                    return;
                }
                this.chart.setOption({
                    xAxis: {
                        data: this.chartData.label,
                        name: this.xlabel
                    },
                    series: [{
                        name: this.name,
                        data: this.chartData.value,
                        itemStyle: {
                            color: this.color
                        },
                        areaStyle: {
                            color: this.areaColor
                        }
                    }]
                });                
            }            
        },

        updateColor() {
            if (this.chart) {
                this.chart.setOption({
                    series: [{
                        name: this.name,
                        itemStyle: {
                            color: this.color
                        }
                    }]
                });                
            }            
        },

        updateXlabel() {
            if (this.chart) {
                this.chart.setOption({
                    xAxis: {
                        name: this.xlabel
                    }
                });                
            }            
        }
    }
};
</script>
