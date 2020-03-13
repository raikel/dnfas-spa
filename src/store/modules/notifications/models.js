import { TasksApi } from '@/api';

export class Notification {
    static DTYPE_ERROR = 'error'
    static DTYPE_WARN = 'warn'
    static DTYPE_INFO = 'info'

    static CATEGORY_TASK = 'task'

    constructor(data) {
        this.id = null;
        this.category = '';
        this.dtype = '';
        this.title = '';
        this.message = '';
        this.timestamp = null;
        this.resource = null;
        this.seen = null;
        this.route = {};
        if (data) {
            this.setData(data);
        }
    }

    setData(data) {
        Object.keys(data).forEach(key => {
            if (this.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        });
    }
    
    setRoute() {
        switch (this.category) {
            case this.CATEGORY_TASK:
                this.setTaskRoute();
                break;
            default:
                break;
        }
    }

    setTaskRoute() {
        TasksApi.retrieve(this.resource).then(({ data }) => {
            const task = data;
            if (task['camera'] !== null) {
                this.route = {
                    name: 'CameraDetails',
                    params: {
                        cameraId: task['camera']
                    }
                };
            } else if (task['video'] !== null) {
                this.route = {
                    name: 'VideoDetails',
                    params: {
                        videoId: task['video']
                    }
                };
            }
        }).catch((error) => {
            console.error(error);
        });
    }
}
