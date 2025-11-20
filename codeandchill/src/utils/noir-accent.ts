// NoirSystem Dynamic Accent System
// Generates accessible color shades and complements

interface HSL {
  h: number;
  s: number;
  l: number;
}

// Convert HSL values to CSS hsl() string
function hsl(h: number, s: number, l: number): string {
  return `hsl(${h} ${s}% ${l}%)`;
}

// Convert hex to HSL
function hexToHsl(hex: string): HSL {
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Generate accessible accent shades
function generateAccentShades(h: number, s: number, baseL: number): string[] {
  // Ensure WCAG AA compliance against dark background (#0b0f13)
  const shades = [
    Math.max(55, baseL),      // accent-1 (brightest)
    Math.max(49, baseL - 6),  // accent-2
    Math.max(40, baseL - 15), // accent-3
    Math.max(29, baseL - 26), // accent-4
    Math.max(19, baseL - 36), // accent-5
    Math.max(11, baseL - 44)  // accent-6 (darkest)
  ];

  return shades.map(l => hsl(h, s, l));
}

// Set accent colors dynamically
export function setAccentColor(h: number = 210, s: number = 85, l: number = 55): void {
  const root = document.documentElement;
  
  // Generate main accent shades
  const shades = generateAccentShades(h, s, l);
  shades.forEach((shade, i) => {
    root.style.setProperty(`--accent-${i + 1}`, shade);
  });

  // Generate complementary colors (triadic harmony)
  const complement1H = (h + 120) % 360;
  const complement2H = (h + 240) % 360;
  
  root.style.setProperty('--accent-complement-1', hsl(complement1H, Math.max(70, s - 15), Math.max(35, l - 20)));
  root.style.setProperty('--accent-complement-2', hsl(complement2H, Math.max(70, s - 15), Math.max(35, l - 20)));
}

// Preset accent themes
export const accentPresets = {
  ocean: { h: 210, s: 85, l: 55 },
  purple: { h: 270, s: 80, l: 60 },
  emerald: { h: 160, s: 75, l: 50 },
  amber: { h: 45, s: 90, l: 55 },
  rose: { h: 330, s: 80, l: 60 },
  cyan: { h: 180, s: 85, l: 55 }
};

// Auto-set accent based on time of day
export function setTimeBasedAccent(): void {
  const hour = new Date().getHours();
  let preset: keyof typeof accentPresets;

  if (hour >= 6 && hour < 12) {
    preset = 'amber'; // Morning - warm
  } else if (hour >= 12 && hour < 18) {
    preset = 'ocean'; // Afternoon - cool
  } else if (hour >= 18 && hour < 22) {
    preset = 'purple'; // Evening - vibrant
  } else {
    preset = 'cyan'; // Night - calm
  }

  const { h, s, l } = accentPresets[preset];
  setAccentColor(h, s, l);
}

// Initialize accent system
export function initNoirAccentSystem(): void {
  // Set initial accent
  setTimeBasedAccent();

  // Listen for custom accent changes
  document.addEventListener('noir:setAccent', (event: any) => {
    const { h, s, l } = event.detail;
    setAccentColor(h, s, l);
  });

  // Listen for preset changes
  document.addEventListener('noir:setPreset', (event: any) => {
    const preset = event.detail.preset as keyof typeof accentPresets;
    if (accentPresets[preset]) {
      const { h, s, l } = accentPresets[preset];
      setAccentColor(h, s, l);
    }
  });
}

// Utility to trigger accent change
export function changeAccent(preset: keyof typeof accentPresets): void {
  document.dispatchEvent(new CustomEvent('noir:setPreset', {
    detail: { preset }
  }));
}

// Utility to set custom accent from hex color
export function setAccentFromHex(hexColor: string): void {
  const { h, s, l } = hexToHsl(hexColor);
  document.dispatchEvent(new CustomEvent('noir:setAccent', {
    detail: { h, s, l }
  }));
}