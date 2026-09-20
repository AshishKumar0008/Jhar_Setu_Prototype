// High-quality SVG-based sample civic problem imagery for instant demo testing
export interface CivicSamplePreset {
  id: "road" | "water" | "electric" | "education";
  name: string;
  hindiName: string;
  icon: string;
  category: "Roads" | "Water" | "Health" | "Education";
  filename: string;
  imageSrc: string;
}

export const CIVIC_SAMPLES: CivicSamplePreset[] = [
  {
    id: "road",
    name: "Broken Road & Deep Potholes",
    hindiName: "टूटी सड़क और गहरे गड्ढे",
    icon: "🛣️",
    category: "Roads",
    filename: "ranchi_main_road_potholes.jpg",
    imageSrc: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#475569" />
            <stop offset="100%" stop-color="#64748b" />
          </linearGradient>
          <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#334155" />
            <stop offset="100%" stop-color="#1e293b" />
          </linearGradient>
          <linearGradient id="puddle" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#78350f" />
            <stop offset="100%" stop-color="#451a03" />
          </linearGradient>
        </defs>
        <rect width="600" height="180" fill="url(#sky)" />
        <rect y="180" width="600" height="220" fill="url(#road)" />
        <!-- Distant trees and roadside -->
        <path d="M0,180 Q100,160 200,180 T400,175 T600,180 L600,200 L0,200 Z" fill="#1e3a1e" opacity="0.6"/>
        <line x1="300" y1="180" x2="300" y2="400" stroke="#fbbf24" stroke-dasharray="25,15" stroke-width="4" opacity="0.4"/>
        <!-- Severe Pothole 1 with water -->
        <ellipse cx="260" cy="280" rx="140" ry="45" fill="#0f172a" stroke="#475569" stroke-width="3"/>
        <ellipse cx="255" cy="282" rx="125" ry="38" fill="url(#puddle)" opacity="0.85"/>
        <ellipse cx="240" cy="275" rx="70" ry="18" fill="#92400e" opacity="0.5"/>
        <!-- Pothole 2 -->
        <ellipse cx="460" cy="330" rx="90" ry="30" fill="#0f172a" stroke="#475569" stroke-width="2"/>
        <ellipse cx="455" cy="332" rx="75" ry="24" fill="url(#puddle)" opacity="0.9"/>
        <!-- Crack lines -->
        <path d="M120,280 L70,295 L40,290 M390,270 L430,250 L470,255 M200,325 L240,360 L220,385" stroke="#0f172a" stroke-width="3" fill="none"/>
        <path d="M120,280 L90,260 L60,265 M380,310 L410,340" stroke="#020617" stroke-width="2" fill="none"/>
        <!-- Geo stamp badge -->
        <rect x="20" y="20" width="230" height="48" rx="8" fill="#000000" fill-opacity="0.75" />
        <text x="32" y="42" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#ffffff">📍 Ranchi District — NH 33 Link</text>
        <text x="32" y="58" font-family="system-ui, sans-serif" font-size="11" fill="#94a3b8">Civic Evidence • 23.3441° N, 85.3096° E</text>
      </svg>
    `),
  },
  {
    id: "water",
    name: "Contaminated Handpump & Red Water",
    hindiName: "दूषित चापाकल और लाल पानी",
    icon: "🚰",
    category: "Water",
    filename: "sahibganj_handpump_iron_contamination.jpg",
    imageSrc: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#94a3b8" />
            <stop offset="100%" stop-color="#64748b" />
          </linearGradient>
          <linearGradient id="rust" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#b45309" />
            <stop offset="100%" stop-color="#78350f" />
          </linearGradient>
          <linearGradient id="mudwater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#dc2626" />
            <stop offset="100%" stop-color="#991b1b" />
          </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#bg)" />
        <!-- Concrete plinth with cracks -->
        <polygon points="120,380 480,380 440,260 160,260" fill="#cbd5e1" stroke="#64748b" stroke-width="3"/>
        <polygon points="150,370 450,370 420,270 180,270" fill="url(#rust)" opacity="0.3"/>
        <!-- Cracked platform -->
        <path d="M220,270 L260,320 L240,370 M360,280 L380,340" stroke="#475569" stroke-width="3" fill="none"/>
        <!-- Handpump Body -->
        <rect x="270" y="120" width="40" height="150" rx="6" fill="#475569" stroke="#1e293b" stroke-width="3"/>
        <rect x="260" y="110" width="60" height="18" rx="4" fill="#334155" />
        <rect x="250" y="260" width="80" height="14" rx="3" fill="#1e293b" />
        <!-- Spout -->
        <path d="M270,180 L200,195 L200,225 L225,220 L270,205 Z" fill="#334155" stroke="#0f172a" stroke-width="2"/>
        <!-- Iron reddish water stream -->
        <path d="M205,220 Q200,280 210,320 Q215,350 220,370" stroke="url(#mudwater)" stroke-width="12" stroke-linecap="round" fill="none" opacity="0.9"/>
        <!-- Contaminated pool -->
        <ellipse cx="230" cy="350" rx="90" ry="25" fill="#7f1d1d" opacity="0.85"/>
        <ellipse cx="230" cy="350" rx="70" ry="18" fill="#b91c1c" opacity="0.6"/>
        <!-- Pump handle -->
        <line x1="300" y1="120" x2="440" y2="80" stroke="#1e293b" stroke-width="12" stroke-linecap="round"/>
        <circle cx="445" cy="78" r="14" fill="#0f172a"/>
        <!-- Geo stamp badge -->
        <rect x="20" y="20" width="240" height="48" rx="8" fill="#000000" fill-opacity="0.75" />
        <text x="32" y="42" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#ffffff">📍 Sahibganj — Block Handpump #4</text>
        <text x="32" y="58" font-family="system-ui, sans-serif" font-size="11" fill="#fca5a5">⚠️ High Iron / Turbidity Observed</text>
      </svg>
    `),
  },
  {
    id: "electric",
    name: "Exposed High-Voltage Transformer Wires",
    hindiName: "खुले हाई-वोल्टेज बिजली के तार",
    icon: "⚡",
    category: "Health",
    filename: "dhanbad_transformer_exposed_wires.jpg",
    imageSrc: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
        <rect width="600" height="400" fill="#334155" />
        <!-- Electric Pole structure -->
        <line x1="160" y1="30" x2="160" y2="400" stroke="#64748b" stroke-width="16"/>
        <line x1="440" y1="30" x2="440" y2="400" stroke="#64748b" stroke-width="16"/>
        <line x1="120" y1="120" x2="480" y2="120" stroke="#475569" stroke-width="12"/>
        <line x1="120" y1="220" x2="480" y2="220" stroke="#475569" stroke-width="12"/>
        <!-- Transformer Box -->
        <rect x="230" y="140" width="140" height="130" rx="8" fill="#0284c7" stroke="#0369a1" stroke-width="4"/>
        <rect x="245" y="155" width="110" height="20" rx="3" fill="#0c4a6e"/>
        <!-- Bushing Insulators -->
        <circle cx="260" cy="135" r="8" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
        <circle cx="300" cy="135" r="8" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
        <circle cx="340" cy="135" r="8" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
        <!-- Dangling Exposed Wires with Spark Risk -->
        <path d="M260,135 Q240,240 210,330 Q200,370 190,400" stroke="#eab308" stroke-width="5" fill="none"/>
        <path d="M300,135 Q320,230 290,340" stroke="#ef4444" stroke-width="6" fill="none"/>
        <path d="M340,135 Q390,260 380,380" stroke="#eab308" stroke-width="5" fill="none"/>
        <!-- Sparks -->
        <polygon points="290,340 300,330 295,345 305,340 290,355" fill="#facc15" />
        <!-- Geo stamp badge -->
        <rect x="20" y="20" width="240" height="48" rx="8" fill="#000000" fill-opacity="0.75" />
        <text x="32" y="42" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#ffffff">📍 Dhanbad Urban — JBVNL Sector 3</text>
        <text x="32" y="58" font-family="system-ui, sans-serif" font-size="11" fill="#fde047">⚡ Critical Hazard: Exposed Low-Tension</text>
      </svg>
    `),
  },
  {
    id: "education",
    name: "Cracked School Classroom Wall & Roof",
    hindiName: "स्कूल की दीवार और छत में दरारें",
    icon: "🏫",
    category: "Education",
    filename: "dumka_primary_school_cracks.jpg",
    imageSrc: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
        <rect width="600" height="400" fill="#f8fafc" />
        <!-- Wall Paint with Water Seepage -->
        <rect width="600" height="400" fill="#fef08a" opacity="0.3" />
        <path d="M0,0 L600,0 L600,90 Q450,140 300,80 T0,110 Z" fill="#78716c" opacity="0.4"/>
        <!-- Chalkboard outline -->
        <rect x="80" y="120" width="220" height="150" rx="4" fill="#14532d" stroke="#78350f" stroke-width="8"/>
        <!-- Huge Diagonal Structural Crack -->
        <path d="M360,40 L380,90 L365,140 L410,210 L390,280 L430,360 L420,400" stroke="#1c1917" stroke-width="5" fill="none"/>
        <path d="M380,90 L420,120 M410,210 L450,230 M390,280 L350,310" stroke="#292524" stroke-width="3" fill="none"/>
        <!-- Spalling roof patch with exposed rebar -->
        <ellipse cx="480" cy="50" rx="60" ry="25" fill="#44403c" />
        <line x1="440" y1="50" x2="520" y2="50" stroke="#b91c1c" stroke-width="3" stroke-dasharray="6,4"/>
        <!-- Geo stamp badge -->
        <rect x="20" y="20" width="250" height="48" rx="8" fill="#000000" fill-opacity="0.75" />
        <text x="32" y="42" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#ffffff">📍 Dumka District — Govt Primary School</text>
        <text x="32" y="58" font-family="system-ui, sans-serif" font-size="11" fill="#f87171">⚠️ Structural Safety Redressal Needed</text>
      </svg>
    `),
  },
];
