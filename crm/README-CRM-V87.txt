LINVA INTERIORS CRM — V87

Security/reliability changes:
- CRM requires Supabase Auth session before loading leads.
- Public browser uses only the Supabase publishable key.
- CRM UI supports authenticated read/update; delete is not exposed.
- Added detailed safe error diagnostics for database operations.
- Added lead editing for name, phone, source, priority, status, follow-up, requirement and message.
- Added better manual lead validation and feedback.
- Added SUPABASE-RLS-HARDENING.sql with the recommended RLS baseline.

IMPORTANT:
A static website cannot apply Supabase database policies remotely. The SQL file must be reviewed and run by the project owner in the Supabase SQL Editor. Existing policies should be checked before dropping/adding policies.

Do not put a Supabase service_role/secret key in this website.
