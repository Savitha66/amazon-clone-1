/* Enhanced script: cart, preview, toasts, animations */
document.addEventListener('DOMContentLoaded', () => {
  // elements
  const searchInput = document.querySelector('.searchinput');
  const searchIcon = document.querySelector('.searchicon');
  const boxes = Array.from(document.querySelectorAll('.shop .box'));
  const backToTop = document.getElementById('backToTop');
  const panelAll = document.getElementById('panelAll');
  const panelOps = document.getElementById('panelOps');
  const seeMoreEls = Array.from(document.querySelectorAll('.see-more'));
  const signinBtn = document.getElementById('signinBtn');
  const cartBtn = document.getElementById('cartBtn');
  const cartCountEl = document.getElementById('cartCount');
  const cartPreview = document.getElementById('cartPreview');
  const previewList = document.getElementById('previewList');
  const goToCart = document.getElementById('goToCart');
  const checkoutNow = document.getElementById('checkoutNow');
  const toastEl = document.getElementById('toast');

  const select = document.querySelector('.searselec');

  // STORAGE helpers
  function getCart() { return JSON.parse(localStorage.getItem('demo_cart') || '[]'); }
  function setCart(c) { localStorage.setItem('demo_cart', JSON.stringify(c)); }

  // update cart count and preview
  function renderCartUI() {
    const cart = getCart();
    const totalCount = cart.reduce((s,i)=>s + (i.qty||1),0);
    cartCountEl.textContent = totalCount;
    cartCountEl.style.display = totalCount ? 'inline-block' : 'none';

    if (!previewList) return;
    if (cart.length === 0) {
      previewList.innerHTML = `<div style="padding:12px;color:#a9bed6">Your cart is empty.</div>`;
    } else {
      previewList.innerHTML = '';
      cart.slice(0,6).forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'preview-item';
        div.innerHTML = `
          <img src="${item.img || 'box4_image.jpg'}" alt="${escapeHtml(item.title)}">
          <div style="flex:1;">
            <div style="font-weight:700;color:#fff">${escapeHtml(item.title)}</div>
            <div style="color:#a9bed6;font-size:13px">Qty: ${item.qty} • ₹${item.price}</div>
          </div>
          <button class="remove-preview" data-idx="${idx}" title="Remove item">✕</button>
        `;
        previewList.appendChild(div);
      });
    }
  }

  // toast
  function showToast(text, timeout=2000) {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.hidden = false;
    requestAnimationFrame(()=>toastEl.classList.add('show'));
    setTimeout(()=> {
      toastEl.classList.remove('show');
      setTimeout(()=> toastEl.hidden = true, 180);
    }, timeout);
  }

  // keyboard / search
  function runSearch() {
    const q = (searchInput && searchInput.value || '').trim().toLowerCase();
    const selected = (select && select.value) || 'all';
    boxes.forEach(b => {
      const title = (b.querySelector('h2')?.textContent || '').toLowerCase();
      const matchesText = !q || title.includes(q);
      const matchesSelect = selected === 'all' || (b.dataset.id && b.dataset.id.includes(selected)) || title.includes(selected);
      b.style.display = (matchesText && matchesSelect) ? '' : 'none';
    });
  }

  if (searchIcon) searchIcon.addEventListener('click', runSearch);
  if (searchInput) searchInput.addEventListener('keydown', (e)=> { if (e.key === 'Enter') runSearch(); });
  if (select) select.addEventListener('change', runSearch);

  // back to top
  if (backToTop) backToTop.addEventListener('click', ()=> window.scrollTo({ top:0, behavior:'smooth' }));

  // panel toggle
  if (panelAll && panelOps) panelAll.addEventListener('click', ()=> panelOps.style.display = (panelOps.style.display === 'none' ? '' : 'none'));

  // overlay preview to product page
  function createOverlay(title, id, img) {
    const overlay = document.createElement('div');
    overlay.id = 'simple-preview-overlay';
    Object.assign(overlay.style, { position:'fixed', left:0, top:0, width:'100vw', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.5)', zIndex:9999});
    overlay.addEventListener('click', (ev)=> { if (ev.target === overlay) overlay.remove(); });
    const box = document.createElement('div');
    box.style.cssText = 'background:#fff;color:#111;padding:20px;border-radius:10px;max-width:520px;width:92%;text-align:center;';
    box.innerHTML = `<h3 style="margin-bottom:8px">${escapeHtml(title)}</h3>
      <img src="${img||'box4_image.jpg'}" alt="${escapeHtml(title)}" style="max-width:240px;border-radius:8px;margin-bottom:10px">
      <p style="color:#444;margin-bottom:14px">Demo preview — click below to open the product page.</p>
      <div style="display:flex;gap:8px;justify-content:center">
        <button id="viewProductBtn" style="padding:8px 12px;border:none;border-radius:6px;cursor:pointer;background:${getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#ffb86b'}">View product</button>
        <button id="closePreviewBtn" style="padding:8px 12px;border:1px solid #bbb;border-radius:6px;cursor:pointer;background:#fff">Close</button>
      </div>`;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    document.getElementById('closePreviewBtn').addEventListener('click', ()=> overlay.remove());
    document.getElementById('viewProductBtn').addEventListener('click', ()=> window.location.href = `product.html?id=${encodeURIComponent(id||title)}`);
  }

  // see-more click
  seeMoreEls.forEach(p => {
    p.addEventListener('click', (e)=> {
      const boxEl = e.target.closest('.box');
      const title = boxEl.querySelector('h2')?.textContent || 'Details';
      const id = boxEl.dataset.id || title;
      const styleBg = boxEl.querySelector('.boximg')?.style.backgroundImage || '';
      const img = styleBg.slice(5,-2) || 'box4_image.jpg';
      createOverlay(title, id, img);
    });
  });

  // boxes clickable
  boxes.forEach(b => {
    b.addEventListener('click', ()=> {
      const id = b.dataset.id || b.querySelector('h2')?.textContent || 'product';
      window.location.href = `product.html?id=${encodeURIComponent(id)}`;
    });
    b.addEventListener('keydown', e => { if (e.key === 'Enter') b.click(); });
  });

  // keyboard search focus
  document.addEventListener('keydown', (e)=> {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // navigation buttons
  if (signinBtn) signinBtn.addEventListener('click', ()=> window.location.href = 'signin.html');
  if (cartBtn) cartBtn.addEventListener('click', ()=> window.location.href = 'cart.html');

  // cart preview interactions
  const cartWrap = document.getElementById('cartWrap');
  if (cartWrap) {
    cartWrap.addEventListener('mouseenter', ()=> {
      cartPreview.hidden = false;
      cartBtn.setAttribute('aria-expanded', 'true');
      renderCartUI();
    });
    cartWrap.addEventListener('mouseleave', ()=> {
      cartPreview.hidden = true;
      cartBtn.setAttribute('aria-expanded', 'false');
    });
  }

  if (goToCart) goToCart.addEventListener('click', ()=> window.location.href = 'cart.html');
  if (checkoutNow) checkoutNow.addEventListener('click', ()=> {
    if (getCart().length === 0) showToast('Cart is empty — add items first');
    else window.location.href = 'signin.html';
  });

  // listen to remove in preview
  document.addEventListener('click', (e)=> {
    if (e.target.classList.contains('remove-preview')) {
      const idx = parseInt(e.target.dataset.idx, 10);
      const c = getCart();
      c.splice(idx, 1);
      setCart(c);
      renderCartUI();
      showToast('Removed from cart');
    }
  });

  // helper escape
  function escapeHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // init
  renderCartUI();

  // small helper to add an item to cart (used by product page)
  window.__demoAddToCart = function(item) {
    const c = getCart();
    c.push(item);
    setCart(c);
    renderCartUI();
    showToast('Added to cart');
  };

  // small toast utility
  window.__showToast = showToast;

  // expose render for product/cart pages if needed
  window.__renderCartUI = renderCartUI;
});
