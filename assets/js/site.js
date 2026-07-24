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

// ================================================================
//  設定（config.js）連動：価格・残枠・電話・UTM・計測
// ================================================================
(function () {
  const cfg = window.ALIGN_CONFIG || {};
  const yen = (n) => '¥' + Number(n || 0).toLocaleString('ja-JP');
  const ga = (name, params) => { if (typeof gtag === 'function') gtag('event', name, params || {}); };

  // ── キャンペーン価格の切替（.js-trial-price / .js-trial-strike / [data-when]）
  //    価格表示は全ページ・全CTAで単一ソース。campaign中は「¥3,300（取消線）→ ¥0」で統一。
  const campaign = cfg.campaignActive !== false;
  const normalPrice = yen(cfg.trialPriceNormal || 3300);
  document.querySelectorAll('.js-trial-price').forEach((el) => {
    el.innerHTML = campaign ? ('<s class="p-was">' + normalPrice + '</s> ¥0') : normalPrice;
  });
  document.querySelectorAll('.js-trial-strike').forEach((el) => {
    if (campaign) { el.hidden = false; el.innerHTML = '<s>' + yen(cfg.trialPriceNormal || 3300) + '</s>'; }
    else { el.hidden = true; }
  });
  document.querySelectorAll('[data-when="campaign"]').forEach((el) => { el.hidden = !campaign; });
  document.querySelectorAll('[data-when="normal"]').forEach((el) => { el.hidden = campaign; });

  // ── 残枠カウンター（.slot-counter）実数連動・N≤3強調・N=0で来月受付に自動切替
  const remaining = Number(cfg.trialSlotsRemaining);
  document.querySelectorAll('.slot-counter').forEach((el) => {
    if (!campaign || isNaN(remaining)) { el.hidden = true; return; }
    if (remaining <= 0) {
      el.classList.add('is-full');
      el.innerHTML = '<span class="sc-full">今月分は満枠です。来月分のご予約を受付中。</span>';
    } else {
      const low = remaining <= 3;
      el.classList.toggle('is-low', low);
      el.innerHTML = '今月の姿勢チェック体験枠 <b class="sc-num">残り' + remaining + '名</b>';
    }
  });

  // ── 電話UI：config.phoneNumber が空なら非表示。番号が入れば全ページで有効化
  const rawTel = (cfg.phoneNumber || '').trim();
  const telDigits = rawTel.replace(/[^0-9+]/g, '');
  document.querySelectorAll('.js-tel-btn, .js-tel-link').forEach((el) => {
    if (telDigits) { el.hidden = false; el.setAttribute('href', 'tel:' + telDigits); }
    else { el.hidden = true; }
  });
  document.querySelectorAll('.js-phone-text').forEach((el) => {
    if (telDigits) { el.textContent = rawTel; el.hidden = false; }
    else { el.hidden = true; }
  });
  document.querySelectorAll('[data-tel-only]').forEach((el) => { el.hidden = !telDigits; });

  // ── 紹介特典（.js-referral-friend / .js-referral-member）
  const rb = cfg.referralBenefit || {};
  document.querySelectorAll('.js-referral-friend').forEach((el) => { if (rb.friend) el.textContent = rb.friend; });
  document.querySelectorAll('.js-referral-member').forEach((el) => { if (rb.member) el.textContent = rb.member; });

  // ── UTM・診断タイプをフォーム hidden に転記
  const params = new URLSearchParams(location.search);
  const utmBits = ['utm_source', 'utm_medium', 'utm_campaign'].map((k) => params.get(k)).filter(Boolean);
  const utmVal = utmBits.length ? utmBits.join(' / ') : (document.referrer ? '参照元: ' + document.referrer : '直接/不明');
  document.querySelectorAll('#utm-source, [name="流入元"]').forEach((el) => { el.value = utmVal; });
  const shindanType = params.get('type');
  if (shindanType) document.querySelectorAll('#shindan-type, [name="診断タイプ"]').forEach((el) => { el.value = shindanType; });

  // ── 計測：LINE / 電話 / フォーム
  document.addEventListener('click', function (e) {
    const line = e.target.closest('a[href*="lin.ee"]');
    if (line) {
      const sec = line.closest('[data-cta-location]');
      ga('cta_line_click', {
        location: sec ? sec.getAttribute('data-cta-location') : 'other',
        link_text: (line.textContent || '').trim().slice(0, 80),
        page_path: location.pathname
      });
    }
    const tel = e.target.closest('a[href^="tel:"]');
    if (tel) ga('cta_tel_click', { page_path: location.pathname });
  }, true);
  document.querySelectorAll('form[data-cta-form]').forEach((f) => {
    f.addEventListener('submit', () => ga('cta_form_submit', { form: f.getAttribute('data-cta-form') || 'reserve', page_path: location.pathname }));
  });
})();
