import { Model } from '../abstract/models';

class CameraModel extends Model {
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
        address: {
            writable: true,
            api: 'address',
            type: String
        },
        streamUrl: {
            writable: true,
            api: 'stream_url',
            type: String
        },
        locationLat: {
            writable: true,
            api: 'location_lat',
            type: Number
        },
        locationLon: {
            writable: true,
            api: 'location_lon',
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

class CameraFilter extends Model {
    props = {
        name: {
            writable: true,
            api: 'name',
            type: String
        },
        address: {
            writable: true,
            api: 'address',
            type: String
        },
        orderBy: {
            writable: true,
            api: 'order_by',
            type: String,
            default: '-name'
        }
    }
}

const cameraModel = new CameraModel();
const cameraFilter = new CameraFilter();

export {
    cameraModel,
    cameraFilter
};

