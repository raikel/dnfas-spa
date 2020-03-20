<template>
    <split-view class="dashboard-index" :side-panel="false">
    <template v-slot:main>
        <el-row :gutter="8" class="mb-4">
            <el-col :xs="12" :sm="6">
                <stat-card
                    title="Rostros detectados"
                    color="#43a047"
                    icon="el-icon-view"
                    footer-icon="el-icon-date"
                    :footer-text="facesCountStat['updatedAt'] | dateTimeFilter('Actualizado ')"
                    :value="facesCountStat['total'] | bigNumberFilter(3, '+')"                    
                ></stat-card>
            </el-col>
            <el-col :xs="12" :sm="6">
                <stat-card
                    title="Fotogramas analizados"
                    color="#409EFF"
                    icon="el-icon-camera-solid"
                    footer-icon="el-icon-date"
                    :footer-text="framesCountStat['updatedAt'] | dateTimeFilter('Actualizado ')"
                    :value="framesCountStat['total'] | bigNumberFilter(3, '+')"                    
                ></stat-card>
            </el-col>
            <el-col :xs="12" :sm="6">
                <stat-card
                    title="Tiempo de análisis"
                    color="#F56C6C"
                    icon="el-icon-time"
                    footer-icon="el-icon-date"
                    :footer-text="processingTimeStat['updatedAt'] | dateTimeFilter('Actualizado ')"
                    :value="processingTimeStat['total'] / 3600 | bigNumberFilter(3, '+')"
                    units="Hrs"                
                ></stat-card>
            </el-col>
            <el-col :xs="12" :sm="6">
                <stat-card
                    title="Tareas completadas"
                    color="#E6A23C"
                    icon="el-icon-user-solid"
                    footer-icon="el-icon-date"
                    :footer-text="tasksCountStat['updatedAt'] | dateTimeFilter('Actualizado ')"
                    :value="tasksCountStat['total'] | bigNumberFilter(3)"              
                ></stat-card>
            </el-col>
        </el-row>

        <div class="flex-row je mb-4">
            <el-radio-group 
                v-model="statsResolution" 
                class="resolution"
            >
                <el-radio-button label="hour">
                    Ultimas 24 horas
                </el-radio-button>
                <el-radio-button label="day">
                    Ultimos 30 días
                </el-radio-button>
            </el-radio-group>
        </div>

        <el-row :gutter="8" class="mb-4">
            <el-col
                :xs="24" 
                :sm="16"
            >
                <h3 class="mb-2">{{ chartsData[selStatChart].name }}</h3>
                <el-card 
                    class="mb-4" 
                    :style="{height: '380px'}"
                >
                    <el-radio-group 
                        v-model="selStatChart"
                        size="mini"
                        class="stat-choice mb-4"
                    >
                        <el-radio-button
                            v-for="(choice, index) in statChartChoices"
                            :key="index"
                            :label="choice.value"
                        >
                            {{ choice.label }}
                        </el-radio-button>
                    </el-radio-group>

                    <time-series-chart
                        v-if="chartsData[selStatChart].data.value.length"
                        height="300px"
                        :chart-data="chartsData[selStatChart].data"
                        :color="chartsData[selStatChart].color"
                        :name="chartsData[selStatChart].name"
                        :xlabel="statsResolution === 'day' ? 'Fecha' : 'Hora'"
                    >                
                    </time-series-chart>
                    <empty
                        v-else
                        title="Sin datos"
                        message="No existen datos registrados para el período solicitado"
                        icon-size="3em"
                        height="300px"
                        icon="el-icon-data-analysis"
                        background="transparent"
                    ></empty> 
                </el-card>                
            </el-col>

            <el-col 
                :xs="24" 
                :sm="8"
            >
                <h3 class="mb-2">Registros</h3>
                <el-card 
                    class="mb-2"
                    :style="{height: '380px'}"
                >
                    <div class="totals">
                        <div
                            class="item header pb-3"
                        >
                            <div class="label">Nombre</div>
                            <div class="label">Total</div>
                        </div>
                         <div 
                            v-for="(item, index) in totalStats" 
                            :key="index"
                            class="item"
                        >
                            <div class="label">{{ item.label }}</div>
                            <div class="value">{{ item.value }}</div>
                        </div>
                    </div>                                    
                </el-card>
            </el-col>
        </el-row>

        <h3 class="mb-2">Sistema</h3>
        <el-row :gutter="8">
            <el-col 
                :xs="24" 
                :sm="8"
            >                
                <el-card class="chart-card mb-2">
                    <h4 class="card-title">Procesador</h4>
                    <div v-if="!cpuData.empty">
                        <bar-chart                            
                            height="200px"
                            :chart-data="cpuData.utilization"
                            xlabel="Núcleo de CPU"
                            ylabel="Utilización (%)"                            
                            :max="100"
                        >                
                        </bar-chart>
                        <div class="chart-footer mt-2">
                            <div class="item">
                                Utilización media <b>{{ 
                                    cpuData.average.toFixed(1)                                    
                                }}</b> %
                            </div>
                            <div class="item ml-2">
                                Utilización máxima <b>{{ 
                                    cpuData.maximum.toFixed(1) 
                                }}</b> %
                            </div>
                        </div>
                    </div>
                    <empty
                        v-else
                        title="Sin datos"
                        message="Los datos solicitados no están disponibles"
                        icon-size="3em"
                        height="200px"
                        icon="el-icon-s-data"
                        background="transparent"
                    ></empty> 
                </el-card>
            </el-col>

            <el-col 
                :xs="24" 
                :sm="8"
            >
                <el-card class="chart-card mb-2">
                    <h4 class="card-title">Memoria RAM</h4>
                    <div v-if="memoryData.used.value.length">
                        <line-chart                        
                            height="200px"
                            :chart-data="memoryData.used"
                            :max="memoryData.total"
                            xlabel="Tiempo transcurrido (segundos)"
                            ylabel="Memoria utilizada (GB)"
                            color="#409eff"
                            name="Memoria"
                        >                
                        </line-chart>

                        <div class="chart-footer mt-2">
                            <div class="item">
                                Total <b>{{ 
                                    memoryData.total.toFixed(2)                                    
                                }}</b> GB
                            </div>
                            <div class="item ml-2">
                                En uso <b>{{ 
                                    memoryData.used.value[memoryData.used.value.length - 1].toFixed(2) 
                                }}</b> GB
                            </div>
                            <div class="item ml-2">
                                Libre <b>{{ 
                                    memoryData.free.toFixed(2) 
                                }}</b> GB
                            </div>
                        </div>
                    </div>                    
                    <empty
                        v-else
                        title="Sin datos"
                        message="Los datos solicitados no están disponibles"
                        icon-size="3em"
                        height="200px"
                        icon="el-icon-s-data"
                        background="transparent"
                    ></empty> 
                </el-card>                 
            </el-col>

            <el-col 
                :xs="24" 
                :sm="8"
            >
                <el-card class="chart-card mb-2">
                    <h4 class="card-title">Tarjeta de Video</h4>
                    <div v-if="gpuData.memoryUsed.value.length">
                        <line-chart
                            height="200px"
                            :chart-data="gpuData.memoryUsed"
                            :max="gpuData.memoryTotal"
                            xlabel="Tiempo transcurrido (segundos)"
                            ylabel="Memoria utilizada (GB)"
                            color="#f56c6c"
                            name="Memoria"
                        >                
                        </line-chart>

                        <div class="chart-footer mt-2">
                            <div class="item">
                                Memoria utilizada <b>{{ 
                                    gpuData.memoryFree.toFixed(2)                                    
                                }}</b> GB
                            </div>
                            <div class="item ml-2">
                                Temperatura <b>{{ 
                                    gpuData.temperature.toFixed(0) 
                                }}</b> °C
                            </div>
                            <div class="item ml-2">
                                Potencia <b>{{ 
                                    gpuData.powerDraw.toFixed(0) 
                                }}</b> W
                            </div>
                        </div>                       
                    </div>

                    <empty
                        v-else
                        title="Sin datos"
                        message="Los datos solicitados no están disponibles"
                        icon-size="3em"
                        height="200px"
                        icon="el-icon-s-data"
                        background="transparent"
                    ></empty> 
                </el-card>                 
            </el-col>
        </el-row>

        <el-row :gutter="8">
            <el-col 
                :xs="24" 
                :sm="8"
            >
                <el-card class="mb-2 info-card">
                    <h4 class="card-title">Almacenamiento</h4>
                    <div class="disk">
                        <div class="disk-chart">
                            <pie-chart
                                :inner-radius="40"
                                :outer-radius="64"
                                :padding-bottom="48"
                                :chart-data="diskUsageData"
                                name="Almacenamiento"
                            >                                          
                            </pie-chart>
                            <div class="disk-total">
                                <div class="value">{{ diskData.total.toFixed(0) }} GB</div>
                                <div class="label">total</div>
                            </div> 
                        </div>
                        <div class="disk-info ml-3">
                            <div class="info-item">
                                <div class="label">Videos</div>
                                <div class="value">{{ mediaSizesData['videos_size'].toFixed(2) }} GB</div>
                            </div>
                            <div class="info-item">
                                <div class="label">Rostros</div>
                                <div class="value">{{ mediaSizesData['faces_image_size'].toFixed(2) }} MB</div>
                            </div>
                            <div class="info-item">
                                <div class="label">Fotogramas</div>
                                <div class="value">{{ mediaSizesData['frames_image_size'].toFixed(2) }} MB</div>
                            </div>
                        </div>   
                    </div>
                                    
                </el-card>
            </el-col>

            <el-col 
                :xs="24" 
                :sm="8"
            >
                <el-card class="mb-2 info-card">
                    <h4 class="card-title">Sensores de temperatura</h4>
                    <div class="temperature">
                         <div 
                            v-for="(item, index) in temperatureData" 
                            :key="index"
                            class="item"
                        >
                            <div class="label">{{ item.label }}</div>
                            <div class="value">{{ item.value }} °C</div>
                        </div>
                    </div>                                    
                </el-card>
            </el-col>

            <el-col 
                :xs="24" 
                :sm="8"
            >
                <el-card class="mb-2 info-card">
                    <h4 class="card-title">Entrada / Salida</h4>
                    <div class="io">
                        <div 
                            v-for="(item, index) in ioData" 
                            :key="index"
                            class="item"
                        >
                            <div class="label">{{ item.label }}</div>
                            <div class="value">{{ item.value }}</div>
                        </div>
                    </div>                                    
                </el-card>                
            </el-col>
        </el-row>
    </template>
    </split-view>
