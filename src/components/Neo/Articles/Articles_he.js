  // src/components/Neo/Articles/Articles_he.js
  // Import images that live *inside* the component folder
  import imgProjectAI       from "./project-ai.jpg";
  import imgStudyMode       from "./study-mode.jpg";
  import imgDeepResearch    from "./deep-research.jpg";
  import imgAgentMode       from "./agent-mode.jpg";
  import imgConnectors      from "./connectors.jpg";
  import imgPrompting       from "./prompting.jpg";
  import imgPortfolio       from "./portfolio.jpg";
  import imgPairProgramming from "./pair-programming.jpg";

  // Simple in-app i18n with articles per locale
  export const locales = {
    en: {
      lang: "en",
      dir: "ltr",
      dateLocale: "en-GB",
      ui: {
        heroTitleTop: "Effortless AI integration",
        heroTitleAccent: "for business",
        heroSub: "No extra setup, just smart automation when you need it.",
        sectionTitle: "Featured AI Articles",
        sectionSub: "Short, practical reads for juniors and students working with AI.",
        openCta: "Open →",
        readCta: "Read full article",
        closeCta: "Close",
        readTimeSuffix: "min read",
        toggleLabel: "HE",
      },
      articles: [
        {
          id: 1,
          title: "Your First Real Project with AI: A Week-by-Week Playbook",
          excerpt:
            "Cut scope, ship fast, learn faster. A crisp 7-step playbook with starter prompts, test-first flow, and a tiny demo you can show.",
          tag: "Learning",
          readTime: 7,
          date: "2025-09-01",
          image: imgProjectAI,
          body: `
  Why it works: small scope → fast feedback → confidence.
  Steps:
  1) Define a 1-sentence outcome (who, what, success metric).
  2) Pick an S scope: one feature, one user flow, one data source.
  3) Plan with AI: ask for milestones, risks, and a file structure.
  4) Tests-first: ask AI to draft 3–5 acceptance checks you can run.
  5) Scaffold in small chunks; review diffs with “critique then improve”.
  6) Ship a demo: CLI or single-page UI; record a 30s screen capture.
  7) Debrief: what to keep, change, and drop next week.

  Starter prompts:
  • Planning — “You are a senior dev. Output milestones, risks, file tree, and a 2-hour plan for the next sprint.”
  • Tests — “List acceptance checks I can verify manually; include input, action, expected result.”
  • Refactor — “Suggest 3 refactors that reduce complexity without changing behavior.”

  Anti-patterns: vague tasks, huge context, long code generations. Keep each chat scoped to one feature.
          `.trim(),
        },
        {
          id: 2,
          title: "Study Mode, Supercharged: A Personal Learning Engine",
          excerpt:
            "Turn AI into your tutor: spaced repetition, micro-projects, weekly sprints, and automatic gap detection.",
          tag: "Study",
          readTime: 7,
          date: "2025-08-25",
          image: imgStudyMode,
          body: `
  Learning loop:
  • Diagnose: quick quiz → identify gaps (concepts, procedures, pitfalls).
  • Plan: 3 learning goals, 2 micro-projects, 1 assessment.
  • Practice: retrieval first (explain, recall), then apply.
  • Spaced: auto-generate flash cards with hints and distractors.

  Weekly template:
  Mon: diagnostic quiz + plan. Tue–Thu: micro-projects (45–60m). Fri: reflection + one-pager summary. Weekend: spaced review.

  Starter prompts:
  • Diagnostic — “Quiz me on topic X (10 items). Label each as ‘concept’ or ‘procedure’ and show the correct reasoning.”
  • Cards — “Create 15 SRS cards with hints; include common misconceptions.”
  • Projects — “Propose two micro-projects that prove I can do Y in under 2 hours.”

  Measure: time-on-task, attempts to success, error categories. Iterate what failed the most.
          `.trim(),
        },
        {
          id: 3,
          title: "Deep Research for Students: From Question to Clear Claims",
          excerpt:
            "A rigorous pipeline: map the topic, collect sources, extract claims vs. evidence, compare viewpoints, and write tight summaries.",
          tag: "Research",
          readTime: 8,
          date: "2025-08-18",
          image: imgDeepResearch,
          body: `
  Pipeline:
  1) Clarify the question; define scope and exclusions.
  2) Build a reading stack (primary, secondary, reviews).
  3) Extract a claim–evidence table (who said what, where, with what method).
  4) Counter-arguments: strongest opposing claims + evidence quality.
  5) Synthesize: what is settled, contested, unknown.
  6) Output: 1-page brief with citations.

  Starter prompts:
  • Map — “List 5 key subtopics, pivotal papers, and recurring debates in X.”
  • Matrix — “Create a table: Claim | Evidence | Source | Method | Confidence.”
  • Brief — “Write a 300-word synthesis separating facts, interpretations, and open questions.”

  Checks: verify quotes, track publication year and method, note sample sizes/limitations. Always keep a citations list.
          `.trim(),
        },
        {
          id: 4,
          title: "Agent Mode for Juniors: Safe Automation that Actually Helps",
          excerpt:
            "Understand capabilities, set guardrails, and run a simple ‘research → plan → implement → test’ loop with checkpoints.",
          tag: "Agents",
          readTime: 6,
          date: "2025-08-10",
          image: imgAgentMode,
          body: `
  What agents can do: track tasks, call tools/APIs, keep context, and hand back artifacts.
  Guardrails:
  • Define a goal, time budget, and stop conditions.
  • Least privilege access for tools/connectors.
  • Human checkpoints after each phase.

  Template loop:
  Research → Plan (milestones + risks) → Implement (small changes) → Test (acceptance checks) → Report (what was done, what failed).

  Starter prompt:
  “You are my agent. Goal: build X. Time budget: 45m. Tools: A,B. Check in after each phase with a plan, next actions, and a rollback note.”

  Audit: keep logs (inputs/outputs), store artifacts, and require a summary with links to evidence.
          `.trim(),
        },
        {
          id: 5,
          title: "Using Connectors Wisely: Real Projects with Minimal Plumbing",
          excerpt:
            "Hook up docs, sheets, and APIs; add least-privilege auth; ship mini-apps: FAQ bot, CSV→dashboard, and CRM notes.",
          tag: "Integration",
          readTime: 6,
          date: "2025-08-02",
          image: imgConnectors,
          body: `
  Patterns:
  • FAQ from docs — index your handbook; answer with citations.
  • CSV → dashboard — parse, validate, chart, export shareable link.
  • CRM notes — summarize calls; tag action items and owners.

  Checklist:
  Auth (scopes, rotation), rate limits, retries, caching, PII hygiene, idempotent writes.

  Starter prompt:
  “Design a connector flow for Y. Output: data model, scopes needed, edge cases, retry/backoff policy, and a minimal UI plan.”

  Tip: start read-only, then add write ops for one entity. Log errors with correlation IDs.
          `.trim(),
        },
        {
          id: 6,
          title: "Prompt Engineering Basics that Don’t Break Under Pressure",
          excerpt:
            "A reliable template: Role → Task → Context → Constraints → Format → Examples → Checks. Plus quick evals.",
          tag: "Prompting",
          readTime: 6,
          date: "2025-07-22",
          image: imgPrompting,
          body: `
  Template:
  Role | Task | Context | Constraints | Output format | Few-shot examples | Quality checks.

  Quality boosters:
  • Ask for assumptions, risks, and alternatives.
  • Request chain-of-thought style internally but only output the final answer format.
  • Add self-critique: “List 3 issues and fix them.”

  Quick evals:
  “Generate 3 diverse answers, then select the best with a short rubric (clarity, correctness, brevity, citation).”

  Keep prompts short, variables explicit, and outputs verifiable (tables, JSON, tests).
          `.trim(),
        },
        {
          id: 7,
          title: "From Tutorial to Portfolio: Ship Work People Can Use",
          excerpt:
            "Move from following along to delivering value: pick a tiny real problem, set metrics, ship weekly, and write a case study.",
          tag: "Career",
          readTime: 7,
          date: "2025-07-10",
          image: imgPortfolio,
          body: `
  One-week plan:
  Mon: pick the problem + metric (eg time saved per task).
  Tue: prototype core path (happy path only).
  Wed: add one blocker/edge.
  Thu: polish demo + README.
  Fri: user feedback + ship.

  Case-study skeleton:
  Problem → Constraints → Approach → Result (metric) → What I’d do next.

  Checklist: 30s demo video, live link or repo, screenshots, setup steps, and metrics before/after.
          `.trim(),
        },
        {
          id: 8,
          title: "AI Pair Programming: Practical Patterns for Daily Coding",
          excerpt:
            "Rubber-ducking, test-first prompts, targeted refactors, and safe debugging with minimal context bloat.",
          tag: "Coding",
          readTime: 6,
          date: "2025-07-01",
          image: imgPairProgramming,
          body: `
  Patterns:
  • Rubber-duck: explain your intent; ask “what’s the simplest path?”
  • Tests first: “Write 3 tests that describe expected behavior.”
  • Debug: paste error + minimal snippet; ask for the failing path and a fix.
  • Refactor: “Suggest 3 changes to reduce complexity or duplication.”

  Guardrails: limit tokens to the file/function in question, never paste secrets, confirm external code licenses.

  Outcome: faster feedback, fewer dead-ends, cleaner diffs.
          `.trim(),
        },
      ],
    },

    he: {
      lang: "he",
      dir: "rtl",
      dateLocale: "he-IL",
      ui: {
        heroTitleTop: "אינטגרציית AI ללא מאמץ",
        heroTitleAccent: "לעסקים",
        heroSub: "בלי הגדרות מיותרות — אוטומציה חכמה כשבאמת צריך.",
        sectionTitle: "מאמרי AI מומלצים",
        sectionSub: "קריאות קצרות ומעשיות לג׳וניורים וסטודנטים שעובדים עם AI.",
        openCta: "פתח →",
        readCta: "קרא את המאמר המלא",
        closeCta: "סגור",
        readTimeSuffix: "דקות קריאה",
        toggleLabel: "EN",
      },
      articles: [
        {
          id: 1,
          title: "פרויקט ראשון אמיתי עם AI: תכנית פעולה לשבוע",
          excerpt:
            "חותכים היקף, משחררים מהר, ולומדים מהר יותר. 7 צעדים עם פרומפטים לפתיחה, בדיקות תחילה ודמו קטן שאפשר להראות.",
          tag: "למידה",
          readTime: 7,
          date: "2025-09-01",
          image: imgProjectAI,
          body: `
  למה זה עובד: היקף קטן → פידבק מהיר → ביטחון.
  שלבים:
  1) מגדירים תוצאה במשפט אחד (מי, מה, מדד הצלחה).
  2) בוחרים היקף S: פיצ׳ר אחד, תרחיש אחד, מקור נתונים אחד.
  3) תכנון עם AI: אבני דרך, סיכונים ועץ קבצים.
  4) בדיקות תחילה: מבקשים 3–5 בדיקות קבלה ידניות.
  5) בונים במנות קטנות; מבקשים “ביקורת ואז שיפור”.
  6) דמו: CLI או עמוד יחיד; מקליטים 30 שניות.
  7) סיכום: מה נשמר, מה משתנה, ומה נזרק לשבוע הבא.

  Starter prompts:
  • תכנון — “שמש כמתכנת בכיר. תן אבני דרך, סיכונים, עץ קבצים ותכנית ל־2 שעות הקרובות.”
  • בדיקות — “רשימת בדיקות קבלה עם קלט/פעולה/תוצאה צפויה.”
  • ריפקטור — “3 שיפורים שמפחיתים מורכבות בלי לשנות התנהגות.”

  אנטי-פאטרנים: משימות מעורפלות, הקשר ענק, יצירת קוד ארוך במכה. כל שיחה לפיצ׳ר אחד.
          `.trim(),
        },
        {
          id: 2,
          title: "Study Mode על סטרואידים: מנוע למידה אישי",
          excerpt:
            "הופכים את ה-AI למורה פרטי: חזרה מרווחת, מיקרו-פרויקטים, ספרינטים שבועיים וזיהוי פערים אוטומטי.",
          tag: "למידה",
          readTime: 7,
          date: "2025-08-25",
          image: imgStudyMode,
          body: `
  לולאת למידה:
  • אבחון: חידון קצר → מיפוי פערים (מושגים, פרוצדורות, טעויות).
  • תכנית: 3 יעדים, 2 מיקרו-פרויקטים, 1 הערכה.
  • תרגול: שליפה מהזיכרון לפני יישום.
  • חזרה מרווחת: יצירת כרטיסים עם רמזים ומסיחים.

  תבנית שבועית:
  ב׳: אבחון ותכנון. ג׳–ה׳: מיקרו-פרויקטים (45–60 ד׳). ו׳: סיכום + דף אחד. סופ״ש: חזרה מרווחת.

  Starter prompts:
  • אבחון — “בחן אותי בנושא X (10 פריטים). סווג ‘מושג’/‘פרוצדורה’ והסבר היגיון נכון.”
  • כרטיסים — “צור 15 כרטיסי SRS עם רמזים וטעויות נפוצות.”
  • פרויקטים — “הצע שני מיקרו-פרויקטים שמוכיחים יכולת Y בפחות משעתיים.”

  מדידה: זמן בפועל, נסיונות עד הצלחה, סוגי שגיאות. לשפר היכן שנכשל הכי הרבה.
          `.trim(),
        },
        {
          id: 3,
          title: "Deep Research לסטודנטים: משאלה לטענות מבוססות",
          excerpt:
            "צינור עבודה קפדני: מיפוי נושא, איסוף מקורות, הפרדת טענות מראיות, השוואת עמדות וכתיבת תקציר חד עם מקורות.",
          tag: "מחקר",
          readTime: 8,
          date: "2025-08-18",
          image: imgDeepResearch,
          body: `
  הצינור:
  1) מחדדים שאלה; מגדירים תחום ומה לא נכלל.
  2) בונים ערימת קריאה (ראשוניים, משניים, סקירות).
  3) טבלת טענה–ראיה (מי אמר, איפה, באיזו מתודה).
  4) טענות נגד: החזקות ביותר + איכות ראיות.
  5) סינתזה: מה מוסכם, מה שנוי במחלוקת, ומה לא ידוע.
  6) פלט: תקציר עמוד אחד עם ציטוטים.

  Starter prompts:
  • מיפוי — “מנה 5 תתי-נושאים, מאמרים מכוננים ומחלוקות חוזרות ב-X.”
  • מטריצה — “צור טבלה: טענה | ראיה | מקור | מתודה | ביטחון.”
  • תקציר — “כתוב 300 מילים שמפרידות עובדות, פירושים ושאלות פתוחות.”

  בדיקות: אימות ציטוטים, ציון שנה/מתודה, גודל מדגם/מגבלות. תמיד לשמור רשימת מקורות.
          `.trim(),
        },
        {
          id: 4,
          title: "Agent Mode לג׳וניורים: אוטומציה בטוחה שבאמת עוזרת",
          excerpt:
            "מבינים יכולות, מציבים מעקות בטיחות, ומריצים לולאה פשוטה: מחקר → תכנון → מימוש → בדיקות עם נקודות עצירה.",
          tag: "סוכנים",
          readTime: 6,
          date: "2025-08-10",
          image: imgAgentMode,
          body: `
  מה סוכן יודע: לעקוב אחר משימות, לקרוא לכלים/API, לשמור הקשר ולהחזיר תוצרים.
  מעקות בטיחות:
  • מגדירים יעד, תקציב זמן ותנאי עצירה.
  • הרשאות מינימליות לכל מחבר/כלי.
  • אישור אדם אחרי כל שלב.

  תבנית:
  מחקר → תכנון (אבני דרך + סיכונים) → מימוש (שינויים קטנים) → בדיקות (קבלה) → דו״ח (מה נעשה ומה נכשל).

  Starter prompt:
  “את/ה הסוכן שלי. יעד: לבנות X. זמן: 45 ד׳. כלים: A,B. אחרי כל שלב דווח/י תכנית, צעדים הבאים ותכנית חזרה לאחור.”

  ביקורת: לוגים של קלט/פלט, שמירת תוצרים, וסיכום עם קישורים לראיות.
          `.trim(),
        },
        {
          id: 5,
          title: "Connectors בחכמה: פרויקטים אמיתיים עם מעט מאוד חיווט",
          excerpt:
            "מחברים דוקים/גילונות/‏API, מוסיפים הרשאות מינימליות, ומשחררים מיני-אפים: בוט FAQ, CSV→דשבורד והערות CRM.",
          tag: "אינטגרציה",
          readTime: 6,
          date: "2025-08-02",
          image: imgConnectors,
          body: `
  תבניות:
  • FAQ מהדוקומנטציה — אינדוקס ומענה עם ציטוטים.
  • CSV → דשבורד — פרס, ולידציה, גרפים, קישור לשיתוף.
  • CRM — תקציר שיחות, תיוג משימות ובעלים.

  צ׳קליסט:
  Scopes, הגבלות קצב, נסיונות/Backoff, קאשינג, טיפול ב-PII, כתיבות אידמפוטנטיות.

  Starter prompt:
  “תכנן זרימת Connector ל-Y. פלט: מודל נתונים, הרשאות נדרשות, קצוות, מדיניות Retry/Backoff ותכנית UI מינימלית.”

  טיפ: להתחיל בקריאה בלבד, להוסיף כתיבה לישות אחת, וללוג עם Correlation ID.
          `.trim(),
        },
        {
          id: 6,
          title: "יסודות Prompt Engineering שלא מתפרקים בלחץ",
          excerpt:
            "תבנית יציבה: תפקיד → משימה → הקשר → אילוצים → פורמט → דוגמאות → בדיקות. פלוס הערכה מהירה.",
          tag: "פרומפטינג",
          readTime: 6,
          date: "2025-07-22",
          image: imgPrompting,
          body: `
  תבנית:
  תפקיד | משימה | הקשר | אילוצים | פורמט פלט | דוגמאות | בדיקות איכות.

  מגבירים איכות:
  • בקשה להנחות, סיכונים ואלטרנטיבות.
  • ביקורת-עצמית: “ציין 3 בעיות ושפר בהתאם.”
  • יציאה בפורמט בר-בדיקה (טבלה/JSON/בדיקות).

  הערכת בזק:
  “ייצר 3 תשובות מגוונות; בחר את הטובה לפי רובריקה קצרה (בהירות, נכונות, תמציתיות, ציטוט).”

  קצר, מפורש, ניתן לאימות.
          `.trim(),
        },
        {
          id: 7,
          title: "מטוטוריאל לפורטפוליו: תוצרים שאנשים באמת משתמשים בהם",
          excerpt:
            "עוברים מ‘ללכת בעקבות’ ל‘מספקים ערך’: בוחרים בעיה קטנה אמיתית, מודדים, משחררים כל שבוע וכותבים קייס-סטאדי.",
          tag: "קריירה",
          readTime: 7,
          date: "2025-07-10",
          image: imgPortfolio,
          body: `
  תכנית שבוע:
  ב׳: בעיה + מדד (למשל זמן שחסכתי).
  ג׳: אבטיפוס לנתיב שמח — בלבד.
  ד׳: מוסיפים קצה/חסם אחד.
  ה׳: פוליש + README.
  ו׳: פידבק משתמשים + שחרור.

  קייס-סטאדי קצר:
  בעיה → אילוצים → גישה → תוצאה (מדד) → מה הלאה.

  צ׳קליסט: סרטון 30 שנ׳, קישור חי או ריפו, צילומי מסך, צעדי התקנה ומדדים לפני/אחרי.
          `.trim(),
        },
        {
          id: 8,
          title: "AI Pair Programming: דפוסים פרקטיים ליום-יום",
          excerpt:
            "Rubber-ducking, בדיקות תחילה, ריפקטור ממוקד ודיבוג בטוח עם מינימום רעש הקשר.",
          tag: "קוד",
          readTime: 6,
          date: "2025-07-01",
          image: imgPairProgramming,
          body: `
  דפוסים:
  • Rubber-duck: מסבירים כוונה; שואלים “מה המסלול הפשוט ביותר?”
  • בדיקות תחילה: “כתוב 3 בדיקות שמתארות התנהגות מצופה.”
  • דיבוג: שגיאה + קטע מינימלי; “מה הנתיב הכושל ומה התיקון?”
  • ריפקטור: “3 שינויים שמפחיתים מורכבות/כפילויות.”

  מעקות: מגבילים הקשר לקובץ/פונקציה, לא מדביקים סודות, בודקים רישיונות לקוד חיצוני.

  תוצאה: פידבק מהיר, פחות מבואי-סתום, דיפים נקיים.
          `.trim(),
        },
      ],
    },
  };
