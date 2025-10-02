// Elements
const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const feedback = document.getElementById('formFeedback');
const card = document.querySelector('.card');

// simple, reliable email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// helpers
function setError(input, errorEl, msg) {
  input.classList.add('input-error');
  input.setAttribute('aria-invalid', 'true');
  errorEl.textContent = msg;
}
function clearError(input, errorEl) {
  input.classList.remove('input-error');
  input.removeAttribute('aria-invalid');
  errorEl.textContent = '';
}

// validators
function validateName() {
  const v = nameInput.value.trim();
  if (!v) { setError(nameInput, nameError, 'Name is required'); return false; }
  if (v.length < 2) { setError(nameInput, nameError, 'Name is too short'); return false; }
  clearError(nameInput, nameError);
  return true;
}
function validateEmail() {
  const v = emailInput.value.trim();
  if (!v) { setError(emailInput, emailError, 'Email is required'); return false; }
  if (!emailRegex.test(v)) { setError(emailInput, emailError, 'Enter a valid email'); return false; }
  clearError(emailInput, emailError);
  return true;
}
function validateMessage() {
  const v = messageInput.value.trim();
  if (!v) { setError(messageInput, messageError, 'Message is required'); return false; }
  if (v.length < 10) { setError(messageInput, messageError, 'Write at least 10 characters'); return false; }
  clearError(messageInput, messageError);
  return true;
}

// live validation
nameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);
messageInput.addEventListener('input', validateMessage);

// submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  feedback.textContent = ''; // clear
  const okName = validateName();
  const okEmail = validateEmail();
  const okMsg = validateMessage();

  if (okName && okEmail && okMsg) {
    // success UI
    feedback.innerHTML = `
      <div class="success-box" role="status" aria-live="polite">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" stroke="#bbf7d0" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div>
          <div style="font-weight:700">Message received</div>
          <div style="font-size:0.9rem;color:rgba(187,247,208,0.85)">Thanks! I’ll reply soon.</div>
        </div>
      </div>
    `;
    form.reset();
    // clear any lingering errors
    clearError(nameInput, nameError);
    clearError(emailInput, emailError);
    clearError(messageInput, messageError);
    // hide feedback after a few seconds
    setTimeout(()=>{ feedback.innerHTML = '' }, 6000);
  } else {
    // show error summary + shake
    feedback.innerHTML = `<div style="color: #ffb3b3; font-weight:600">Please fix the errors above.</div>`;
    card.classList.add('shake');
    setTimeout(()=> card.classList.remove('shake'), 600);
  }
});

// reset handler
form.addEventListener('reset', () => {
  setTimeout(() => { // allow browser to clear inputs first
    clearError(nameInput, nameError);
    clearError(emailInput, emailError);
    clearError(messageInput, messageError);
    feedback.textContent = '';
  }, 10);
});
(function(){
  const feedbackEl = document.getElementById('formFeedback');

  // Create banner element (reused)
  const banner = document.createElement('div');
  banner.setAttribute('role','status');
  banner.setAttribute('aria-live','polite');
  banner.style.position = 'fixed';
  banner.style.left = '50%';
  banner.style.top = '18px';
  banner.style.transform = 'translateX(-50%)';
  banner.style.zIndex = '9999';
  banner.style.padding = '12px 18px';
  banner.style.borderRadius = '12px';
  banner.style.boxShadow = '0 10px 30px rgba(16,185,129,0.12)';
  banner.style.display = 'none';
  banner.style.alignItems = 'center';
  banner.style.gap = '10px';
  banner.style.fontWeight = '700';
  banner.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial';
  banner.style.background = 'linear-gradient(90deg, rgba(34,197,94,0.14), rgba(16,185,129,0.08))';
  banner.style.color = '#e6ffef';
  banner.style.backdropFilter = 'blur(6px)';

  // message text
  const text = document.createElement('div');
  text.textContent = 'The message has sent successfully';

  // close button
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.innerHTML = '✕';
  closeBtn.title = 'Close';
  closeBtn.style.marginLeft = '8px';
  closeBtn.style.background = 'transparent';
  closeBtn.style.border = 'none';
  closeBtn.style.color = 'inherit';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontSize = '14px';
  closeBtn.style.padding = '4px';
  closeBtn.style.opacity = '0.95';

  closeBtn.addEventListener('click', () => {
    hideBanner();
  });

  banner.appendChild(text);
  banner.appendChild(closeBtn);
  document.body.appendChild(banner);

  let hideTimeout = null;
  function showBanner() {
    if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null; }
    banner.style.display = 'flex';
    banner.style.opacity = '0';
    banner.style.transition = 'opacity .22s ease, transform .22s ease';
    banner.style.transform = 'translateX(-50%) translateY(-6px)';
    requestAnimationFrame(()=> {
      banner.style.opacity = '1';
      banner.style.transform = 'translateX(-50%) translateY(0)';
    });
    // auto-hide after 4 seconds
    hideTimeout = setTimeout(hideBanner, 4000);
  }
  function hideBanner() {
    if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null; }
    banner.style.opacity = '0';
    banner.style.transform = 'translateX(-50%) translateY(-6px)';
    setTimeout(()=> { banner.style.display = 'none'; }, 260);
  }

  // Observe the feedback area for the success-box you create in your existing code
  if (feedbackEl) {
    const mo = new MutationObserver(muts => {
      for (const m of muts) {
        // if a success-box element is inserted or the text contains "Message received"
        if (feedbackEl.querySelector('.success-box') || /Message received/i.test(feedbackEl.textContent || '')) {
          showBanner();
          return;
        }
      }
    });
    mo.observe(feedbackEl, { childList: true, subtree: true, characterData: true });
  }
})();
