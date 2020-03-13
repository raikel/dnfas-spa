<template>
    <div :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import resize from './mixins/resize';

export default {
    name: 'LineChart',

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
            default: '#000000'
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
                    type: 'value',
                    name: this.xlabel,
                    nameLocation: 'center',
                    nameTextStyle: {
                        color: '#777'
                    },
                    nameGap: 24,
                    axisLabel: {
                        textStyle: {
                            color: '#999'
                        },
                        formatter(value) {
                            if (value) {
                                return Number(value).toFixed(0);
                            }
                            return value;
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    z: 10,
                    min: 0,
                    max: 60,
                    data: [],
                    boundaryGap: false,
                    inverse: true                  
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
                    min: 0,
                    max: Math.ceil(this.max)
                },
                series: [
                    {
                        symbol: 'none',
                        itemStyle: {
                            color: this.color,
                            lineStyle: {                                
                                width: 3
                            }
                        },
                        areaStyle: {
                            color: 'rgba(255, 0, 0, 0.1)'
                        },
                        smooth: true,
                        type: 'line',
                        animationDuration: 1000,
                        animationEasing: 'cubicInOut',
                        name: this.name,
                        data: []
                    }
                ]
            });
        },

        updateCharData() {
            if (this.chart) {
                if (this.chartData.time.length !== this.chartData.value.length) {
                    return;
                }
                const now = new Date().getTime();
                const data = [];

                for (let i = 0; i < this.chartData.time.length; i++) {
                    const time = (now - this.chartData.time[i].getTime()) / 1000;
                    if (time < 60.5) {
                        data.push([time, this.chartData.value[i]]);
                    }                    
                }

/*                 console.log(seconds);
                console.log(values); */

                this.chart.setOption({
                    series: [{
                        name: this.name,
                        data: data
                    }]
                });
            }            
        }
    }
};
</script>
