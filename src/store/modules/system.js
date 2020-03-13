import { SystemApi } from '@/api';

const MEMORY_MILLISECONDS = 1.2 * 60 * 1000;

const state = {
    info: {
        cpu: {
            label: [],
            value: []
        },
        gpu: {
            'name': '',
            'temperature': 0,
            'fanSpeed': 0,
            'utilization': 0,
            'memoryUsed': {
                time: [],
                value: []
            },
            'memoryTotal': 0,
            'powerDraw': 0
        },
        memory: {
            'total': 0,
            'used': {
                time: [],
                value: []
            },
            'free': 0
        },
        disk: {
            'total': 0,
            'used': 0,
            'free': 0,
            'readBytes': 0,
            'writeBytes': 0,
            'readTime': 0,
            'writeTime': 0
        },
        network: {
            'bytesSent': 0,
            'bytesRecv': 0,
            'packetsSent': 0,
            'packetsRecv': 0
        },
        temperature: []
    }    
};

const GB = 1024 * 1024 * 1024;
const MB = 1024 * 1024;

const mutations = {
    UPDATE_INFO: (state, data) => {
        const now = new Date();
        
        const clearOlder = function(serie) {
            while (serie.time.length) {
                const elapsed = now.getTime() - serie.time[0].getTime();
                if (elapsed > MEMORY_MILLISECONDS) {
                    serie.time.shift();
                    serie.value.shift();
                } else {
                    break;
                }
            }
        };        
        
        const info = state.info;       
        
        const cpu = data['cpu'];
        const gpu = data['gpu'][0];
        const memory = data['memory'];
        const disk = data['disk'];
        const network = data['network'];
        const temperature = data['temperature'];

        if (cpu) {
            const cpuData = {
                label: [],
                value: []
            };
            for (let i = 0; i < cpu.length; i++) {
                cpuData.label.push('C' + (i + 1));                
                cpuData.value.push(cpu[i]);                
            }
            info.cpu = cpuData;
        }

        if (gpu) {            
            info.gpu.memoryUsed.time.push(now);
            info.gpu.memoryUsed.value.push(gpu['memory_used'] / GB);
            clearOlder(info.gpu.memoryUsed);
            
            info.gpu.name = gpu['name'];
            info.gpu.temperature = gpu['temperature'];
            info.gpu.fanSpeed = gpu['fan_speed'];
            info.gpu.utilization = gpu['utilization'];
            info.gpu.memoryTotal = gpu['memory_total'] / GB;
            info.gpu.memoryFree = gpu['memory_used'] / GB;
            info.gpu.powerDraw = gpu['power_draw'];
        }

        if (memory) {
            info.memory.used.time.push(now);
            info.memory.used.value.push(memory['used'] / GB);
            clearOlder(info.memory.used);

            info.memory.total = memory['total'] / GB;
            info.memory.free = memory['free'] / GB;
        }

        if (disk) {
            info.disk.total = disk['total'] / GB;
            info.disk.used = disk['used'] / GB;
            info.disk.free = disk['free'] / GB;
            info.disk.readBytes = disk['read_bytes'] / GB;
            info.disk.writeBytes = disk['write_bytes'] / GB;
            info.disk.readTime = disk['read_time'];
            info.disk.writeTime = disk['write_time'];
        }

        if (network) {
            info.network.bytesSent = network['bytes_sent'] / MB;
            info.network.bytesRecv = network['bytes_recv'] / MB;
            info.network.packetsSent = network['packets_sent'];
            info.network.packetsRecv = network['packets_recv'];
        }

        if (temperature) {
            info.temperature = temperature;
        }
    }
};

const actions = {
    fetchInfo(context, params) {
        return new Promise((resolve, reject) => {
            SystemApi.query(params).then(({ data }) => {
                if (data) {
                    context.commit('UPDATE_INFO', data);
                }                
                resolve(state.info);
            }).catch(error => {
                reject(error);
            });
        });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
