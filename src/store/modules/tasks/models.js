import { 
    Model, 
    dateReader, 
    dateWriter, 
    timeReader, 
    timeWriter 
} from '../abstract/models';

class VTaskConfigModel extends Model {
    VIDEO_SOURCE_RECORD = 'record'
    VIDEO_SOURCE_CAMERA = 'camera'

    props = {
        videoSourceType: {
            writable: true,
            api: 'video_source_type',
            type: String,
            default: 'camera'
        },
        videoSourceId: {
            writable: true,
            api: 'video_source_id',
            type: Number,
            default: null
        },
        startAt: {
            writable: true,
            api: 'start_at',
            type: Number,
            default: -1
        },
        stopAt: {
            writable: true,
            api: 'stop_at',
            type: Number,
            default: -1
        }
    }
}

const vTaskConfigModel = new VTaskConfigModel();

class VdfTaskConfigModel extends VTaskConfigModel {
    props = Object.assign({}, vTaskConfigModel.props, {
        detectionMinHeight: {
            writable: true,
            api: 'detection_min_height',
            type: Number,
            default: 32
        },
        detectionMinScore: {
            writable: true,
            api: 'detection_min_score',
            type: Number,
            default: 0.9
        },
        similarityThresh: {
            writable: true,
            api: 'similarity_thresh',
            type: Number,
            default: 0.5
        },
        maxFrameSize: {
            writable: true,
            api: 'max_frame_size',
            type: Number,
            default: 720
        },
        videoDetectInterval: {
            writable: true,
            api: 'video_detect_interval',
            type: Number,
            default: 0.5
        },
        facesTimeMemory: {
            writable: true,
            api: 'faces_time_memory',
            type: Number,
            default: 60
        },
        storeFaceFrames: {
            writable: true,
            api: 'store_face_frames',
            type: Boolean,
            default: true
        },
        frontalFaces: {
            writable: true,
            api: 'frontal_faces',
            type: Boolean,
            default: true
        }
    })
}

const vdfTaskConfigModel = new VdfTaskConfigModel();

class VhfTaskConfigModel extends VdfTaskConfigModel {
    props = Object.assign({}, vdfTaskConfigModel.props, {
        huntedSubjects: {
            writable: true,
            api: 'hunted_subjects',
            type: Number,
            many: true
        }
    })
}

const vhfTaskConfigModel = new VhfTaskConfigModel();

class PgaTaskConfigModel extends Model {
    props = {
        minCreatedAt: {
            writable: true,
            api: 'min_created_at',
            type: Date,
            default: null
        },
        maxCreatedAt: {
            writable: true,
            api: 'max_created_at',
            type: Date,
            default: null
        },
        overwrite: {
            writable: true,
            api: 'overwrite',
            type: Boolean,
            default: false
        }
    }
}

const pgaTaskConfigModel = new PgaTaskConfigModel();

class PgaTaskInfoModel extends Model {
    props = {
        facesCount: {
            writable: false,
            api: 'faces_count',
            type: Number,
            optional: true
        },
        processingTime: {
            writable: false,
            api: 'processing_time',
            type: Number,
            optional: true
        }
    }
}

const pgaTaskInfoModel = new PgaTaskInfoModel();

class VTaskInfoModel extends Model {
    props = {
        framesCount: {
            writable: false,
            api: 'frames_count',
            type: Number,
            optional: true
        },
        processingTime: {
            writable: false,
            api: 'processing_time',
            type: Number,
            optional: true
        },
        frameRate: {
            writable: false,
            api: 'frame_rate',
            type: Number,
            optional: true
        }
    }
}

const vTaskInfoModel = new VTaskInfoModel();

// =============================================================================
// Face clustering
// =============================================================================

class FclTaskConfigModel extends Model {

    LINKAGE_WARD = 'ward'
    LINKAGE_AVERAGE = 'average'
    LINKAGE_SINGLE = 'single'
    LINKAGE_COMPLETE = 'complete'

    LINKAGE_CHOICES = [{
        label: 'Cuadrático',
        value: this.LINKAGE_WARD
    }, {
        label: 'Promedio',
        value: this.LINKAGE_AVERAGE
    }, {
        label: 'Simple',
        value: this.LINKAGE_SINGLE
    }, {
        label: 'Completo',
        value: this.LINKAGE_COMPLETE
    }]

