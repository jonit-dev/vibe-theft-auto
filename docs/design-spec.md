# Vibe Theft Auto - Design Specification

## 1. Visual Theme

### 1.1 Concept

A dark sci-fi aesthetic with cyberpunk influences. The game world should feel technologically advanced but dystopian, with high contrast between neon elements and shadowy environments.

### 1.2 Key Visual References

- Blade Runner 2049
- Cyberpunk 2077
- Deus Ex series
- Ghost in the Shell
- TRON: Legacy

## 2. Color Palette

### 2.1 Primary Colors

- Deep Space Black: `#0A0E17` - Primary background color
- Midnight Blue: `#141E33` - Secondary background color
- Tech Blue: `#0A84FF` - Primary accent color

### 2.2 Secondary Colors

- Neon Purple: `#B73EFF` - Secondary accent color
- Cyber Green: `#00FF9D` - Tertiary accent color

### 2.3 UI Colors

- Interface Dark: `#1C2333` - UI background color
- Interface Light: `#2C3445` - UI secondary background
- Text White: `#E8ECEF` - Primary text color
- Subdued Text: `#8A93A7` - Secondary text color
- Alert Red: `#FF3B5F` - Warning/danger color
- Success Green: `#00C875` - Success/confirm color

### 2.4 Gradient Combinations

- Tech Gradient: `linear-gradient(135deg, #0A84FF 0%, #B73EFF 100%)` - Used for important UI elements
- Dark Gradient: `linear-gradient(180deg, #0A0E17 0%, #141E33 100%)` - Used for panels and backgrounds

## 3. Typography

### 3.1 Primary Font

- **Font Family**: "Rajdhani" - A geometric sans-serif with a technical, futuristic feel
- **Weights**: 300 (Light), 500 (Medium), 700 (Bold)
- **Usage**: Main UI text, headings, buttons

### 3.2 Secondary Font

- **Font Family**: "Roboto Mono" - A monospaced font for technical displays
- **Weights**: 400 (Regular), 700 (Bold)
- **Usage**: Code displays, terminal interfaces, numerical data

### 3.3 Text Sizes

- Heading 1: 32px / 700 weight
- Heading 2: 24px / 700 weight
- Heading 3: 18px / 500 weight
- Body: 16px / 400 weight
- Small: 14px / 400 weight
- Micro: 12px / 400 weight

## 4. UI Components

### 4.1 Buttons

- **Primary Button**: Pill-shaped with tech gradient background, 2px glow effect in accent color
- **Secondary Button**: Outlined with 1px stroke in accent color, transparent background
- **Tertiary Button**: Text-only with accent color, hover underline effect

### 4.2 Panels and Windows

- Rounded corners (8px radius)
- 75-85% opacity dark backgrounds
- Thin 1px borders in accent colors
- Subtle outer glow in accent color (2-3px)
- Drop shadows for depth (rgba(0,0,0,0.5), 5-10px blur)

### 4.3 HUD Elements

- Minimalist design with thin lines
- Important information highlighted with accent colors
- Non-critical information in subdued colors
- Dynamic elements should have subtle animations
- Holographic-style elements with transparency

### 4.4 Icons

- Thin stroke (1-2px) geometric designs
- Consistent accent colors
- Glow effects on hover/active states
- Minimal detail for clear legibility at small sizes

## 5. Animation and Effects

### 5.1 UI Transitions

- Subtle fade-in/out (150-200ms)
- Soft slide animations for panels (200-250ms)
- Easing: cubic-bezier(0.25, 0.1, 0.25, 1)

### 5.2 Highlight Effects

- Pulsing glow for important elements
- Scanlines effect for technical interfaces (subtle, 30% opacity)
- Digital distortion for damaged/glitching elements

### 5.3 Particle Effects

- Holographic particles (blue/cyan)
- Energy trails (accent colors)
- Digital dust/noise for atmosphere

## 6. Loading and Transition Screens

### 6.1 Loading Screens

- Animated technical diagrams or wireframes
- Progress indicator using accent colors
- Minimal lore text or hints in Rajdhani font
- Background with subtle animated patterns

### 6.2 Game Transitions

- Quick fade to black (150ms)
- Digital glitch effect for sudden transitions
- Slow-motion effect for dramatic moments

## 7. Environmental Design

### 7.1 Lighting

- High contrast between dark environments and neon light sources
- Accent colors used for key lighting elements
- Volumetric fog in shadowy areas
- Reflective surfaces to enhance lighting effects

### 7.2 Architecture

- Brutalist structures with futuristic elements
- Decaying infrastructure contrasted with high-tech installations
- Neon signage using accent colors
- Holographic advertisements and interfaces

## 8. Implementation Guidelines

### 8.1 Visual Hierarchy

1. Critical gameplay information (highest visibility)
2. Interactive elements (clear highlighting)
3. Environmental storytelling (subtle but noticeable)
4. Decorative elements (lowest visibility)

### 8.2 Accessibility Considerations

- High contrast mode option
- Configurable UI scaling
- Colorblind-friendly alternative palette
- Option to reduce animation effects
- Text legibility in all screen contexts

### 8.3 Responsive Design

- UI should scale appropriately for different display resolutions
- Mobile-specific layout with larger touch targets
- Maintain visual consistency across platforms
