// script.js
// Lightweight interactive behavior for your Amazon-clone page.
// Safe: does not modify image URLs or CSS files. Only adds event listeners and small DOM overlays.

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const searchInput = document.querySelector('.searchinput');
  const searchIcon = document.querySelector('.searchicon');
  const boxes = Array.from(document.querySelectorAll('.shop .box'));
  const backToTop = document.querySelector('.footpanel1');
  const panelAll = document.querySelector('.panelall');
  const panelOps = document.querySelector('.panelops');
  const seeMoreEls = Array.from(document.querySelectorAll('.boxcontent > p'));

  // 1) Search: filter boxes by their <h2> text (case-insensitive).
  function runSearch() {
    const q = (searchInput && searchInput.value || '').trim().toLowerCase();
    if (!q) {
      // show all
      boxes.forEach(b => b.style.display = '');
      return;
    }
    boxes.forEach(b => {
      const titleEl = b.querySelector('h2');
      const title = titleEl ? titleEl.textContent.toLowerCase() : '';
      // keep element visible if query found in title
      if (title.includes(q)) b.style.display = '';
      else b.style.display = 'none';
    });
  }

  if (searchIcon) searchIcon.addEventListener('click', runSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') runSearch();
    });
  }

  // 2) Back to top: smooth scroll
  if (backToTop) {
    backToTop.style.cursor = 'pointer';
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3) Panel "All" toggle: toggles showing/hiding the .panelops by adding a class
  // (This doesn't change CSS file; it only toggles an inline style so layout remains unchanged.
  if (panelAll && panelOps) {
    panelAll.style.cursor = 'pointer';
    panelAll.addEventListener('click', () => {
      // toggle a simple hidden state by switching inline display
      const isHidden = panelOps.style.display === 'none';
      panelOps.style.display = isHidden ? '' : 'none';
    });
  }

  // 4) "See more" click: lightweight overlay showing the box title (no navigation, no image changes)
  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'simple-preview-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: '9999',
      padding: '20px',
      boxSizing: 'border-box'
    });
    overlay.addEventListener('click', () => overlay.remove());
    const box = document.createElement('div');
    Object.assign(box.style, {
      background: 'white',
      color: '#111',
      padding: '20px',
      borderRadius: '10px',
      maxWidth: '90%',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    });
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    return box;
  }

  seeMoreEls.forEach((p) => {
    p.style.cursor = 'pointer';
    p.addEventListener('click', (e) => {
      // find nearest box title
      const box = e.target.closest('.box');
      const title = box ? (box.querySelector('h2')?.textContent || 'Details') : 'Details';
      const body = createOverlay();
      body.innerHTML = `<h3 style="margin-bottom:8px">${escapeHtml(title)}</h3>
                        <p style="margin-bottom:12px; color:#444">This is a demo preview. Click anywhere to close.</p>
                        <button id="closePreviewBtn" style="padding:8px 12px;border:none;border-radius:6px;cursor:pointer">Close</button>`;
      document.getElementById('closePreviewBtn').addEventListener('click', () => {
        const overlay = document.getElementById('simple-preview-overlay');
        if (overlay) overlay.remove();
      });
    });
  });

  // 5) Small accessibility: press "/" to focus search (like many sites)
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
    }
  });

  // Utility: simple HTML-escape for overlay content
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // NOTE: we intentionally do NOT manipulate background-image styles or image URLs
  // so your box background images (set in CSS inline style attributes) remain unaffected.
});
