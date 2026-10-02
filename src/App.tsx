import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Component, lazy, ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { HomePage } from "./pages/HomePage";
import { WorkspacePage } from "./pages/WorkspacePage";
import { ExperimentsPage } from "./pages/ExperimentsPage";
import { ExperimentDetailPage } from "./pages/ExperimentDetailPage";
import { TopicPage } from "./pages/TopicPage";
import { SyllabusPage } from "./pages/SyllabusPage";
import { ConceptsPage } from "./pages/ConceptsPage";
import { RoadmapPage } from "./pages/RoadmapPage";
import { SimplePage } from "./pages/SimplePage";
import { GraphsPage } from "./pages/GraphsPage";
import { VideoAnalysisPage } from "./pages/VideoAnalysisPage";
import { KnowledgeGraphPage } from "./pages/KnowledgeGraphPage";
import { LMSConfigPage } from "./pages/LMSConfigPage";
import { QuantumPage } from "./pages/QuantumPage";
import { TeacherPage } from "./pages/TeacherPage";
import { SolverPage } from "./pages/SolverPage";
import { QuizPage } from "./pages/QuizPage";
import { FormulasPage } from "./pages/FormulasPage";
import { FormulaRevisionGridPage } from "./pages/FormulaRevisionGridPage";
import { DictionaryPage } from "./pages/DictionaryPage";
import { AstroPhysicsPage } from "./pages/AstroPhysicsPage";
import { ParticlePhysicsPage } from "./pages/ParticlePhysicsPage";
import { AtmospherePage } from "./pages/AtmospherePage";
import { StringTheoryPage } from "./pages/StringTheoryPage";
import { PhysicsInnovationsPage } from "./pages/PhysicsInnovationsPage";
import { PhysicsModulesPage } from "./pages/PhysicsModulesPage";
import { ComparisonPage } from "./pages/ComparisonPage";
import { QualityAuditPage } from "./pages/QualityAuditPage";
import { AccuracyCenterPage } from "./pages/AccuracyCenterPage";
import { LearningStudioPage } from "./pages/LearningStudioPage";
import { SimulationDepthPage } from "./pages/SimulationDepthPage";
import { ClassroomDeploymentPage } from "./pages/ClassroomDeploymentPage";
import { AccessibilityCenterPage } from "./pages/AccessibilityCenterPage";
import { InsightsCenterPage } from "./pages/InsightsCenterPage";
import { ReleaseGovernancePage } from "./pages/ReleaseGovernancePage";
import { ExcellenceBenchmarkPage } from "./pages/ExcellenceBenchmarkPage";
import { useLabStore } from "./store/useLabStore";
import { ScaleOfUniversePage } from "./physics/scale-of-universe/ScaleOfUniversePage";
import { sendStatement, initXAPISync } from "./lib/xapi";
import { ToastProvider } from "./components/ToastSystem";
import { CursorTrail } from "./components/CursorTrail";
import { SplashLoader } from "./components/SplashLoader";
import { AchievementSystem } from "./components/AchievementSystem";
import { ParticleConstellation } from "./components/ParticleConstellation";
import { AmbientAudio } from "./components/AmbientAudio";
import { AppFooter } from "./components/AppFooter";
import { ProLabProgramPage } from "./pages/ProLabProgramPage";
import { ProLabPage } from "./pages/ProLabPage";
import { ClientDemosPage } from "./pages/ClientDemosPage";
import { AppDirectoryPage } from "./pages/AppDirectoryPage";
import { ConceptExperiencesPage } from "./pages/ConceptExperiencesPage";

