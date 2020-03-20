import { Model } from '../abstract/models';

class VideoThumbModel extends Model {
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
        video: {
            writable: false,
            api: 'video',
            type: Number
        }
    }
}

const videoThumbModel = new VideoThumbModel();

class VideoModel extends Model {
    props = {
        id: {
            writable: false,
            api: 'id',
            type: Number
        },
        path: {
            writable: true,
            api: 'path',
            type: String
        },
        url: {
            writable: false,
            api: 'url',
            type: String
        },
        name: {
            writable: true,
            api: 'name',
            type: String
        },
        thumbs: {
            writable: false,
            api: 'thumbs',
            type: Object,
            many: true,
            model: videoThumbModel
        },
        finishAt: {
            writable: false,
            api: 'finish_at',
            type: Date
        },
        startsAt: {
            writable: false,
            api: 'starts_at',
            type: Date
        },
        frameWidth: {
            writable: false,
            api: 'frame_width',
            type: Number
        },
        framesHeight: {
            writable: false,
            api: 'frame_height',
            type: Number
        },
        size: {
            writable: false,
            api: 'size',
            type: String
        },
        durationSeconds: {
            writable: false,
            api: 'duration_seconds',
            type: Number
        },
        framesCount: {
            writable: false,
            api: 'frames_count',
            type: Number
        },
        lastTaskAt: {
            writable: false,
            api: 'last_task_at',
            type: Number
        },
        processingTime: {
            writable: false,
            api: 'processing_time',
            type: Number
        },
        frameRate: {
            writable: false,
            api: 'frame_rate',
            type: Number
        },
        runningTasks: {
            writable: false,
            api: 'running_tasks',
            type: Date
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

const videoModel = new VideoModel();

class VideoFilter extends Model {
    props = {
        name: {
            writable: true,
            api: 'name',
            type: String
        },
        minCreatedAt: {
            writable: true,
            api: 'min_created_at',
            type: Date
        },
        maxCreatedAt: {
            writable: true,
            api: 'max_created_at',
            type: Date
        },
        minDuration: {
            writable: true,
            api: 'min_duration',
            type: Number,
            writer: val => 60 * val
        },
        maxDuration: {
            writable: true,
            api: 'max_duration',
            type: Number,
            writer: val => 60 * val
        },
        orderBy: {
            writable: true,
            api: 'order_by',
            type: String,
            default: '-created_at'
        }
    }
}

const videoFilter = new VideoFilter();

export {
    videoModel,
    videoFilter
};

