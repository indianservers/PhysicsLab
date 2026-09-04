import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = fileURLToPath(new URL("./", import.meta.url));
const data = JSON.parse(await fs.readFile(new URL("./lesson_data.json", import.meta.url), "utf8"));
const workbook = Workbook.create();
const summary = workbook.worksheets.add("Summary");
const lessonsSheet = workbook.worksheets.add("All Lessons");
const curriculumSheet = workbook.worksheets.add("Curriculum Map");
const mapSheet = workbook.worksheets.add("Lesson-Topic Map");

const navy = "#14213D";
const blue = "#1D4ED8";
const paleBlue = "#EAF2FF";
const paleGold = "#FFF4D6";
const gold = "#F59E0B";
const ink = "#1F2937";
const muted = "#64748B";
const line = "#DCE3EC";

function join(items) {
  return Array.isArray(items) ? items.join(" • ") : (items ?? "");
}

const sortedLessonProfiles = data.lessonProfiles
  .slice()
  .sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
const numericIdByCode = new Map(sortedLessonProfiles.map((item, index) => [item.lessonId, index + 1]));

function addTitle(sheet, title, subtitle, lastCol) {
  sheet.getRange(`A1:${lastCol}1`).merge();
  sheet.getRange("A1").values = [[title]];
  sheet.getRange(`A2:${lastCol}2`).merge();
  sheet.getRange("A2").values = [[subtitle]];
  sheet.getRange(`A1:${lastCol}1`).format = {
    fill: navy,
    font: { bold: true, color: "#FFFFFF", size: 18 },
    verticalAlignment: "center",
  };
  sheet.getRange(`A2:${lastCol}2`).format = {
    fill: paleBlue,
    font: { color: muted, italic: true, size: 10 },
    verticalAlignment: "center",
    wrapText: true,
  };
  sheet.getRange(`A1:${lastCol}1`).format.rowHeight = 32;
  sheet.getRange(`A2:${lastCol}2`).format.rowHeight = 30;
  sheet.showGridLines = false;
}

function styleTableSheet(sheet, headers, rows, lastCol, tableName) {
  addTitle(sheet, sheet.name, "Extracted from the Physics Simulator curriculum, experiment, and Learning Studio registries.", lastCol);
  const matrix = [headers, ...rows];
  sheet.getRangeByIndexes(3, 0, matrix.length, headers.length).values = matrix;
  const table = sheet.tables.add(`A4:${lastCol}${rows.length + 4}`, true, tableName);
  table.style = "TableStyleMedium2";
  table.showBandedRows = true;
  table.showFilterButton = true;
  sheet.getRange(`A4:${lastCol}4`).format = {
    fill: blue,
    font: { bold: true, color: "#FFFFFF" },
    wrapText: true,
    verticalAlignment: "center",
  };
  sheet.getRange(`A4:${lastCol}4`).format.rowHeight = 34;
  sheet.getRange(`A5:${lastCol}${rows.length + 4}`).format = {
    font: { color: ink, size: 9 },
    verticalAlignment: "top",
    wrapText: false,
  };
  sheet.getRange(`A4:${lastCol}${rows.length + 4}`).format.borders = {
    insideHorizontal: { style: "thin", color: line },
    bottom: { style: "thin", color: line },
  };
  sheet.freezePanes.freezeRows(4);
  sheet.freezePanes.freezeColumns(3);
}

const lessonHeaders = [
  "Lesson ID", "Category", "Subcategory / Unit", "Topic(s)", "Lesson", "Lesson Code", "Class Level", "Difficulty",
  "Curriculum Domain(s)", "Aim", "Theory", "Formulae", "Apparatus", "Expected Result",
  "Readiness", "Priority", "Lesson Question", "Success Evidence",
];
const lessonRows = sortedLessonProfiles.map((item, index) => [
    index + 1, item.category, join(item.mappedUnits) || "Unmapped", join(item.mappedTopics) || "Unmapped", item.title, item.lessonId,
    item.classLevel, item.difficulty, join(item.curriculumDomains), item.aim, item.theory, join(item.formulae),
    join(item.apparatus), item.expectedResult, item.readinessScore, item.priority, item.lessonQuestion, item.successEvidence,
  ]);