const CircularStudioPage = lazy(() => import("./pages/CircularStudioPage"));
const InertiaStudioPage = lazy(() => import("./pages/InertiaStudioPage"));
const SecondLawStudioPage = lazy(() => import("./pages/SecondLawStudioPage"));
const ThirdLawStudioPage = lazy(() => import("./pages/ThirdLawStudioPage"));
const FrictionStudioPage = lazy(() => import("./pages/FrictionStudioPage"));
const TensionNormalStudioPage = lazy(() => import("./pages/TensionNormalStudioPage"));
const MultiForceStudioPage = lazy(() => import("./pages/MultiForceStudioPage"));
const WorkStudioPage = lazy(() => import("./pages/WorkStudioPage"));
const KineticEnergyStudioPage = lazy(() => import("./pages/KineticEnergyStudioPage"));
const PotentialEnergyStudioPage = lazy(() => import("./pages/PotentialEnergyStudioPage"));
const ConservationEnergyStudioPage = lazy(() => import("./pages/ConservationEnergyStudioPage"));
const PowerStudioPage = lazy(() => import("./pages/PowerStudioPage"));
const EfficiencyStudioPage = lazy(() => import("./pages/EfficiencyStudioPage"));
const UniversalGravityStudioPage = lazy(() => import("./pages/UniversalGravityStudioPage"));
const GravitationalFieldStudioPage = lazy(() => import("./pages/GravitationalFieldStudioPage"));
const GravitationalPotentialStudioPage = lazy(() => import("./pages/GravitationalPotentialStudioPage"));
const OrbitsStudioPage = lazy(() => import("./pages/OrbitsStudioPage"));
const EscapeVelocityStudioPage = lazy(() => import("./pages/EscapeVelocityStudioPage"));
const KeplersLawsStudioPage = lazy(() => import("./pages/KeplersLawsStudioPage"));
const SpringShmStudioPage = lazy(() => import("./pages/SpringShmStudioPage"));
const PendulumStudioPage = lazy(() => import("./pages/PendulumStudioPage"));
const EnergyExchangeStudioPage = lazy(() => import("./pages/EnergyExchangeStudioPage"));
const DampingStudioPage = lazy(() => import("./pages/DampingStudioPage"));
const ResonanceStudioPage = lazy(() => import("./pages/ResonanceStudioPage"));
const CoupledOscillatorsStudioPage = lazy(() => import("./pages/CoupledOscillatorsStudioPage"));
const WavePropertiesStudioPage = lazy(() => import("./pages/WavePropertiesStudioPage"));
const SuperpositionStudioPage = lazy(() => import("./pages/SuperpositionStudioPage"));
const InterferenceStudioPage = lazy(() => import("./pages/InterferenceStudioPage"));
const StandingWavesStudioPage = lazy(() => import("./pages/StandingWavesStudioPage"));
const SoundSpectrumStudioPage = lazy(() => import("./pages/SoundSpectrumStudioPage"));
const DopplerEffectStudioPage = lazy(() => import("./pages/DopplerEffectStudioPage"));
const ReflectionStudioPage = lazy(() => import("./pages/ReflectionStudioPage"));
const RefractionStudioPage = lazy(() => import("./pages/RefractionStudioPage"));
const LensesStudioPage = lazy(() => import("./pages/LensesStudioPage"));
const MirrorsStudioPage = lazy(() => import("./pages/MirrorsStudioPage"));
const OpticsInterferenceStudioPage = lazy(() => import("./pages/OpticsInterferenceStudioPage"));
const DiffractionStudioPage = lazy(() => import("./pages/DiffractionStudioPage"));
const CoulombForceStudioPage = lazy(() => import("./pages/CoulombForceStudioPage"));
const ElectricFieldStudioPage = lazy(() => import("./pages/ElectricFieldStudioPage"));
const ElectricPotentialStudioPage = lazy(() => import("./pages/ElectricPotentialStudioPage"));
const CurrentStudioPage = lazy(() => import("./pages/CurrentStudioPage"));
const CircuitsStudioPage = lazy(() => import("./pages/CircuitsStudioPage"));
const CapacitorsStudioPage = lazy(() => import("./pages/CapacitorsStudioPage"));
const MagneticFieldLinesStudioPage = lazy(() => import("./pages/MagneticFieldLinesStudioPage"));
const LorentzForceStudioPage = lazy(() => import("./pages/LorentzForceStudioPage"));
const CurrentWireStudioPage = lazy(() => import("./pages/CurrentWireStudioPage"));
const SolenoidStudioPage = lazy(() => import("./pages/SolenoidStudioPage"));
const InductionStudioPage = lazy(() => import("./pages/InductionStudioPage"));
const ElectromagnetsStudioPage = lazy(() => import("./pages/ElectromagnetsStudioPage"));
const SemiconductorsStudioPage = lazy(() => import("./pages/SemiconductorsStudioPage"));
const DiodesStudioPage = lazy(() => import("./pages/DiodesStudioPage"));
const TransistorsStudioPage = lazy(() => import("./pages/TransistorsStudioPage"));
const AmplifiersStudioPage = lazy(() => import("./pages/AmplifiersStudioPage"));
const LogicGatesStudioPage = lazy(() => import("./pages/LogicGatesStudioPage"));
const SensorsStudioPage = lazy(() => import("./pages/SensorsStudioPage"));
const TemperatureStudioPage = lazy(() => import("./pages/TemperatureStudioPage"));
const HeatTransferStudioPage = lazy(() => import("./pages/HeatTransferStudioPage"));
const GasLawsStudioPage = lazy(() => import("./pages/GasLawsStudioPage"));
const FirstLawStudioPage = lazy(() => import("./pages/FirstLawStudioPage"));
const EntropyStudioPage = lazy(() => import("./pages/EntropyStudioPage"));
const HeatEnginesStudioPage = lazy(() => import("./pages/HeatEnginesStudioPage"));
const DensityPressureStudioPage = lazy(() => import("./pages/DensityPressureStudioPage"));
const HydrostaticsStudioPage = lazy(() => import("./pages/HydrostaticsStudioPage"));
const BuoyancyStudioPage = lazy(() => import("./pages/BuoyancyStudioPage"));
const ContinuityStudioPage = lazy(() => import("./pages/ContinuityStudioPage"));
const BernoulliStudioPage = lazy(() => import("./pages/BernoulliStudioPage"));
const ViscosityStudioPage = lazy(() => import("./pages/ViscosityStudioPage"));
const QuantumIdeasStudioPage = lazy(() => import("./pages/QuantumIdeasStudioPage"));
const PhotoelectricStudioPage = lazy(() => import("./pages/PhotoelectricStudioPage"));
const MatterWavesStudioPage = lazy(() => import("./pages/MatterWavesStudioPage"));
const AtomicSpectraStudioPage = lazy(() => import("./pages/AtomicSpectraStudioPage"));
const NuclearStructureStudioPage = lazy(() => import("./pages/NuclearStructureStudioPage"));
const RadioactivityStudioPage = lazy(() => import("./pages/RadioactivityStudioPage"));
const SolarSystemStudioPage = lazy(() => import("./pages/SolarSystemStudioPage"));
const StellarLifeStudioPage = lazy(() => import("./pages/StellarLifeStudioPage"));
const SpectroscopyStudioPage = lazy(() => import("./pages/SpectroscopyStudioPage"));
const GalaxiesStudioPage = lazy(() => import("./pages/GalaxiesStudioPage"));
const CosmologyStudioPage = lazy(() => import("./pages/CosmologyStudioPage"));
const ExoplanetsStudioPage = lazy(() => import("./pages/ExoplanetsStudioPage"));
const RelativeMotionPage = lazy(() => import("./pages/RelativeMotionPage"));
const ProjectileStudioPage = lazy(() => import("./pages/ProjectileStudioPage"));
const AccelerationTimePage = lazy(() => import("./pages/AccelerationTimePage"));
const VelocityTimePage = lazy(() => import("./pages/VelocityTimePage"));
const PositionTimePage = lazy(() => import("./pages/PositionTimePage"));
const MomentumCollisionsPage = lazy(() => import("./pages/MomentumCollisionsPage"));
const EquilibriumComPage = lazy(() => import("./pages/EquilibriumComPage"));
const TorqueLeversPage = lazy(() => import("./pages/TorqueLeversPage"));
const AtwoodPage = lazy(() => import("./pages/AtwoodPage"));
const InclineStudioPage = lazy(() => import("./pages/InclineStudioPage"));
const FreeBodyPage = lazy(() => import("./pages/FreeBodyPage"));
const UncertaintyPage = lazy(() => import("./pages/UncertaintyPage"));
const MassTimePage = lazy(() => import("./pages/MassTimePage"));
const SpherometerPage = lazy(() => import("./pages/SpherometerPage"));
const MicrometerPage = lazy(() => import("./pages/MicrometerPage"));
const VernierCaliperPage = lazy(() => import("./pages/VernierCaliperPage"));
const MeterScalePage = lazy(() => import("./pages/MeterScalePage"));
const RocketPartsPage = lazy(() => import("./pages/RocketPartsPage").then((module) => ({ default: module.RocketPartsPage })));

