import { ExperimentDefinition } from "../types";

export interface GuideContent {
  title: string;
  intent: string;
  steps: string[];
  checks?: string[];
  tips?: string[];
}

export function guideForExperiment(experiment: ExperimentDefinition): GuideContent {
  const formula = experiment.formulae[0];
  return {
    title: `${experiment.title} guide`,
    intent: experiment.aim,
    steps: [
      `Start with the concept: ${trimSentence(experiment.theory)}`,
      `Set up the apparatus: ${experiment.apparatus.slice(0, 5).join(", ")}.`,
      ...experiment.procedure.slice(0, 4),
      "Change only one variable at a time and watch the visualization, calculator, and output cards together.",
      `Record at least three trials using: ${experiment.observationColumns.slice(0, 5).join(", ")}.`,
      `Finish by checking whether your result matches: ${trimSentence(experiment.expectedResult)}`,
    ],
    checks: [
      formula ? `Formula focus: ${formula.name} (${formula.expression}).` : "Formula focus: identify the relationship between input and output variables.",
      "Before marking the lab done, write a prediction, one observation, and a conclusion in the notebook.",
      "Use the quiz and viva questions to confirm the idea in words, not only by numbers.",
    ],
    tips: experiment.commonMistakes.slice(0, 3),
  };
}

export function guideForLearningStage(stage: string): GuideContent {
  const guides: Record<string, GuideContent> = {
    concept: {
      title: "Concept guide",
      intent: "Build the mental model before touching the sliders.",
      steps: ["Read the theory in one pass.", "Name the quantities that can change.", "Write the formula in your own words.", "Predict which output should increase or decrease."],
      checks: ["You should be able to explain the aim without reading it word-for-word."],
    },
    predict: {
      title: "Prediction guide",
      intent: "Make a testable claim before running the experiment.",
      steps: ["Choose one variable to change.", "Predict the direction of change.", "Mention which quantity you will keep constant.", "Write the reason using a formula or physical idea."],
      checks: ["A good prediction can be proven wrong by the data."],
    },
    experiment: {
      title: "Experiment guide",
      intent: "Run a controlled investigation.",
      steps: ["Follow the procedure in order.", "Move one control at a time.", "Pause after each change and read the output.", "Repeat until you have a clear pattern."],
      checks: ["Avoid changing several inputs at once unless the task asks for comparison."],
    },
    record: {
      title: "Notebook guide",
      intent: "Turn observations into usable evidence.",
      steps: ["Add trial values with units.", "Keep significant figures consistent.", "Note any unexpected result.", "Compare measured and expected values."],
      checks: ["A notebook entry should let someone else repeat the trial."],
    },
    quiz: {
      title: "Assessment guide",
      intent: "Check whether the concept is understood, not memorized.",
      steps: ["Answer without looking first.", "Reopen the visualization for any missed idea.", "Correct the notebook conclusion if the quiz reveals a gap."],
      checks: ["If two options look similar, compare their units or cause-effect direction."],
    },
    mastered: {
      title: "Mastery guide",
      intent: "Make the learning portable to a new problem.",
      steps: ["Explain the lab in three sentences.", "State the main formula and assumptions.", "Describe one real-world example.", "Export the portfolio if this is for submission."],
      checks: ["Mastery means you can use the idea outside this exact screen."],
    },
  };
  return guides[stage] ?? guides.concept;
}

