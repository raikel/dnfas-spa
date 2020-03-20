import { taskModel, vTaskConfigModel } from '@/store/modules/tasks/models';

export const typeOptions = {
    [taskModel.TYPE_VIDEO_DETECT_FACES]: {
        label: 'Detección de rostros',
        icon: 'face-detection',
        nsteps: 2
    },
    [taskModel.TYPE_VIDEO_HUNT_FACES]: {
        label: 'Búsqueda de rostros',
        icon: 'face-detection',
        nsteps: 3
    },
    [taskModel.TYPE_VIDEO_DETECT_PERSON]: {
        label: 'Detección de personas',
        icon: 'face-detection',
        nsteps: 2
    },
    [taskModel.TYPE_VIDEO_HUNT_PERSON]: {
        label: 'Búsqueda de personas',
        icon: 'face-detection',
        nsteps: 3
    },
    [taskModel.TYPE_PREDICT_GENDERAGE]: {
        label: 'Predecir género y edad',
        icon: 'face-detection',
        nsteps: 2
    },
    [taskModel.TYPE_FACE_CLUSTERING]: {
        label: 'Agrupamiento de rostros',
        icon: 'face-detection',
        nsteps: 2
    }
};

export const typeChoices = Object.keys(typeOptions).map(type => {
    return {
        label: typeOptions[type].label,
        value: type
    };
});

export const statusOptions = {
    [taskModel.STATUS_CREATED]: {
        label: 'Creada',
        color: '#e6a23c'
    },
    [taskModel.STATUS_RUNNING]: {
        label: 'En ejecución',
        color: '#409eff'
    },
    [taskModel.STATUS_PAUSED]: {
        label: 'Pausada',
        color: '#909399'
    },
    [taskModel.STATUS_STOPPED]: {
        label: 'Detenida',
        color: '#000000'
    },
    [taskModel.STATUS_KILLED]: {
        label: 'Terminada',
        color: '#f56c6c'
    },
    [taskModel.STATUS_SUCCESS]: {
        label: 'Finalizada',
        color: '#909399'
    },
    [taskModel.STATUS_FAILURE]: {
        label: 'Error',
        color: '#f56c6c'
    },
    [taskModel.STATUS_REVOKED]: {
        label: 'Revocada',
        color: '#f56c6c'
    }
};

export const statusChoices = Object.keys(statusOptions).map(status => {
    return {
        label: statusOptions[status].label,
        value: status
    };
});

export const videoSourceOptions = {
    [vTaskConfigModel.VIDEO_SOURCE_CAMERA]: {
        label: 'Cámara de Video',
        icon: 'video'
    },
    [vTaskConfigModel.VIDEO_SOURCE_RECORD]: {
        label: 'Archivo de Video',
        icon: 'video-record'
    }
};

export const videoSourceChoices = Object.keys(videoSourceOptions).map(key => {
    return {
        label: videoSourceOptions[key].label,
        value: key
    };
});

export const orderChoices = [{
    label: 'Fecha de creación', 
    value: 'created_at'
}, {
    label: 'Nombre', 
    value: 'name'
}, {
    label: 'Estado', 
    value: 'status'
}, {
    label: 'Tipo de tarea', 
    value: 'task_type'
}];
