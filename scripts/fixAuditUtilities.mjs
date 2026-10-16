import { readFile,writeFile } from 'node:fs/promises';
async function edit(file,pairs,prefix=''){let text=(await readFile(file,'utf8')).replaceAll('\r\n','\n');for(const [old,next]of pairs){if(!text.includes(old)){if(text.includes(next))continue;throw new Error(`${file}: missing ${old.slice(0,70)}`);}text=text.replaceAll(old,next);}await writeFile(file,text.startsWith(prefix)?text:prefix+text);}
const labels={QualityAuditPage:{risk:'Risk filter',category:'Physics category'},AccuracyCenterPage:{mode:'Model evidence filter'},LearningStudioPage:{focus:'Learning focus',category:'Physics category'},SimulationDepthPage:{tier:'Simulation depth',category:'Physics category'},ClassroomDeploymentPage:{tier:'Classroom readiness',category:'Physics category'},AccessibilityCenterPage:{tier:'Accessibility tier',category:'Physics category'},InsightsCenterPage:{urgency:'Intervention urgency',focus:'Intervention focus'},ReleaseGovernancePage:{gate:'Release gate'}};
for(const [file,fields]of Object.entries(labels)){const name=`src/pages/${file}.tsx`;let text=await readFile(name,'utf8');for(const [field,label]of Object.entries(fields))if(!text.includes(`aria-label="${label}"`))text=text.replace(new RegExp(`<select([^>]*?)value=\\{${field}\\}`,'g'),`<select aria-label="${label}"$1value={${field}}`);await writeFile(name,text);}
if(!(await readFile('src/pages/FormulasPage.tsx','utf8')).includes('aria-label={variable.label}'))await edit('src/pages/FormulasPage.tsx', [['type="range"','aria-label={variable.label} type="range"']]);
await edit('src/pages/WorkspacePage.tsx', [['<main\n','<main id="content" tabIndex={-1}\n']]);
await edit('src/pages/VideoAnalysisPage.tsx', [['<div className="grid min-h-0 flex-1','<div id="content" tabIndex={-1} className="grid min-h-0 flex-1']]);
await edit('src/pages/LMSConfigPage.tsx', [['<main className=','<main id="content" tabIndex={-1} className=']]);
await edit('src/i18n/index.ts', [['localStorage.getItem','safeStorage.getItem']], 'import { safeStorage } from "../lib/safeStorage";\n');
await edit('src/pages/QuizPage.tsx', [
 ['const bestScoreKey = "physicslab-quiz-best-v1";', 'const bestScoreKey = "physicslab-quiz-best-percent-v1";'],
 ['localStorage.', 'safeStorage.'],
 ['const [bestScore, setBestScore] = useState(() => Number(safeStorage.getItem(bestScoreKey) ?? 0));','const [bestScore, setBestScore] = useState(() => Math.max(0, Math.min(100, Number(safeStorage.getItem(bestScoreKey)) || 0)));'],
 ['const session = useMemo(() => makeQuizSession', 'const sessionWeakConcepts = useMemo(() => weakConceptList.map(item => item.tag), [categoryId, subcategoryId, difficulty, classFilter, runSeed, focusTag]);\n  const session = useMemo(() => makeQuizSession'],
 ['weakConceptList.map((item) => item.tag)', 'sessionWeakConcepts'],
 ['runSeed, weakConceptList]);','runSeed, sessionWeakConcepts]);'],
 ['const answeredCount = Object.keys(answers).length;', 'const answeredCount = session.filter(question => answers[question.id] !== undefined).length;'],
 ['const isComplete = answeredCount === session.length;', 'const isComplete = session.length > 0 && answeredCount === session.length;\n  const percentage = session.length ? Math.round(score / session.length * 100) : 0;'],
 ['Math.round((answeredCount / quizStats.sessionSize) * 100)', 'session.length ? Math.round((answeredCount / session.length) * 100) : 0'],
 ['    setElapsed(0);','    setElapsed(0);\n    quizStreakRef.current = 0;\n    setAnimatingOption(null);\n    window.clearTimeout(animationTimerRef.current);'],
 ['}, [categoryId, subcategoryId, difficulty, classFilter, runSeed]);','}, [categoryId, subcategoryId, difficulty, classFilter, runSeed, focusTag]);'],
 ['score <= bestScore', 'percentage <= bestScore'], ['setBestScore(score)', 'setBestScore(percentage)'], ['String(score)', 'String(percentage)'], ['[bestScore, isComplete, score]', '[bestScore, isComplete, percentage]'],
 ['const quizStreakRef = useRef(0);','const quizStreakRef = useRef(0);\n  const animationTimerRef = useRef<number>();\n  useEffect(() => () => window.clearTimeout(animationTimerRef.current), []);'],
 ['window.setTimeout(() => setAnimatingOption(null), 600);','window.clearTimeout(animationTimerRef.current);\n    animationTimerRef.current = window.setTimeout(() => setAnimatingOption(null), 600);'],
 ['value={quizStats.sessionSize}', 'value={session.length}'], ['Best {bestScore}/12','Best {bestScore}%'], ['${quizStats.sessionSize}', '${session.length}'], ['of {quizStats.sessionSize}','of {session.length}'], ['{score}/{quizStats.sessionSize}', '{score}/{session.length}']
], 'import { safeStorage } from "../lib/safeStorage";\n');
await edit('src/lib/quiz.ts', [['const relaxedPool = strictPool.length >= quizStats.sessionSize ? strictPool : getQuizQuestions({ ...filters, subcategoryId: "all" });\n  const finalPool = relaxedPool.length >= quizStats.sessionSize ? relaxedPool : quizQuestions;','const finalPool = strictPool;']]);
await edit('src/pages/ExperimentDetailPage.tsx', [['<VirtualLabEnhancements experiment={experiment} />','<VirtualLabEnhancements key={experiment.id} experiment={experiment} />']]);