    props = {
        topDistThr: {
            writable: true,
            api: 'top_dist_thr',
            type: Number,
            default: 0.6
        },
        lowDistThr: {
            writable: true,
            api: 'low_dist_thr',
            type: Number,
            default: 0.6
        },
        edgeThr: {
            writable: true,
            api: 'edge_thr',
            type: Number,
            default: 0.5
        },
        linkage: {
            writable: true,
            api: 'linkage',
            type: String,
            choices: this.LINKAGE_CHOICES.map(c => c.value),
            default: this.LINKAGE_WARD
        },
        memorySeconds: {
            writable: true,
            api: 'memory_seconds',
            type: Number,
            default: 3600
        },
        filterBackWeeks: {
            writable: true,
            api: 'filter_back_weeks',
            type: Number,
            default: undefined,
            optional: true
        },
        filterBackDays: {
            writable: true,
            api: 'filter_back_days',
            type: Number,
            default: undefined,
            optional: true
        },
        filterBackHours: {
            writable: true,
            api: 'filter_back_hours',
            type: Number,
            default: undefined,
            optional: true
        },
        filterMinDate: {
            writable: true,
            api: 'filter_min_date',
            type: Date,
            default: null,
            reader: dateReader,
            writer: dateWriter,
            optional: true
        },
        filterMaxDate: {
            writable: true,
            api: 'filter_max_date',
            type: Date,
            default: null,
            reader: dateReader,
            writer: dateWriter,
            optional: true
        },
        filterMinTime: {
            writable: true,
            api: 'filter_min_time',
            type: Date,
            default: null,
            reader: timeReader,
            writer: timeWriter,
            optional: true
        },
        filterMaxTime: {
            writable: true,
            api: 'filter_max_time',
            type: Date,
            default: null,
            reader: timeReader,
            writer: timeWriter,
            optional: true
        },
        filterTasks: {
            writable: true,
            api: 'filter_tasks',
            type: Number,
            many: true
        },
        filterTasksTags: {
            writable: true,
            api: 'filter_tasks_tags',
            type: Number,
            many: true
        }
    }
}

const fclTaskConfigModel = new FclTaskConfigModel();

class FclTaskInfoModel extends Model {
    props = {
        facesCount: {
            writable: false,
            api: 'faces_count',
            type: Number,
            optional: true
        },
        processingTime: {
            writable: false,
            api: 'processing_time',
            type: Number,
            optional: true
        }
    }
}

const fclTaskInfoModel = new FclTaskInfoModel();

class TaskModel extends Model {
    TYPE_VIDEO_DETECT_FACES = 'video_detect_faces'
    TYPE_VIDEO_HUNT_FACES = 'video_hunt_faces'
    TYPE_VIDEO_DETECT_PERSON = 'video_detect_person'
    TYPE_VIDEO_HUNT_PERSON = 'video_hunt_person'
    TYPE_PREDICT_GENDERAGE = 'predict_genderage'
    TYPE_FACE_CLUSTERING = 'face_clustering'

    TYPE_CHOICES = [
        this.TYPE_VIDEO_DETECT_FACES,
        this.TYPE_VIDEO_HUNT_FACES,
        this.TYPE_VIDEO_DETECT_PERSON,
        this.TYPE_VIDEO_HUNT_PERSON,
        this.TYPE_PREDICT_GENDERAGE,
        this.TYPE_FACE_CLUSTERING
    ]

    STATUS_CREATED = 'created'
    STATUS_RUNNING = 'running'
    STATUS_PAUSED = 'paused'
    STATUS_STOPPED = 'stopped'
    STATUS_KILLED = 'killed'
    STATUS_SUCCESS = 'success'
    STATUS_FAILURE = 'failure'
    STATUS_REVOKED = 'revoked'
    STATUS_RETRY = 'retry'

