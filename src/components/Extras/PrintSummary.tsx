import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Printer } from 'lucide-react';
import { certifications, education, experience, personal, projects, skillCategories, skills } from '../../data/portfolio';
import { CATEGORY_LABEL } from '../Skills/categoryStyle';

// A one-page, plain summary built from the site's data. The button prints it;
// the print stylesheet hides the rest of the page, so "Save as PDF" in the
// print dialog gives a clean sheet.

function Sheet() {
  return createPortal(
    <div id="print-sheet" className="print-sheet">
      <h1>{personal.name}</h1>
      <p className="sub">
        {personal.headline} · {personal.location} · {personal.email} · {personal.github}
      </p>
      <h2>Profile</h2>
      <p>{personal.about}</p>
      <h2>Education</h2>
      <ul>
        {education.map((e) => (
          <li key={e.qualification}>
            {e.qualification}, {e.institution}, {e.period}
            {e.cgpa ? `, CGPA ${e.cgpa}` : ''}
          </li>
        ))}
      </ul>
      <h2>Skills</h2>
      <ul>
        {skillCategories.map((c) => (
          <li key={c}>
            <b>{CATEGORY_LABEL[c]}:</b> {skills.filter((s) => s.category === c).map((s) => s.name).join(', ')}
          </li>
        ))}
      </ul>
      <h2>Projects</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <b>{p.title}</b> ({p.category}): {p.description}
          </li>
        ))}
      </ul>
      <h2>Experience</h2>
      <ul>
        {experience.map((x) => (
          <li key={x.organization}>
            <b>{x.organization}</b>: {x.responsibilities.map((r) => r.detail).join(' ')}
          </li>
        ))}
      </ul>
      <h2>Certifications</h2>
      <ul>
        {certifications.map((c) => (
          <li key={c.name}>
            {c.name} ({c.area})
          </li>
        ))}
      </ul>
    </div>,
    document.body,
  );
}

export function PrintSummary() {
  const [armed, setArmed] = useState(false);

  const print = () => {
    setArmed(true);
    // Let the sheet mount, then open the print dialog.
    window.setTimeout(() => window.print(), 60);
  };

  return (
    <section aria-label="One-page summary" className="relative z-10 pb-16">
      <div className="container-editorial flex flex-wrap items-center gap-4">
        <button type="button" onClick={print} className="mc-btn inline-flex min-h-11 items-center gap-2 px-4 text-sm">
          <Printer size={16} aria-hidden="true" />
          Print one-page summary
        </button>
        <p className="label-mono text-mist-muted">Choose “Save as PDF” in the print window.</p>
      </div>
      {armed && <Sheet />}
    </section>
  );
}
