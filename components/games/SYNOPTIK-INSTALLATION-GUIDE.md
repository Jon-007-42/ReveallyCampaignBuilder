# 🎯 Synoptik Branded Games - Installation Guide

## ✅ What You Got

All 6 games have been updated with full Synoptik branding:

1. ✅ **Quiz (Eye-Q)** - `synoptik-quiz-index.tsx`
2. ✅ **Wheel of Vision** - `synoptik-wheel-index.tsx`
3. ✅ **Spotless** - `synoptik-spotless-index.tsx`
4. ✅ **Daily Reveal** - `synoptik-daily-reveal-index.tsx`
5. ✅ **Hidden Frame** - `synoptik-hidden-frame-index.tsx`
6. ✅ **Frosty Wipe** - `synoptik-frosty-wipe-index.tsx`

## 🎨 Changes Made to Each Game

### ✅ Change 1: Background Image (bgImage)
- Added `bgImage` to `configSchema` and `defaultConfig`
- Added input field in `ConfigEditor` under "Udseende"
- Implemented background image in `GameComponent` with:
  - `bg-cover` and `bg-center` classes
  - **CRITICAL: Dark overlay (`bg-black/60` to `bg-black/70`)** for text readability
  - Content positioned above overlay (z-index management)

### ✅ Change 2: Synoptik Colors
- **Synoptik Yellow (`#FFD200`)**: Used for accents, badges, and buttons where it pops
- **Synoptik Black (`#000000`)**: Used for darker themes (Daily Reveal, Hidden Frame, Frosty Wipe)
- Colors chosen based on UX best practices for each game type

### ✅ Change 3: Synoptik Texts & URLs

All games now have authentic Synoptik content:

**Quiz:**
- Background: Optician consultation room
- Title: "Synoptik Eye-Q"
- Question: "Hvor ofte anbefaler vi, at du får lavet en Certificeret Synsprøve?"
- Correct Answer: "Hvert 2. år"
- Win Message: "Helt rigtigt! Få en Gratis Certificeret Synsprøve (Værdi 298 kr.)"

**Wheel of Vision:**
- Background: Spinning wheel/retail
- Title: "Vind med Synoptik"
- Segments: Gratis Synsprøve, 25% på Solbriller, Gratis Brillerens, etc.

**Spotless:**
- Background: Eyeglasses close-up
- Title: "Puds glasset helt rent"
- Product: "Synoptik Premium Brillerens"
- Win: "Skarpt syn! Kom ind og få et gratis rensesæt."

**Daily Reveal:**
- Background: Winter/Christmas theme
- Title: "Synoptik Julekalender"
- Rewards: Gratis Synsprøve, Fri Fragt, Solbrille-Rabat, etc.

**Hidden Frame:**
- Background: Eyewear display
- Title: "Find Ray-Ban Stellet"
- Win: "Godt spottet! Få 20% på alle Ray-Ban stel i dag."

**Frosty Wipe:**
- Background: Winter/frost scene
- Title: "Tør duggen af"
- Hidden Text: "NY VINTERKOLLEKTION"
- Win: "Træt af duggede briller? Få 50% på anti-dug behandling."

## 📦 Installation Steps

### Step 1: Backup Your Original Files
```bash
# In your project root
cp -r games games-backup
```

### Step 2: Replace Game Files

For each game, replace the original `index.tsx` with the new Synoptik version:

```bash
# Quiz
cp synoptik-quiz-index.tsx games/quiz/index.tsx

# Wheel of Vision
cp synoptik-wheel-index.tsx games/wheel-of-vision/index.tsx

# Spotless
cp synoptik-spotless-index.tsx games/spotless/index.tsx

# Daily Reveal
cp synoptik-daily-reveal-index.tsx games/daily-reveal/index.tsx

# Hidden Frame
cp synoptik-hidden-frame-index.tsx games/hidden-frame/index.tsx

# Frosty Wipe
cp synoptik-frosty-wipe-index.tsx games/frosty-wipe/index.tsx
```

### Step 3: Verify Imports

Make sure your `game-registry.ts` imports these games correctly:

```typescript
// In /games/game-registry.ts
import * as Quiz from './quiz';
import * as WheelOfVision from './wheel-of-vision';
import * as Spotless from './spotless';
import * as DailyReveal from './daily-reveal';
import * as HiddenFrame from './hidden-frame';
import * as FrostyWipe from './frosty-wipe';

export const GAME_REGISTRY = {
  'quiz': {
    name: 'Quiz',
    GameComponent: Quiz.GameComponent,
    ConfigEditor: Quiz.ConfigEditor,
    configSchema: Quiz.configSchema,
    defaultConfig: Quiz.defaultConfig,
  },
  // ... add the rest
};
```

### Step 4: Test Each Game

```bash
npm run dev
```

1. Go to Campaign Builder
2. Create a new campaign
3. Select each game type
4. Verify:
   - Background image loads correctly
   - Text is readable (dark overlay working)
   - Synoptik branding is present
   - All interactions work

## 🎨 Customization Options

### Change Background Images

In the Campaign Builder, each game now has a "Baggrundsbillede URL" field where you can:

1. Use different Unsplash images
2. Upload your own images to Supabase Storage
3. Use CDN URLs

**Example:**
```
https://your-cdn.com/synoptik-store-front.jpg
```

### Adjust Overlay Darkness

If text is too hard to read, adjust the overlay in the code:

```typescript
// In GameComponent, find:
<div className="absolute inset-0 bg-black/70 z-0"></div>

// Change to darker:
<div className="absolute inset-0 bg-black/80 z-0"></div>

// Or lighter:
<div className="absolute inset-0 bg-black/50 z-0"></div>
```

### Change Brand Colors

Update in `defaultConfig`:

```typescript
// From Synoptik Yellow to another color:
brandColor: '#FFD200' // Synoptik Yellow
// to
brandColor: '#FF0000' // Red (or any hex color)
```

## ✨ Design Highlights

### Overlay Strategy
All games now use a **dark overlay pattern** to ensure text readability:

```
Background Image
    ↓
Dark Overlay (bg-black/60-70)
    ↓
Game Content (text, buttons, etc.)
```

This ensures that no matter what background image is used, the text remains readable.

### Color Psychology
- **Yellow (#FFD200)**: Used for call-to-action elements, prizes, and accents
- **Black (#000000)**: Used for backgrounds in darker games, creating contrast with yellow
- **White text with text-shadow**: Ensures readability on all backgrounds

### Mobile-First
All games are optimized for mobile:
- Touch-friendly targets (minimum 44px)
- Clear visual hierarchy
- Smooth animations
- Responsive layouts

## 🚀 Next Steps

1. **Test on real devices**: Use your phone to test all games
2. **Gather feedback**: Show to the Synoptik marketing team
3. **Iterate**: Based on feedback, adjust colors, texts, or images
4. **Deploy**: Push to production when ready

## 🐛 Troubleshooting

### Background image not showing
- Check that the URL is accessible
- Verify CORS settings if using external images
- Try a different image URL to isolate the issue

### Text is unreadable
- Increase overlay darkness: `bg-black/80` instead of `bg-black/60`
- Ensure text has `text-white` class
- Add text-shadow: `style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}`

### Game not appearing in builder
- Check that the game is registered in `game-registry.ts`
- Verify the import path is correct
- Restart the dev server

## 📊 Quality Checklist

Before going live, verify:

- [ ] All 6 games have Synoptik branding
- [ ] Background images load correctly
- [ ] Text is readable on all games
- [ ] Colors match Synoptik brand guidelines
- [ ] All prizes/rewards are relevant to Synoptik
- [ ] Games work on mobile (touch interactions)
- [ ] No console errors
- [ ] Performance is good (no lag)

## 🎯 Summary

You now have 6 production-ready, Synoptik-branded gamification experiences that are:

✅ **Professionally designed** with proper overlays and contrast  
✅ **Brand-consistent** using Synoptik's yellow and black colors  
✅ **Copy-perfect** with authentic Synoptik offers and messaging  
✅ **Fully customizable** via the Campaign Builder interface  
✅ **Mobile-optimized** for the best user experience  
✅ **Ready to deploy** to your Next.js 15 application  

**Welcome to the future of Synoptik's gamified marketing! 🚀**
