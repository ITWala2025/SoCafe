// ===== MENU DATA =====
const menuData = {
  hot: [
    { name: 'Espresso', desc: 'Single or double shot, rich & intense' },
    { name: 'Cappuccino', desc: 'Espresso, steamed milk & silky foam' },
    { name: 'Latte', desc: 'Smooth espresso with velvety steamed milk' },
    { name: 'Americano', desc: 'Long black with hot water' },
    { name: 'Flat White', desc: 'Double ristretto with microfoam' },
    { name: 'Hot Chocolate', desc: 'Rich, creamy & warming' },
    { name: 'Tea', desc: "Barry's Tea – Irish breakfast & herbal" },
  ],
  cold: [
    { name: 'Iced Latte', desc: 'Chilled espresso with cold milk over ice' },
    { name: 'Iced Americano', desc: 'Double shot espresso over ice' },
    { name: 'Cold Brew', desc: 'Slow-steeped, smooth & refreshing' },
    { name: 'Iced Mocha', desc: 'Chocolate, espresso & cold milk on ice' },
    { name: 'Smoothie', desc: 'Seasonal fruits blended fresh' },
    { name: 'Fresh Juice', desc: 'Orange or apple, pressed daily' },
  ],
  food: [
    { name: 'Toasted Sandwich', desc: 'Ham & cheese or tuna melt' },
    { name: 'Soup of the Day', desc: 'Homemade, served with bread' },
    { name: 'Sausage Roll', desc: 'Flaky pastry, hearty filling' },
    { name: 'Wrap', desc: 'Chicken or veggie, fresh & filling' },
    { name: 'Quiche', desc: 'Homemade, served with side salad' },
    { name: 'Salad Bowl', desc: 'Seasonal greens, light & fresh' },
  ],
  treats: [
    { name: 'Scone', desc: 'Plain or fruit, with butter & jam' },
    { name: 'Croissant', desc: 'Buttery, flaky & golden' },
    { name: 'Muffin', desc: 'Blueberry or chocolate chip' },
    { name: 'Brownie', desc: 'Rich, fudgy & indulgent' },
    { name: 'Cookie', desc: 'Freshly baked, warm & chewy' },
    { name: 'Cake Slice', desc: "Ask for today's selection" },
  ],
};

// ===== RENDER MENU =====
function renderMenu(category) {
  const grid = document.getElementById('menuGrid');
  const items = menuData[category];

  // Fade out
  grid.style.opacity = '0';
  grid.style.transform = 'translateY(12px)';

  setTimeout(() => {
    grid.innerHTML = items
      .map(
        (item) => `
      <div class="menu-card">
        <div class="menu-card-header">
          <h3 class="menu-card-name">${item.name}</h3>
          <span class="menu-card-icon"></span>
        </div>
        <p class="menu-card-desc">${item.desc}</p>
      </div>
    `
      )
      .join('');

    // Fade in
    requestAnimationFrame(() => {
      grid.style.opacity = '1';
      grid.style.transform = 'translateY(0)';
    });
  }, 250);
}

// ===== MENU TABS =====
function initMenuTabs() {
  const tabs = document.querySelectorAll('.menu-tab');
  const grid = document.getElementById('menuGrid');

  // Set up transition
  grid.style.transition =
    'opacity 0.3s ease, transform 0.3s ease';

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      renderMenu(tab.dataset.tab);
    });
  });

  // Initial render
  renderMenu('hot');
}

// ===== NAVBAR SCROLL =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open')
      ? 'hidden'
      : '';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#book') return; // Handled by booking modal
      if (href === '#' || href === '#!') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const targetPosition =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

// ===== PARALLAX EFFECT ON HERO =====
function initHeroParallax() {
  const heroBg = document.querySelector('.hero-bg img');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.15}px)`;
    }
  });
}

// ===== TOAST NOTIFICATION =====
function showToast(message, icon = '☕') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-text">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-leave');
    toast.addEventListener('animationend', () => toast.remove());
  }, 4000);
}

// ===== BOOKING MODAL =====
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const cancelBtn = document.getElementById('modalCancelBtn');
  const form = document.getElementById('bookingForm');
  const dateInput = document.getElementById('bookDate');

  if (!modal) return;

  // Set today as minimum date
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind to any book trigger
  document.querySelectorAll('a[href="#book"], #navBookBtn, .footer-book-link').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // If mobile menu is open, close it
      const navLinks = document.getElementById('navLinks');
      const toggle = document.getElementById('menuToggle');
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        if (toggle) toggle.classList.remove('active');
      }
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // Close on clicking backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Handle submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bookName').value || 'Guest';
      const guests = document.getElementById('bookGuests').value;
      const time = document.getElementById('bookTime').value;

      closeModal();
      form.reset();

      showToast(`Thank you, ${name}! Your table request for ${guests} at ${time} has been reserved.`, '🌿');
    });
  }
}

// ===== FOOD & DRINK CARDS CLICK TO MENU =====
function initFoodCards() {
  const cards = document.querySelectorAll('.food-card');
  const categoryMap = {
    'coffee & pastries': 'hot',
    'sweet treats': 'treats',
    'light bites': 'food',
    'cold drinks': 'cold'
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.food-card-title')?.textContent.trim().toLowerCase();
      const targetCategory = categoryMap[title] || 'hot';

      // Switch active tab
      const targetTab = document.querySelector(`.menu-tab[data-tab="${targetCategory}"]`);
      if (targetTab) {
        document.querySelectorAll('.menu-tab').forEach((t) => t.classList.remove('active'));
        targetTab.classList.add('active');
        renderMenu(targetCategory);
      }

      // Scroll to menu
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        const offset = 80;
        const targetPosition =
          menuSection.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===== SCROLLSPY =====
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initMenuTabs();
  initScrollReveal();
  initSmoothScroll();
  initHeroParallax();
  initBookingModal();
  initFoodCards();
  initBackToTop();
  initScrollSpy();
});
