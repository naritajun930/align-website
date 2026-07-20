// ALIGN Personal Gym — 共通スクリプト
(function () {
  // スクロールアニメーション
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // モバイルメニュー
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      btn.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      menu.classList.remove('open'); btn.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  // ヒーロースライドショー（TOPのみ）
  const slides = document.querySelectorAll('#heroSlides img');
  if (slides.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let cur = 0;
    setInterval(() => {
      slides[cur].classList.remove('active');
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add('active');
    }, 5000);
  }

  // 追従CTA：最初の画面を見終えるまでは出さない
  const floatCta = document.querySelector('.float-cta');
  if (floatCta) {
    const revealAt = Math.min(window.innerHeight * 0.8, 560);
    const onScroll = () => {
      floatCta.classList.toggle('show', window.scrollY > revealAt);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();

// LINE CTA クリック計測（GA4）
(function () {
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href*="lin.ee"]');
    if (!a || typeof gtag !== 'function') return;
    gtag('event', 'line_click', {
      link_url: a.href,
      link_text: (a.textContent || '').trim().slice(0, 80),
      page_path: location.pathname
    });
  }, true);
})();
