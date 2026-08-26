/* Linva Interiors — analytics / conversion event layer
 * IDs intentionally remain blank until the real GA4 / Google Ads IDs are supplied.
 */
(() => {
  const GA4_MEASUREMENT_ID = 'G-NQQFFNLKL4';
  const GOOGLE_ADS_CONVERSION_ID = '';
  const GOOGLE_ADS_CONVERSION_LABELS = {
    home_visit_submit: '',
    budget_estimate_submit: '',
    design_quiz_complete: ''
  };

  window.dataLayer = window.dataLayer || [];

  function loadGtag() {
    if (!GA4_MEASUREMENT_ID && !GOOGLE_ADS_CONVERSION_ID) return;
    if (window.__linvaGtagLoaded) return;
    window.__linvaGtagLoaded = true;
    window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' +
      encodeURIComponent(GA4_MEASUREMENT_ID || GOOGLE_ADS_CONVERSION_ID);
    document.head.appendChild(s);
    window.gtag('js', new Date());
    if (GA4_MEASUREMENT_ID) window.gtag('config', GA4_MEASUREMENT_ID, {send_page_view:true});
  }

  function event(name, params = {}) {
    window.dataLayer.push({event:name, ...params});
    loadGtag();
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
      const label = GOOGLE_ADS_CONVERSION_LABELS[name];
      if (GOOGLE_ADS_CONVERSION_ID && label) {
        window.gtag('event','conversion',{send_to:GOOGLE_ADS_CONVERSION_ID+'/'+label});
      }
    }
  }

  window.LinvaAnalytics = Object.freeze({event});

  document.addEventListener('click', (e) => {
    const link = e.target.closest && e.target.closest('a[href*="wa.me/"], a[href*="whatsapp"]');
    if (link) event('whatsapp_click', {link_text:(link.textContent||'').trim().slice(0,80)});
  }, {passive:true});
})();
