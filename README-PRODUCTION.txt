LINVA INTERIORS — PRODUCTION-READY PACKAGE

This package is the final static website build prepared from the latest working Linva Interiors site.

Included:
- Homepage, Privacy Policy, clean Design Ideas hub + 9 room-category pages (Kitchen, Bedroom, Living Room, Bathroom, Pooja Room, TV Unit, Kids Bedroom, Wardrobe, Balcony)
- Design Discovery Quiz: 10 total questions
- Budget Calculator
- Authenticated/noindex CRM interface
- Supabase lead capture integration
- Lead-form consent + consent timestamp capture
- SEO metadata, canonicals, structured data, robots.txt and sitemap.xml
- Responsive/mobile navigation and accessibility fixes
- Design Ideas cleanup: removed the redundant purple hero, removed the obsolete Dining Room page, and kept Wardrobe as the ninth category
- All Design Ideas navigation uses the current nine-category structure; no obsolete Dining Room route is included
- Updated Q6–Q10 quiz artwork, optimized to WebP

Quiz structure:
Q1 What are you designing?
Q2 Which home feels most like you?
Q3 Which colour world feels right for you?
Q4 How should your home feel?
Q5 Which kitchen would you choose? (shown only for Complete Home/Kitchen projects)
Q6 What matters most in your home?
Q7 Which finish attracts you more?
Q8 How personalised should your home be?
Q9 What investment range are you considering? (4 options: Under ₹5 lakh, ₹5–10 lakh, ₹10–15 lakh, ₹15–25 lakh)
Q10 When are you planning to start? (4 options: Immediately, Within 1–3 months, Within 3–6 months, Just exploring)

Before/after deployment:
- Confirm the Supabase project has the intended Row Level Security policies for the leads table.
- Confirm the production email/FormSubmit destination is verified and receiving enquiries.
- Confirm the GA4 measurement ID and any Google Ads conversion labels are the intended production IDs.
- After deployment, run Google PageSpeed Insights, Search Console URL inspection, and a real mobile lead-submission test.


GOOGLE ADS / ANALYTICS NOTE (2 Sep 2026)
- GA4 measurement ID in analytics.js: G-NQQFFNLKL4.
- Lead actions emit the GA4 recommended generate_lead event only after a successful lead save.
- The homepage Free Home Visit form redirects to thank-you.html only after FormSubmit receives the form; that page fires the lead event.
- Direct Google Ads conversion ID/labels are intentionally blank. Enter the real AW- conversion ID and conversion-action labels supplied by Google Ads; do not invent them.
- Optional analytics is consent-controlled.
- Design Ideas images are labelled as concepts/inspiration and are not represented as completed Linva Interiors projects unless explicitly stated.


CRM V87 HARDENING
- CRM UI requires Supabase Auth before querying leads.
- CRM has no browser-side DELETE action.
- Lead editing and detailed database error diagnostics added.
- Recommended RLS policy baseline is included at crm/SUPABASE-RLS-HARDENING.sql.
- RLS changes are not applied by the static website; review and execute the SQL in Supabase SQL Editor.
