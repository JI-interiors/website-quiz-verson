# Linva Interiors V31 + CRM Integration (Development)

Open `index.html` for the website.
Open `crm/index.html` for the CRM.

The website and quiz write leads to the same-origin localStorage key `linva_crm_leads`, so completed quiz leads and Free Home Visit enquiries appear automatically in the CRM when opened from the same origin/browser.

This is a development integration, not a secure multi-user production backend. Before public deployment, replace localStorage with a server database/API and add authentication.
