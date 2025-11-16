# Logo Instructions

## Current Logo

A placeholder SVG logo has been created at `public/logo.svg` that approximates your uploaded logo design (magenta triangle with shield and arrow).

## How to Use Your Actual Logo

### Option 1: Save Your Logo File

1. Save your logo image as `logo.png` or `logo.svg`
2. Place it in the `public/` folder
3. The system is already configured to use `/logo.svg`
4. Supported formats: PNG, SVG, JPG, WebP

### Option 2: Update the Logo Path

If you want to use a different filename, update these files:

**Sidebar** (`src/components/layout/sidebar.tsx`):
```typescript
<Image
  src="/your-logo-filename.png"  // Change this line
  alt="Department Logo"
  width={40}
  height={40}
/>
```

**Login Page** (`src/app/login/page.tsx`):
```typescript
<Image
  src="/your-logo-filename.png"  // Change this line
  alt="Department Logo"
  width={64}
  height={64}
/>
```

## Logo Specifications

### Sidebar Logo
- **Displayed Size**: 40x40px
- **Container**: White rounded square (48x48px)
- **Format**: SVG recommended for scalability
- **Background**: Transparent preferred

### Login Page Logo
- **Displayed Size**: 64x64px
- **Container**: Green gradient rounded square (80x80px)
- **Format**: SVG recommended for scalability
- **Background**: Transparent preferred

## Design Notes

Your uploaded logo features:
- Magenta/pink color (#E91E8C)
- Triangle outline
- Shield design inside
- Arrow pointing down

The current placeholder SVG attempts to recreate this design. For best results, use your actual logo file.

## PNG Logo Upload

If you have a PNG version of your logo:
1. Save it as `public/logo.png`
2. Update the image paths from `/logo.svg` to `/logo.png`
3. Ensure transparent background for best display

## SVG Logo (Recommended)

If you have an SVG version:
1. Save it as `public/logo.svg` (replaces current placeholder)
2. System is already configured to use it
3. SVG provides perfect scaling at any size
4. Smaller file size than PNG

## Where the Logo Appears

- ✅ Sidebar (top left, 40x40px)
- ✅ Login page (centered, 64x64px)
- ✅ Password reset page (centered, will be added)

## Questions?

The logo is stored in: `physical-planning-system/public/`

Just drop your logo file there and refresh the browser!
