import { Model } from '../abstract/models';

class FrameModel extends Model {
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
        faces: {
            writable: false,
            api: 'faces',
            type: Number,
            many: true
        },
        timestamp: {
            writable: false,
            api: 'timestamp',
            type: Date
        }
    }
}

const frameModel = new FrameModel();

export {
    frameModel
};

