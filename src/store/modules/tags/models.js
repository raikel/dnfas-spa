import { Model } from '../abstract/models';

class TagModel extends Model {
    MODEL_TASK = 'task'
    MODEL_CAMERA = 'camera'
    MODEL_VIDEO = 'video'

    MODEL_CHOICES = [
        this.MODEL_TASK,
        this.MODEL_CAMERA,
        this.MODEL_VIDEO
    ]

    props = {
        id: {
            writable: false,
            api: 'id',
            type: Number
        },
        name: {
            writable: true,
            api: 'name',
            type: String
        },
        model: {
            writable: true,
            api: 'model',
            type: String,
            choices: this.MODEL_CHOICES
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

const tagModel = new TagModel();

export {
    TagModel,
    tagModel
};