</template>

<script>

import SplitView from '@/layout/components/SplitView';
import StatCard from './components/StatCard';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import LineChart from '@/components/charts/LineChart';
import TimeSeriesChart from '@/components/charts/TimeSeriesChart';
import Empty from '@/components/Empty';
import AutoUpdate from '@/mixins/AutoUpdate';
import { mapGetters } from 'vuex';

const STAT_CHART_CHOICES = [
    {
        label: 'Rostros detectados',
        value: '0'
    }, {
        label: 'Fotogramas analizados',
        value: '1'
    }, {
        label: 'Tiempo de análisis',
        value: '2'
    }, {
        label: 'Tareas completadas',
        value: '3'
    }
];

export default {
    name: 'DashboardIndex',
    
    components: {
        SplitView,
        StatCard,
        BarChart,
        PieChart,
        LineChart,
        TimeSeriesChart,
        Empty
    },

    mixins: [AutoUpdate],

    props: {
        updateInterval: {
            type: Number,
            default: 2000
        }
    },

    data() {
        return {
            statsResolution: 'day',
            selStatChart: 0,
            statChartChoices: STAT_CHART_CHOICES,
            autoUpdate: true
        };
    },

    computed: {

        ...mapGetters([
            'stats'
        ]),

        facesCountStat() {
            return this.stats['faces_count'][this.statsResolution];
        },

        tasksCountStat() {
            return this.stats['tasks_count'][this.statsResolution];
        },

        framesCountStat() {
            return this.stats['frames_count'][this.statsResolution];
        },

        processingTimeStat() {
            return this.stats['processing_time'][this.statsResolution];
        },

        chartsData() {
            return [
                {
                    name: 'Rostros detectados',
                    color: '#43a047',
                    data: this.facesCountStat.data
                }, {
                    name: 'Fotogramas analizados',
                    color: '#409eff',
                    data: this.framesCountStat.data
                }, {
                    name: 'Tiempo de análisis',
                    color: '#f56c6c',
                    data: this.processingTimeStat.data
                }, {
                    name: 'Tareas completadas',
                    color: '#e6a23c',
                    data: this.tasksCountStat.data
                }
            ];
        },

        totalStats() {
            return [
                {
                    label: 'Sujetos',
                    value: this.stats['stored_subjects']['all']['total']
                }, {
                    label: 'Rostros',
                    value: this.stats['stored_faces']['all']['total']
                }, {
                    label: 'Fotogramas',
                    value: this.stats['stored_frames']['all']['total']
                }, {
                    label: 'Cámaras',
                    value: this.stats['stored_cameras']['all']['total']
                }, {
                    label: 'Videos',
                    value: this.stats['stored_videos']['all']['total']
                }, {
                    label: 'Tareas',
                    value: this.stats['stored_tasks']['all']['total']
                }
            ];
        },

        cpuData() {
            const utilization = this.$store.state.system.info.cpu;
            var average = 0;
            var maximum = 0;
            
            if (utilization.value.length) {
                average = utilization.value.reduce((acc, val) => {
                    return acc + val;
                }) / utilization.value.length;
                maximum = Math.max(...utilization.value);
            }            

            return {
                empty: !utilization.value.length,
                utilization: {
                    label: utilization.label,
                    series: [{
                        name: 'CPU',
                        color: '#43a047',
                        value: utilization.value
                    }]
                },
                average: average,
                maximum: maximum
            };
        },

        memoryData() {
            return this.$store.state.system.info.memory;
        },

        gpuData() {
            return this.$store.state.system.info.gpu;
        },

        diskData() {
            return this.$store.state.system.info.disk;
        },

        temperatureData() {
            return this.$store.state.system.info.temperature.slice(0, 5);
        },

        networkData() {
            return this.$store.state.system.info.network;
        },

        ioData() {
            return [{
                label: 'Lectura en disco',
                value: this.diskData.readBytes.toFixed(3) + ' GB'
            }, {
                label: 'Escritura en disco',
                value: this.diskData.writeBytes.toFixed(3) + ' GB'
            }, {
                label: 'Transmisión de red',
                value: this.networkData.bytesSent.toFixed(2) + ' MB'
            }, {
                label: 'Recepción de red',
                value: this.networkData.bytesRecv.toFixed(2) + ' MB'
            }];
        },

        diskUsageData() {
            return [{
                name: 'En uso', 
                value: this.diskData.used ? this.diskData.used.toFixed(1) : 0,
                itemStyle: {
                    color: '#43a047'
                }
            }, {
                name: 'Libre',
                value: this.diskData.free ? this.diskData.free.toFixed(1) : 0,
                itemStyle: {
                    color: '#409eff'
                }
            }];
        },

        mediaSizesData() {
            const MB = 1024 * 1024;
            const GB = MB * 1024;

            return {
                'faces_image_size': this.stats['faces_image_size']['all']['total'] / MB,
                'frames_image_size': this.stats['frames_image_size']['all']['total'] / MB,
                'videos_size': this.stats['videos_size']['all']['total'] / GB
            };
        }
    },

    created() {
        this.$store.dispatch('stats/fetchStats');
    },

    methods: {
        update() {
            this.$store.dispatch('system/fetchInfo');
        }
    }
};
</script>

