import { Model, dateReader, dateWriter } from '../abstract/models';

class SubjectModel extends Model {
    SEX_MAN = 'man'
    SEX_WOMAN = 'woman'

    SKIN_WHITE = 'white'
    SKIN_BROWN = 'brown'
    SKIN_BLACK = 'black'

    props = {
        id: {
            writable: false,
            api: 'id',
            type: Number
        },
        image: {
            writable: false,
            api: 'image',
            type: String
        },
        name: {
            writable: true,
            api: 'name',
            type: String
        },
        lastName: {
            writable: true,
            api: 'last_name',
            type: String
        },
        fullName: {
            writable: false,
            api: 'full_name',
            type: String
        },
        birthdate: {
            writable: true,
            api: 'birthdate',
            type: Date,
            reader: dateReader,
            writer: dateWriter
        },
        age: {
            writable: true,
            api: 'age',
            type: Number
        },
        faces: {
            writable: true,
            api: 'faces',
            type: Number,
            many: true
        },
        sex: {
            writable: true,
            api: 'sex',
            type: String,
            choices: [
                this.SEX_MAN,
                this.SEX_WOMAN,
                ''
            ],
            default: ''
        },
        skin: {
            writable: true,
            api: 'skin',
            type: String,
            choices: [
                this.SKIN_WHITE,
                this.SKIN_BROWN,
                this.SKIN_BLACK,
                ''
            ],
            default: ''
        },
        predSex: {
            writable: false,
            api: 'pred_sex',
            type: String,
            choices: [
                this.SEX_MAN,
                this.SEX_WOMAN,
                ''
            ],
            default: ''
        },
        predAge: {
            writable: false,
            api: 'pred_age',
            type: Number
        },
        task: {
            writable: false,
            api: 'task',
            type: Number
        },
        createdAt: {
            writable: false,
            api: 'created_at',
            type: Date
        },
        updatedAt: {
            writable: false,
            api: 'updated_at',
            type: Date
        }
    }
}

const subjectModel = new SubjectModel();

class SubjectFilter extends Model {
    SEX_MAN = 'man'
    SEX_WOMAN = 'woman'

    SKIN_WHITE = 'white'
    SKIN_BROWN = 'brown'
    SKIN_BLACK = 'black'

    props = {
        name: {
            writable: true,
            api: 'name',
            type: String
        },
        lastName: {
            writable: true,
            api: 'last_name',
            type: String
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
        minAge: {
            writable: true,
            api: 'min_age',
            type: Number
        },
        maxAge: {
            writable: true,
            api: 'max_age',
            type: Number
        },
        sex: {
            writable: true,
            api: 'sex',
            type: String,
            choices: [
                '',
                this.SEX_MAN,
                this.SEX_WOMAN
            ],
            default: ''
        },
        skin: {
            writable: true,
            api: 'skin',
            type: String,
            choices: [
                '',
                this.SKIN_WHITE,
                this.SKIN_BROWN,
                this.SKIN_BLACK
            ],
            default: ''
        },
        predSex: {
            writable: false,
            api: 'pred_sex',
            type: String,
            choices: [
                '',
                this.SEX_MAN,
                this.SEX_WOMAN
            ],
            default: ''
        },
        predAge: {
            writable: false,
            api: 'pred_age',
            type: Number,
            default: null
        },
        tasks: {
            writable: true,
            api: 'tasks',
            type: Number,
            many: true
        }
    }
}

const subjectFilter = new SubjectFilter();

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

export {
    SubjectModel,
    subjectModel,
    SubjectFilter,
    subjectFilter,
    demograpModel
};

