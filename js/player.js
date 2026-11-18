/**
 * Y. Jitesh Reddy — Dubbing & Voiceover Portfolio
 * Custom Interactive Audio Suite & Organic Visualizer
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------
  // DOM Elements
  // ---------------------------------------------------------
  const audio = document.getElementById('mainAudio');
  const btnPlay = document.getElementById('btnPlay');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const btnReplay = document.getElementById('btnReplay');
  const btnBackward = document.getElementById('btnBackward');
  const btnForward = document.getElementById('btnForward');
  const btnSpeed = document.getElementById('btnSpeed');
  const speedDisplay = document.getElementById('speedDisplay');
  const btnMute = document.getElementById('btnMute');
  const volIconHigh = document.getElementById('volIconHigh');
  const volIconMuted = document.getElementById('volIconMuted');
  const volumeSlider = document.getElementById('volumeSlider');
  const currentTimeEl = document.getElementById('currentTime');
  const totalDurationEl = document.getElementById('totalDuration');
  const waveformContainer = document.getElementById('waveformContainer');
  const waveformProgress = document.getElementById('waveformProgress');
  const waveformBarsContainer = document.getElementById('waveformBars');
  const visualizerContainer = document.querySelector('.visualizer-container');
  const visualizerCanvas = document.getElementById('visualizerCanvas');
  const transcriptToggle = document.getElementById('transcriptToggle');
  const transcriptContent = document.getElementById('transcriptContent');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.querySelector('.nav-links');

  // Canvas 2D Context
  const ctx = visualizerCanvas.getContext('2d');

  // Playback speeds cycle
  const speeds = [1.0, 1.25, 1.5, 0.75];
  let currentSpeedIdx = 0;
  let lastVolume = 1;
  let isPlaying = false;
  let animFrameId = null;

  // ---------------------------------------------------------
  // 1. Generate Organic Waveform Bars (64 Bars)
  // ---------------------------------------------------------
  // Realistic vocal monologue pattern: variation in speech, emphasis, pauses
  const barHeights = [
    18, 24, 38, 45, 62, 55, 78, 68, 52, 40, 25, 15,
    30, 48, 72, 85, 92, 75, 60, 42, 58, 80, 95, 70,
    35, 20, 28, 46, 65, 82, 88, 76, 54, 48, 64, 82,
    70, 52, 38, 22, 16, 32, 54, 75, 90, 84, 66, 48,
    35, 52, 70, 86, 78, 62, 45, 30, 22, 38, 58, 72,
    60, 42, 28, 18
  ];

  barHeights.forEach((h, idx) => {
    const bar = document.createElement('div');
    bar.className = 'wf-bar';
    bar.style.height = `${Math.max(12, Math.min(100, h * 0.44))}px`;
    bar.dataset.index = idx;
    waveformBarsContainer.appendChild(bar);
  });

  const bars = Array.from(waveformBarsContainer.children);

  // ---------------------------------------------------------
  // 2. Play / Pause Handling
  // ---------------------------------------------------------
  function updatePlayState(playing) {
    isPlaying = playing;
    if (playing) {
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
      btnPlay.classList.add('is-playing');
      visualizerContainer.classList.add('playing');
      startVisualizer();
    } else {
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
      btnPlay.classList.remove('is-playing');
      visualizerContainer.classList.remove('playing');
    }
  }

  btnPlay.addEventListener('click', () => {
    if (audio.paused) {
      stopAllMiniPlayers();
      audio.play().then(() => {
        updatePlayState(true);
      }).catch(err => {
        console.warn('Playback error or blocked by autoplay policy:', err);
      });
    } else {
      audio.pause();
      updatePlayState(false);
    }
  });

  audio.addEventListener('play', () => {
    stopAllMiniPlayers();
    updatePlayState(true);
  });
  audio.addEventListener('pause', () => updatePlayState(false));
  audio.addEventListener('ended', () => {
    updatePlayState(false);
    audio.currentTime = 0;
    updateProgressUI();
  });

  // ---------------------------------------------------------
  // 3. Replay, Forward & Backward Controls
  // ---------------------------------------------------------
  // Replay from start
  btnReplay.addEventListener('click', () => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
    updatePlayState(true);
    showNotice('Audio restarted from beginning');
  });

  // Backward 10s
  btnBackward.addEventListener('click', () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
    updateProgressUI();
  });

  // Forward 10s
  btnForward.addEventListener('click', () => {
    const duration = audio.duration || 158; // 2:38 = 158s
    audio.currentTime = Math.min(duration, audio.currentTime + 10);
    updateProgressUI();
  });

  // ---------------------------------------------------------
  // 4. Playback Speed Selector
  // ---------------------------------------------------------
  btnSpeed.addEventListener('click', () => {
    currentSpeedIdx = (currentSpeedIdx + 1) % speeds.length;
    const newSpeed = speeds[currentSpeedIdx];
    audio.playbackRate = newSpeed;
    speedDisplay.textContent = `${newSpeed}×`;
  });

  // ---------------------------------------------------------
  // 5. Volume & Mute Controls
  // ---------------------------------------------------------
  function setVolumeIcon(vol) {
    if (vol === 0 || audio.muted) {
      volIconHigh.classList.add('hidden');
      volIconMuted.classList.remove('hidden');
    } else {
      volIconHigh.classList.remove('hidden');
      volIconMuted.classList.add('hidden');
    }
  }

  volumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    audio.volume = val;
    audio.muted = (val === 0);
    setVolumeIcon(val);
  });

  btnMute.addEventListener('click', () => {
    if (audio.muted || audio.volume === 0) {
      audio.muted = false;
      audio.volume = lastVolume > 0 ? lastVolume : 1;
      volumeSlider.value = audio.volume;
      setVolumeIcon(audio.volume);
    } else {
      lastVolume = audio.volume;
      audio.muted = true;
      volumeSlider.value = 0;
      setVolumeIcon(0);
    }
  });

  // ---------------------------------------------------------
  // 6. Time Formatting & Progress Tracking
  // ---------------------------------------------------------
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updateProgressUI() {
    const duration = audio.duration || 158.4;
    const current = audio.currentTime;
    const progressPercent = Math.min(100, Math.max(0, (current / duration) * 100));

    // Update scrubber progress line
    waveformProgress.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(current);

    // Update wave bars played class
    const totalBars = bars.length;
    const activeBarIndex = Math.floor((progressPercent / 100) * totalBars);

    bars.forEach((bar, idx) => {
      if (idx <= activeBarIndex) {
        bar.classList.add('played');
      } else {
        bar.classList.remove('played');
      }
    });

    // Update aria attribute
    waveformContainer.setAttribute('aria-valuenow', Math.round(progressPercent));
  }

  audio.addEventListener('timeupdate', updateProgressUI);

  audio.addEventListener('loadedmetadata', () => {
    if (audio.duration && !isNaN(audio.duration)) {
      totalDurationEl.textContent = formatTime(audio.duration);
    }
  });

  // Fallback if loadedmetadata already fired or cached
  if (audio.duration && !isNaN(audio.duration)) {
    totalDurationEl.textContent = formatTime(audio.duration);
  }

  // ---------------------------------------------------------
  // 7. Interactive Waveform Seeking
  // ---------------------------------------------------------
  waveformContainer.addEventListener('click', (e) => {
    const rect = waveformContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const ratio = Math.max(0, Math.min(1, clickX / width));
    const duration = audio.duration || 158.4;
    audio.currentTime = ratio * duration;
    updateProgressUI();
  });

  // ---------------------------------------------------------
  // 8. Organic Harmonic Wave Visualizer (Canvas)
  // ---------------------------------------------------------
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = visualizerCanvas.getBoundingClientRect();
    visualizerCanvas.width = rect.width * dpr;
    visualizerCanvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  let phase = 0;

  function renderVisualizer() {
    const width = visualizerCanvas.offsetWidth;
    const height = visualizerCanvas.offsetHeight;
    const midY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // If audio is playing, amplify waves; if paused, keep calm gentle organic breath
    const amplitude = isPlaying ? 22 : 4;
    const speed = isPlaying ? 0.05 : 0.015;
    phase += speed;

    // Draw 3 harmonic soft pastel waves
    const waves = [
      { color: 'rgba(94, 138, 110, 0.45)', freq: 0.018, phaseOffset: 0, ampMult: 1.0 },
      { color: 'rgba(209, 110, 84, 0.35)', freq: 0.024, phaseOffset: 2.2, ampMult: 0.8 },
      { color: 'rgba(124, 116, 166, 0.3)', freq: 0.015, phaseOffset: 4.1, ampMult: 0.6 }
    ];

    waves.forEach(wave => {
      ctx.beginPath();
      ctx.strokeStyle = wave.color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';

      for (let x = 0; x <= width; x += 4) {
        // Organic envelope tapering at the edges
        const envelope = Math.sin((x / width) * Math.PI);
        const y = midY + Math.sin(x * wave.freq + phase + wave.phaseOffset) * amplitude * wave.ampMult * envelope;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    });

    animFrameId = requestAnimationFrame(renderVisualizer);
  }

  function startVisualizer() {
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(renderVisualizer);
    }
  }

  // Initial render for visualizer
  renderVisualizer();

  // ---------------------------------------------------------
  // 9. Transcript / Spoken Reflection Accordion
  // ---------------------------------------------------------
  transcriptToggle.addEventListener('click', () => {
    const isExpanded = transcriptToggle.getAttribute('aria-expanded') === 'true';
    transcriptToggle.setAttribute('aria-expanded', !isExpanded);
    transcriptContent.classList.toggle('is-open', !isExpanded);
  });

  // ---------------------------------------------------------
  // 10. Mobile Navigation Toggle
  // ---------------------------------------------------------
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    // Close when clicking nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // ---------------------------------------------------------
  // 11. Keyboard Shortcuts (Space, Arrow keys, R, M)
  // ---------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    // Avoid hijacking inputs and textarea
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      return;
    }

    if (e.code === 'Space') {
      e.preventDefault();
      btnPlay.click();
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      btnBackward.click();
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      btnForward.click();
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      btnReplay.click();
    } else if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      btnMute.click();
    }
  });

  // Stop all active mini players across the spectrum
  function stopAllMiniPlayers() {
    document.querySelectorAll('.mini-player').forEach(player => {
      const a = player.querySelector('.mini-audio');
      if (a && !a.paused) {
        a.pause();
      }
      player.classList.remove('is-playing');
      const pIcon = player.querySelector('.mini-icon-play');
      const sIcon = player.querySelector('.mini-icon-pause');
      if (pIcon) pIcon.classList.remove('hidden');
      if (sIcon) sIcon.classList.add('hidden');
    });
  }

  // ---------------------------------------------------------
  // 12. Mini Audio Players for Emotion Range Spectrum
  // ---------------------------------------------------------
  const miniPlayers = document.querySelectorAll('.mini-player');
  miniPlayers.forEach(player => {
    const miniAudio = player.querySelector('.mini-audio');
    const btnMiniPlay = player.querySelector('.btn-mini-play');
    const playIcon = player.querySelector('.mini-icon-play');
    const pauseIcon = player.querySelector('.mini-icon-pause');
    const scrubber = player.querySelector('.mini-scrubber');
    const progress = player.querySelector('.mini-progress');
    const currTime = player.querySelector('.mini-curr');
    const durTime = player.querySelector('.mini-dur');

    if (!miniAudio || !btnMiniPlay) return;

    function updateMiniUI(playing) {
      if (playing) {
        player.classList.add('is-playing');
        if (playIcon) playIcon.classList.add('hidden');
        if (pauseIcon) pauseIcon.classList.remove('hidden');
      } else {
        player.classList.remove('is-playing');
        if (playIcon) playIcon.classList.remove('hidden');
        if (pauseIcon) pauseIcon.classList.add('hidden');
      }
    }

    btnMiniPlay.addEventListener('click', (e) => {
      e.stopPropagation();
      if (miniAudio.paused) {
        // Stop main hero audio if playing
        if (!audio.paused) {
          audio.pause();
          updatePlayState(false);
        }
        // Stop all other mini players
        stopAllMiniPlayers();
        // Play this audio
        miniAudio.play().then(() => {
          updateMiniUI(true);
        }).catch(err => console.warn('Mini playback blocked or error:', err));
      } else {
        miniAudio.pause();
        updateMiniUI(false);
      }
    });

    miniAudio.addEventListener('play', () => updateMiniUI(true));
    miniAudio.addEventListener('pause', () => updateMiniUI(false));
    miniAudio.addEventListener('ended', () => {
      updateMiniUI(false);
      miniAudio.currentTime = 0;
      if (progress) progress.style.width = '0%';
      if (currTime) currTime.textContent = '0:00';
    });

    miniAudio.addEventListener('timeupdate', () => {
      const dur = miniAudio.duration;
      const cur = miniAudio.currentTime;
      if (dur && !isNaN(dur) && dur > 0) {
        const pct = (cur / dur) * 100;
        if (progress) progress.style.width = `${pct}%`;
        if (currTime) currTime.textContent = formatTime(cur);
      }
    });

    miniAudio.addEventListener('loadedmetadata', () => {
      if (miniAudio.duration && !isNaN(miniAudio.duration)) {
        if (durTime) durTime.textContent = formatTime(miniAudio.duration);
      }
    });

    if (scrubber) {
      scrubber.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = scrubber.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const dur = miniAudio.duration;
        if (dur && !isNaN(dur)) {
          miniAudio.currentTime = ratio * dur;
        }
      });
    }
  });

  // Temporary feedback toast helper
  function showNotice(text) {
    const existing = document.getElementById('tempToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'tempToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #231F1C;
      color: #FFF;
      font-size: 0.85rem;
      padding: 0.65rem 1.15rem;
      border-radius: 9999px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.18);
      z-index: 9999;
      pointer-events: none;
      animation: fadeInOut 2.4s ease forwards;
    `;
    toast.textContent = text;
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 2400);
  }
});
