import { Model } from '../abstract/models';

class AgeStatsModel extends Model {
    props = {
        counts: {
            writable: false,
            api: 'counts',
            type: Number,
            many: true
        },
        meanValue: {
            writable: false,
            api: 'mean_value',
            type: Number
        },
        minValue: {
            writable: false,
            api: 'min_value',
            type: Number
        },
        maxValue: {
            writable: false,
            api: 'max_value',
            type: Number
        }
    }
}

const ageStatsModel = new AgeStatsModel();

class DemograpModel extends Model {
    props = {
        ageLabels: {
            writable: false,
            api: 'age_labels',
            type: Number,
            many: true
        },
        menAges: {
            writable: false,
            api: 'men_ages',
            type: Object,
            model: ageStatsModel
        },
        womenAges: {
            writable: false,
            api: 'women_ages',
            type: Object,
            model: ageStatsModel
        },
        menCount: {
            writable: false,
            api: 'men_count',
            type: Number,
            default: 0
        },
        womenCount: {
            writable: false,
            api: 'women_count',
            type: Number,
            default: 0
        }
    }
}

const demograpModel = new DemograpModel();

class DemograpFilter extends Model {
    SEX_MAN = 'man'
    SEX_WOMAN = 'woman'

    SKIN_WHITE = 'white'
    SKIN_BROWN = 'brown'
    SKIN_BLACK = 'black'

    props = {
        orderBy: {
            writable: true,
            api: 'order_by',
            type: String,
            default: '-created_at'
        },
        minTimestamp: {
            writable: true,
            api: 'min_timestamp',
            type: Date
        },
        maxTimestamp: {
            writable: true,
            api: 'max_timestamp',
            type: Date
        },
        minPredAge: {
            writable: true,
            api: 'min_pred_age',
            type: Number
        },
        maxAge: {
            writable: true,
            api: 'max_pred_age',
            type: Number
        },
        predSex: {
            writable: true,
            api: 'pred_sex',
            type: String,
            choices: [
                '',
                this.SEX_MAN,
                this.SEX_WOMAN
            ],
            default: ''
        },
        tasks: {
            writable: true,
            api: 'tasks',
            type: Number,
            many: true
        },
        tasksTags: {
            writable: true,
            api: 'tasks_tags',
            type: Number,
            many: true
        }
    }
}

const demograpFilter = new DemograpFilter();

export {
    DemograpModel,
    demograpModel,
    DemograpFilter,
    demograpFilter    
};

