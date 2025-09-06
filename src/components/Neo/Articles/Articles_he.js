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
      toggleLabel: "HE ",
    },
    articles: [
      {
        id: 1,
        title: "How to Build Your First Project as a Junior with AI",
        excerpt:
          "A practical guide for juniors: planning, generating code snippets, and getting instant AI feedback to kickstart your project.",
        tag: "Learning",
        readTime: 6,
        date: "2025-09-01",
        image: imgProjectAI,
        body: `
Getting started can feel overwhelming. This article shows a repeatable pattern:
1) Outline the scope with an AI planning prompt.
2) Generate scaffold code in small chunks, then review.
3) Ask AI for tests first to clarify expected behavior.
4) Use a “red-green-refactor” loop and let AI propose refactors.
Pro tip: keep conversations per feature to avoid context bloat.
        `.trim(),
      },
      {
        id: 2,
        title: "Expanding Knowledge with OpenAI’s New Study Mode",
        excerpt:
          "An overview of the Study & Learn Mode and how it personalizes the learning process to accelerate your growth.",
        tag: "Study",
        readTime: 7,
        date: "2025-08-25",
        image: imgStudyMode,
        body: `
Study Mode adapts to your level: it quizzes you, generates spaced-repetition cards,
and proposes micro-projects. You'll learn to craft prompts that reveal gaps and
turn them into targeted exercises. Includes a sample weekly plan for CS students.
        `.trim(),
      },
      {
        id: 3,
        title: "How Deep Research Can Help Students in Their Degree",
        excerpt:
          "Using advanced research tools to explore academic sources, summarize key insights, and create tailored study material.",
        tag: "Research",
        readTime: 8,
        date: "2025-08-18",
        image: imgDeepResearch,
        body: `
Deep Research helps you map a topic, compare viewpoints, and produce annotated
summaries. We'll cover building a reading stack, extracting claims vs. evidence,
and generating citations checklists to avoid common academic pitfalls.
        `.trim(),
      },
      {
        id: 4,
        title: "Agent Mode – Capabilities and Benefits for Juniors & Students",
        excerpt:
          "What Agent Mode is, how it works, and why it’s a powerful assistant for early-stage learners.",
        tag: "Agents",
        readTime: 5,
        date: "2025-08-10",
        image: imgAgentMode,
        body: `
Agent Mode can track tasks, call tools, and maintain context across steps.
We show safe defaults, when to supervise vs. fully automate, and a template
for 'research → plan → implement → test' loops that agents can run for you.
        `.trim(),
      },
      {
        id: 5,
        title: "Using Connectors Wisely in Junior AI Projects",
        excerpt:
          "Integrate external systems through Connectors and build real-world projects with ease.",
        tag: "Integration",
        readTime: 6,
        date: "2025-08-02",
        image: imgConnectors,
        body: `
Connectors let you pull data from docs, drives, and APIs without heavy plumbing.
We’ll cover auth basics, least-privilege access, and mini-apps like
'FAQ bot from team docs' and 'CSV-to-dashboard' with minimal setup.
        `.trim(),
      },
      {
        id: 6,
        title: "Prompt Engineering Basics for Juniors",
        excerpt:
          "From zero to solid prompts: structure, constraints, step-by-step reasoning requests, and evaluation checklists.",
        tag: "Prompting",
        readTime: 6,
        date: "2025-07-22",
        image: imgPrompting,
        body: `
Learn the 'task → constraints → format → examples → checks' template.
Request tests, compare outputs, and iterate quickly without overfitting
to one perfect prompt.
        `.trim(),
      },
      {
        id: 7,
        title: "From Tutorial to Portfolio: Shipping Real Projects",
        excerpt:
          "Bridge the gap from tutorials to useful tools that demonstrate practical impact.",
        tag: "Career",
        readTime: 7,
        date: "2025-07-10",
        image: imgPortfolio,
        body: `
Pick a tiny real problem, define success metrics, and ship within a week.
Use scope boxes (S/M/L), demo checklists, and a case-study rubric
that recruiters actually read.
        `.trim(),
      },
      {
        id: 8,
        title: "AI Pair Programming 101",
        excerpt:
          "Use AI as a thoughtful coding partner: rubber-ducking, test-first prompts, and targeted refactoring suggestions.",
        tag: "Coding",
        readTime: 5,
        date: "2025-07-01",
        image: imgPairProgramming,
        body: `
Ask for alternatives, trade-offs, and failure modes. Pair on tests,
error messages, and perf hotspots. Includes 10 prompt snippets
for common coding tasks.
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
        title: "איך לבנות פרויקט ראשון כג׳וניור בעזרת AI",
        excerpt:
          "מדריך פרקטי: תכנון, יצירת קוד לדוגמה, וקבלת פידבק מיידי כדי להזניק את הפרויקט.",
        tag: "למידה",
        readTime: 6,
        date: "2025-09-01",
        image: imgProjectAI,
        body: `
התחלה יכולה להיות מאתגרת. נלמד דפוס חוזר:
1) מגדירים היקף בעזרת prompt תכנוני.
2) מייצרים שלד קוד במנות קטנות ומבצעים ביקורת.
3) מבקשים בדיקות קודם כדי לחדד ציפיות.
4) עובדים במחזור “אדום-ירוק-ריפקטור” ונותנים ל-AI להציע שיפורים.
טיפ: שומרים כל שיחה סביב פיצ׳ר אחד כדי למנוע רעש.
        `.trim(),
      },
      {
        id: 2,
        title: "להעמיק ידע עם Study Mode החדש של OpenAI",
        excerpt:
          "איך Study & Learn מתאים תכנים אישית ומאיץ את הקצב שלך.",
        tag: "למידה",
        readTime: 7,
        date: "2025-08-25",
        image: imgStudyMode,
        body: `