const topics = [
  "mechanics",
  "waves",
  "optics",
  "electricity",
  "magnetism",
  "thermodynamics",
  "modern-physics",
  "fluid-mechanics",
  "oscillations",
  "astronomy",
  "astrophysics",
  "measurement",
  "electronics",
  "energy",
];

export default function App() {
  const { t } = useTranslation();
  const location = useLocation();
  const [online, setOnline] = useState(navigator.onLine);
  const theme = useLabStore((state) => state.theme);
  const accessibility = useLabStore((state) => state.accessibility);
  const cursorRafRef = useRef<number | null>(null);
  const isDedicatedStudio = location.pathname === "/thermodynamics/first-law" || location.pathname === "/thermodynamics/entropy" || location.pathname === "/thermodynamics/heat-engines" || location.pathname === "/fluid-mechanics/density-pressure" || location.pathname === "/fluid-mechanics/hydrostatics" || location.pathname === "/fluid-mechanics/buoyancy" || location.pathname === "/fluid-mechanics/continuity" || location.pathname === "/fluid-mechanics/bernoulli" || location.pathname === "/fluid-mechanics/viscosity" || location.pathname === "/modern-physics/quantum-ideas" || location.pathname === "/modern-physics/photoelectric-effect" || location.pathname === "/modern-physics/matter-waves" || location.pathname === "/modern-physics/atomic-spectra" || location.pathname === "/modern-physics/nuclear-structure" || location.pathname === "/modern-physics/radioactivity" || location.pathname === "/astrophysics/solar-system" || location.pathname === "/astrophysics/stellar-life" || location.pathname === "/astrophysics/spectroscopy" || location.pathname === "/astrophysics/galaxies" || location.pathname === "/astrophysics/cosmology" || location.pathname === "/astrophysics/exoplanets" || location.pathname === "/thermodynamics/gas-laws" || location.pathname === "/thermodynamics/heat-transfer" || location.pathname === "/thermodynamics/temperature" || location.pathname === "/electronics/sensors" || location.pathname === "/electronics/logic-gates" || location.pathname === "/electronics/amplifiers" || location.pathname === "/electronics/transistors" || location.pathname === "/electronics/diodes" || location.pathname === "/electronics/semiconductors" || location.pathname === "/magnetism/electromagnets" || location.pathname === "/magnetism/induction" || location.pathname === "/magnetism/solenoids" || location.pathname === "/magnetism/current-wire" || location.pathname === "/magnetism/lorentz-force" || location.pathname === "/magnetism/field-lines" || location.pathname === "/electricity/capacitors" || location.pathname === "/electricity/circuits" || location.pathname === "/electricity/current" || location.pathname === "/electricity/electric-potential" || location.pathname === "/electricity/electric-field" || location.pathname === "/electricity/coulomb-force" || location.pathname === "/optics/diffraction" || location.pathname === "/optics/interference" || location.pathname === "/optics/mirrors" || location.pathname === "/optics/lenses" || location.pathname === "/optics/refraction" || location.pathname === "/optics/reflection" || location.pathname === "/motion/doppler-effect" || location.pathname === "/motion/sound-spectrum" || location.pathname === "/motion/standing-waves" || location.pathname === "/motion/interference" || location.pathname === "/motion/superposition" || location.pathname === "/motion/wave-properties" || location.pathname === "/motion/coupled-oscillators" || location.pathname === "/motion/resonance" || location.pathname === "/motion/damping" || location.pathname === "/motion/energy-exchange" || location.pathname === "/motion/pendulum" || location.pathname === "/motion/spring-shm" || location.pathname === "/motion/keplers-laws" || location.pathname === "/motion/escape-velocity" || location.pathname === "/motion/orbits" || location.pathname === "/motion/gravitational-potential" || location.pathname === "/motion/gravitational-field" || location.pathname === "/motion/universal-gravity" || location.pathname === "/motion/efficiency" || location.pathname === "/motion/power" || location.pathname === "/motion/conservation-energy" || location.pathname === "/motion/potential-energy" || location.pathname === "/motion/kinetic-energy" || location.pathname === "/motion/work" || location.pathname === "/motion/multi-force-challenge" || location.pathname === "/motion/tension-normal" || location.pathname === "/motion/friction" || location.pathname === "/motion/third-law-pairs" || location.pathname === "/motion/second-law-fma" || location.pathname === "/motion/first-law-inertia" || location.pathname === "/motion/circular-motion" || location.pathname === "/motion/relative-motion" || location.pathname === "/motion/projectile-motion" || location.pathname === "/motion/acceleration-time" || location.pathname === "/motion/velocity-time" || location.pathname === "/motion/position-time" || location.pathname === "/mechanics/momentum-collisions" || location.pathname === "/mechanics/equilibrium-com" || location.pathname === "/mechanics/torque-levers" || location.pathname === "/mechanics/pulley-systems" || location.pathname === "/mechanics/inclined-plane" || location.pathname === "/mechanics/free-body-diagrams" || location.pathname === "/measurement/uncertainty" || location.pathname === "/measurement/mass-time" || location.pathname === "/measurement/spherometer" || location.pathname === "/measurement/micrometer" || location.pathname === "/measurement/vernier-caliper" || location.pathname === "/measurement/meter-scale" || location.pathname === "/string-theory" || location.pathname === "/graph" || location.pathname === "/roadmap" || location.pathname === "/experiments" || ((location.pathname === "/comparison" || location.pathname === "/quiz") && !location.search) || location.pathname.startsWith("/concept-studio");
  const isQuietSurface = isDedicatedStudio || location.pathname === "/";

  useEffect(() => {
    sendStatement("launched", window.location.pathname);
    initXAPISync();
    localStorage.removeItem("physicslab-theme-preset-v1");
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
    root.removeAttribute("data-theme-preset");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#050c18" : "#f8fafc");
  }, [theme]);

  /* Cursor-reactive ambient light — updates CSS custom properties at 60fps */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (cursorRafRef.current !== null) return;
      cursorRafRef.current = requestAnimationFrame(() => {
        document.body.style.setProperty("--cursor-x", `${e.clientX}px`);
        document.body.style.setProperty("--cursor-y", `${e.clientY}px`);
        cursorRafRef.current = null;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (cursorRafRef.current !== null) cancelAnimationFrame(cursorRafRef.current);
    };
  }, []);

  const classes = [
    theme === "dark" ? "dark" : "",
    accessibility.highContrast ? "high-contrast" : "",
    accessibility.largeUi ? "large-ui" : "",
    accessibility.colorBlindSafe ? "color-blind-safe" : "",
    accessibility.reducedMotion ? "reduced-motion" : "",
  ].join(" ");

  return (
    <div className={classes}>
      {!isQuietSurface && <SplashLoader />}
      {!isQuietSurface && <ParticleConstellation />}
      {!isQuietSurface && <CursorTrail />}
      <AchievementSystem />
      {!isQuietSurface && <AmbientAudio />}
      <ToastProvider>
        <a href="#content" className="skip-link">Skip to content</a>
        <main className="app-shell min-h-screen" style={{ position: "relative", zIndex: 1 }}>
          {!online && (
            <div className="bg-warning-500 px-4 py-2 text-center text-sm font-semibold text-space-900">
              {t("offline")}
            </div>
          )}
          <div key={location.pathname} className="route-fade">
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/client-demos" element={<ClientDemosPage />} />
              <Route path="/all-modules" element={<AppDirectoryPage />} />
              <Route path="/motion/circular-motion" element={<Suspense fallback={<div>Loading circular motion…</div>}><CircularStudioPage /></Suspense>} />
              <Route path="/motion/first-law-inertia" element={<Suspense fallback={<div>Loading inertia…</div>}><InertiaStudioPage /></Suspense>} />
              <Route path="/motion/second-law-fma" element={<Suspense fallback={<div>Loading second law…</div>}><SecondLawStudioPage /></Suspense>} />
              <Route path="/motion/third-law-pairs" element={<Suspense fallback={<div>Loading third law…</div>}><ThirdLawStudioPage /></Suspense>} />
              <Route path="/motion/friction" element={<Suspense fallback={<div>Loading friction…</div>}><FrictionStudioPage /></Suspense>} />
              <Route path="/motion/tension-normal" element={<Suspense fallback={<div>Loading tension…</div>}><TensionNormalStudioPage /></Suspense>} />
              <Route path="/thermodynamics/first-law" element={<Suspense fallback={<div>Loading first law…</div>}><FirstLawStudioPage /></Suspense>} />
              <Route path="/thermodynamics/entropy" element={<Suspense fallback={<div>Loading entropy…</div>}><EntropyStudioPage /></Suspense>} />
              <Route path="/thermodynamics/heat-engines" element={<Suspense fallback={<div>Loading heat engines…</div>}><HeatEnginesStudioPage /></Suspense>} />
              <Route path="/fluid-mechanics/density-pressure" element={<Suspense fallback={<div>Loading density pressure…</div>}><DensityPressureStudioPage /></Suspense>} />
              <Route path="/fluid-mechanics/hydrostatics" element={<Suspense fallback={<div>Loading hydrostatics…</div>}><HydrostaticsStudioPage /></Suspense>} />
              <Route path="/fluid-mechanics/buoyancy" element={<Suspense fallback={<div>Loading buoyancy…</div>}><BuoyancyStudioPage /></Suspense>} />
              <Route path="/fluid-mechanics/continuity" element={<Suspense fallback={<div>Loading continuity…</div>}><ContinuityStudioPage /></Suspense>} />
              <Route path="/fluid-mechanics/bernoulli" element={<Suspense fallback={<div>Loading Bernoulli…</div>}><BernoulliStudioPage /></Suspense>} />
              <Route path="/fluid-mechanics/viscosity" element={<Suspense fallback={<div>Loading viscosity…</div>}><ViscosityStudioPage /></Suspense>} />
              <Route path="/modern-physics/quantum-ideas" element={<Suspense fallback={<div>Loading quantum ideas…</div>}><QuantumIdeasStudioPage /></Suspense>} />
              <Route path="/modern-physics/photoelectric-effect" element={<Suspense fallback={<div>Loading photoelectric effect…</div>}><PhotoelectricStudioPage /></Suspense>} />
              <Route path="/modern-physics/matter-waves" element={<Suspense fallback={<div>Loading matter waves…</div>}><MatterWavesStudioPage /></Suspense>} />
              <Route path="/modern-physics/atomic-spectra" element={<Suspense fallback={<div>Loading atomic spectra…</div>}><AtomicSpectraStudioPage /></Suspense>} />
              <Route path="/modern-physics/nuclear-structure" element={<Suspense fallback={<div>Loading nuclear structure…</div>}><NuclearStructureStudioPage /></Suspense>} />
              <Route path="/modern-physics/radioactivity" element={<Suspense fallback={<div>Loading radioactivity…</div>}><RadioactivityStudioPage /></Suspense>} />
              <Route path="/astrophysics/solar-system" element={<Suspense fallback={<div>Loading solar system…</div>}><SolarSystemStudioPage /></Suspense>} />
              <Route path="/astrophysics/stellar-life" element={<Suspense fallback={<div>Loading stellar life…</div>}><StellarLifeStudioPage /></Suspense>} />
              <Route path="/astrophysics/spectroscopy" element={<Suspense fallback={<div>Loading spectroscopy…</div>}><SpectroscopyStudioPage /></Suspense>} />
              <Route path="/astrophysics/galaxies" element={<Suspense fallback={<div>Loading galaxies…</div>}><GalaxiesStudioPage /></Suspense>} />
              <Route path="/astrophysics/cosmology" element={<Suspense fallback={<div>Loading cosmology…</div>}><CosmologyStudioPage /></Suspense>} />
              <Route path="/astrophysics/exoplanets" element={<Suspense fallback={<div>Loading exoplanets…</div>}><ExoplanetsStudioPage /></Suspense>} />
              <Route path="/thermodynamics/gas-laws" element={<Suspense fallback={<div>Loading gas laws…</div>}><GasLawsStudioPage /></Suspense>} />
              <Route path="/thermodynamics/heat-transfer" element={<Suspense fallback={<div>Loading heat transfer…</div>}><HeatTransferStudioPage /></Suspense>} />
              <Route path="/thermodynamics/temperature" element={<Suspense fallback={<div>Loading temperature…</div>}><TemperatureStudioPage /></Suspense>} />
              <Route path="/electronics/sensors" element={<Suspense fallback={<div>Loading sensors…</div>}><SensorsStudioPage /></Suspense>} />
              <Route path="/electronics/logic-gates" element={<Suspense fallback={<div>Loading logic gates…</div>}><LogicGatesStudioPage /></Suspense>} />
              <Route path="/electronics/amplifiers" element={<Suspense fallback={<div>Loading amplifiers…</div>}><AmplifiersStudioPage /></Suspense>} />
              <Route path="/electronics/transistors" element={<Suspense fallback={<div>Loading transistors…</div>}><TransistorsStudioPage /></Suspense>} />
              <Route path="/electronics/diodes" element={<Suspense fallback={<div>Loading diodes…</div>}><DiodesStudioPage /></Suspense>} />
              <Route path="/electronics/semiconductors" element={<Suspense fallback={<div>Loading semiconductors…</div>}><SemiconductorsStudioPage /></Suspense>} />
              <Route path="/magnetism/electromagnets" element={<Suspense fallback={<div>Loading electromagnets…</div>}><ElectromagnetsStudioPage /></Suspense>} />
              <Route path="/magnetism/induction" element={<Suspense fallback={<div>Loading induction…</div>}><InductionStudioPage /></Suspense>} />
              <Route path="/magnetism/solenoids" element={<Suspense fallback={<div>Loading solenoid…</div>}><SolenoidStudioPage /></Suspense>} />
              <Route path="/magnetism/current-wire" element={<Suspense fallback={<div>Loading current wire…</div>}><CurrentWireStudioPage /></Suspense>} />
              <Route path="/magnetism/lorentz-force" element={<Suspense fallback={<div>Loading Lorentz force…</div>}><LorentzForceStudioPage /></Suspense>} />
              <Route path="/magnetism/field-lines" element={<Suspense fallback={<div>Loading magnetic field lines…</div>}><MagneticFieldLinesStudioPage /></Suspense>} />
              <Route path="/electricity/capacitors" element={<Suspense fallback={<div>Loading capacitors…</div>}><CapacitorsStudioPage /></Suspense>} />
              <Route path="/electricity/circuits" element={<Suspense fallback={<div>Loading circuits…</div>}><CircuitsStudioPage /></Suspense>} />
              <Route path="/electricity/current" element={<Suspense fallback={<div>Loading electric current…</div>}><CurrentStudioPage /></Suspense>} />
              <Route path="/electricity/electric-potential" element={<Suspense fallback={<div>Loading electric potential…</div>}><ElectricPotentialStudioPage /></Suspense>} />
              <Route path="/electricity/electric-field" element={<Suspense fallback={<div>Loading electric field…</div>}><ElectricFieldStudioPage /></Suspense>} />
              <Route path="/electricity/coulomb-force" element={<Suspense fallback={<div>Loading Coulomb force…</div>}><CoulombForceStudioPage /></Suspense>} />
              <Route path="/optics/diffraction" element={<Suspense fallback={<div>Loading diffraction…</div>}><DiffractionStudioPage /></Suspense>} />
              <Route path="/optics/interference" element={<Suspense fallback={<div>Loading optics interference…</div>}><OpticsInterferenceStudioPage /></Suspense>} />
              <Route path="/optics/mirrors" element={<Suspense fallback={<div>Loading mirrors…</div>}><MirrorsStudioPage /></Suspense>} />
              <Route path="/optics/lenses" element={<Suspense fallback={<div>Loading lenses…</div>}><LensesStudioPage /></Suspense>} />
              <Route path="/optics/refraction" element={<Suspense fallback={<div>Loading refraction…</div>}><RefractionStudioPage /></Suspense>} />
              <Route path="/optics/reflection" element={<Suspense fallback={<div>Loading reflection…</div>}><ReflectionStudioPage /></Suspense>} />
              <Route path="/motion/doppler-effect" element={<Suspense fallback={<div>Loading Doppler effect…</div>}><DopplerEffectStudioPage /></Suspense>} />
              <Route path="/motion/sound-spectrum" element={<Suspense fallback={<div>Loading sound spectrum…</div>}><SoundSpectrumStudioPage /></Suspense>} />
              <Route path="/motion/standing-waves" element={<Suspense fallback={<div>Loading standing waves…</div>}><StandingWavesStudioPage /></Suspense>} />
              <Route path="/motion/interference" element={<Suspense fallback={<div>Loading interference…</div>}><InterferenceStudioPage /></Suspense>} />
              <Route path="/motion/superposition" element={<Suspense fallback={<div>Loading superposition…</div>}><SuperpositionStudioPage /></Suspense>} />
              <Route path="/motion/wave-properties" element={<Suspense fallback={<div>Loading wave properties…</div>}><WavePropertiesStudioPage /></Suspense>} />
              <Route path="/motion/coupled-oscillators" element={<Suspense fallback={<div>Loading coupled oscillators…</div>}><CoupledOscillatorsStudioPage /></Suspense>} />
              <Route path="/motion/resonance" element={<Suspense fallback={<div>Loading resonance…</div>}><ResonanceStudioPage /></Suspense>} />
              <Route path="/motion/damping" element={<Suspense fallback={<div>Loading damping…</div>}><DampingStudioPage /></Suspense>} />
              <Route path="/motion/energy-exchange" element={<Suspense fallback={<div>Loading energy exchange…</div>}><EnergyExchangeStudioPage /></Suspense>} />
              <Route path="/motion/pendulum" element={<Suspense fallback={<div>Loading pendulum…</div>}><PendulumStudioPage /></Suspense>} />
              <Route path="/motion/spring-shm" element={<Suspense fallback={<div>Loading spring SHM…</div>}><SpringShmStudioPage /></Suspense>} />
              <Route path="/motion/keplers-laws" element={<Suspense fallback={<div>Loading Kepler laws…</div>}><KeplersLawsStudioPage /></Suspense>} />
              <Route path="/motion/escape-velocity" element={<Suspense fallback={<div>Loading escape velocity…</div>}><EscapeVelocityStudioPage /></Suspense>} />
              <Route path="/motion/orbits" element={<Suspense fallback={<div>Loading orbits…</div>}><OrbitsStudioPage /></Suspense>} />
              <Route path="/motion/gravitational-potential" element={<Suspense fallback={<div>Loading gravitational potential…</div>}><GravitationalPotentialStudioPage /></Suspense>} />
              <Route path="/motion/gravitational-field" element={<Suspense fallback={<div>Loading gravitational field…</div>}><GravitationalFieldStudioPage /></Suspense>} />
              <Route path="/motion/universal-gravity" element={<Suspense fallback={<div>Loading gravitation…</div>}><UniversalGravityStudioPage /></Suspense>} />
              <Route path="/motion/efficiency" element={<Suspense fallback={<div>Loading efficiency…</div>}><EfficiencyStudioPage /></Suspense>} />
              <Route path="/motion/power" element={<Suspense fallback={<div>Loading power…</div>}><PowerStudioPage /></Suspense>} />
              <Route path="/motion/conservation-energy" element={<Suspense fallback={<div>Loading conservation…</div>}><ConservationEnergyStudioPage /></Suspense>} />
              <Route path="/motion/potential-energy" element={<Suspense fallback={<div>Loading potential energy…</div>}><PotentialEnergyStudioPage /></Suspense>} />
              <Route path="/motion/kinetic-energy" element={<Suspense fallback={<div>Loading kinetic energy…</div>}><KineticEnergyStudioPage /></Suspense>} />
              <Route path="/motion/work" element={<Suspense fallback={<div>Loading work…</div>}><WorkStudioPage /></Suspense>} />
              <Route path="/motion/multi-force-challenge" element={<Suspense fallback={<div>Loading challenge…</div>}><MultiForceStudioPage /></Suspense>} />
              <Route path="/motion/relative-motion" element={<Suspense fallback={<div>Loading relative motion…</div>}><RelativeMotionPage /></Suspense>} />
              <Route path="/motion/projectile-motion" element={<Suspense fallback={<div>Loading projectile studio…</div>}><ProjectileStudioPage /></Suspense>} />
              <Route path="/motion/acceleration-time" element={<Suspense fallback={<div>Loading acceleration studio…</div>}><AccelerationTimePage /></Suspense>} />
              <Route path="/motion/velocity-time" element={<Suspense fallback={<div>Loading motion studio…</div>}><VelocityTimePage /></Suspense>} />
              <Route path="/motion/position-time" element={<Suspense fallback={<div>Loading position and time…</div>}><PositionTimePage /></Suspense>} />
              <Route path="/mechanics/momentum-collisions" element={<Suspense fallback={<div>Loading momentum and collisions…</div>}><MomentumCollisionsPage /></Suspense>} />
              <Route path="/mechanics/equilibrium-com" element={<Suspense fallback={<div>Loading equilibrium and centre of mass…</div>}><EquilibriumComPage /></Suspense>} />
              <Route path="/mechanics/torque-levers" element={<Suspense fallback={<div>Loading torque and levers…</div>}><TorqueLeversPage /></Suspense>} />
              <Route path="/mechanics/pulley-systems" element={<Suspense fallback={<div>Loading pulley systems…</div>}><AtwoodPage /></Suspense>} />
              <Route path="/mechanics/inclined-plane" element={<Suspense fallback={<div>Loading inclined plane…</div>}><InclineStudioPage /></Suspense>} />
          <Route path="/mechanics/free-body-diagrams" element={<Suspense fallback={<div>Loading free-body diagrams…</div>}><FreeBodyPage /></Suspense>} />
              <Route path="/measurement/uncertainty" element={<Suspense fallback={<div>Loading uncertainty analysis…</div>}><UncertaintyPage /></Suspense>} />
              <Route path="/measurement/mass-time" element={<Suspense fallback={<div>Loading mass and time…</div>}><MassTimePage /></Suspense>} />
              <Route path="/measurement/spherometer" element={<Suspense fallback={<div>Loading spherometer…</div>}><SpherometerPage /></Suspense>} />
              <Route path="/measurement/micrometer" element={<Suspense fallback={<div>Loading micrometer…</div>}><MicrometerPage /></Suspense>} />
              <Route path="/measurement/vernier-caliper" element={<Suspense fallback={<div>Loading vernier caliper…</div>}><VernierCaliperPage /></Suspense>} />
              <Route path="/measurement/meter-scale" element={<Suspense fallback={<div>Loading meter scale…</div>}><MeterScalePage /></Suspense>} />
              <Route path="/concept-studio" element={<ConceptExperiencesPage />} />
              <Route path="/concept-studio/:conceptId" element={<ConceptExperiencesPage />} />
              <Route path="/lab" element={<WorkspacePage mode="guided" />} />
              <Route path="/pro-lab" element={<ProLabProgramPage />} />
              <Route path="/pro-lab/launch-vehicle" element={<ProLabPage />} />
              <Route path="/rocket-lab/parts" element={<Suspense fallback={<div className="min-h-screen bg-space-950 p-10 text-space-100">Loading Rocket Parts engineering reference…</div>}><RocketPartsPage /></Suspense>} />
              <Route path="/rocket-lab/parts/:partId" element={<Suspense fallback={<div className="min-h-screen bg-space-950 p-10 text-space-100">Loading component workspace…</div>}><RocketPartsPage /></Suspense>} />
              <Route path="/sandbox" element={<WorkspacePage mode="sandbox" />} />
              <Route path="/experiments" element={<ExperimentsPage />} />
              <Route path="/experiments/:id" element={<RouteErrorBoundary><ExperimentDetailPage /></RouteErrorBoundary>} />
              <Route path="/syllabus" element={<SyllabusPage />} />
              <Route path="/concepts" element={<ConceptsPage />} />
              <Route path="/modules" element={<PhysicsModulesPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/solver" element={<SolverPage />} />
              <Route path="/formulas" element={<FormulasPage />} />
              <Route path="/formulas/revision-grid" element={<FormulaRevisionGridPage />} />
              <Route path="/dictionary" element={<DictionaryPage />} />
              <Route path="/astrophysics" element={<AstroPhysicsPage />} />
              <Route path="/particle-physics" element={<ParticlePhysicsPage />} />
              <Route path="/particle-physics/:conceptId" element={<ParticlePhysicsPage />} />
              <Route path="/atmosphere" element={<AtmospherePage />} />
              <Route path="/string-theory" element={<StringTheoryPage />} />
              <Route path="/physics-innovations" element={<PhysicsInnovationsPage />} />
              <Route path="/physics/scale-of-universe" element={<ScaleOfUniversePage />} />
              <Route path="/comparison" element={<ComparisonPage />} />
              <Route path="/quality-audit" element={<QualityAuditPage />} />
              <Route path="/accuracy-center" element={<AccuracyCenterPage />} />
              <Route path="/learning-studio" element={<LearningStudioPage />} />
              <Route path="/simulation-depth" element={<SimulationDepthPage />} />
              <Route path="/classroom-deployment" element={<ClassroomDeploymentPage />} />
              <Route path="/accessibility-center" element={<AccessibilityCenterPage />} />
              <Route path="/insights-center" element={<InsightsCenterPage />} />
              <Route path="/release-governance" element={<ReleaseGovernancePage />} />
              <Route path="/excellence-benchmark" element={<ExcellenceBenchmarkPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/video" element={<VideoAnalysisPage />} />
              <Route path="/quantum" element={<QuantumPage />} />
              <Route path="/teacher" element={<TeacherPage />} />
              <Route path="/lms-config" element={<LMSConfigPage />} />
              <Route path="/topics" element={<Navigate to="/topics/mechanics" replace />} />
              {topics.map((topic) => (
                <Route key={topic} path={`/topics/${topic}`} element={<TopicPage topic={topic} />} />
              ))}
              <Route path="/graphs" element={<GraphsPage />} />
              <Route path="/graph" element={<KnowledgeGraphPage />} />
              <Route path="/projects" element={<SimplePage title="Projects" showProjects />} />
              <Route path="/settings" element={<SimplePage title="Settings" />} />
              <Route path="/backup" element={<SimplePage title="Backup" />} />
              <Route path="/help" element={<SimplePage title="Help" />} />
              <Route path="/trust" element={<SimplePage title="Scientific Trust" />} />
              <Route path="/privacy" element={<SimplePage title="Privacy" />} />
              <Route path="/terms" element={<SimplePage title="Terms" />} />
            </Routes>
          </div>
          {!isQuietSurface && <AppFooter />}
        </main>
      </ToastProvider>
    </div>
  );
}

class RouteErrorBoundary extends Component<{ children: ReactNode }, { message: string | null }> {
  state = { message: null };

  static getDerivedStateFromError(error: unknown) {
    return { message: error instanceof Error ? error.message : "This lab view could not render." };
  }

  render() {
    if (this.state.message) {
      return (
        <section className="mx-auto max-w-3xl p-6">
          <div className="panel border-warning-400/60 p-5">
            <p className="ui-label text-warning-300">Lab view recovered</p>
            <h1 className="mt-2 text-2xl font-black">This experiment needs a refresh</h1>
            <p className="mt-2 text-sm text-space-200">{this.state.message}</p>
            <a className="hero-btn-secondary mt-4 inline-flex" href="/experiments">Back to experiments</a>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}





















































