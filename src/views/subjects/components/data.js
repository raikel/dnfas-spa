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

export const skinOptions = {
    [subjectModel.SKIN_WHITE]: {
        label: 'Blanca'
    },
    [subjectModel.SKIN_BROWN]: {
        label: 'Morena'
    },
    [subjectModel.SKIN_BLACK]: {
        label: 'Negra'
    }
};

export const skinChoices = Object.keys(skinOptions).map(skin => {
    return {
        label: skinOptions[skin].label,
        value: skin
    };
});

export const orderChoices = [{
    label: 'Fecha y hora', 
    value: 'created_at'
}, {
    label: 'Nombre', 
    value: 'name'
}, {
    label: 'Edad', 
    value: 'birthdate'
}];