styleTableSheet(lessonsSheet, lessonHeaders, lessonRows, "R", "AllLessonsTable");
lessonsSheet.getRange(`A5:A${lessonRows.length + 4}`).format.numberFormat = "0";
lessonsSheet.getRange(`O5:O${lessonRows.length + 4}`).format.numberFormat = "0";
lessonsSheet.getRange(`O5:O${lessonRows.length + 4}`).conditionalFormats.add("colorScale", {
  colors: ["#FEE2E2", "#FEF3C7", "#DCFCE7"], thresholds: ["min", "50%", "max"],
});
const lessonWidths = [10, 18, 30, 34, 30, 26, 22, 12, 22, 44, 50, 40, 34, 48, 11, 22, 48, 48];
lessonWidths.forEach((width, index) => lessonsSheet.getRangeByIndexes(0, index, lessonRows.length + 4, 1).format.columnWidth = width);

const curriculumHeaders = [
  "Category / Domain", "Subcategory / Unit", "Topic", "Topic ID", "Class", "Grade", "Unit ID", "Marks",
  "Learning Stage", "Outcomes", "Tools", "Mapped Lessons", "Numeric Lesson IDs", "Lesson Codes", "Curriculum Source", "Class Description",
];
const curriculumRows = data.curriculumTopics
  .slice()
  .sort((a, b) => a.grade - b.grade || a.unitTitle.localeCompare(b.unitTitle) || a.topicTitle.localeCompare(b.topicTitle))
  .map((item) => {
    const names = item.experimentIds.map((id) => data.lessonProfiles.find((lesson) => lesson.lessonId === id)?.title ?? id);
    return [item.domain, item.unitTitle, item.topicTitle, item.topicId, item.classLabel, item.grade, item.unitId,
      item.unitMarks, item.stage, join(item.outcomes), join(item.tools), join(names) || "No mapped interactive lesson",
      join(item.experimentIds.map((id) => numericIdByCode.get(id))), join(item.experimentIds), item.curriculumSource, item.classDescription];
  });
styleTableSheet(curriculumSheet, curriculumHeaders, curriculumRows, "P", "CurriculumMapTable");
curriculumSheet.getRange(`F5:H${curriculumRows.length + 4}`).format.horizontalAlignment = "right";
const curriculumWidths = [20, 30, 32, 25, 16, 9, 28, 9, 15, 50, 36, 45, 20, 40, 34, 50];
curriculumWidths.forEach((width, index) => curriculumSheet.getRangeByIndexes(0, index, curriculumRows.length + 4, 1).format.columnWidth = width);

const mapHeaders = [
  "Lesson ID", "Category", "Subcategory / Unit", "Topic", "Lesson", "Class", "Grade", "Learning Stage", "Difficulty",
  "Lesson Code", "Topic ID", "Unit ID", "Readiness", "Priority", "Outcome(s)",
];
const mapRows = data.lessonMappings
  .slice()
  .sort((a, b) => a.grade - b.grade || a.domain.localeCompare(b.domain) || a.topicTitle.localeCompare(b.topicTitle) || a.lessonTitle.localeCompare(b.lessonTitle))
  .map((item) => [numericIdByCode.get(item.lessonId) ?? null, item.lessonCategory, item.unitTitle, item.topicTitle, item.lessonTitle, item.classLabel, item.grade,
    item.stage, item.difficulty, item.lessonId, item.topicId, item.unitId, item.readinessScore, item.priority, join(item.outcomes)]);
styleTableSheet(mapSheet, mapHeaders, mapRows, "O", "LessonTopicMapTable");
mapSheet.getRange(`A5:A${mapRows.length + 4}`).format.numberFormat = "0";
mapSheet.getRange(`M5:M${mapRows.length + 4}`).format.numberFormat = "0";
const mapWidths = [10, 19, 30, 30, 30, 16, 9, 15, 12, 27, 25, 28, 11, 22, 50];
mapWidths.forEach((width, index) => mapSheet.getRangeByIndexes(0, index, mapRows.length + 4, 1).format.columnWidth = width);

