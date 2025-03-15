# Vibe Theft Auto - Design Specification

## 1. Visual Theme

### 1.1 Concept

A vibrant retro 80s Miami aesthetic inspired by GTA Vice City. The game world should feel nostalgic and energetic, with neon signs, palm trees, and sunset gradients creating a distinctive atmosphere that evokes the glamour and excess of 1980s Miami.

### 1.2 Key Visual References

- GTA Vice City
- Miami Vice TV series
- Hotline Miami
- Scarface
- Retrowave/synthwave aesthetics

## 2. Color Palette

### 2.1 Primary Colors

- Miami Black: `#0A0C14` - Primary background color
- Midnight Purple: `#1A0933` - Secondary background color
- Neon Pink: `#FF41A6` - Primary accent color

### 2.2 Secondary Colors

- Vice Blue: `#00A5E5` - Secondary accent color
- Palm Green: `#00E574` - Tertiary accent color
- Sunset Orange: `#FF8E42` - Highlight color

### 2.3 UI Colors

- Interface Dark: `#1A1133` - UI background color
- Interface Light: `#2A2044` - UI secondary background
- Text White: `#EFF6FF` - Primary text color
- Subdued Text: `#9D98B3` - Secondary text color
- Alert Red: `#FF3062` - Warning/danger color
- Success Green: `#3DFC9E` - Success/confirm color

### 2.4 Gradient Combinations

- Miami Sunset: `linear-gradient(135deg, #FF41A6 0%, #FF8E42 100%)` - Used for important UI elements
- Ocean Drive: `linear-gradient(180deg, #0A0C14 0%, #1A0933 100%)` - Used for panels and backgrounds
- Neon Glow: `linear-gradient(135deg, #00A5E5 0%, #00E574 100%)` - Used for interactive elements

## 3. Typography

### 3.1 Primary Font

- **Font Family**: "Outrun Future" - A retro-futuristic font that captures the 80s arcade and neon aesthetic
- **Weights**: 400 (Regular), 700 (Bold)
- **Usage**: Main UI text, headings, buttons

### 3.2 Secondary Font

- **Font Family**: "VCR OSD Mono" - A monospaced font reminiscent of 80s computer displays
- **Weights**: 400 (Regular)
- **Usage**: Code displays, terminal interfaces, numerical data

### 3.3 Text Sizes

- Heading 1: 36px / 700 weight
- Heading 2: 28px / 700 weight
- Heading 3: 20px / 400 weight
- Body: 16px / 400 weight
- Small: 14px / 400 weight
- Micro: 12px / 400 weight

## 4. UI Components

### 4.1 Buttons

- **Primary Button**: Pill-shaped with miami sunset gradient background, 2px neon glow effect in accent color
- **Secondary Button**: Outlined with 1px stroke in neon color, transparent background
- **Tertiary Button**: Text-only with neon accent color, hover underline effect

### 4.2 Panels and Windows

- Rounded corners (8px radius)
- 75-85% opacity dark backgrounds
- Thin 1px neon borders in accent colors
- Vibrant outer glow in accent color (2-3px)
- Drop shadows for depth (rgba(0,0,0,0.5), 5-10px blur)

### 4.3 HUD Elements

- Minimalist design with neon outlines
- Important information highlighted with vibrant colors
- Non-critical information in subdued colors
- Dynamic elements should have subtle pulsing animations
- Retro-style chrome elements with transparency

### 4.4 Icons

- Thin stroke (1-2px) geometric designs with neon glow
- Vibrant accent colors
- Glow effects on hover/active states
- Minimal detail for clear legibility at small sizes

## 5. Animation and Effects

### 5.1 UI Transitions

- Neon flicker effect for startup/initialization (150-200ms)
- Smooth horizontal scan lines (subtle, 30% opacity)
- Easing: cubic-bezier(0.25, 0.1, 0.25, 1)

### 5.2 Highlight Effects

- Pulsing neon glow for important elements
- VHS/CRT scan line effect for retro interfaces
- Color fringing for damaged/glitching elements

### 5.3 Particle Effects

- Neon trails (pink/blue)
- Palm leaf silhouettes
- Retro grid patterns for ground/horizon

## 6. Loading and Transition Screens

### 6.1 Loading Screens

- Animated palm tree silhouettes against sunset gradient
- Cassette tape or vinyl record loading spinner
- Retro typography with game hints or lore
- Background with subtle animated grid patterns

### 6.2 Game Transitions

- VHS tracking effect for scene transitions (150ms)
- Glitch effect for sudden transitions
- Slow-motion 80s action movie style for dramatic moments

## 7. Environmental Design

### 7.1 Lighting

- High contrast between dark environments and neon light sources
- Sunset color palette for sky and reflections
- Volumetric fog with pink/blue tint
- Reflective surfaces to enhance neon lighting effects

### 7.2 Architecture

- Art Deco Miami buildings with neon outlines
- Palm trees silhouetted against sunset backgrounds
- Neon signage using accent colors
- Retro cars and environment props

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
