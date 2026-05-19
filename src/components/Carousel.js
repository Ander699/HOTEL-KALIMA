export const initCarousel = () => {
    const track = document.getElementById('carousel-track');
    const dotsWrap = document.getElementById('carousel-dots');
    if (!track) return;
  
    const slides = Array.from(track.children);
    let current = 0;
    let timer;
  
    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  
    const goTo = (n) => {
      current = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
      resetTimer();
    };
  
    const resetTimer = () => {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 4500);
    };
  
    document.querySelector('.carousel-prev')?.addEventListener('click', () => goTo(current - 1));
    document.querySelector('.carousel-next')?.addEventListener('click', () => goTo(current + 1));
  
    // Swipe support
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    });
  
    resetTimer();
  };