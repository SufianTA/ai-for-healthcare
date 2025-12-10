'use client';

import Image from 'next/image';

type Founder = {
  name: string;
  role: string;
  blurb: string;
  avatar: string;
};

const founders: Founder[] = [
  {
    name: 'Sufian Aldogom',
    role: 'Clinical Ops & Product',
    blurb: 'Bridges OR workflows with product design to keep residents focused on the craft.',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=240&q=60',
  },
  {
    name: 'Alok Gupta',
    role: 'Technical Lead',
    blurb: 'Builds the scoring engine and keeps the platform resilient for high-stakes training.',
    avatar: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=240&q=60',
  },
  {
    name: 'Andres Hernandez',
    role: 'Data & Analytics',
    blurb: 'Turns raw attempts into actionable feedback and transparent progression charts.',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=60',
  },
  {
    name: 'Sharjeel Chaudhry',
    role: 'XR & Simulation',
    blurb: 'Explores VR/AR skill drills so practice feels closer to the operating room.',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=60',
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
        <div key={f.name} className="card" style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', width: 54, height: 54, borderRadius: '50%', overflow: 'hidden' }}>
              <Image src={f.avatar} alt={f.name} fill sizes="54px" />
            </div>
            <div>
              <strong>{f.name}</strong>
              <div className="muted" style={{ fontSize: 13 }}>{f.role}</div>
            </div>
          </div>
          <p style={{ margin: 0 }}>{f.blurb}</p>
        </div>
      ))}
    </div>
  );
}
