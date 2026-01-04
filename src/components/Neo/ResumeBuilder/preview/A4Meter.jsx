export default function A4Meter({ height, max, overflow }) {
  const percent = Math.min(100, Math.round((height / max) * 100));

  return (
    <div className={`a4-meter ${overflow ? "overflow" : ""}`}>
      <div className="a4-meter-bar">
        <div
          className="a4-meter-fill"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="a4-meter-label">
        {overflow
          ? "⚠️ Content exceeds one A4 page"
          : "✓ Fits in one A4 page"}
      </div>
    </div>
  );
}
