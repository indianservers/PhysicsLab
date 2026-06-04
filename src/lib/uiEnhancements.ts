import { PhysicsIconName } from "./icons";

export interface UIEnhancement {
  id: number;
  category: "Navigation" | "Discovery" | "Learning" | "Controls" | "Visualization" | "Accessibility" | "Polish";
  title: string;
  detail: string;
  icon: PhysicsIconName;
}

export const uiEnhancements: UIEnhancement[] = [
  { id: 1, category: "Navigation", title: "Sticky command areas", detail: "Keep filters and section jumps close while browsing long physics content.", icon: "compass" },
  { id: 2, category: "Navigation", title: "Quick section jumps", detail: "Guide, toolkit, motion, 3D, sim, coach, and notebook anchors are one tap away.", icon: "step" },
  { id: 3, category: "Navigation", title: "Active filter chips", detail: "Show the exact class, category, level, and search filters currently shaping results.", icon: "check" },
  { id: 4, category: "Navigation", title: "Compact result mode", detail: "Switch between rich cards and dense scanning when the experiment list is large.", icon: "menu" },
  { id: 5, category: "Navigation", title: "Sort control", detail: "Order labs by title, class, difficulty, category, or richest interactive support.", icon: "chart" },
  { id: 6, category: "Navigation", title: "Reset filters action", detail: "Clear search and all selectors without hunting through individual controls.", icon: "settings" },
  { id: 7, category: "Navigation", title: "Class progress rail", detail: "Show class-by-class lab density directly on the library page.", icon: "book" },
  { id: 8, category: "Discovery", title: "Dynamic feature badges", detail: "Cards identify guided, visual, 3D, calculator, and coach support.", icon: "spark" },
  { id: 9, category: "Discovery", title: "Topic trace", detail: "Each card surfaces mapped syllabus topics so students see why the lab matters.", icon: "clipboard" },
  { id: 10, category: "Discovery", title: "Difficulty scanning", detail: "Level chips stay pinned at the card top for fast teacher planning.", icon: "gauge" },
  { id: 11, category: "Discovery", title: "Coverage metric cards", detail: "Prominent metrics summarize shown labs, tagged labs, 3D labs, and mapped topics.", icon: "chart" },
  { id: 12, category: "Discovery", title: "Empty-state recovery", detail: "No-result pages give a direct reset path instead of a dead end.", icon: "compass" },
  { id: 13, category: "Discovery", title: "Class shortcut chips", detail: "Class 7-12 can be selected with fast segmented controls.", icon: "book" },
  { id: 14, category: "Discovery", title: "Syllabus spine panel", detail: "Class rows show expected physics themes and matching lab counts.", icon: "chart" },
  { id: 15, category: "Learning", title: "Lab command strip", detail: "Each experiment starts with what is available and what to do first.", icon: "teacher" },
  { id: 16, category: "Learning", title: "One-variable warning", detail: "The clean-pattern reminder sits outside the visualization so it never hides the core scene.", icon: "check" },
  { id: 17, category: "Learning", title: "Guide-first layout", detail: "A guided learning section appears before interactive work.", icon: "book" },
  { id: 18, category: "Learning", title: "Toolkit visibility", detail: "Concept map, unit check, misconceptions, and mastery support remain easy to reach.", icon: "spark" },
  { id: 19, category: "Learning", title: "Concept-flow badges", detail: "Cinematic visualizations explain the sequence of physical cause and effect.", icon: "step" },
  { id: 20, category: "Learning", title: "Notebook anchor", detail: "Observation tables are reachable from the top navigation.", icon: "clipboard" },
  { id: 21, category: "Learning", title: "Viva reveal cards", detail: "Question answers are hidden until the learner actively checks them.", icon: "teacher" },
  { id: 22, category: "Learning", title: "Expected result block", detail: "Every lab ends with a target physics conclusion.", icon: "check" },
  { id: 23, category: "Controls", title: "Slider quick presets", detail: "Each variable has low, mid, and high buttons for fast comparisons.", icon: "settings" },
  { id: 24, category: "Controls", title: "Range labels", detail: "Slider min and max values are visible beside every control.", icon: "ruler" },
  { id: 25, category: "Controls", title: "Value meter fill", detail: "Controls show the current relative position as a progress fill.", icon: "gauge" },
  { id: 26, category: "Controls", title: "Precise monospace values", detail: "Calculated inputs and outputs align for clean reading.", icon: "calculator" },
  { id: 27, category: "Controls", title: "Control tooltips", detail: "Every variable includes short physics guidance.", icon: "clipboard" },
  { id: 28, category: "Controls", title: "Preserve one-variable study", detail: "Quick actions modify one slider at a time by default.", icon: "check" },
  { id: 29, category: "Controls", title: "Compact calculator panel", detail: "Collapsible calculators keep space available for animations.", icon: "calculator" },
  { id: 30, category: "Controls", title: "Outcome tooltips", detail: "Result cards explain what each output means.", icon: "book" },
  { id: 31, category: "Visualization", title: "Focused visual slot", detail: "The main visual area shows the active 3D or 2D interactive model without duplicate animation panels.", icon: "wave" },
  { id: 32, category: "Visualization", title: "3D scene slot", detail: "Three.js visualizations respond to the same experiment sliders.", icon: "orbit" },
  { id: 33, category: "Visualization", title: "Scene guide panel", detail: "Animations include a short interpretive guide beside the canvas.", icon: "eye" },
  { id: 34, category: "Visualization", title: "Cinematic status chip", detail: "High-value animations are marked as cinematic explainers.", icon: "spark" },
  { id: 35, category: "Visualization", title: "Output beside visuals", detail: "Top calculated results appear beside 3D scenes for immediate connection.", icon: "calculator" },
  { id: 36, category: "Visualization", title: "Responsive canvas sizing", detail: "Visual stages keep usable proportions across desktop and mobile.", icon: "eye" },
  { id: 37, category: "Visualization", title: "Interactive drag cue", detail: "3D canvases use cursor states to signal scene rotation.", icon: "orbit" },
  { id: 38, category: "Visualization", title: "Formula proximity", detail: "The model formula remains near the simulation output.", icon: "calculator" },
  { id: 39, category: "Accessibility", title: "Keyboard focus rings", detail: "Interactive elements have strong visible focus states.", icon: "check" },
  { id: 40, category: "Accessibility", title: "Skip link support", detail: "Keyboard users can jump directly to main content.", icon: "step" },
  { id: 41, category: "Accessibility", title: "High contrast mode", detail: "Existing accessibility themes keep panels readable.", icon: "eye" },
  { id: 42, category: "Accessibility", title: "Reduced motion mode", detail: "Motion-heavy UI respects reduced-motion settings.", icon: "settings" },
  { id: 43, category: "Accessibility", title: "Scrollable chip rows", detail: "Filter chips stay usable on small screens without text overlap.", icon: "menu" },
  { id: 44, category: "Accessibility", title: "Large touch targets", detail: "Buttons, cards, and sliders use comfortable hit areas.", icon: "check" },
  { id: 45, category: "Polish", title: "Consistent card radius", detail: "Cards, panels, and controls use a restrained 8px-radius visual system.", icon: "ruler" },
  { id: 46, category: "Polish", title: "Icon-led interface", detail: "Experiment, tool, section, and action labels are paired with physics icons.", icon: "spark" },
  { id: 47, category: "Polish", title: "Status chip vocabulary", detail: "Small chips make feature state visible without long text blocks.", icon: "check" },
  { id: 48, category: "Polish", title: "Soft hover lift", detail: "Cards and buttons respond gently without shifting layouts aggressively.", icon: "spark" },
  { id: 49, category: "Polish", title: "Print-friendly tables", detail: "Notebook tables use compact borders and readable headers.", icon: "printer" },
  { id: 50, category: "Polish", title: "Local-first confidence", detail: "Browser-only, local-storage, and pure frontend cues are visible in the UI.", icon: "save" },
];
