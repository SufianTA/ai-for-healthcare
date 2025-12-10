'use client';

import Image from 'next/image';

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
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Sufian',
  },
  {
    name: 'Alok Gupta',
    role: 'Clinical Founder',
    strengths: 'Surgeon, Medical Educator',
    archetype: 'Domain Expert',
    relevance: 'Required for credibility and surgical network',
    filled: 'Yes',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Alok',
  },
  {
    name: 'Andres Hernandez',
    role: 'Product + UX Lead',
    strengths: 'Microsoft alum, EMBA’26, UX & Gamification from Xbox ecosystem',
    archetype: 'The Architect',
    relevance: 'Required for UX',
    filled: 'Yes',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Andres',
  },
  {
    name: 'Sharjeel Chaudhry',
    role: 'Strategy Lead',
    strengths: 'Surgical resident, consulting & business strategy, med-device founder',
    archetype: 'The Hustler',
    relevance: 'Required for novice learner perspective',
    filled: 'Yes',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Sharjeel',
  },
];

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
            <div style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <Image src={f.avatar} alt={f.name} fill sizes="56px" />
            </div>
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
