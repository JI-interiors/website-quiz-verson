LINVA INTERIORS — DESIGN IDEAS VIDEO AUDIT & STRUCTURAL FIX
Date: 2026-09-01

Issues identified from the supplied video:
1. The landing Design Ideas page showed a kitchen-specific image/gallery immediately after the category chips. This made the general Design Ideas page look like a Kitchen page.
2. Individual category pages contained a generic "Browse Categories / Explore more designs" block before the category's own gallery. This caused unrelated rooms (e.g. Living Room) to appear while viewing Kitchen/Bedroom, creating the impression that the gallery was not separated by category.
3. The generic category block used mismatched thumbnails for Bathroom, Pooja Room and TV Unit (for example, living-room/bedroom project images with those labels).
4. The individual pages did contain category-specific gallery sections, but several were populated with repeated generic placeholder/project images rather than distinct category gallery images. This remains a content/image replacement item unless the required gallery images are supplied.
5. The Wardrobe page had only one gallery image; it is structurally separate but needs additional real wardrobe gallery images if a multi-image gallery is desired.

Structural fixes applied:
- Removed the Kitchen-only gallery from the main Design Ideas landing page.
- Removed the generic cross-category "Browse Categories" block from all nine individual category pages.
- Preserved the nine-category icon navigation and the nine thumbnail cards on the main Design Ideas landing page.
- Preserved each individual page's own category-specific gallery section and planning/SEO/FAQ content.
- Removed now-unused landing-page kitchen-gallery / popular-ideas CSS rules.
- No old #designs route references were present in the audited source.
- No Dining Room reference exists in website HTML/JS/CSS/sitemap; only the production README mentions its removal.

Current structural state after this pass:
- Landing page: category chips -> 9 category cards -> local inspiration/FAQ/contact; no Kitchen-only gallery.
- Individual category page: category chips -> that category's own gallery -> planning/SEO/FAQ/contact; no unrelated cross-category card gallery.
