import { Model } from '../abstract/models';

class FaceMatchModel extends Model {
    props = {
        id: {
            writable: false,
            api: 'id',
            type: Number
        },
        score: {
            writable: false,
            api: 'score',
            type: Number
        },
        subject: {
            writable: false,
            api: 'subject',
            type: Number
        }
    }
}

const faceMatchModel = new FaceMatchModel();

class FaceRecoModel extends Model {
    props = {
        id: {
            writable: false,
            api: 'id',
            type: Number
        },
        simThresh: {
            writable: true,
            api: 'sim_thresh',
            type: Number
        },
        maxMatches: {
            writable: true,
            api: 'max_matches',
            type: Number
        },
        face: {
            writable: true,
            api: 'face',
            type: Number
        },
        segments: {
            writable: true,
            api: 'segments',
            type: Number,
            many: true
        },
        matches: {
            writable: false,
            api: 'matches',
            type: Object,
            many: true,
            model: faceMatchModel
        },
        createdAt: {
            writable: false,
            api: 'created_at',
            type: Date
        }
    }
}

const faceRecoModel = new FaceRecoModel();

export {
    faceRecoModel
};

