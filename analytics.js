/* Linva Interiors — privacy-aware analytics and conversion layer.
 * GA4 is loaded only after optional analytics consent.
 * Direct Google Ads conversion tracking becomes active when the real AW ID/labels
 * from the Google Ads conversion actions are entered below. Never invent these values.
 */
(() => {
  const GA4_MEASUREMENT_ID = 'G-NQQFFNLKL4';
  const GOOGLE_ADS_CONVERSION_ID = ''; // Example format: AW-123456789. Enter the real ID from Google Ads.
  const GOOGLE_ADS_CONVERSION_LABELS = {
    'Website Free Home Visit': '',
    'Website Budget Calculator': '',
    'Design Discovery Quiz': ''
  };
  const CONSENT_KEY = 'linva_analytics_consent';
  const CONSENT_VERSION = '2026-09-02';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };

  // Consent Mode defaults to denied before any Google tag is loaded.
  window.gtag('consent','default',{
    ad_storage:'denied',
    ad_user_data:'denied',
    ad_personalization:'denied',
    analytics_storage:'denied',
    wait_for_update:500
  });

  function getConsent(){
    try{return JSON.parse(localStorage.getItem(CONSENT_KEY)||'null')}catch(_){return null}
  }
  function setConsent(choice){
    const value={choice,version:CONSENT_VERSION,at:new Date().toISOString()};
    try{localStorage.setItem(CONSENT_KEY,JSON.stringify(value))}catch(_){ }
    const granted=choice==='granted';
    window.gtag('consent','update',{
      analytics_storage:granted?'granted':'denied',
      ad_storage:granted?'granted':'denied',
      ad_user_data:granted?'granted':'denied',
      ad_personalization:granted?'granted':'denied'
    });
    if(granted) loadGtag();
    updateBanner();
  }
  function loadGtag(){
    if(window.__linvaGtagLoaded) return;
    if(!GA4_MEASUREMENT_ID && !GOOGLE_ADS_CONVERSION_ID) return;
    window.__linvaGtagLoaded=true;
    const id=GA4_MEASUREMENT_ID||GOOGLE_ADS_CONVERSION_ID;
    const s=document.createElement('script'); s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);
    document.head.appendChild(s);
    window.gtag('js',new Date());
    if(GA4_MEASUREMENT_ID) window.gtag('config',GA4_MEASUREMENT_ID,{send_page_view:true});
    if(GOOGLE_ADS_CONVERSION_ID) window.gtag('config',GOOGLE_ADS_CONVERSION_ID);
  }
  function event(name,params={}){
    window.dataLayer.push({event:name,...params});
    const consent=getConsent();
    if(!consent || consent.choice!=='granted') return;
    loadGtag();
    if(typeof window.gtag==='function'){
      window.gtag('event',name,params);
      const label=GOOGLE_ADS_CONVERSION_LABELS[params.lead_source] || GOOGLE_ADS_CONVERSION_LABELS[name];
      if(GOOGLE_ADS_CONVERSION_ID && label){
        window.gtag('event','conversion',{send_to:GOOGLE_ADS_CONVERSION_ID+'/'+label,value:params.value||1,currency:params.currency||'INR'});
      }
    }
  }
  function banner(){
    if(document.getElementById('linvaConsentBanner')) return;
    const existing=getConsent();
    if(existing && existing.version===CONSENT_VERSION) { if(existing.choice==='granted') loadGtag(); return; }
    const wrap=document.createElement('div'); wrap.id='linvaConsentBanner'; wrap.className='linva-consent-banner';
    wrap.innerHTML='<div><strong>Privacy choices</strong><p>We use essential website functions. Optional Google Analytics helps us understand website usage. You can allow or decline optional analytics.</p></div><div class="linva-consent-actions"><button type="button" data-consent="denied">Only necessary</button><button type="button" class="primary" data-consent="granted">Allow analytics</button></div>';
    document.body.appendChild(wrap);
    wrap.querySelectorAll('[data-consent]').forEach(btn=>btn.addEventListener('click',()=>setConsent(btn.dataset.consent)));
  }
  function updateBanner(){
    const b=document.getElementById('linvaConsentBanner'); if(b) b.remove();
  }
  window.LinvaAnalytics=Object.freeze({event});
  document.addEventListener('click',(e)=>{
    const link=e.target.closest&&e.target.closest('a[href*="wa.me/"],a[href*="whatsapp"]');
    if(link) event('whatsapp_click',{link_text:(link.textContent||'').trim().slice(0,80)});
    
  },{passive:false});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',banner,{once:true}); else banner();
})();
