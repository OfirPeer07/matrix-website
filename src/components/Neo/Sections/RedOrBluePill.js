import React from 'react';
import './RedOrBluePill.css';
import '../../../styles/sections/Sections.css';

const RedOrBluePill = () => {
  return (
    <div className="text-content">
      <div className="text-box">
        <div className="inner-box" dir="ltr">
          <h2>Which pill will you choose?</h2>

          <p>
            In High-Tech, this choice is also relevant.
            When a student finishes their studies, they face the same choice:
          </p>

          <p>
            🟦 <strong>The Blue Pill</strong> – Believing that with nice CVs, motivation, and time – the job will come.<br />
            Living in a partial illusion: that the system will see you, and that "trying hard" is enough to make it happen.
          </p>

          <p>
            🟥 <strong>The Red Pill</strong> – Seeing reality as it is: that most companies look for employees with work experience.<br />
            Understanding that juniors often fall between the cracks and realizing the system isn't built for you.
          </p>
          <h3>What is your choice?</h3>
        </div>
      </div>
    </div>
  );
};

export default RedOrBluePill;