Study Mode מתאים את עצמו לרמה שלך: חידונים, כרטיסי חזרה (SRS),
ומיקרו-פרויקטים. נתרגל יצירת פרומפטים שמגלים פערים
וממירים אותם למשימות ממוקדות. כולל תכנית שבועית לסטודנטים למדמ״ח.
        `.trim(),
      },
      {
        id: 3,
        title: "איך Deep Research מסייע לסטודנטים בתואר",
        excerpt:
          "כלים מתקדמים לחיפוש מקורות, סיכום תובנות ויצירת חומר לימוד מותאם אישית.",
        tag: "מחקר",
        readTime: 8,
        date: "2025-08-18",
        image: imgDeepResearch,
        body: `
Deep Research עוזר למפות נושא, להשוות עמדות, ולהפיק תקצירים מוערים.
נלמד לבנות ערימת קריאה, להבחין בין טענות לראיות,
ולעבוד עם צ׳קליסטי ציטוטים כדי להימנע מטעויות שכיחות.
        `.trim(),
      },
      {
        id: 4,
        title: "Agent Mode — היכולות ולמה זה חשוב לג׳וניורים/סטודנטים",
        excerpt:
          "מה זה Agent Mode, איך עובדים איתו, ואיך הוא מייעל למידה וביצוע משימות.",
        tag: "סוכנים",
        readTime: 5,
        date: "2025-08-10",
        image: imgAgentMode,
        body: `
Agent Mode יכול לעקוב אחרי משימות, לקרוא לכלים, ולשמור הקשר בין שלבים.
נציג דפולטיים בטוחים, מתי להשגיח לעומת אוטומציה מלאה,
ותבנית 'מחקר → תכנון → מימוש → בדיקות' שסוכן יכול להריץ עבורך.
        `.trim(),
      },
      {
        id: 5,
        title: "שימוש חכם ב-Connectors לפרויקטים של ג׳וניורים",
        excerpt:
          "חיבור למערכות חיצוניות ויצירת פרויקטים מציאותיים במהירות.",
        tag: "אינטגרציה",
        readTime: 6,
        date: "2025-08-02",
        image: imgConnectors,
        body: `
Connectors מאפשרים למשוך נתונים ממסמכים, דרייבים ו-API בקלות.
נכסה יסודות הרשאות, Least-Privilege, ומיני-אפים כמו
'בוט שאלות נפוצות' ו'CSV ללוח מחוונים' עם מינימום הגדרות.
        `.trim(),
      },
      {
        id: 6,
        title: "יסודות Prompt Engineering לג׳וניורים",
        excerpt:
          "מבנה פרומפט מוצלח: משימה → אילוצים → פורמט → דוגמאות → בדיקות.",
        tag: "פרומפטינג",
        readTime: 6,
        date: "2025-07-22",
        image: imgPrompting,
        body: `
נלמד תבנית קבועה וטיפים לבקש בדיקות, להשוות תוצאות ולהתקדם מהר
בלי להצמד ל'פרומפט מושלם' אחד.
        `.trim(),
      },
      {
        id: 7,
        title: "מטוטוריאל לפורטפוליו: לשחרר פרויקטים אמיתיים",
        excerpt:
          "איך הופכים לימוד תיאורטי לתוצרים שמראים אימפקט אמיתי.",
        tag: "קריירה",
        readTime: 7,
        date: "2025-07-10",
        image: imgPortfolio,
        body: `
בוחרים בעיה קטנה אמיתית, מגדירים מדדי הצלחה, ומשחררים תוך שבוע.
שלוש רמות היקף (S/M/L), צ׳קליסט דמו, ותבנית קצרה לקייס-סטאדי
שמגייסים באמת קוראים.
        `.trim(),
      },
      {
        id: 8,
        title: "AI Pair Programming למתחילים",
        excerpt:
          "לרתום את ה-AI כשותף קוד: Rubber-ducking, בדיקות תחילה וריפקטורינג ממוקד.",
        tag: "קוד",
        readTime: 5,
        date: "2025-07-01",
        image: imgPairProgramming,
        body: `
מבקשים אלטרנטיבות, Trade-offs, ומצבי כשל. מזווגים סביב בדיקות,
שגיאות וביצועים. כולל 10 תבניות פרומפט לשימוש יומיומי.
        `.trim(),
      },
    ],
  },
};
