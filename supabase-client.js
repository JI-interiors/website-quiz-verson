/* Linva Interiors — Supabase lead capture
 * Public publishable key only. Includes controlled fallback payloads for schema compatibility.
 */
(() => {
  const SUPABASE_URL = 'https://mcnmkhlmplzcacyuaitq.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_UeKXJgDg1NEFqCTn_Ux6rQ_UpCxfuYU';

  async function postLead(payload) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(payload),
      credentials: 'omit'
    });
    let detail = '';
    if (!response.ok) {
      try { detail = await response.text(); } catch (_) {}
      const error = new Error(`Lead submission failed (${response.status})${detail ? ` ${detail}` : ''}`);
      error.status = response.status;
      error.detail = detail;
      throw error;
    }
    return true;
  }

  async function insertLead(lead) {
    try {
      return await postLead(lead);
    } catch (firstError) {
      // Retry only schema-related client errors with progressively smaller payloads.
      // This preserves the full CRM record when the database accepts it, while allowing
      // older lead-table schemas to receive the core enquiry fields.
      if (![400, 409, 422].includes(firstError.status)) {
        console.error('[LinvaCRM] Supabase insert failed:', firstError);
        throw firstError;
      }

      const withoutConsent = {...lead};
      delete withoutConsent.consent_at;
      try { return await postLead(withoutConsent); } catch (secondError) {
        if (![400, 409, 422].includes(secondError.status)) {
          console.error('[LinvaCRM] Supabase retry failed:', secondError);
          throw secondError;
        }
      }

      const withoutProfile = {...withoutConsent};
      delete withoutProfile.profile;
      try { return await postLead(withoutProfile); } catch (thirdError) {
        if (![400, 409, 422].includes(thirdError.status)) {
          console.error('[LinvaCRM] Supabase retry without profile failed:', thirdError);
          throw thirdError;
        }
        const core = {
          source: lead.source, name: lead.name, phone: lead.phone,
          requirement: lead.requirement, message: lead.message,
          priority: lead.priority, status: lead.status, followup_at: lead.followup_at
        };
        try { return await postLead(core); } catch (finalError) {
          console.error('[LinvaCRM] Final core insert failed:', {
            status: finalError.status, detail: finalError.detail, original: firstError.detail
          });
          throw finalError;
        }
      }
    }
  }

  window.LinvaCRM = Object.freeze({ insertLead });
})();
