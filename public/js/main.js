(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Nav scroll state + mobile toggle */
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => navLinks.classList.remove('is-open'))
    );
  }

  /* Scroll reveal */
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('[data-reveal]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 0.08}s`;
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
  }

  /* Hero frame parallax tilt */
  const frameWrap = document.querySelector('.hero__frame-wrap');
  const frame = document.querySelector('.hero__frame');
  if (frameWrap && frame && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    frameWrap.addEventListener('mousemove', (e) => {
      const rect = frameWrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      frame.style.transform = `rotateY(${-8 + x * 10}deg) rotateX(${4 - y * 10}deg) rotate(-1.5deg)`;
    });
    frameWrap.addEventListener('mouseleave', () => {
      frame.style.transform = 'rotateY(-8deg) rotateX(4deg) rotate(-1.5deg)';
    });
  }

  /* Ticking KPI number in hero */
  const tickEl = document.querySelector('[data-tick-target]');
  if (tickEl && !reduceMotion) {
    const target = parseInt(tickEl.dataset.tickTarget, 10);
    const duration = 1600;
    const start = performance.now();
    const format = (n) => 'Rs. ' + Math.round(n).toLocaleString('en-PK');
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      tickEl.textContent = format(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  } else if (tickEl) {
    tickEl.textContent = 'Rs. ' + parseInt(tickEl.dataset.tickTarget, 10).toLocaleString('en-PK');
  }

  /* Waitlist form (stubbed backend — logs signup server-side) */
  const wlForm = document.querySelector('#waitlist-form');
  const wlStatus = document.querySelector('#waitlist-status');
  if (wlForm) {
    wlForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = wlForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      wlStatus.textContent = 'Joining…';
      wlStatus.removeAttribute('data-state');
      try {
        const payload = Object.fromEntries(new FormData(wlForm).entries());
        const res = await fetch('/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.ok) {
          wlStatus.textContent = "You're on the list — we'll email you at launch.";
          wlStatus.dataset.state = 'ok';
          wlForm.reset();
        } else {
          wlStatus.textContent = data.error || 'Something went wrong. Please try again.';
          wlStatus.dataset.state = 'error';
        }
      } catch (err) {
        wlStatus.textContent = 'Network error — please try again.';
        wlStatus.dataset.state = 'error';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  /* Subscribe form (live products — creates a pending subscription request) */
  const subForm = document.querySelector('#subscribe-form');
  const subStatus = document.querySelector('#subscribe-status');
  if (subForm) {
    subForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = subForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      subStatus.textContent = 'Sending…';
      subStatus.removeAttribute('data-state');
      try {
        const payload = Object.fromEntries(new FormData(subForm).entries());
        const res = await fetch('/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.ok) {
          subStatus.textContent = "Request received — we'll send a payment link or activate your free access within one business day.";
          subStatus.dataset.state = 'ok';
          subForm.reset();
        } else {
          subStatus.textContent = data.error || 'Something went wrong. Please try again.';
          subStatus.dataset.state = 'error';
        }
      } catch (err) {
        subStatus.textContent = 'Network error — please try again.';
        subStatus.dataset.state = 'error';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  /* Contact form (stubbed backend — logs submission server-side) */
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      status.textContent = 'Sending…';
      status.removeAttribute('data-state');

      try {
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());
        const res = await fetch('/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.ok) {
          status.textContent = "Thanks — we'll be in touch within one business day.";
          status.dataset.state = 'ok';
          form.reset();
        } else {
          status.textContent = data.error || 'Something went wrong. Please try again.';
          status.dataset.state = 'error';
        }
      } catch (err) {
        status.textContent = 'Network error — please try again.';
        status.dataset.state = 'error';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
})();
