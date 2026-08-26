LINVA INTERIORS CRM — SUPABASE INTEGRATION

The production CRM uses Supabase for server-side lead storage. The public website only uses the Supabase publishable key and can submit leads under Row Level Security; it cannot read existing leads. The CRM uses Supabase Auth and authenticated access to read/update leads.

Sources currently supported by the CRM data model include Website Free Home Visit, Design Discovery Quiz and Website Budget Calculator. The source field is intentionally flexible for future WhatsApp, Instagram, Facebook, Pinterest, YouTube, LinkedIn, X and Google Ads integrations.

Never place a Supabase service-role/secret key in the website.
