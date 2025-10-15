# 🎨 Consza Theme - Quick Visual Guide

## Color Palette

### Primary Colors
```
Orange (Primary):    #FF6600  🟠
Dark Navy (Accent):  #1a2238  🔵
White:               #FFFFFF  ⚪
Light Gray BG:       #f5f7fa  ⬜
```

### Usage Rules

**Orange (#FF6600) - Action & Emphasis**
- Primary buttons
- Links hover state
- Section badges/labels
- Icons in circles
- Text highlights
- CTAs

**Dark Navy (#1a2238) - Authority & Trust**
- Top navigation bar
- Section backgrounds (Stats, CTA)
- Headings
- Text on light backgrounds
- Footer

**White (#FFFFFF) - Clarity & Space**
- Main backgrounds
- Card backgrounds
- Button text
- Text on dark backgrounds

## Button Styles

### Primary Button (Orange)
```jsx
className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-md 
           font-semibold uppercase text-sm tracking-wide transition-all 
           duration-300 transform hover:-translate-y-1 shadow-lg"
```

### Secondary Button (Outline)
```jsx
className="bg-transparent border-2 border-white hover:bg-white 
           hover:text-accent-500 text-white px-8 py-4 rounded-md 
           font-semibold uppercase text-sm tracking-wide transition-all duration-300"
```

### Link Button
```jsx
className="text-primary-500 font-semibold uppercase text-sm tracking-wide 
           hover:text-accent-500 transition-colors flex items-center gap-2"
```

## Card Styles

### Service/Feature Card
```jsx
className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl 
           transition-all duration-300 group border-b-4 border-primary-500"

// Icon container
className="w-20 h-20 bg-primary-500 text-white rounded-full flex items-center 
           justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
```

### Project/Property Card
```jsx
className="bg-white rounded-lg shadow-lg overflow-hidden group 
           hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"

// Image hover overlay
className="absolute inset-0 bg-accent-500 opacity-0 group-hover:opacity-90 
           transition-opacity duration-300 flex items-center justify-center"
```

## Section Headers

### Centered Section Header
```jsx
<span className="text-primary-500 font-bold text-sm uppercase tracking-wider">
  Label Text
</span>
<h2 className="text-3xl lg:text-5xl font-bold text-accent-500 mt-4 mb-4">
  Main Heading Here
</h2>
<p className="text-gray-600 max-w-2xl mx-auto text-lg">
  Description text goes here
</p>
```

## Section Backgrounds

### Alternating Pattern
```
Hero Section:      Dark image + overlay
Stats Section:     Dark Navy (#1a2238)
About Section:     White (#FFFFFF)
Properties:        Light Gray (#f5f7fa)
Services:          White (#FFFFFF)
CTA Section:       Dark Navy (#1a2238)
```

## Icon Styles

### Circular Icon (Orange)
```jsx
className="w-20 h-20 bg-primary-500 text-white rounded-full flex items-center 
           justify-center mb-4"
```

### Circular Icon (With Opacity)
```jsx
className="w-20 h-20 bg-primary-500 bg-opacity-20 text-primary-500 rounded-full 
           flex items-center justify-center mb-4"
```

## Typography Scale

```
Hero Title:         text-4xl md:text-5xl lg:text-6xl font-bold
Section Title:      text-3xl lg:text-5xl font-bold
Card Title:         text-xl font-bold
Body Text:          text-base md:text-lg
Small Text:         text-sm
Labels/Badges:      text-xs sm:text-sm uppercase tracking-wider font-bold
```

## Spacing System

```
Section Padding:    py-20 lg:py-28
Container:          container mx-auto px-4
Grid Gap:           gap-8
Card Padding:       p-6 to p-8
Element Margin:     mb-4, mb-6, mb-8
```

## Hover Effects

### Card Lift
```jsx
className="transform hover:-translate-y-2 transition-all duration-300"
```

### Button Lift
```jsx
className="transform hover:-translate-y-1 transition-all duration-300"
```

### Image Scale
```jsx
className="group-hover:scale-110 transition-transform duration-500"
```

### Icon Scale
```jsx
className="group-hover:scale-110 transition-transform duration-300"
```

### Shadow Enhancement
```jsx
className="shadow-lg hover:shadow-2xl transition-all duration-300"
```

## Responsive Breakpoints

```
Mobile:     < 640px   (sm:)
Tablet:     640px+    (md: 768px+)
Desktop:    1024px+   (lg:)
Large:      1280px+   (xl:)
```

## Component Cheat Sheet

### Navbar
- Top Bar: Dark Navy with contact info
- Main Nav: White with orange buttons
- Sticky: `sticky top-0 z-50`

### Hero Section
- Background: `bg-cover bg-center` with dark overlay
- Height: `h-[600px] lg:h-[700px]`
- Content: Centered, max-w-3xl

### Stats Section
- Background: Dark Navy
- Grid: `grid-cols-2 lg:grid-cols-4`
- Icons: Orange with 20% opacity background

### Service Cards
- Grid: `grid-cols-1 md:grid-cols-3`
- Border: `border-b-4 border-primary-500`
- Icon: Orange circle, 20x20

### Property Cards
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Image: `h-72` with hover overlay
- Hover: Dark navy overlay with white button

## Quick Copy-Paste Components

### Orange Button
```jsx
<button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-md font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
  Button Text
</button>
```

### Section Header
```jsx
<div className="text-center mb-16">
  <span className="text-primary-500 font-bold text-sm uppercase tracking-wider">Label</span>
  <h2 className="text-3xl lg:text-5xl font-bold text-accent-500 mt-4 mb-4">
    Main Heading
  </h2>
  <p className="text-gray-600 max-w-2xl mx-auto text-lg">
    Description text
  </p>
</div>
```

### Feature Card
```jsx
<div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 group border-b-4 border-primary-500">
  <div className="w-20 h-20 bg-primary-500 text-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
    <FaIcon className="text-3xl" />
  </div>
  <h3 className="text-xl font-bold text-accent-500 mb-4">Title</h3>
  <p className="text-gray-600 leading-relaxed mb-6">Description</p>
  <a href="#" className="text-primary-500 font-semibold uppercase text-sm tracking-wide hover:text-accent-500 transition-colors flex items-center gap-2">
    View All <span>→</span>
  </a>
</div>
```

## Design Principles

1. **Orange for Action** - All clickable/interactive elements
2. **Navy for Authority** - Headers, backgrounds, trust elements
3. **White for Clarity** - Content areas, readability
4. **Uppercase for Labels** - Section badges, buttons
5. **Bold Typography** - Strong, confident headings
6. **Generous Spacing** - Breathing room, not cramped
7. **Pronounced Hovers** - Clear feedback on interactions
8. **Consistent Borders** - Orange bottom borders on cards
9. **Circular Icons** - Friendly, approachable
10. **Image Overlays** - Dark navy on hover for consistency
