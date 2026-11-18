/**
 * Y. Jitesh Reddy — Dubbing & Voiceover Portfolio
 * Custom Interactive Emotion Audio Suite & Smooth Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------
  // 1. Mobile Navigation Toggle
  // ---------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // ---------------------------------------------------------
  // 2. Helper Utilities: Time Formatting & Toast
  // ---------------------------------------------------------
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // ---------------------------------------------------------
  // 3. Mini Audio Players for All 7 Emotion Clips
  // ---------------------------------------------------------
  const miniPlayers = document.querySelectorAll('.mini-player');

  function stopAllMiniPlayers() {
    miniPlayers.forEach(player => {
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
        // Pause any other playing clip
        stopAllMiniPlayers();

        miniAudio.play().then(() => {
          updateMiniUI(true);
        }).catch(err => {
          console.warn('Playback error or policy:', err);
        });
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

    // Check if metadata was pre-cached
    if (miniAudio.duration && !isNaN(miniAudio.duration)) {
      if (durTime) durTime.textContent = formatTime(miniAudio.duration);
    }

    if (scrubber) {
      scrubber.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = scrubber.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const dur = miniAudio.duration;
        if (dur && !isNaN(dur) && dur > 0) {
          miniAudio.currentTime = ratio * dur;
        }
      });
    }
  });

  // ---------------------------------------------------------
  // 4. Smooth Scrolling for Internal Links
  // ---------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        // Update URL hash without jump
        history.pushState(null, null, targetId);
      }
    });
  });
});
