<template>

<div class="video-player">
    <video id="plyr-container" :src="src">
    </video>
    <el-alert
        v-if="alert"
        :title="alert.text"
        :type="alert.type"
        show-icon
        class="mt-3"
    ></el-alert>
</div>

</template>

<script>

import Plyr from 'plyr';

const controls = [
    // The large play button in the center
    'play-large',
    // Restart playback
    'restart',
    // Rewind by the seek time (default 10 seconds)
    'rewind',
    // Play/pause playback
    'play',
    // Fast forward by the seek time (default 10 seconds)
    'fast-forward',
    // The progress bar and scrubber for playback and buffering
    'progress',
    // The current time of playback
    'current-time',
    // The full duration of the media
    'duration',
    // Toggle mute
    'mute',
    // Volume control
    'volume',
    // Toggle captions
    'captions',
    // Settings menu 
    'settings',
    // Show a download button with a link to either the current 
    // source or a custom URL you specify in your options
    'download',
    // Toggle fullscreen
    'fullscreen' 
];

const i18n = {
    restart: 'Riniciar',
    rewind: 'Retroceder {seektime} secs',
    play: 'Reproducir',
    pause: 'Pausar',
    fastForward: 'Avanzar {seektime} secs',
    seek: 'Seek',
    played: 'Played',
    buffered: 'Buffered',
    currentTime: 'Current time',
    duration: 'Duración',
    volume: 'Volumen',
    mute: 'Silenciar',
    unmute: 'Unmute',
    enableCaptions: 'Enable captions',
    disableCaptions: 'Disable captions',
    enterFullscreen: 'Pantalla completa',
    exitFullscreen: 'Salir de pantalla completa',
    frameTitle: 'Player for {title}',
    captions: 'Captions',
    settings: 'Settings',
    speed: 'Speed',
    normal: 'Normal',
    quality: 'Quality',
    loop: 'Loop',
    start: 'Start',
    end: 'End',
    all: 'All',
    reset: 'Reset',
    disabled: 'Disabled',
    advertisement: 'Ad'
};

const alert = {
    type: 'error',
    text: 'Ha ocurrido un error con la reproducción del stream de video. ' + 
          'Por verifique que los parámetros de la cámara sean correctos'
};

export default {
    name: 'VideoPlayer',

    props: {
        src: {
            type: String,
            required: true
        },
        controls: {
            type: Array,
            default: () => [
                'play-large',
                'play',
                'current-time',                
                'fullscreen' 
            ],
            validator: values => values.every(val => controls.includes(val))
        }
    },

    data() {
        return {
            player: undefined,
            alert: null
        };
    },

    mounted() {
        this.player = new Plyr('#plyr-container', {
            title: 'Example Title',
            controls: this.controls,
            i18n: i18n
        });
        this.player.on('error', () => {
            this.alert = alert;
        });
    },

    beforeDestroy() {
        if (this.player) {            
            this.player.destroy();
        }
    },

    methods: {
    }
};
</script>
