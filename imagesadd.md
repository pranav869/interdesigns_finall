# Featured Projects Gallery Integration

Before implementing the gallery, completely remove all existing placeholder, stock, AI-generated, demo, sample, or mock project images currently used in the Featured Projects section.

## Existing Image Cleanup

1. Delete all hardcoded image references.
2. Remove all stock/demo/sample images from the codebase.
3. Remove any fallback placeholder images.
4. Remove unused image imports.
5. Remove mock project data containing image URLs.
6. Remove old gallery-related assets that are no longer needed.
7. Clean up unused CSS, JS, and references associated with the old implementation.
8. The gallery must never display demo content under any circumstance.

---

## Image Source Structure

The real project images are already organized into folders:

text /residential /commercial /offices /villas 

Each folder contains exactly 4 project images.

The gallery must use ONLY these images.

No other images should be used anywhere inside the Featured Projects section.

---

## Dynamic Gallery Generation

Do not manually hardcode image paths.

Create a fully data-driven gallery system that automatically loads images from the folder structure.

Example:

js const projects = {   residential: [...],   commercial: [...],   offices: [...],   villas: [...] }; 

Use the existing framework/build system to dynamically load images from their folders.

If a folder becomes empty in the future, display nothing rather than showing placeholder content.

---

## Category Filtering

Make all category tabs fully functional.

### Categories

- All
- Residential
- Commercial
- Offices
- Villas

### Filter Behaviour

When a category is selected:

- Residential → show only images from /residential
- Commercial → show only images from /commercial
- Offices → show only images from /offices
- Villas → show only images from /villas
- All → show images from every category

Requirements:

- No page refresh
- No layout jumping
- Smooth transitions
- Preserve active tab state

---

## Project Card Generation

Automatically generate project cards using the images inside each category folder.

Each image should become a project card.

Do not manually create cards.

Cards should be generated dynamically from the folder contents.

---

## Premium Animations

Implement luxury-grade micro interactions.

### Filter Animation

When switching categories:

- Fade animation
- Slight upward movement
- Duration: 400–600ms
- Smooth easing
- No flashing

### Card Hover

On hover:

- Scale: 1.03
- Soft luxury shadow
- Slight image zoom
- Smooth transition

---

## Layout Requirements

Use a premium editorial-style layout.

### Desktop

- 2 columns

### Tablet

- 2 columns

### Mobile

- 1 column

Layout must remain balanced regardless of category selection.

---

## Image Loading Experience

Add premium loading states.

### Skeleton Loader

- Shimmer animation
- Match card dimensions
- Visible until image loads

### Image Appearance

- Smooth fade-in
- No abrupt rendering

---

## Image Optimization

Implement:

- Lazy loading
- Responsive image sizing
- Proper aspect ratios
- Prevent layout shifts
- Fast loading performance
- Optimized rendering

---

## Design Preservation

Keep the existing design language unchanged.

Preserve:

- Typography
- Section spacing
- Luxury visual hierarchy
- Gold accent color (#C8A96B)
- Existing buttons
- Existing section layout
- Existing premium aesthetic

Do not redesign the section.

Only replace the image system and make filtering fully functional.

---

## Final Deliverable

Update all required HTML, CSS, JavaScript, React, or framework files.

Requirements:

- Remove all old placeholder/demo images
- Use only images from the four folders
- Dynamically generate cards
- Fully functional category filtering
- Responsive layout
- Premium animations
- Skeleton loading states
- Lazy loading
- Production-ready implementation
- No hardcoded project images remaining anywhere in the codebase

Return complete production-ready code changes.