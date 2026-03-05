import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

function HeroSection() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">Personal AI Infrastructure</h1>
        <p className="hero__subtitle">
          Auto-generated documentation for Daniel Miessler&rsquo;s{' '}
          <a href="https://github.com/danielmiessler/Personal_AI_Infrastructure">
            Personal AI Infrastructure
          </a>{' '}
          (PAI) project &mdash; an open-source agent that remembers you, learns from you,
          and magnifies your capabilities through AI.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/user/what-is-pai">
            What is Personal AI Infrastructure? &rarr;
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
      'Discover what Personal AI Infrastructure is, how it remembers and learns, then install it and run your first session.',
    link: '/user/what-is-pai',
    linkText: 'Get started \u2192',
  },
  {
    title: '\u26A1 Power-Users',
    description:
      'Learn how customisation works, then make your AI yours \u2014 personality, skills, and behaviour rules.',
    link: '/power-user/how-customization-works',
    linkText: 'Understand customisation \u2192',
  },
  {
    title: '\uD83D\uDD27 Developers',
    description:
      "Understand the extension model, then build skills, write hooks, and set up agents.",
    link: '/developer/extension-model',
    linkText: 'Understand extensions \u2192',
  },
  {
    title: '\uD83C\uDFD7\uFE0F Contributors',
    description:
      'Explore the architecture, the Algorithm, memory, and design philosophy behind the system.',
    link: '/contributor/architecture',
    linkText: 'Explore architecture \u2192',
  },
];

function CardGrid() {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2>Find what you need</h2>
        <p>
          Personal AI Infrastructure is an agent that magnifies your capabilities &mdash; it
          remembers you, learns from you, and has dozens of specialised skills that activate
          automatically. These docs are organised by role so you can jump straight to what
          matters:
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
        <h2>What makes Personal AI Infrastructure different</h2>
        <ul>
          <li>
            <strong>It&rsquo;s an agent, not a chatbot.</strong> It doesn&rsquo;t just generate
            text &mdash; it thinks about your problem, brings specialised skills to bear, delegates
            to other agents, and verifies its own work.
          </li>
          <li>
            <strong>It remembers.</strong> Your projects, preferences, and past conversations persist
            across every session. No re-explaining. No starting over.
          </li>
          <li>
            <strong>It learns from you.</strong> Rate responses 1-10 and your AI adapts to how you
            think and work. The AI you use on day 90 is measurably better than day 1.
          </li>
          <li>
            <strong>It has real capabilities.</strong> 27+ specialised skills &mdash; from deep
            research to security testing to visual content &mdash; that activate automatically based
            on what you need.
          </li>
          <li>
            <strong>It knows your goals.</strong> Your mission, projects, and priorities factor
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
      title="Personal AI Infrastructure — Documentation"
      description="Auto-generated documentation for Daniel Miessler's Personal AI Infrastructure (PAI) project. Structured with Diataxis for users, power users, developers, and contributors."
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
                    Personal AI Infrastructure
                  </a>{' '}
                  (PAI), created by <strong>Daniel Miessler</strong>. The PAI project focuses on
                  building the system itself &mdash; this site complements it by providing
                  structured, role-based documentation organised using the{' '}
                  <a href="https://diataxis.fr/">Diataxis framework</a>
                  : tutorials for learning, how-to guides for tasks, reference for lookup,
                  and explanations for understanding. Maintained by{' '}
                  <a href="https://github.com/virtualian">@virtualian</a>. For the official source,
                  visit{' '}
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
