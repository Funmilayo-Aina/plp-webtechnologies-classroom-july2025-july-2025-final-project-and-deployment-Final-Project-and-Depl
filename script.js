/* js/script.js
   Modular interactivity for FhamaDeli
   - Theme toggle (with localStorage persistence)
   - Animations: bounce, spinner, color box
   - Small reusable functions with parameters and returns
   - Contact form validation
*/

/* ---------- THEME TOGGLE (works & persists) ---------- */
(function initThemeToggle(){
  // allow multiple pages to have the toggle button by selecting all matching IDs
  const toggles = document.querySelectorAll('#toggle-theme');
  const body = document.body;
  const saved = localStorage.getItem('fhamaTheme');

  // apply saved theme on load
  if (saved === 'dark') body.classList.add('dark-mode');

  // update button text(s)
  function updateToggleText() {
    toggles.forEach(btn => {
      btn.textContent = body.classList.contains('dark-mode') ? '🌞 Light Mode' : '🌙 Dark Mode';
      btn.setAttribute('aria-pressed', body.classList.contains('dark-mode'));
    });
  }
  updateToggleText();

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      // persist selection
      if (body.classList.contains('dark-mode')) localStorage.setItem('fhamaTheme', 'dark');
      else localStorage.setItem('fhamaTheme', 'light');
      updateToggleText();
    });
  });
})();

/* ---------- SIMPLE REUSABLE FUNCTIONS (scope, params, return) ---------- */

// calculate delivery cost (demonstrates parameters and return)
function calculateDeliveryCost(distanceKm, ratePerKm = 2) {
  if (typeof distanceKm !== 'number' || distanceKm < 0) return null;
  return distanceKm * ratePerKm;
}

// reusable triggerAnimation: adds class then removes after animationend
function triggerAnimation(el, className) {
  if (!el) return false;
  el.classList.add(className);
  function cleanup() { el.classList.remove(className); el.removeEventListener('animationend', cleanup); }
  el.addEventListener('animationend', cleanup);
  return true;
}

/* ---------- ANIMATION & INTERACTIVITY (DOM) ---------- */
document.addEventListener('DOMContentLoaded', () => {

  // Orders counter
  let orderCount = parseInt(sessionStorage.getItem('fhamaOrders') || '0', 10);
  const orderCountEl = document.getElementById('orderCount');
  const addOrderBtn = document.getElementById('addOrder');
  const resetOrdersBtn = document.getElementById('resetOrders');

  function updateOrderUI() {
    if (orderCountEl) orderCountEl.textContent = orderCount;
    sessionStorage.setItem('fhamaOrders', String(orderCount));
  }
  updateOrderUI();

  if (addOrderBtn) {
    addOrderBtn.addEventListener('click', () => {
      orderCount++;
      updateOrderUI();
      // playful bounce when new order
      const ball = document.getElementById('ball');
      if (ball) triggerAnimation(ball, 'bouncing');
    });
  }
  if (resetOrdersBtn) {
    resetOrdersBtn.addEventListener('click', () => { orderCount = 0; updateOrderUI(); });
  }

  // Payment/delivery selects -> instant textual feedback
  const paymentSelect = document.getElementById('paymentSelect');
  const paymentMessage = document.getElementById('paymentMessage');
  if (paymentSelect && paymentMessage) {
    paymentSelect.addEventListener('change', (e) => {
      paymentMessage.textContent = e.target.value ? `✅ Selected: ${e.target.value}` : '';
    });
  }
  const deliverySelect = document.getElementById('deliverySelect');
  const deliveryMessage = document.getElementById('deliveryMessage');
  if (deliverySelect && deliveryMessage) {
    deliverySelect.addEventListener('change', (e) => {
      deliveryMessage.textContent = e.target.value ? `🚚 Delivery: ${e.target.value}` : '';
    });
  }

  // Animation buttons
  const bounceBtn = document.getElementById('bounceBtn');
  const spinBtn = document.getElementById('spinBtn');
  const colorBtn = document.getElementById('colorBtn');
  const ball = document.getElementById('ball');
  const spinner = document.getElementById('spinner');
  const box = document.getElementById('box');

  if (bounceBtn && ball) {
    bounceBtn.addEventListener('click', () => {
      // toggle: if class exists remove it, else add then auto-remove
      if (ball.classList.contains('bouncing')) ball.classList.remove('bouncing');
      else ball.classList.add('bouncing');
    });
  }

  // spinner start/stop
  let spinnerOn = false;
  if (spinBtn && spinner) {
    spinBtn.addEventListener('click', () => {
      spinnerOn = !spinnerOn;
      if (spinnerOn) spinner.classList.add('spinning');
      else spinner.classList.remove('spinning');
    });
  }

  if (colorBtn && box) {
    colorBtn.addEventListener('click', () => box.classList.toggle('color-change'));
  }

  /* Demonstrate calculateDeliveryCost usage */
  console.log('Delivery cost for 10km @2/unit:', calculateDeliveryCost(10, 2));

  /* ---------- CONTACT FORM VALIDATION ---------- */
  const contactForm = document.getElementById('contactForm') || document.getElementById('contactForm'); // may exist on contact page
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name')?.value.trim() || '';
      const email = document.getElementById('email')?.value.trim() || '';
      const phone = document.getElementById('phone')?.value.trim() || '';
      const service = document.getElementById('service')?.value || '';
      const country = document.getElementById('country')?.value || '';
      const message = document.getElementById('message')?.value.trim() || '';

      let valid = true;
      const errors = [];

      if (name.length < 3) { valid = false; errors.push('Name must be at least 3 characters.'); }
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) { valid = false; errors.push('Enter a valid email.'); }
      const phoneRe = /^[0-9+\s()-]{7,20}$/;
      if (!phoneRe.test(phone)) { valid = false; errors.push('Enter a valid phone number (digits, +, - allowed).'); }
      if (!service) { valid = false; errors.push('Please select a service.'); }
      if (!country) { valid = false; errors.push('Please select a country.'); }
      if (message.length < 10) { valid = false; errors.push('Message must be at least 10 characters.'); }

      const feedback = document.getElementById('formFeedback');
      if (!feedback) return;

      if (valid) {
        feedback.style.color = 'green';
        feedback.innerHTML = '✅ Message sent successfully. We will reply shortly.';
        contactForm.reset();
      } else {
        feedback.style.color = 'crimson';
        feedback.innerHTML = '❌ ' + errors.join('<br>');
      }
    });
  }

}); // DOMContentLoaded end
