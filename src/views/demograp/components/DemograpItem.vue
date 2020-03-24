<template>

<div class="demograp-item">
    <img :src="subject.image" alt="">
    <div class="mt-3 text-sm text-w6">{{ sex }}</div>
    <div class="text-sm text-w6">{{ age }}</div>
</div> 

</template>

<script>

const sexOptions = {
    'man': 'Hombre',
    'woman': 'Mujer'
};

export default {
    name: 'DemograpItem',

    props: {
        subject: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
        };
    },

    computed: {
        sex() {
            const sex = this.subject.predSex;
            const score = (100 * this.subject.predSexScore).toFixed(0);
            return sex ? 
                `${sexOptions[sex]} (${score} %)` : 'Sexo no establecido';
        },
        age() {
            const age = this.subject.predAge;
            const score = this.subject.predAgeVar.toFixed(1);
            return age ? `${age} ± ${score} años` : 'Edad no establecida';
        }
    }
    
};
</script>

<style lang="scss">

.demograp-item {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    img {
        height: 112px;
        width: 96px;
        object-fit: cover;
        border-radius: 6px;
    }
}

</style>

