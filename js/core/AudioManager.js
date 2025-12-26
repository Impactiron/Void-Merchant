// FILE: js/core/AudioManager.js

/**
 * 📘 PROJECT: VOID MERCHANT
 * MODULE: AUDIO MANAGER
 * * Kapselt die Phaser Sound Engine für zentrale Kontrolle.
 * * UPDATE: Synthetischer Fallback (Oscillators), falls keine Dateien vorhanden sind.
 */

export default class AudioManager {
    constructor(scene) {
        this.scene = scene;

        // Settings (könnten später aus SaveGame/Config kommen)
        this.volMaster = 0.5;
        this.volMusic = 0.3;
        this.volSfx = 0.6;

        this.currentMusic = null;

        // Web Audio Context für Synthese (Lazy Init)
        this.audioCtx = null;
    }

    /**
     * Initialisiert den AudioContext bei Bedarf (User Interaction Requirement)
     */
    initSynth() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            }
        }
    }

    /**
     * Spielt einen Sound-Effekt (One-Shot).
     * Nutzt Phaser Sound, oder Fallback auf Synth.
     * @param {string} key - Der Asset Key (z.B. 'sfx_laser_shoot')
     * @param {Object} config - Optionale Phaser Sound Config
     */
    playSfx(key, config = {}) {
        const finalConfig = {
            volume: this.volSfx,
            ...config
        };

        // 1. Versuche Phaser Cache
        if (this.scene.cache.audio.exists(key)) {
            this.scene.sound.play(key, finalConfig);
        } else {
            // 2. Fallback: Synthesizer
            this.playSynth(key, finalConfig.volume);
        }
    }

    /**
     * Generiert Sound basierend auf dem Key-Namen
     */
    playSynth(key, volume) {
        this.initSynth();
        if (!this.audioCtx) return;

        const t = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        // Mapping Logic: Key Name -> Sound Type
        if (key.includes('laser') || key.includes('shoot')) {
            // PEW PEW (High to Low Frequency)
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(100, t + 0.15);
            gain.gain.setValueAtTime(volume * 0.5, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
            osc.start(t);
            osc.stop(t + 0.15);

        } else if (key.includes('explosion') || key.includes('impact')) {
            // BOOM (Low Square + Noise Simulation via random freq mod not perfectly possible with simple osc, using low square)
            osc.type = 'square';
            osc.frequency.setValueAtTime(100, t);
            osc.frequency.exponentialRampToValueAtTime(10, t + 0.3);
            gain.gain.setValueAtTime(volume * 0.8, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
            osc.start(t);
            osc.stop(t + 0.3);

        } else if (key.includes('ui_select') || key.includes('menu')) {
            // BLIP (Short High Sine)
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, t);
            gain.gain.setValueAtTime(volume * 0.5, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            osc.start(t);
            osc.stop(t + 0.1);

        } else if (key.includes('ui_hover')) {
            // TICK (Very Short)
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, t);
            gain.gain.setValueAtTime(volume * 0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
            osc.start(t);
            osc.stop(t + 0.05);
        }
    }

    /**
     * Startet oder wechselt die Hintergrundmusik.
     * (Synth Fallback für Musik ist komplex, wir lassen es bei Silence wenn file fehlt)
     */
    playMusic(key, fadeDuration = 1000) {
        if (!this.scene.cache.audio.exists(key)) {
            // console.warn(`AudioManager: Music '${key}' not found. Playing Silence.`);
            return;
        }

        if (this.currentMusic && this.currentMusic.key === key && this.currentMusic.isPlaying) {
            return;
        }

        if (this.currentMusic) {
            this.scene.tweens.add({
                targets: this.currentMusic,
                volume: 0,
                duration: fadeDuration,
                onComplete: () => {
                    if (this.currentMusic) {
                        this.currentMusic.stop();
                        this.currentMusic.destroy();
                    }
                    this.startNewMusic(key, fadeDuration);
                }
            });
        } else {
            this.startNewMusic(key, fadeDuration);
        }
    }

    startNewMusic(key, fadeDuration) {
        this.currentMusic = this.scene.sound.add(key, {
            volume: 0,
            loop: true
        });

        this.currentMusic.play();

        this.scene.tweens.add({
            targets: this.currentMusic,
            volume: this.volMusic,
            duration: fadeDuration
        });
    }

    setMusicVolume(vol) {
        this.volMusic = vol;
        if (this.currentMusic) {
            this.currentMusic.setVolume(vol);
        }
    }
}


