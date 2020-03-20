import { subjectModel } from '@/store/modules/subjects/models';

export const sexOptions = {
    [subjectModel.SEX_MAN]: {
        label: 'Hombre'
    },
    [subjectModel.SEX_WOMAN]: {
        label: 'Mujer'
    }
};

export const sexChoices = Object.keys(sexOptions).map(sex => {
    return {
        label: sexOptions[sex].label,
        value: sex
    };
});

export const orderChoices = [{
    label: 'Fecha y hora', 
    value: 'created_at'
}, {
    label: 'Género', 
    value: 'pred_sex'
}, {
    label: 'Edad', 
    value: 'pred_age'
}];
