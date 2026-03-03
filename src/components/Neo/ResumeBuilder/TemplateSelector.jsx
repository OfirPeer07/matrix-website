import "./TemplateSelector.css";
import { useLocaleContext } from "../../../context/LocaleContext";

const translations = {
    en: {
        selectorLabel: "▶ Template",
        classic: "Classic",
        modern: "Modern",
        neural: "Neural Link",
        ats: "ATS"
    },
    he: {
        selectorLabel: "▶ תבנית",
        classic: "קלאסי",
        modern: "מודרני",
        neural: "ניוראל לינק",
        ats: "ATS"
    }
};

export default function TemplateSelector({ selected, onChange }) {
    const { locale } = useLocaleContext();
    const t = translations[locale] || translations.he;

    const TEMPLATES = [
        {
            id: "classic",
            label: t.classic,
            thumb: (
                <div className="template-card-thumb thumb-classic">
                    <div className="thumb-col-left" />
                    <div className="thumb-lines">
                        <div className="thumb-line header" />
                        <div className="thumb-line w80" />
                        <div className="thumb-line w60" />
                        <div className="thumb-line w80" />
                        <div className="thumb-line w40" />
                        <div className="thumb-line w60" />
                    </div>
                </div>
            ),
        },
        {
            id: "modern",
            label: t.modern,
            thumb: (
                <div className="template-card-thumb thumb-modern">
                    <div className="thumb-modern-header" />
                    <div className="thumb-modern-grid">
                        <div className="thumb-modern-main">
                            <div className="thumb-line w80" />
                            <div className="thumb-line w60" />
                            <div className="thumb-line w80" />
                            <div className="thumb-line w40" />
                        </div>
                        <div className="thumb-modern-side" />
                    </div>
                </div>
            ),
        },
        {
            id: "neural",
            label: t.neural,
            thumb: (
                <div className="template-card-thumb thumb-neural">
                    <div className="thumb-neural-header">
                        <div className="thumb-neural-title" />
                        <div className="thumb-neural-badge" />
                    </div>
                    <div className="thumb-neural-grid">
                        <div className="thumb-modern-main">
                            <div className="thumb-line w80" />
                            <div className="thumb-line w60" />
                            <div className="thumb-line w80" />
                            <div className="thumb-line w40" />
                        </div>
                        <div className="thumb-modern-side" />
                    </div>
                </div>
            ),
        },
        {
            id: "ats",
            label: t.ats,
            thumb: (
                <div className="template-card-thumb thumb-ats">
                    <div className="thumb-ats-header">
                        <div className="thumb-ats-name" />
                        <div className="thumb-ats-role" />
                    </div>
                    <div className="thumb-hr" />
                    <div className="thumb-line w80" />
                    <div className="thumb-line w60" />
                    <div className="thumb-line w80" />
                    <div className="thumb-line w40" />
                </div>
            ),
        },
    ];
    return (
        <div className="template-selector">
            <span className="template-selector-label">{t.selectorLabel}</span>
            <div className="template-cards">
                {TEMPLATES.map((tpl) => (
                    <div
                        key={tpl.id}
                        className={`template-card ${selected === tpl.id ? "selected" : ""}`}
                        onClick={() => onChange(tpl.id)}
                        role="button"
                        aria-pressed={selected === tpl.id}
                        title={tpl.label}
                    >
                        <div className="template-card-check">✓</div>
                        {tpl.thumb}
                        <span className="template-card-name">{tpl.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
