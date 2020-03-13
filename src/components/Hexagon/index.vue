<template>
    <div class="hexagon" :style="{width: size, height: size}">
        <div class="shape" :style="{backgroundColor: color}"></div>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Hexagon',
    
    props: {
        color: {
            type: String,
            default: '#999'
        },
        size: {
            type: String,
            default: '100px'
        }
    }
}

</script>

<style lang="scss">

.hexagon {
    text-align: center;
    position: relative;
    display: inline-block;

    .content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .shape {
        height: 100%;
        width: calc(100% * 0.57735);
        display: inline-block;
        box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
    }

    .shape:before {
        position: absolute;
        top: 0;
        right: calc((100% / 2) - ((100% * 0.57735) / 2));
        background-color: inherit;
        height: inherit;
        width: inherit;
        content: "";
        transform: rotateZ(60deg);
    }

    .shape:after {
        position: absolute;
        top: 0;
        right: calc((100% / 2) - ((100% * 0.57735) / 2));
        background-color: inherit;
        height: inherit;
        width: inherit;
        content: "";
        transform: rotateZ(-60deg);
    }
}

</style>
