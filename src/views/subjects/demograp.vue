<template>

<div v-if="demograp" class="demograp">
    <div class="main mr-4">
        <div class="charts">            
            <el-card class="bar-chart-card mr-2">
                <h4 class="card-title mb-1"> {{ ageChartData.title }} </h4>
                <bar-chart                            
                    height="300px"
                    xlabel="Edad"
                    ylabel="Número de personas"
                    :chart-data="ageChartData.chart"
                    :max="ageChartData.max"
                >                
                </bar-chart>
            </el-card>

            <el-card class="pie-chart-card">
                <h4 class="card-title mb-1">Distribución por sexo</h4>
                <div class="sex">
                    <div class="sex-chart">
                        <div class="sex-total">
                            <div class="value">{{ sexData.total }}</div>
                            <div class="label">total</div>
                        </div> 
                        <pie-chart
                            :inner-radius="64"
                            :outer-radius="84"
                            :padding-bottom="48"
                            :chart-data="sexData.chart"
                            name="Sexo"
                        >                                          
                        </pie-chart>                    
                    </div>  
                </div>
                <div class="age-stats mt-4">
                    <div class="stat-item mb-2">
                        <div class="label">Edad Promedio (Hombres)</div>
                        <div class="value"> 
                            {{ ageStats.menMean }} 
                        </div>
                    </div>
                    <div class="stat-item mb-2">
                        <div class="label">Edad Promedio (Mujeres)</div>
                        <div class="value"> 
                            {{ ageStats.womenMean }} 
                        </div>
                    </div>
                </div>                          
            </el-card>
        </div>

        <demograp-list class="mt-5"></demograp-list>
    </div>

    <div class="control-panel">
        <div class="action-bar mb-3">
            <tool-button
                class="mx-1"
                tooltip="Actualizar en tiempo real" 
                icon="el-icon-timer"
                :active="autoUpdate"
                @click="autoUpdate = !autoUpdate"
            ></tool-button>
        </div>

        <el-card>
            <subjects-filter @change="onFilterChange">                
            </subjects-filter>
        </el-card>
    </div>
</div>

</template>

<script>
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import ToolButton from '@/components/ToolButton';
import { demograpModel } from '@/store/modules/subjects/models';
import SubjectsFilter from './components/SubjectsFilter';
import DemograpList from './components/DemograpList';

export default {
    name: 'Demograp',

    components: {
        SubjectsFilter,
        DemograpList,
        ToolButton,
        BarChart,
        PieChart
    },

    data() {
        return {
            autoUpdate: false,
            demograp: demograpModel.create()
        };
    },

    computed: {
        ageChartData() {
            const menMax = Math.max(...this.demograp.menAges.counts);
            const womenMax = Math.max(...this.demograp.womenAges.counts);
            return {
                chart: {
                    label: this.labelText(this.demograp.ageLabels),
                    series: [{
                        name: 'Hombres',
                        color: '#43a047',
                        value: this.demograp.menAges.counts
                    }, {
                        name: 'Mujeres',
                        color: '#409eff',
                        value: this.demograp.womenAges.counts
                    }]
                },
                title: 'Distribución por edad',
                max: Math.round(1.2 * Math.max(menMax, womenMax))
            };
        },

        sexData() {
            return {
                chart: [{
                    name: 'Hombres', 
                    value: this.demograp.menCount,
                    itemStyle: {
                        color: '#43a047'
                    }
                }, {
                    name: 'Mujeres', 
                    value: this.demograp.womenCount,
                    itemStyle: {
                        color: '#409eff'
                    }
                }],
                total: (this.demograp.menCount + this.demograp.womenCount)
            };
        },

        ageStats() {
            const data = {
                womenMean: 0,
                manMean: 0
            };
            if (this.demograp.menAges.meanValue) {
                data.menMean = this.demograp.menAges.meanValue.toFixed(1);
            }
            if (this.demograp.womenAges.meanValue) {
                data.womenMean = this.demograp.womenAges.meanValue.toFixed(1);
            }
            return data;
        }
    },

    created() {
        this.updateDemograp();
    },

    methods: {
        onFilterChange() {
            this.updateDemograp();
        },

        updateDemograp() {
            this.$store.dispatch('subjects/fetchDemograp').then(data => {
                this.demograp = data;
            });
        },

        labelText(labels) {
            return labels.map((label, index) => {
                if (index === 0) {
                    return `< ${label}`;
                } else if (index === labels.length - 1) {
                    return `> ${label}`;
                } else {
                    return `${label}-${labels[index + 1]}`;
                }
            });
        }
    }
};
</script>

<style lang="scss">

.demograp {
    display: flex;
    align-items: flex-start;

    .control-panel {
        width: 300px;
        flex-basis: 300px;
        flex-shrink: 0;
    }

    .action-bar {
        display: flex;
        flex-flow: row;
        justify-content: center;
        align-items: flex-start;
    }

    .main {
        flex-grow: 1;
    }

    .card-title {
        text-align: center;
        color: #000;
        font-size: 0.9rem;
    }

    .charts {
        display: flex;
        flex-flow: row nowrap;
        .bar-chart-card {
            flex-grow: 1;
        }
    }

    .sex {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: flex-start;
        .sex-info {
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
    .sex-chart {
        position: relative;
    }
    .sex-total {
        position: absolute;
        left: 0;
        top: -8px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        text-align: center;
        .value {
            font-size: 20px;
            font-weight: 600;
        }
        .label {
            font-size: 12px;
        }
    }

    .age-stats {
        font-size: 12px;
        .stat-item {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
        }
        .value {
            font-weight: 700;
        }
    }
}

</style>
