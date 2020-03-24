<template>

<split-view class="demograp-index">
    <template v-slot:main>
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

        <list-header 
            class="mb-3 mt-5"
            :add-button="false"
            :show-count="subjects.length"
            :total-count="subjectsCount"
        ></list-header>

        <demograp-list></demograp-list>
    </template>

    <template v-slot:side-actions>
        <template v-if="panel === 'search'">
            <div class="text-lg text-w6">Búsqueda</div>
            <div class="flex-row">
                <tool-button
                    class="ml-1"
                    tooltip="Restablecer filtro" 
                    icon="el-icon-refresh"
                    @click="onClearFilter"
                ></tool-button>
                <tool-button
                    class="ml-1"
                    tooltip="Exportar" 
                    icon="el-icon-download"
                    @click="panel = 'export'"
                ></tool-button>
            </div>                              
        </template>
        <template v-else-if="panel === 'export'">
            <div class="text-lg text-w6">Exportar</div>
            <div class="flex-row">
                <tool-button
                    class="mx-1"
                    tooltip="Cancelar" 
                    icon="el-icon-close"
                    @click="panel = 'search'"
                ></tool-button>
            </div>                    
        </template>
    </template>

    <template v-slot:side-content>
        <demograp-filter 
            v-if="panel === 'search'"
        ></demograp-filter>
        <xls-saver 
            v-if="panel === 'export'"
            :columns="columns"
            store="demograp"
        ></xls-saver>
    </template>
</split-view>

</template>

<script>

import { mapGetters } from 'vuex';
import ListHeader from '@/components/ListHeader';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import ToolButton from '@/components/ToolButton';
import XlsSaver from '@/components/XlsSaver';
import SplitView from '@/layout/components/SplitView';
import DemograpFilter from './components/DemograpFilter';
import DemograpList from './components/DemograpList';

import { columns } from './components/data';

export default {
    name: 'DemograpIndex',

    components: {
        ListHeader,
        SplitView,
        DemograpFilter,
        DemograpList,
        ToolButton,
        XlsSaver,
        BarChart,
        PieChart
    },

    data() {
        return {
            panel: 'search',
            columns: columns
        };
    },

    computed: {
        ...mapGetters({
            subjects: 'demograp/sortedItems'
        }),

        subjectsCount: function() {
            return this.$store.state.demograp.count;
        },

        demograp() {
            return this.$store.state.demograp.stats;
        },

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
        this.$store.dispatch('demograp/fetchStats');
        this.$store.dispatch('demograp/fetchItems');
    },

    methods: {
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
        },

        onClearFilter() {
            this.$store.dispatch('demograp/resetFilter');
            this.$store.dispatch('demograp/fetchItems');
        }
    }
};
</script>

<style lang="scss">

.demograp-index {

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