    STATUS_CHOICES = [
        this.STATUS_CREATED,
        this.STATUS_RUNNING,
        this.STATUS_PAUSED,
        this.STATUS_STOPPED,
        this.STATUS_KILLED,
        this.STATUS_SUCCESS,
        this.STATUS_FAILURE,
        this.STATUS_REVOKED,
        this.STATUS_RETRY
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
        tags: {
            writable: true,
            api: 'tags',
            type: Number,
            many: true
        },
        taskType: {
            writable: true,
            api: 'task_type',
            type: String,
            choices: this.TYPE_CHOICES,
            default: ''
        },
        status: {
            writable: false,
            api: 'status',
            type: String,
            choices: this.STATUS_CHOICES
        },
        startedAt: {
            writable: false,
            api: 'started_at',
            type: Date
        },
        finishedAt: {
            writable: false,
            api: 'finished_at',
            type: Date
        },
        scheduleStartAt: {
            writable: true,
            api: 'schedule_start_at',
            type: Date
        },
        scheduleStopAt: {
            writable: true,
            api: 'schedule_stop_at',
            type: Date
        },
        repeatDays: {
            writable: true,
            api: 'repeat_days',
            type: String,
            default: ''
        },
        progress: {
            writable: false,
            api: 'progress',
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
        config: {
            writable: true,
            api: 'config',
            type: Object,
            default: {}
        },
        info: {
            writable: false,
            api: 'info',
            type: Object,
            default: {}
        }
    }

    apiGet(apiData = {}) {
        const data = super.apiGet(apiData);
        switch (apiData['task_type']) {
            case this.TYPE_VIDEO_DETECT_FACES:
                data.config = vdfTaskConfigModel.apiGet(apiData['config']);
                data.info = vTaskInfoModel.apiGet(apiData['info']);
                break;
            case this.TYPE_VIDEO_HUNT_FACES:
                data.config = vhfTaskConfigModel.apiGet(apiData['config']);
                data.info = vTaskInfoModel.apiGet(apiData['info']);
                break;
            case this.TYPE_PREDICT_GENDERAGE:
                data.config = pgaTaskConfigModel.apiGet(apiData['config']);
                data.info = pgaTaskInfoModel.apiGet(apiData['info']);
                break;
            case this.TYPE_FACE_CLUSTERING:
                data.config = fclTaskConfigModel.apiGet(apiData['config']);
                data.info = fclTaskInfoModel.apiGet(apiData['info']);
                break;  
            default:
                break;
        }
        return data;        
    }

    apiPost(data = {}, empty = true) {
        const apiData = super.apiPost(data, empty);
        switch (data.taskType) {
            case this.TYPE_VIDEO_DETECT_FACES:
                apiData['config'] = vdfTaskConfigModel.apiPost(data.config, empty);
                apiData['info'] = vTaskInfoModel.apiPost(data.info, empty);
                break;
            case this.TYPE_VIDEO_HUNT_FACES:
                apiData['config'] = vhfTaskConfigModel.apiPost(data.config, empty);
                apiData['info'] = vTaskInfoModel.apiPost(data.info, empty);
                break;
            case this.TYPE_PREDICT_GENDERAGE:
                apiData['config'] = pgaTaskConfigModel.apiPost(data.config, empty);
                apiData['info'] = pgaTaskInfoModel.apiPost(data.info, empty);
                break;
            case this.TYPE_FACE_CLUSTERING:
                apiData['config'] = fclTaskConfigModel.apiPost(data.config, empty);
                apiData['info'] = fclTaskInfoModel.apiPost(data.info, empty);
                break;
            default:
                break;
        }
        return apiData;
    }
}

const taskModel = new TaskModel();

class TaskFilter extends Model {
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
        taskType: {
            writable: true,
            api: 'task_type',
            many: true,
            type: String,
            choices: taskModel.TYPE_CHOICES,
            default: ''
        },
        status: {
            writable: true,
            api: 'status',
            type: String,
            many: true,
            choices: taskModel.STATUS_CHOICES
        },
        minCreatedAt: {
            writable: true,
            api: 'min_created_at',
            type: Date
        }
    }
}

const taskFilter = new TaskFilter();

export {
    taskModel,
    vTaskConfigModel,
    vdfTaskConfigModel,
    vhfTaskConfigModel,
    pgaTaskConfigModel,
    fclTaskConfigModel,
    fclTaskInfoModel,
    taskFilter
};
