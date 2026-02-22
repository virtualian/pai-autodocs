import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

function HeroSection() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">PAI Auto-Docs</h1>
        <p className="hero__subtitle">
          AI-generated documentation for PAI &mdash; Personal AI Infrastructure by Daniel Miessler.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/user/what-is-pai">
            What is PAI? &rarr;
          </Link>
          <Link className="button button--outline button--lg" to="/about">
            About this site
          </Link>
        </div>
      </div>
    </header>
  );
}

const cards = [
  {
    title: '\uD83D\uDC64 Users',
    description:
      'Discover what PAI is, how it remembers and learns, then install it and run your first session.',
    link: '/user/what-is-pai',
    linkText: 'Understand PAI \u2192',
  },
  {
    title: '\u26A1 Power-Users',
    description:
      'Learn how customisation works, then make PAI yours \u2014 personality, skills, and behaviour rules.',
    link: '/power-user/how-customization-works',
    linkText: 'Understand customisation \u2192',
  },
  {
    title: '\uD83D\uDD27 Developers',
    description:
      "Understand PAI's extension model, then build skills, write hooks, and set up agents.",
    link: '/developer/extension-model',
    linkText: 'Understand extensions \u2192',
  },
  {
    title: '\uD83C\uDFD7\uFE0F Contributors',
    description:
      'Explore the architecture, the Algorithm, memory, and design philosophy behind PAI.',
    link: '/contributor/architecture',
    linkText: 'Explore architecture \u2192',
  },
];

function CardGrid() {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2>What can PAI do for me?</h2>
        <p>
          PAI is an agent that magnifies your capabilities. It remembers you, learns from you, and
          has dozens of specialised skills that activate automatically. It follows a structured
          Algorithm to solve problems systematically. Here&rsquo;s how to find what you need:
        </p>
        <div className="row">
          {cards.map((card, idx) => (
            <div key={idx} className={clsx('col col--6', styles.featureCard)}>
              <div className="card shadow--md">
                <div className="card__header">
                  <h3>{card.title}</h3>
                </div>
                <div className="card__body">
                  <p>{card.description}</p>
                </div>
                <div className="card__footer">
                  <Link className="button button--primary button--sm" to={card.link}>
                    {card.linkText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DifferentiatorSection() {
  return (
    <section className={styles.differentiators}>
      <div className="container">
        <h2>What makes PAI different</h2>
        <ul>
          <li>
            <strong>It&rsquo;s an agent, not a chatbot.</strong> PAI doesn&rsquo;t just generate
            text &mdash; it thinks about your problem, brings specialised skills to bear, delegates
            to other agents, and verifies its own work.
          </li>
          <li>
            <strong>It remembers.</strong> Your projects, preferences, and past conversations persist
            across every session. No re-explaining. No starting over.
          </li>
          <li>
            <strong>It learns from you.</strong> Rate responses 1-10 and PAI adapts to how you think
            and work. The AI you use on day 90 is measurably better than day 1.
          </li>
          <li>
            <strong>It has real capabilities.</strong> 27+ specialised skills &mdash; from deep
            research to security testing to visual content &mdash; that activate automatically based
            on what you need.
          </li>
          <li>
            <strong>It knows your goals.</strong> PAI factors your mission, projects, and priorities
            into every interaction. Context is the starting point, not an afterthought.
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  return (
    <Layout
      title="PAI Auto-Docs"
      description="AI-generated documentation for Personal AI Infrastructure by Daniel Miessler"
    >
      <HeroSection />
      <main>
        <div className={styles.noteBox}>
          <div className="container">
            <div className="admonition admonition-note alert alert--secondary">
              <div className="admonition-heading">
                <h5>About these docs</h5>
              </div>
              <div className="admonition-content">
                <p>
                  This is an <strong>unofficial</strong>, AI-generated documentation site for{' '}
                  <a href="https://github.com/danielmiessler/Personal_AI_Infrastructure">
                    PAI (Personal AI Infrastructure)
                  </a>{' '}
                  created by <strong>Daniel Miessler</strong>. Content is generated by Claude,
                  organised using the{' '}
                  <a href="https://diataxis.fr/">Diataxis framework</a>, and maintained by{' '}
                  <a href="https://github.com/virtualian">@virtualian</a>. For the official PAI
                  source, visit{' '}
                  <a href="https://github.com/danielmiessler/Personal_AI_Infrastructure">
                    Daniel&rsquo;s repository
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
        <CardGrid />
        <DifferentiatorSection />
      </main>
    </Layout>
  );
}
