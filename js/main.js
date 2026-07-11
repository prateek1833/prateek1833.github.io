// ==========================================================================
// Nav: scrolled state + active link + mobile menu
// ==========================================================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const backToTop = document.getElementById('backToTop');

function onScroll() {
  const scrolled = window.scrollY > 20;
  nav.classList.toggle('scrolled', scrolled);
  backToTop.classList.toggle('visible', window.scrollY > 600);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

navToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ==========================================================================
// Scroll reveal
// ==========================================================================
const revealTargets = document.querySelectorAll(
  '.about-content, .about-media, .timeline-item, .project-card, .skill-group, .stat-box, .edu-card, .strength-card, .contact-form, .contact-info'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealTargets.forEach(el => revealObserver.observe(el));

// ==========================================================================
// Animated counters (achievements section)
// ==========================================================================
const counters = document.querySelectorAll('.stat-num[data-count]');

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

// ==========================================================================
// Contact form (Formspree — AJAX submit so we can show inline status)
// ==========================================================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.form-submit');
    const submitText = contactForm.querySelector('.submit-text');
    const originalText = submitText.textContent;

    submitBtn.disabled = true;
    submitText.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status mono';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formStatus.textContent = 'Message sent — I\'ll get back to you soon.';
        formStatus.classList.add('success');
        contactForm.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      formStatus.textContent = 'Something went wrong. Please email me directly instead.';
      formStatus.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitText.textContent = originalText;
    }
  });
}

// ==========================================================================
// Smooth active-link highlight
// ==========================================================================
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4, rootMargin: '-100px 0px -50% 0px' });

sections.forEach(section => sectionObserver.observe(section));
