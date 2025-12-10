'use client';

type Founder = {
  name: string;
  role: string;
  strengths: string;
  archetype: string;
  relevance: string;
  filled: string;
  avatar: string;
};

const founders: Founder[] = [
  {
    name: 'Sufian Aldogom',
    role: 'Development Lead',
    strengths: 'CSAIL, software development, implementation',
    archetype: 'The Hacker',
    relevance: 'Required for MVP build',
    filled: 'Yes',
    avatar: 'SA',
  },
  {
    name: 'Alok Gupta',
    role: 'Clinical Founder',
    strengths: 'Surgeon, Medical Educator',
    archetype: 'Domain Expert',
    relevance: 'Required for credibility and surgical network',
    filled: 'Yes',
    avatar: 'AG',
  },
  {
    name: 'Andres Hernandez',
    role: 'Product + UX Lead',
    strengths: 'Microsoft alum, EMBA’26, UX & Gamification from Xbox ecosystem',
    archetype: 'The Architect',
    relevance: 'Required for UX',
    filled: 'Yes',
    avatar: 'AH',
  },
  {
    name: 'Sharjeel Chaudhry',
    role: 'Strategy Lead',
    strengths: 'Surgical resident, consulting & business strategy, med-device founder',
    archetype: 'The Hustler',
    relevance: 'Required for novice learner perspective',
    filled: 'Yes',
    avatar: 'SC',
  },
];

function Avatar({ label }: { label: string }) {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'linear-gradient(145deg, rgba(14,165,233,0.18), rgba(14,165,233,0.32))',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        color: '#0f172a',
      }}
      aria-hidden
    >
      {label}
    </div>
  );
}

export default function FoundersPage() {
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div className="badge" style={{ marginBottom: 10 }}>Our team</div>
        <h1 style={{ margin: '4px 0 8px' }}>Built by clinicians and engineers for surgical training</h1>
        <p className="muted" style={{ margin: 0 }}>
          SurgiTrack blends medical rigor with product craft. Meet the group pushing skill tracking forward.
        </p>
      </div>
      {founders.map((f) => (
        <div key={f.name} className="card" style={{ display: 'grid', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar label={f.avatar} />
            <div>
              <strong>{f.name}</strong>
              <div className="muted" style={{ fontSize: 13 }}>{f.role}</div>
            </div>
          </div>
          <p style={{ margin: 0 }}><strong>Strengths:</strong> {f.strengths}</p>
          <p style={{ margin: 0 }}><strong>Archetype:</strong> {f.archetype}</p>
          <p style={{ margin: 0 }}><strong>Relevance:</strong> {f.relevance}</p>
          <p style={{ margin: 0 }}><strong>Role filled:</strong> {f.filled}</p>
        </div>
      ))}
    </div>
  );
}
