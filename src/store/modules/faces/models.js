import { Model } from '../abstract/models';

class FaceModel extends Model {
    SEX_MAN = 'man'
    SEX_WOMAN = 'woman'

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
        frame: {
            writable: true,
            api: 'frame',
            type: Number
        },
        box: {
            writable: false,
            api: 'box',
            type: Number,
            many: true
        },
        subject: {
            writable: true,
            api: 'subject',
            type: Number
        },
        predSex: {
            writable: false,
            api: 'pred_sex',
            type: String,
            choices: [
                this.SEX_MAN,
                this.SEX_WOMAN,
                ''
            ]
        },
        predAge: {
            writable: false,
            api: 'pred_age',
            type: Number
        },
        createdAt: {
            writable: false,
            api: 'created_at',
            type: Date
        },
        timestamp: {
            writable: false,
            api: 'timestamp',
            type: Date
        },
        task: {
            writable: false,
            api: 'task',
            type: Number
        }
    }
}

const faceModel = new FaceModel();

export {
    faceModel
};

