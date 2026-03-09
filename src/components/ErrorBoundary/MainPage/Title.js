import { useState, useEffect, useRef } from "react";
import { useLocaleContext } from "../../../context/LocaleContext";
import "./Title.css";

const Title = () => {
  const { locale } = useLocaleContext();
  const translations = {
    en: ["Welcome to the Matrix World"],
    he: ["ברוכים הבאים לעולם המטריקס"]
  };

  const texts = translations[locale] || translations.en;
  const [currentText, setCurrentText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const typingTimeout = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setCurrentText(translations[locale][0]);
      return;
    }

    const word = texts[textIndex];
    const done = charIndex === word.length;
    const empty = charIndex === 0;

    typingTimeout.current = setTimeout(() => {
      setCurrentText(word.substring(0, charIndex + (isDeleting ? -1 : 1)));
      setCharIndex((c) => c + (isDeleting ? -1 : 1));

      if (done) setIsDeleting(true);
      if (empty && isDeleting) {
        setIsDeleting(true);
        setTextIndex((i) => (i + 1) % texts.length);
      }
    }, done ? 1000 : 90);

    return () => clearTimeout(typingTimeout.current);
  }, [charIndex, isDeleting, textIndex, isMobile, locale, texts]);

  return (
    <h1 className="typing-title">
      {currentText}
      {!isMobile && <span className="cursor">|</span>}
    </h1>
  );
};

export default Title;
