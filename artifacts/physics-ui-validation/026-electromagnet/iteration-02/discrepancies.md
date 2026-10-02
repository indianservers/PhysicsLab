# Lesson 026 — Electromagnet visual review

- The supplied GLB was deliberately not loaded under the user's current 2D-first direction. A generated transparent PNG establishes the crane, coil and washer tray; live SVG layers render current packets, magnetic field lines, pole labels and lifted washers.
- The PNG is presentation-only. Every reading and animated overlay is driven by the authoritative electromagnet simulation state, including signed field direction and current reversal.
- The mockup's laboratory hierarchy is retained inside the existing app shell: core/coil and current controls, large apparatus stage, live readings, field-versus-current graph, electrical safety panel and minimum-current challenge.
- The magnetic circuit uses `Bideal = μ₀NI / (g + ℓcore/μr)` with air/iron/steel relative permeabilities of 1/2000/500 and a smooth saturation clamp. Iron and steel saturation values are 1.6 T and 1.9 T.
- Lift force is estimated from `F = B²A/(2μ₀)` with a documented 10% coupling efficiency; the load is represented as 20 g steel washers. Coil resistance is `N × 0.005 Ω`, voltage is `IR`, power is `I²R`, and the illustrative steady temperature is `24 °C + 0.5 P`.
- Safe operation requires coil temperature at or below 70 °C and battery voltage at or below 24 V. Reversing current swaps north and south while preserving `|B|`.
- Play, pause, step, speed and reduced-motion behavior were browser-tested. Reduced-motion mode settles the energizing transition immediately.
- The challenge was completed with 1200 turns, an iron core, a 1 mm air gap and the calculated minimum 1.00 A: 26 washers at 1200 ampere-turns, within both safety limits.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-ce3929ee-0bdd-4f4e-9887-becbb3e5c951.png`; app copy: `public/assets/experiments/electromagnet/electromagnet-crane.png` (1536×1024, 32-bit alpha).
- Desktop 1440×900, tablet 1024×768 and mobile 390×844 were captured. A fresh console had no runtime errors; its only warnings were the two pre-existing React Router future-flag notices.
