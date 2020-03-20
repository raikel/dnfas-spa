<template>

<div class="demograp-item">
    <img :src="subject.image" alt="">
    <div class="info">{{ `${sex}, ${age} años` }}</div>
</div> 

</template>

<script>

const sexOptions = {
    'man': 'Hombre',
    'woman': 'Mujer'
};

export default {
    name: 'DemograpCard',

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
            return sex ? sexOptions[sex] : '(?)';
        },
        age() {
            return this.subject.predAge || '(?)';
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
    .info {
        margin-top: 12px;
        font-size: 12px;
        font-weight: 600;
    }
}

</style>

