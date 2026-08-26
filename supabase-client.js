/* Linva Interiors — Supabase client integration
 * Uses only the public publishable key. Never put a service-role/secret key here.
 */
(() => {
  const SUPABASE_URL = 'https://mcnmkhlmplzcacyuaitq.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_UeKXJgDg1NEFqCTn_Ux6rQ_UpCxfuYU';

  async function insertLead(lead) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(lead),
      credentials: 'omit'
    });
    if (!response.ok) {
      let detail = '';
      try { detail = await response.text(); } catch (_) {}
      throw new Error(`Lead submission failed (${response.status}) ${detail}`.trim());
    }
    return true;
  }

  window.LinvaCRM = Object.freeze({ insertLead });
})();
