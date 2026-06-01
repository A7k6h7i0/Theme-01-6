/* ================================================
   AVENTO — Main JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar Scroll Behavior ---- */
  const navbar = document.getElementById('navbar');
  function handleNavbar() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
    } else {
      navbar.classList.remove('scrolled');
      if (navbar.dataset.transparent === 'true') navbar.classList.add('transparent');
    }
  }
  if (navbar) {
    if (navbar.dataset.transparent === 'true') navbar.classList.add('transparent');
    window.addEventListener('scroll', handleNavbar, { passive: true });
    handleNavbar();
  }

  /* ---- Mobile Menu ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  /* ---- Active Nav Link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Scroll Reveal ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---- Counter Animation ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }
  const counterEls = document.querySelectorAll('.counter-num');
  if (counterEls.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* ---- Skill Bar Animation ---- */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (skillBars.length > 0) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          setTimeout(() => {
            bar.style.width = bar.dataset.width;
          }, 200);
          skillObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });
    skillBars.forEach(bar => skillObserver.observe(bar));
  }

  /* ---- Portfolio Filter ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        portfolioItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
            item.style.animation = 'fadeInUp 0.4s ease both';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---- Testimonials Slider ---- */
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.testimonials-dot');
  const prevBtn = document.querySelector('.testimonials-btn.prev');
  const nextBtn = document.querySelector('.testimonials-btn.next');
  if (track) {
    let current = 0;
    const items = track.querySelectorAll('.testimonial-item');
    const total = items.length;
    let autoplayTimer;

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    }

    function startAutoplay() {
      autoplayTimer = setInterval(() => goTo(current + 1), 5500);
    }
    function stopAutoplay() { clearInterval(autoplayTimer); }

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoplay(); goTo(current - 1); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoplay(); goTo(current + 1); startAutoplay(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { stopAutoplay(); goTo(i); startAutoplay(); }));

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { stopAutoplay(); goTo(diff > 0 ? current + 1 : current - 1); startAutoplay(); }
    });

    goTo(0);
    startAutoplay();
  }

  /* ---- Accordion (FAQ) ---- */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.accordion-body').style.maxHeight = '0';
      });

      // Open clicked if was closed
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---- FAQ Tabs ---- */
  const faqTabs = document.querySelectorAll('.faq-tab');
  const faqItems = document.querySelectorAll('.accordion-item[data-category]');
  if (faqTabs.length > 0) {
    faqTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        faqTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.cat;
        faqItems.forEach(item => {
          item.style.display = (cat === 'all' || item.dataset.category === cat) ? '' : 'none';
        });
      });
    });
  }

  /* ---- Lightbox ---- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox) {
    document.querySelectorAll('.portfolio-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img && lightboxImg) {
          lightboxImg.src = img.src;
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });
    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };
    document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ---- Back to Top ---- */
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- Parallax Hero ---- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    document.querySelector('.hero')?.classList.add('loaded');
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `scale(1) translateY(${scrolled * 0.3}px)`;
    }, { passive: true });
  }

  /* ---- Parallax CTA ---- */
  const ctaBg = document.querySelector('.cta-bg');
  if (ctaBg) {
    window.addEventListener('scroll', () => {
      const section = ctaBg.parentElement;
      const rect = section.getBoundingClientRect();
      const offset = rect.top * 0.25;
      ctaBg.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

  /* ---- Particles ---- */
  const particlesContainer = document.querySelector('.hero-particles');
  if (particlesContainer) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 50 + 8;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 15 + 10}s;
        animation-delay: ${Math.random() * 12}s;
      `;
      particlesContainer.appendChild(p);
    }
  }

  /* ---- Typed text effect ---- */
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const phrases = typedEl.dataset.phrases ? JSON.parse(typedEl.dataset.phrases) : [typedEl.textContent];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let cursor = document.createElement('span');
    cursor.classList.add('typed-cursor');
    cursor.textContent = '|';
    typedEl.textContent = '';
    typedEl.appendChild(cursor);

    function typeLoop() {
      const phrase = phrases[phraseIndex];
      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }
      typedEl.textContent = phrase.substring(0, charIndex);
      typedEl.appendChild(cursor);

      let delay = isDeleting ? 55 : 100;
      if (!isDeleting && charIndex === phrase.length) {
        delay = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
      }
      setTimeout(typeLoop, delay);
    }
    setTimeout(typeLoop, 1200);
  }

  /* ---- Smooth Scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  /* ---- Number ticker for hero stats ---- */
  document.querySelectorAll('.hero-stat .num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.querySelector('span')?.textContent || '';
    let start = 0;
    const duration = 2000;
    const timer = setInterval(() => {
      start += target / (duration / 16);
      if (start >= target) { start = target; clearInterval(timer); }
      el.innerHTML = Math.floor(start).toLocaleString() + `<span>${suffix}</span>`;
    }, 16);
  });

});
