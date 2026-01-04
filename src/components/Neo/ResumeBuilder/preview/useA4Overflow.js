import { useEffect, useState } from "react";

const A4_HEIGHT_PX = 1122; // ~297mm @ 96dpi

export default function useA4Overflow(ref) {
  const [height, setHeight] = useState(0);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    const measure = () => {
      const h = el.scrollHeight;
      setHeight(h);
      setOverflow(h > A4_HEIGHT_PX);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => observer.disconnect();
  }, [ref]);

  return { height, overflow, max: A4_HEIGHT_PX };
}