export function guideForTool(tool: string): GuideContent {
  const lower = tool.toLowerCase();
  if (lower.includes("graph") || lower.includes("plot")) {
    return {
      title: `${tool} guide`,
      intent: "Use the graph to see the relationship, slope, area, and trend.",
      steps: ["Choose the x-variable and y-variable.", "Run or update the experiment.", "Look for straight-line, curve, or oscillating behavior.", "Use slope or area only when the graph meaning supports it."],
      checks: ["Always read axis labels and units before interpreting the graph."],
    };
  }
  if (lower.includes("quiz") || lower.includes("assessment")) {
    return {
      title: `${tool} guide`,
      intent: "Use assessment to close the learning loop.",
      steps: ["Attempt after prediction and observation.", "Use wrong answers to locate the weak concept.", "Revise the conclusion before marking mastery."],
      checks: ["A quiz score is evidence, not the whole learning record."],
    };
  }
  if (lower.includes("notebook") || lower.includes("record")) {
    return {
      title: `${tool} guide`,
      intent: "Capture evidence while it is fresh.",
      steps: ["Write the prediction first.", "Record readings with units.", "Add one observation about pattern or anomaly.", "Finish with a conclusion tied to the aim."],
      checks: ["Do not leave unit columns blank."],
    };
  }
  if (lower.includes("ray") || lower.includes("mirror") || lower.includes("lens") || lower.includes("prism")) {
    return {
      title: `${tool} guide`,
      intent: "Trace light paths and compare geometry with image formation.",
      steps: ["Set the object or incoming ray.", "Adjust angle, focal length, or refractive index.", "Follow incident, reflected, and refracted rays.", "Compare image position with formula predictions."],
      checks: ["Measure optical angles from the normal unless the activity states otherwise."],
    };
  }
  if (lower.includes("circuit") || lower.includes("battery") || lower.includes("voltmeter") || lower.includes("ammeter") || lower.includes("resistor")) {
    return {
      title: `${tool} guide`,
      intent: "Connect circuit variables to current, voltage, resistance, and power.",
      steps: ["Close the circuit path.", "Choose one resistance or voltage change.", "Read current and voltage together.", "Compare readings with Ohm's law or power formula."],
      checks: ["Ammeter is read in series; voltmeter is read across a component."],
    };
  }
  if (lower.includes("wave") || lower.includes("sound") || lower.includes("frequency")) {
    return {
      title: `${tool} guide`,
      intent: "Relate frequency, amplitude, wavelength, and speed.",
      steps: ["Set frequency first.", "Change amplitude separately.", "Compare wavelength spacing.", "Use v = f lambda to connect the pattern to numbers."],
      checks: ["Frequency changes pitch; amplitude changes loudness or intensity."],
    };
  }
  if (lower.includes("magnet") || lower.includes("compass") || lower.includes("coil")) {
    return {
      title: `${tool} guide`,
      intent: "Use field direction and strength to explain magnetic effects.",
      steps: ["Place the source magnet or coil.", "Change current, turns, or distance.", "Watch field direction.", "Use the right-hand rule where current is involved."],
      checks: ["Reversing current reverses magnetic polarity."],
    };
  }
  if (lower.includes("thermo") || lower.includes("heat") || lower.includes("temperature")) {
    return {
      title: `${tool} guide`,
      intent: "Distinguish thermal state from energy transfer.",
      steps: ["Set the temperature or heat input.", "Choose mass/material/process.", "Watch how the state variable changes.", "Compare heat, temperature, and rate carefully."],
      checks: ["Heat and temperature are related but not the same quantity."],
    };
  }
  if (lower.includes("fluid") || lower.includes("pressure") || lower.includes("water")) {
    return {
      title: `${tool} guide`,
      intent: "Connect pressure, depth, density, buoyancy, and flow.",
      steps: ["Set depth or flow speed.", "Change density or area.", "Read pressure/force output.", "Compare with P = rho gh or Bernoulli terms."],
      checks: ["Use SI units before substituting into formulae."],
    };
  }
  return {
    title: `${tool} guide`,
    intent: "Use this tool to connect a visible change with a measured physics quantity.",
    steps: ["Read what the tool measures or changes.", "Adjust one input.", "Observe the output and graph.", "Record the value with units.", "Explain the pattern in one sentence."],
    checks: ["If the result looks wrong, check units, range, and which variable was changed."],
  };
}

export const teacherGuide: GuideContent = {
  title: "Teacher tools guide",
  intent: "Create a classroom-ready lab path with clear controls, evidence, and assessment.",
  steps: ["Choose the class first.", "Select the topic and mapped experiment.", "Write instructions that name the required variables and evidence.", "Decide whether variables, notebook, and quiz are required.", "Save, open, or copy the assignment link."],
  checks: ["Use export all before moving assignment packs to another browser or device.", "Preview the assignment link once before sharing."],
};

export const workspaceGuide: GuideContent = {
  title: "Lab workspace guide",
  intent: "Build or inspect a simulation with objects, instruments, live graphs, and measurements.",
  steps: ["Add objects from the library or drag them onto the canvas.", "Use Play, Pause, Step, and Speed to control time.", "Select an object to edit properties.", "Use instruments and graph traces to collect evidence.", "Export data or save the lab when the model is ready."],
  checks: ["Keep SI units consistent.", "Pause before reading exact values.", "Use Reset only when you are ready to clear the current trial."],
};

export const graphGuide: GuideContent = {
  title: "Graphs and data guide",
  intent: "Turn simulation motion and sensor values into measurable evidence.",
  steps: ["Run the simulation until enough points are collected.", "Choose the x and y variables for the trace.", "Use cursor, slope, area, and fit readouts for analysis.", "Add uncertainty when comparing measured and expected values.", "Export CSV, JSON, or graph PNG for reports."],
  checks: ["A graph with too few points can be misleading.", "Slope and area have physical meaning only for some variable pairs."],
};

export const videoGuide: GuideContent = {
  title: "Video analysis guide",
  intent: "Extract position, velocity, and acceleration from a real or recorded motion clip.",
  steps: ["Load a browser-local video file.", "Calibrate using a known distance.", "Set the origin.", "Track the object frame by frame.", "Read position, velocity, and acceleration graphs.", "Export CSV for reporting."],
  checks: ["Calibrate before tracking.", "Use the correct FPS so time values are meaningful."],
};

export function guideForQuantumTool(name: "photoelectric" | "tunneling" | "bohr"): GuideContent {
  if (name === "photoelectric") {
    return {
      title: "Photoelectric guide",
      intent: "Compare photon energy with metal work function.",
      steps: ["Choose a metal.", "Increase frequency until emission begins.", "Change intensity and watch current.", "Compare maximum kinetic energy and stopping voltage."],
      checks: ["Intensity changes number of emitted electrons, but frequency controls whether emission starts."],
    };
  }
  if (name === "tunneling") {
    return {
      title: "Tunneling guide",
      intent: "Explore quantum transmission through a barrier.",
      steps: ["Set particle energy.", "Change barrier height and width.", "Compare transmission and reflection.", "Switch particle mass to see why tunneling is more visible for electrons."],
      checks: ["A wider or higher barrier usually reduces transmission."],
    };
  }
  return {
    title: "Bohr model guide",
    intent: "Connect electron transitions with emitted spectral lines.",
    steps: ["Choose or excite an energy level.", "Drop to a lower level.", "Read energy and wavelength.", "Locate visible transitions on the spectrum strip."],
    checks: ["Emission occurs when the electron drops to a lower energy level."],
  };
}

function trimSentence(value: string) {
  return value.trim().replace(/\.$/, ".");
}
