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
        predSexScore: {
            writable: false,
            api: 'pred_sex_score',
            type: Number
        },
        predAge: {
            writable: false,
            api: 'pred_age',
            type: Number
        },
        predAgeVar: {
            writable: false,
            api: 'pred_age_var',
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
        },
        timestamp: {
            writable: false,
            api: 'timestamp',
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
        orderBy: {
            writable: true,
            api: 'order_by',
            type: String,
            default: '-created_at'
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
        },
        tasksTags: {
            writable: true,
            api: 'tasks_tags',
            type: Number,
            many: true
        }
    }
}

const subjectFilter = new SubjectFilter();

export {
    SubjectModel,
    subjectModel,
    SubjectFilter,
    subjectFilter
};