addTitle(summary, "Physics Simulator — Complete Lesson Inventory", "Workbook scope: all 80 unique interactive lessons with numeric IDs 1–80, the full curriculum hierarchy, and every lesson-to-topic mapping found in source.", "H");
summary.getRange("A4:H4").merge();
summary.getRange("A4").values = [["Inventory at a glance"]];
summary.getRange("A4:H4").format = { fill: gold, font: { bold: true, color: navy, size: 12 }, verticalAlignment: "center" };
summary.getRange("A4:H4").format.rowHeight = 25;
summary.getRange("A6:B6").values = [["Metric", "Value"]];
summary.getRange("A7:A11").values = [["Unique lessons"], ["Curriculum topics"], ["Lesson-topic rows"], ["Mapped lessons"], ["Unmapped lessons"]];
summary.getRange("B7:B11").formulas = [
  [`=COUNTA('All Lessons'!$E$5:$E$${lessonRows.length + 4})`],
  [`=COUNTA('Curriculum Map'!$C$5:$C$${curriculumRows.length + 4})`],
  [`=COUNTA('Lesson-Topic Map'!$D$5:$D$${mapRows.length + 4})`],
  [`=COUNTIF('All Lessons'!$D$5:$D$${lessonRows.length + 4},"<>Unmapped")`],
  [`=COUNTIF('All Lessons'!$D$5:$D$${lessonRows.length + 4},"Unmapped")`],
];
summary.getRange("D6:H6").values = [["Workbook guide", "Purpose", "Primary hierarchy", "Rows", "Notes"]];
summary.getRange("D7:H10").values = [
  ["All Lessons", "Unique lesson registry", "Category → Subcategory/Unit → Topic → Lesson", lessonRows.length, "Best sheet for a de-duplicated lesson list"],
  ["Curriculum Map", "Syllabus hierarchy", "Class → Unit → Topic → Mapped Lessons", curriculumRows.length, "Includes outcomes, tools, stage, and source"],
  ["Lesson-Topic Map", "Relational mapping", "Category → Unit → Topic → Lesson", mapRows.length, "One row per topic/lesson relationship"],
  ["Summary", "Counts and navigation", "Workbook-level", 1, "Formula-driven totals"],
];
summary.getRange("A6:B11").format.borders = { preset: "all", style: "thin", color: line };
summary.getRange("D6:H10").format.borders = { preset: "all", style: "thin", color: line };
summary.getRange("A6:B6").format = { fill: blue, font: { bold: true, color: "#FFFFFF" } };
summary.getRange("D6:H6").format = { fill: blue, font: { bold: true, color: "#FFFFFF" }, wrapText: true };
summary.getRange("B7:B11").format = { fill: paleGold, font: { bold: true, color: navy, size: 14 }, numberFormat: "0", horizontalAlignment: "right" };
summary.getRange("A13:H13").merge();
summary.getRange("A13").values = [["Definition used: “lesson” means a unique interactive experiment/learning profile. Curriculum topics without an interactive lesson remain visible in Curriculum Map."]];
summary.getRange("A13:H13").format = { fill: paleBlue, font: { color: muted, italic: true }, wrapText: true };
summary.getRange("A13:H13").format.rowHeight = 32;
summary.getRange("A1:H13").format.font.name = "Aptos";
summary.getRange("A1:A13").format.columnWidth = 24;
summary.getRange("B1:B13").format.columnWidth = 15;
summary.getRange("C1:C13").format.columnWidth = 4;
summary.getRange("D1:D13").format.columnWidth = 21;
summary.getRange("E1:E13").format.columnWidth = 28;
summary.getRange("F1:F13").format.columnWidth = 40;
summary.getRange("G1:G13").format.columnWidth = 12;
summary.getRange("H1:H13").format.columnWidth = 38;
summary.freezePanes.freezeRows(2);

for (const sheet of [lessonsSheet, curriculumSheet, mapSheet]) {
  sheet.getUsedRange().format.font.name = "Aptos";
}

const checks = [];
checks.push((await workbook.inspect({ kind: "table", range: "Summary!A1:H13", include: "values,formulas", tableMaxRows: 15, tableMaxCols: 8 })).ndjson);
checks.push((await workbook.inspect({ kind: "table", range: "All Lessons!A1:R10", include: "values,formulas", tableMaxRows: 10, tableMaxCols: 18 })).ndjson);
checks.push((await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 100 }, summary: "final formula error scan" })).ndjson);

for (const [sheetName, range, fileName] of [
  ["Summary", "A1:H13", "preview-summary.png"],
  ["All Lessons", "A1:R24", "preview-lessons.png"],
  ["Curriculum Map", "A1:P24", "preview-curriculum.png"],
  ["Lesson-Topic Map", "A1:O24", "preview-map.png"],
]) {
  const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  await fs.writeFile(new URL(`./${fileName}`, import.meta.url), new Uint8Array(await preview.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(workbook);
const outputPath = fileURLToPath(new URL("./physics_simulator_all_lessons.xlsx", import.meta.url));
await output.save(outputPath);
console.log(JSON.stringify({ output: outputPath, checks }, null, 2));