<style lang="scss">

.dashboard-index {
    .el-radio-group.resolution {
        width: 350px;
    }
    .el-radio-group.stat-choice {        
        width: 500px;
        .el-radio-button__inner {
            font-size: 12px;
            padding: 4px 8px;
        }
    }
    .totals {
        .item {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #ccc;
            padding: 12px 0;
            font-size: 14px;
        }        
        .value {
            font-weight: 700;
            color: #777;              
        }
        .header {
            font-weight: 700;
            font-size: 16px;
            color: #000;
        }
    }
    .chart-card {
        .el-card__body {
            padding: 16px;
        }
    }
    .card-title {
        text-align: center;
        color: #000;
        font-size: 0.9rem;
    }
    .info-card {
        height: 244px;
    }
    .chart-footer {
        display: flex;
        flex-flow: row nowrap;
        font-size: 12px;
        .item {
            background-color: #ddd;
            border-radius: 3px;
            padding: 2px 4px;
        }
    }
    .disk {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: flex-start;
        .disk-info {
            width: 100%;
            padding-top: 36px;
            .info-item {
                padding: 4px 0;
                display: flex;
                justify-content: space-between;
                font-size: 14px;
            }
            .value {
                font-weight: 700;
                color: #555;                
            }
        } 
    }
    .disk-chart {
        position: relative;
    }
    .disk-total {
        position: absolute;
        left: 46px;
        top: 60px;
        text-align: center;
        .value {
            font-weight: 600;
        }
        .label {
            font-size: 12px;
        }
    }

    .temperature {
        .item {
            display: flex;
            justify-content: space-between;
            border-top: 1px solid #ccc;
            padding: 8px 0;
            font-size: 14px;
        }
        .value {
            font-weight: 700;
            color: #f56c6c;                
        }
    }
    .io {
        .item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 14px;
        }
        .value {
            font-weight: 700;
            font-size: 16px;
            color: #409eff;                
        }
    }
}

</style>
