import Vue from 'vue';

const hasOwnProperty = Object.prototype.hasOwnProperty;

const isEmpty = function(val) {
    return val === undefined || val === null || val === '';
};

class Model {
    props = {};

    create() {
        const data = {};
        Object.keys(this.props).forEach(key => {            
            data[key] = this.propValue(key);
        });
        return data;
    }

    propValue(key) {
        const prop = this.props[key]; 
        let val = null;
        if (hasOwnProperty.call(prop, 'default')) {
            val = typeof prop.default === 'function' ? 
                prop.default() : prop.default;            
        } else if (prop.many === true) {
            val = [];
        } else if (prop.choices !== undefined && prop.choices.length) {
            val = prop.choices[0];
        } else if (prop.model !== undefined) {
            val = prop.model.create();
        } else if (prop.type !== undefined) {
            const type = prop.type;
            switch (type) {
                case Number:
                    val = undefined;
                    break;
                case Date:
                    val = null;
                    break;
                case String:
                    val = '';
                    break;
                case Object:
                    val = {};
                    break;
                case Boolean:
                    val = undefined;
                    break;
                default:
                    Vue.$log.warn(`Unknown prop type "${type}".`);
                    break;
            }
        }
        return val;
    }

    apiGet(apiData = {}) {
        const data = {};
        Object.keys(this.props).forEach(key => {
            const prop = this.props[key];
            if (prop.api) { 
                if (hasOwnProperty.call(apiData, prop.api)) {
                    const value = apiData[prop.api];
                    if (prop.model) {
                        if (prop.many === true) {
                            data[key] = [];
                            value.forEach(apiProp => {
                                data[key].push(prop.model.apiGet(apiProp));
                            });
                        } else {
                            data[key] = prop.model.apiGet(value);
                        }
                    } else {
                        if (prop.many === true) {
                            data[key] = [];
                            if (Array.isArray(value)) {
                                value.forEach(apiProp => {
                                    if (prop.reader) {
                                        data[key].push(prop.reader(apiProp));
                                    } else {
                                        data[key].push(apiProp);
                                    }                                    
                                });
                            } else {
                                Vue.$log.warn(`Data for API key ${prop.api} is not an array.`);
                            }                            
                        } else {
                            if (prop.reader) {
                                data[key] = prop.reader(value);
                            } else {
                                data[key] = value;
                            }                            
                        }
                    }
                } else {
                    if (!prop.optional) {
                        Vue.$log.warn(`Missed API key ${prop.api} in API data.`);
                    }                    
                }
            } else {
                data[key] = this.propValue(key);
            }            
            this.checkChoice(data[key], prop, prop.api);
        });
        return data;
    }

    apiPost(data = {}, empty = true) {
        const apiData = {};
        for (const key in data) {
            const prop = this.props[key];
            if (hasOwnProperty.call(this.props, key) && prop.writable) {
                const value = data[key];
                var valid = this.checkChoice(value, prop, prop.api);
                if (valid && (empty || (!empty && !isEmpty(value)))) {
                    const apiProp = prop.api;
                    if (prop.writer) {
                        apiData[apiProp] = prop.writer(value);
                    } else {
                        apiData[apiProp] = value;
                    }                    
                }
            }            
        }
        return apiData;
    }

    checkChoice(value, prop, key) {
        if (prop.choices && prop.choices.length) {
            if (prop.many) {
                for (let i = 0; i < value.length; i++) {
                    if (prop.choices.indexOf(value[i]) === -1) {
                        Vue.$log.warn(`Value "${value[i]}" for key "${key}" not in choices.`);
                        return false;
                    }                
                }
            } else {
                if (prop.choices.indexOf(value) === -1) {
                    Vue.$log.warn(`Value "${value}" for key "${key}" not in choices.`);
                    return false;
                }
            }
        }        
        return true;
    }
}

const timeReader = function(time) {
    if (!time) {
        return time;
    }
    const d = new Date('1970-01-01T' + time);
    return isNaN(d) ? time : d;
};

const timeWriter = function(date) {
    if (!date) {
        return date;
    }
    const d = new Date(date);
    return isNaN(d) ? date : d.toISOString().substring(11, 19);
};

const dateReader = function(date) {
    if (!date) {
        return date;
    }
    const d = new Date(date + 'T00:00:00');
    return isNaN(d) ? date : d;
};

const dateWriter = function(date) {
    if (!date) {
        return date;
    }
    const d = new Date(date);
    return isNaN(d) ? date : d.toISOString().substring(0, 10);
};

const numberReader = function(val) {
    if (val === null) {
        return undefined;
    }
    return val;
};

export { 
    Model, 
    dateReader,
    dateWriter,
    timeReader,
    timeWriter,
    numberReader 
};
