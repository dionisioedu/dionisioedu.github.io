# Asset Management Guide

## Folder Structure

```
src/assets/
├── images/
│   ├── articles/       # Article hero images, code screenshots
│   ├── books/          # Book cover images
│   ├── guides/         # Guide images, diagrams
│   └── screenshots/    # UI/UX screenshots, demos
public/assets/
├── images/             # Static images (served as-is, not optimized)
```

## Where to Store Images

### `src/assets/images/` - For Processed Assets
**Best for:** 
- Regular images that Astro will optimize (WEBP, responsive)
- Images imported in Astro components
- Regularly updated content images

**Usage in Astro Components:**
```astro
---
import bookCover from '../assets/images/books/clean-code.jpg';
---

<img src={bookCover.src} alt="Clean Code" />
```

**Usage in Markdown (with imports):**
```mdx
---
// Import at top of .mdx file
import { Image } from 'astro:assets';
import bookCover from '../../../assets/images/books/clean-code.jpg';
---

<Image src={bookCover} alt="Clean Code" />
```

### `public/assets/images/` - For Direct Static References
**Best for:**
- Favicon, manifest images
- Legacy images with direct `/assets/images/` references
- Images that don't need optimization

**Usage:**
```markdown
![Books](/assets/images/books-1.webp)
```

```html
<img src="/assets/images/sportpulse.png" alt="SportPulse" />
```

## Current Setup

All images have been organized into:
- ✅ `src/assets/images/` - Categorized by type (articles, books, guides, screenshots)
- ✅ `public/assets/images/` - Copy of all images for backward compatibility

## Migration Guide

### Step 1: Moving an Image
1. Add new image to appropriate subfolder in `src/assets/images/`
   - Articles → `src/assets/images/articles/`
   - Books → `src/assets/images/books/`
   - Guides → `src/assets/images/guides/`
   - Screenshots → `src/assets/images/screenshots/`

2. Also copy to `public/assets/images/` for build compatibility

### Step 2: Updating References
**For Markdown files with static paths:**
- Keep using `/assets/images/filename.ext`
- Images in `public/assets/images/` are served at `/assets/images/`

**For future Astro component optimization:**
- Import from `../../../assets/images/category/filename.ext`
- Use `src={importedImage.src}` in img tags

## Image Organization by Category

### Articles (`src/assets/images/articles/`)
- `clean-code.jpg` - Clean Code article cover
- `sre.png` - SRE fundamentals cover
- `bigo.jpg` - Big-O notation cover
- `big-o.png`, `big-o-graph.png` - Algorithm complexity diagrams
- `data-types-table.webp`, `data-types.webp` - Data structures
- `python-libs.png` - Python libraries diagram
- `wheel-of-list.png` - Design patterns wheel
- `tudo-sobre-linux.png` - Linux guide
- Other educational diagrams and code screenshots

### Books (`src/assets/images/books/`)
- `books-1.webp` - Beginner Developer's Guide
- `books-2.webp` - Advanced C++ Guide
- `ebook-page-1.png` - eBook preview

### Guides (`src/assets/images/guides/`)
- (Reserved for future guide-specific images)

### Screenshots (`src/assets/images/screenshots/`)
- `welcome-*.webp` - Welcome/landing screenshots
- `hacker-*.webp` - Coding/tech screenshots
- `office-*.webp` - Professional environment screenshots
- `desktop-*.webp` - Desktop application screenshots
- `tutorial-*.webp` - Tutorial step screenshots
- `projects-*.webp`, `projects-1.webp`, `projects-2.webp` - Project showcases
- `trainning-*.webp` - Training material screenshots
- And other UI/demo images

## Build Process

Run `npm run build` to:
1. Process images in `src/assets/` (resize, convert to WEBP, etc.)
2. Copy static files from `public/` as-is
3. Output final site to `dist/`

Images in both locations are included in the final build.

## Best Practices

1. **Use descriptive filenames:** `clean-code-hero.jpg` not `img1.jpg`
2. **Optimize before storing:** Use tools like ImageOptim, TinyPNG
3. **Maintain both locations:** Keep copies in both `src/assets/` (for optimization referencing) and `public/assets/` (for backward compatibility with existing markdown references)
4. **Use appropriate formats:**
   - `.jpg` - Photos, complex images (book covers)
   - `.webp` - Screenshots, UI mockups (best compression)
   - `.png` - Diagrams, icons (lossless)
5. **Organize by content type:** Makes maintenance easier
