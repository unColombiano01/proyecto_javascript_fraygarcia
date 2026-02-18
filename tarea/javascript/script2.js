
const form           = document.getElementById('loginForm');
const emailEl        = document.getElementById('email');
const pwEl           = document.getElementById('password');
const rolEl          = document.getElementById('rol');
const togglePw       = document.getElementById('togglePw');

const btn            = form.querySelector('.btn');

const emailErr = document.getElementById('emailErr');
const pwErr    = document.getElementById('pwErr');
const rolErr   = document.getElementById('rolErr');

const bars  = [
  document.getElementById('s1'),
  document.getElementById('s2'),
  document.getElementById('s3'),
  document.getElementById('s4'),
];
const strengthLabel = document.getElementById('strengthLabel');

// ── Mostrar o ocultar contraseña
togglePw.addEventListener('click', () => {
  const isText = pwEl.type === 'text';
  pwEl.type = isText ? 'password' : 'text';

  document.getElementById('eyeIcon').innerHTML = isText
    // Ojo cerrado → ojo abierto
    ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
    // Ojo abierto → ojo cerrado
    : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
});

//Helpers de validación 

/**
 * Muestra o oculta el error de un campo.
 * @param {HTMLElement} el      - Input o select
 * @param {HTMLElement} msgEl   - Elemento de mensaje de error
 * @param {boolean}     show    - true = error, false = válido
 */
function setError(el, msgEl, show) {
  if (show) {
    el.style.borderColor = '#ff5555';
    el.classList.remove('valid');
    msgEl.classList.add('visible');
  } else {
    el.style.borderColor = '';
    el.classList.add('valid');
    msgEl.classList.remove('visible');
  }
}

/**
 * animación de sacudida a un elemento.
 * @param {HTMLElement} el
 */
function shake(el) {
  el.classList.remove('shake');
  void el.offsetWidth; // forzar un reflow para reiniciar la animación
  el.classList.add('shake');
  el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
}

// seguridad de contraseña

/**
 * Calcula un puntaje de 0–4 según criterios de seguridad.
 * @param {string} pw
 * @returns {number}
 */
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 6)  score++;                               // longitud mínima
  if (pw.length >= 10) score++;                              // longitud buena
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;        // mayúsculas y minúsculas
  if (/[0-9]/.test(pw) && /[^a-zA-Z0-9]/.test(pw)) score++; // números y símbolos
  return score;
}

/**
 * Actualiza las barras y etiqueta de fortaleza visualmente.
 * @param {string} pw
 */
function updateStrength(pw) {
  const score = pw ? getStrength(pw) : 0;

  const cssClass = ['', 'active-weak', 'active-medium', 'active-medium', 'active-strong'];
  const texts    = ['', 'Débil',       'Regular',       'Buena',         'Fuerte'];
  const colors   = ['', '#ff5555',     '#ffaa00',       '#ffaa00',       '#00ff87'];

  bars.forEach((bar, i) => {
    bar.className = '';
    if (pw && i < score) bar.classList.add(cssClass[score]);
  });

  strengthLabel.textContent = pw ? texts[score] : '';
  strengthLabel.style.color = pw ? colors[score] : '';
}

// Validación en tiempo real 

// Correo: validar al salir del campo
emailEl.addEventListener('blur', () => {
  const v   = emailEl.value.trim();
  const bad = !v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  setError(emailEl, emailErr, bad);
});

// Correo: corregir error mientras se escribe
emailEl.addEventListener('input', () => {
  const yaVisto = emailEl.classList.contains('valid') || emailErr.classList.contains('visible');
  if (yaVisto) {
    const v   = emailEl.value.trim();
    const bad = !v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    setError(emailEl, emailErr, bad);
  }
});

// Contraseña: actualizar fortaleza y limpiar error
pwEl.addEventListener('input', () => {
  updateStrength(pwEl.value);
  if (pwEl.value) setError(pwEl, pwErr, false);
});

// Rol: validar al cambiar
rolEl.addEventListener('change', () => {
  setError(rolEl, rolErr, !rolEl.value);
});

// envio formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const emailVal = emailEl.value.trim();
  const pwVal    = pwEl.value;
  const rolVal   = rolEl.value;

  // Determinacion d errores
  const emailBad = !emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
  const pwBad    = !pwVal;
  const rolBad   = !rolVal;

  // Mostrar los errores en pantalla
  setError(emailEl, emailErr, emailBad);
  setError(pwEl,    pwErr,    pwBad);
  setError(rolEl,   rolErr,   rolBad);

  // Sacudir los campos con error
  if (emailBad) shake(emailEl);
  if (pwBad)    shake(pwEl);
  if (rolBad)   shake(rolEl);

  // Bloquear envío si hay errores
  if (emailBad || pwBad || rolBad) {
    btn.style.background = '#ff5555';
    btn.textContent      = 'COMPLETA LOS CAMPOS ✕';
    setTimeout(() => {
      btn.style.background = '';
      btn.textContent      = 'INGRESAR →';
    }, 2000);
    return; // ← salir sin continuar
  }

  // Todo correcto: redirigir directamente
  window.location.href = '../carga/cargaIngreso.html';
});
