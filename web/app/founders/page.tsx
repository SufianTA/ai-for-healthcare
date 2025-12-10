'use client';

type Founder = {
  name: string;
  role: string;
  summary: string;
  avatar: string;
};

const founders: Founder[] = [
  {
    name: 'Sufian Aldogom',
    role: 'Development Lead',
    summary: 'CSAIL-trained builder focused on full-stack implementation and keeping the MVP moving.',
    avatar: 'SA',
  },
  {
    name: 'Alok Gupta',
    role: 'Clinical Founder',
    summary: 'Surgeon and medical educator ensuring clinical rigor and credibility.',
    avatar: 'AG',
  },
  {
    name: 'Andres Hernandez',
    role: 'Product + UX Lead',
    summary: 'Microsoft alum and EMBA’26 bringing UX, gamification, and product polish.',
    avatar: 'AH',
  },
  {
    name: 'Sharjeel Chaudhry',
    role: 'Strategy Lead',
    summary: 'Surgical resident and med-device founder aligning strategy with learner needs.',
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
        <h1 style={{ margin: '4px 0 8px', fontSize: '42px' }}>Built by clinicians and engineers for surgical training</h1>
        <p className="muted" style={{ margin: 0, fontSize: '18px' }}>
          SurgiTrack blends medical rigor with product craft. Meet the group keeping skill tracking practical and credible.
        </p>
      </div>
      {founders.map((f) => (
        <div key={f.name} className="card" style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar label={f.avatar} />
            <div>
              <strong style={{ fontSize: 18 }}>{f.name}</strong>
              <div className="muted" style={{ fontSize: 14 }}>{f.role}</div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 15 }}>{f.summary}</p>
        </div>
      ))}
    </div>
  );
}
