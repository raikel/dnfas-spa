import { SubjectFilter, subjectFilter } from '../subjects/models';

class SubjectSegmentModel extends SubjectFilter {
    props = Object.assign({}, subjectFilter.props, {
        id: {
            writable: false,
            api: 'id',
            type: Number
        },
        title: {
            writable: true,
            api: 'title',
            type: String
        }
    })
}

const subjectSegmentModel = new SubjectSegmentModel();

export {
    SubjectSegmentModel,
    subjectSegmentModel
};

