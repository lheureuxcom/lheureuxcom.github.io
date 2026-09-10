const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
}

document.querySelectorAll('.reveal').forEach(el => {
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }), {threshold:.06});
    io.observe(el);
  } else {
    el.classList.add('visible');
  }
});

const filters = document.querySelectorAll('[data-filter]');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  document.querySelectorAll('.commerce-card').forEach(card => {
    card.style.display = (f === 'all' || card.dataset.category === f) ? '' : 'none';
  });
}));

document.querySelectorAll('[data-wishlist]').forEach(btn => btn.addEventListener('click', () => {
  btn.classList.toggle('saved');
  btn.textContent = btn.classList.contains('saved') ? '♥ Saved' : (btn.classList.contains('wish-button') ? '♡' : '♡ Save to Favorites');
}));

let bag = [];
try { bag = JSON.parse(localStorage.getItem('lheureuxBag') || '[]'); } catch(e) { bag = []; }

const drawer = document.querySelector('.bag-drawer');
const backdrop = document.querySelector('.bag-backdrop');
const bagItems = document.querySelector('[data-bag-items]');
const bagEmpty = document.querySelector('[data-bag-empty]');
const bagTotal = document.querySelector('[data-bag-total]');
const bagCount = document.querySelectorAll('[data-bag-count]');

function saveBag() {
  localStorage.setItem('lheureuxBag', JSON.stringify(bag));
  renderBag();
}

function renderBag() {
  if (!bagItems) return;
  bagItems.innerHTML = '';
  bag.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'bag-item';
    row.innerHTML = `<img src="${item.image}" alt=""><div><h4>${item.name}</h4><small>$${Number(item.price).toLocaleString()}</small></div><button class="bag-remove" data-remove="${i}">Remove</button>`;
    bagItems.appendChild(row);
  });
  document.querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', () => {
    bag.splice(Number(btn.dataset.remove), 1);
    saveBag();
  }));
  const total = bag.reduce((s, x) => s + Number(x.price || 0), 0);
  if (bagTotal) bagTotal.textContent = '$' + total.toLocaleString();
  bagCount.forEach(c => c.textContent = bag.length);
  if (bagEmpty) bagEmpty.style.display = bag.length ? 'none' : 'block';
}

function openBag() {
  if (drawer) drawer.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
  if (drawer) drawer.setAttribute('aria-hidden','false');
}
function closeBag() {
  if (drawer) drawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  if (drawer) drawer.setAttribute('aria-hidden','true');
}
document.querySelectorAll('[data-open-bag]').forEach(b => b.addEventListener('click', openBag));
document.querySelectorAll('[data-close-bag]').forEach(b => b.addEventListener('click', closeBag));

document.querySelectorAll('[data-add-to-bag]').forEach(btn => btn.addEventListener('click', () => {
  try {
    bag.push(JSON.parse(btn.dataset.product));
    saveBag();
    openBag();
  } catch(e) {}
}));

const checkout = document.querySelector('[data-checkout]');
if (checkout) checkout.addEventListener('click', () => {
  if (!bag.length) return;
  const lines = bag.map(x => `${x.name} - $${Number(x.price).toLocaleString()}`);
  const total = bag.reduce((s,x) => s + Number(x.price || 0), 0);
  const msg = encodeURIComponent(`Hello Lheureux, I am interested in:\n${lines.join('\n')}\nEstimated total: $${total.toLocaleString()}`);
  window.location.href = `sms:+18628021872?body=${msg}`;
});

renderBag();
