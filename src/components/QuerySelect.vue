<template>

<el-select
    filterable
    :multiple="multiple"
    remote
    clearable
    :placeholder="placeholder"                              
    :remote-method="query"
    :loading="querying"
    :automatic-dropdown="false"
    :value="value"
    @change="onChange"
>
    <el-option
        v-for="choice in choices"
        :key="choice.id"
        :label="choice.name"
        :value="choice.id"
    ></el-option>
</el-select>

</template>

<script>

export default {
    name: 'QuerySelect',

    props: {
        store: {
            type: String,
            required: true
        },
        value: {
            type: null,
            default: () => []
        },        
        placeholder: {
            type: String,
            default: 'Seleccionar'
        },
        params: {
            type: Object,
            default: () => {}
        },
        multiple: {
            type: Boolean,
            default: true
        },
        name: {
            type: String,
            default: 'name'
        } 
    },

    data() {
        return {
            querying: false,
            queriedChoices: [],
            defaultChoices: []
        };
    },

    computed: {
        api() {
            return this.$store.state[this.store].API;   
        },
        choices() {
            const choices = [];
            const values = Array.isArray(this.value) ? 
                this.value : [this.value];
            values.forEach(id => {
                if (id || id === 0) {
                    this.$store.dispatch(`${this.store}/getItem`, id);
                    const choice = this.$store.state[this.store].items[id];
                    if (choice) {
                        choices.push({
                            id: choice.id,
                            name: choice.name || choice.id
                        });
                    }
                }                
            });

            const choices_ = this.queriedChoices.length ? 
                this.queriedChoices : this.defaultChoices;

            choices_.forEach(choice_ => {
                if (!choices.some(choice => choice.id === choice_.id)) {
                    choices.push({
                        id: choice_.id,
                        name: choice_.name || choice_.id
                    });
                }
            });
            return choices;          
        }  
    },

    watch: {
        store(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.setDefaults();
            }
        }
    },

    created() {
        this.setDefaults();
    },

    methods: {
        onChange(val) {
            this.$emit('change', val);
            this.queriedChoices = [];
        },

        setDefaults() {
            this.api.fetch({
                limit: 50,
                fields: 'id,name'
            }).then(({ data }) => {
                const results = data.results || [];
                this.defaultChoices = results.map(choice => {
                    return {
                        id: choice.id,
                        name: choice.name
                    };
                });
            });
        },

        query(query) {
            this.queriedChoices = [];
            if (query && query.length >= 2 && !this.querying) {                
                this.querying = true;                           
                this.api.fetch({
                    name: query, 
                    fields: 'id,name',
                    ...this.params
                }).then(({ data }) => {
                    const results = data.results || [];
                    this.queriedChoices = results.map(choice => {
                        return {
                            id: choice.id,
                            name: choice.name
                        };
                    });
                }).catch(error => {
                    this.$log.error(error);                   
                }).finally(() => {
                    this.querying = false;
                });                
            }
        }
    }
};
</script>

<style lang="scss">
</style>
