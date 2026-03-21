import { ArrowRight, Code2, Cpu, Globe, BookOpen, Users, Trophy, Play, Zap, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const CATEGORIES = [
  { icon: <Code2 size={28} />, label: 'Programming', color: '#7c3aed', count: '240+ courses' },
  { icon: <Cpu size={28} />, label: 'AI & ML', color: '#06b6d4', count: '180+ courses' },
  { icon: <Globe size={28} />, label: 'Web Dev', color: '#f59e0b', count: '320+ courses' },
  { icon: <BookOpen size={28} />, label: 'Data Science', color: '#10b981', count: '150+ courses' },
  { icon: <Zap size={28} />, label: 'DevOps', color: '#f43f5e', count: '90+ courses' },
  { icon: <Trophy size={28} />, label: 'Cybersecurity', color: '#8b5cf6', count: '70+ courses' },
]

const TESTIMONIALS = [
  {
    name: 'Priya Sharma', role: 'Software Engineer', initials: 'PS',
    color: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
    text: 'LearnFlow helped me go from beginner to job-ready in just 4 months. The structured courses and progress tracking kept me motivated.',
    rating: 5,
  },
  {
    name: 'Rahul Verma', role: 'Full Stack Developer', initials: 'RV',
    color: 'linear-gradient(135deg, #f59e0b, #f43f5e)',
    text: 'Absolutely love the video sequencing. I could track my progress on each lesson and never felt lost. 10/10 would recommend!',
    rating: 5,
  },
  {
    name: 'Ananya Patel', role: 'Data Analyst', initials: 'AP',
    color: 'linear-gradient(135deg, #10b981, #06b6d4)',
    text: 'The course catalog is phenomenal. I landed my dream job after completing the Data Science track on LearnFlow.',
    rating: 5,
  },
]

const STATS = [
  { value: '50K+', label: 'Active Students', icon: <Users size={20} /> },
  { value: '800+', label: 'Expert Courses', icon: <BookOpen size={20} /> },
  { value: '95%', label: 'Completion Rate', icon: <Trophy size={20} /> },
  { value: '4.8★', label: 'Avg. Rating', icon: <Star size={20} /> },
]

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* ─── HERO ─────────────────────────────── */}
      <section
        className="hero-section"
        style={{ minHeight: '580px' }}
      >
        <div
          className="hero-bg"
          style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
        />
        <div className="hero-overlay" />

        <div className="hero-content" style={{ width: '100%', maxWidth: 1280, margin: '0 auto', padding: '80px 24px 80px' }}>
          <div style={{ maxWidth: 640 }}>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 999,
              background: 'rgba(124,58,237,0.25)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(124,58,237,0.4)',
              color: '#c4b5fd', fontSize: 13, fontWeight: 600,
              marginBottom: 24,
            }}
              className="animate-fadeInUp"
            >
              <Zap size={14} /> World-Class Online Learning
            </div>

            <h1
              className="animate-fadeInUp delay-100"
              style={{
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(36px,6vw,64px)',
                color: '#fff', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 20,
              }}
            >
              Learn Without{' '}
              <span style={{
                background: 'linear-gradient(90deg, #a78bfa, #06b6d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Limits
              </span>
            </h1>

            <p
              className="animate-fadeInUp delay-200"
              style={{ fontSize: 18, color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, marginBottom: 36 }}
            >
              Track your progress, master new skills, and launch your career with expert-led courses.
              Join 50,000+ learners on LearnFlow today.
            </p>

            <div
              className="animate-fadeInUp delay-300"
              style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
            >
              <Link to="/signup" className="btn-primary" style={{ fontSize: 16, padding: '13px 28px', borderRadius: 12 }}>
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/signup" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '13px 28px', borderRadius: 12, fontSize: 16, fontWeight: 600,
                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(255,255,255,0.25)', color: '#fff',
                textDecoration: 'none', transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <Play size={18} fill="#fff" /> Browse Courses
              </Link>
            </div>

            {/* Social proof */}
            <div className="animate-fadeInUp delay-400" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 36 }}>
              <div style={{ display: 'flex' }}>
                {['#7c3aed','#06b6d4','#f59e0b','#10b981'].map((c, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: c, border: '2px solid rgba(255,255,255,0.3)',
                    marginLeft: i > 0 ? -10 : 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 11, fontWeight: 700,
                  }}>
                    {['R','S','A','V'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="#f59e0b" stroke="none" />)}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>
                  Loved by 50,000+ learners
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─────────────────────────────── */}
      <section style={{
        background: 'var(--brand-primary)',
        padding: '28px 24px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,0.7)' }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CATEGORIES ─────────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
              <BookOpen size={14} /> Explore Topics
            </div>
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">Choose from top categories and start learning in minutes</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 16,
          }}>
            {CATEGORIES.map((cat, i) => (
              <Link
                key={i}
                to="/signup"
                className="category-pill"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: `${cat.color}18`,
                  border: `1.5px solid ${cat.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: cat.color,
                }}>
                  {cat.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{cat.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{cat.count}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED COURSES ─────────────────── */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="section-eyebrow"><Zap size={14} /> Top Picks</div>
              <h2 className="section-title">Featured Courses</h2>
            </div>
            <Link to="/signup" className="btn-secondary" style={{ fontSize: 14 }}>
              View All Courses <ArrowRight size={16} />
            </Link>
          </div>

          {/* Horizontal scroll cards */}
          <div style={{
            display: 'flex', gap: 20, overflowX: 'auto',
            paddingBottom: 16,
            scrollbarWidth: 'thin',
          }}>
            {[
              { title: 'Complete Python Bootcamp', cat: 'Programming', instructor: 'Dr. Anil Kumar', rating: 4.8, price: '₹899', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80' },
              { title: 'Machine Learning A-Z', cat: 'AI & ML', instructor: 'Prof. Sunita Singh', rating: 4.9, price: '₹1,299', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&q=80' },
              { title: 'React & Next.js Mastery', cat: 'Web Dev', instructor: 'Rajan Mehta', rating: 4.7, price: '₹799', img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80' },
              { title: 'Data Science with Python', cat: 'Data Science', instructor: 'Dr. Kavya Reddy', rating: 4.8, price: '₹999', img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&q=80' },
              { title: 'AWS Cloud Practitioner', cat: 'DevOps', instructor: 'Vikram Nair', rating: 4.6, price: '₹1,599', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80' },
            ].map((c, i) => (
              <div key={i} style={{
                minWidth: 260, borderRadius: 14,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                overflow: 'hidden', flexShrink: 0,
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
              >
                <img src={c.img} alt={c.title} style={{ width: '100%', height: 150, objectFit: 'cover' }} />
                <div style={{ padding: '14px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-primary)', letterSpacing: '0.07em', marginBottom: 6 }}>{c.cat}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 6 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{c.instructor}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                    <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: 13 }}>{c.rating}</span>
                    {[1,2,3,4,5].map(j => <Star key={j} size={11} fill={j <= Math.floor(c.rating) ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth={1.5} />)}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>{c.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}><Star size={14} /> Students Love Us</div>
            <h2 className="section-title">What Our Students Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                padding: 28, borderRadius: 18,
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
              >
                {/* Stars */}
                <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                  {[1,2,3,4,5].map(j => <Star key={j} size={14} fill="#f59e0b" stroke="none" />)}
                </div>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: t.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: 14,
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────── */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #4c1d95, #7c3aed, #1e40af)',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 40, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Ready to Start Learning?
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 36, lineHeight: 1.6 }}>
            Join thousands of students who have already transformed their careers with LearnFlow.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 12,
              background: '#fff', color: 'var(--brand-primary)',
              fontWeight: 800, fontSize: 16, textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)' }}
            >
              Create Free Account <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────── */}
      <footer style={{ background: '#09090b', padding: '48px 24px 32px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 12,
          }}>LF</div>
          <span style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16 }}>LearnFlow</span>
        </div>
        <p style={{ fontSize: 13, marginBottom: 8 }}>© 2024 LearnFlow. Built for learners. Powered by passion.</p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 16 }}>
          {['Privacy Policy', 'Terms of Service', 'Contact Us'].map(l => (
            <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
