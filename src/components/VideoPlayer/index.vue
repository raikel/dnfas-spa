<template>
    <div class="video-player">
        <video id="plyr-container" :src="src"></video>
    </div>
</template>

<script>

import Plyr from 'plyr';

export default {
    name: 'VideoDetails',

    props: {
        src: {
            type: String,
            required: true
        },
        play: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            player: undefined
        }
    },

    watch: {
        'play': function() {
            this.control();
        }
    },

    mounted() {
        this.player = new Plyr('#plyr-container', {
            title: 'Example Title',
            controls: [
                'play-large', // The large play button in the center
                'restart', // Restart playback
                'rewind', // Rewind by the seek time (default 10 seconds)
                'play', // Play/pause playback
                'fast-forward', // Fast forward by the seek time (default 10 seconds)
                'progress', // The progress bar and scrubber for playback and buffering
                'current-time', // The current time of playback
                'duration', // The full duration of the media
                'mute', // Toggle mute
                'volume', // Volume control
                // 'captions', // Toggle captions
                // 'settings', // Settings menu
                // 'pip', // Picture-in-picture (currently Safari only)
                // 'airplay', // Airplay (currently Safari only)
                // 'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
                'fullscreen' // Toggle fullscreen
            ],
            i18n: {
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
            }
        });
        this.control();
    },

    beforeDestroy() {
        console.log('Destroying player beforeDestroy');
        if (this.player) {            
            this.player.destroy();
            console.log('Destroyed');
        }
    },

    methods: {
        control() {
            if (this.player) {
                if (this.play && !this.player.playing) {
                    this.player.play();
                } else if (!this.play && this.player.playing) {
                    this.player.pause();
                }
            }
        }
    }
};
</script>
