// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'PAI Auto-Docs',
			description: 'AI-generated documentation for Personal AI Infrastructure',
			social: [
				{ icon: 'github', label: 'PAI by Daniel Miessler', href: 'https://github.com/danielmiessler/Personal_AI_Infrastructure' },
			],
			components: {
				Footer: './src/components/Footer.astro',
			},
			head: [
				{
					tag: 'style',
					content: `
						.pai-banner { background: var(--sl-color-accent-low); color: var(--sl-color-accent-high); text-align: center; padding: 0.5rem 1rem; font-size: 0.85rem; border-bottom: 1px solid var(--sl-color-accent); }
						.pai-banner a { color: var(--sl-color-accent-high); font-weight: 600; text-decoration: underline; }
					`,
				},
				{
					tag: 'script',
					content: `
						document.addEventListener('DOMContentLoaded', () => {
							if (!document.querySelector('.pai-banner')) {
								const banner = document.createElement('div');
								banner.className = 'pai-banner';
								banner.innerHTML = '<strong><a href="https://github.com/danielmiessler">Daniel Miessler</a></strong>\\'s <a href="https://github.com/danielmiessler/Personal_AI_Infrastructure">PAI</a> v3.0 \\u2014 AI-generated docs \\u00b7 <a href="/about/">About this site</a>';
								document.body.prepend(banner);
							}
						});
					`,
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:title',
						content: 'PAI Auto-Docs \u2014 AI-Generated Documentation for Personal AI Infrastructure',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:description',
						content: 'Unofficial, AI-generated documentation for PAI (Personal AI Infrastructure) by Daniel Miessler. Structured with Diataxis. Maintained by the community.',
					},
				},
				{
					tag: 'script',
					attrs: {
						type: 'module',
					},
					content: `
						import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
						mermaid.initialize({
							startOnLoad: true,
							theme: 'neutral',
							themeVariables: {
								primaryColor: '#3b82f6',
								primaryTextColor: '#1e293b',
								primaryBorderColor: '#93c5fd',
								lineColor: '#64748b',
								secondaryColor: '#e0f2fe',
								tertiaryColor: '#f0f9ff',
								fontFamily: 'system-ui, sans-serif',
							},
						});
					`,
				},
			],
			sidebar: [
				// ── User: Use PAI ──
				{
					label: 'User \u2014 Use PAI',
					items: [
						{
							label: 'Understand',
							items: [
								{ label: 'What is PAI?', slug: 'user/what-is-pai' },
								{ label: 'Your AI Remembers', slug: 'user/memory' },
								{ label: 'Your AI Gets Better', slug: 'user/self-improvement' },
							],
						},
						{
							label: 'Get Started',
							items: [
								{ label: 'Install PAI', slug: 'user/install-pai' },
								{ label: 'Your First Session', slug: 'user/first-session' },
							],
						},
						{
							label: 'Guides',
							items: [
								{ label: 'Give Feedback', slug: 'user/giving-feedback' },
								{ label: 'Work With Skills', slug: 'user/working-with-skills' },
							],
						},
						{
							label: 'Reference',
							items: [
								{ label: 'Skills Catalog', slug: 'user/skills-catalog' },
							],
						},
					],
				},
				// ── Power User: Customise PAI ──
				{
					label: 'Power User \u2014 Customise PAI',
					items: [
						{
							label: 'Understand',
							items: [
								{ label: 'How Customisation Works', slug: 'power-user/how-customization-works' },
							],
						},
						{
							label: 'Get Started',
							items: [
								{ label: 'Customise Your AI', slug: 'power-user/customize-your-ai' },
							],
						},
						{
							label: 'Guides',
							items: [
								{ label: 'Configure Skills', slug: 'power-user/configure-skills' },
							],
						},
						{
							label: 'Reference',
							items: [
								{ label: 'Configuration Reference', slug: 'power-user/configuration' },
							],
						},
					],
				},
				// ── Developer: Extend PAI ──
				{
					label: 'Developer \u2014 Extend PAI',
					items: [
						{
							label: 'Understand',
							items: [
								{ label: 'The Extension Model', slug: 'developer/extension-model' },
							],
						},
						{
							label: 'Get Started',
							items: [
								{ label: 'Your First Skill', slug: 'developer/first-skill' },
								{ label: 'Your First Hook', slug: 'developer/first-hook' },
							],
						},
						{
							label: 'Guides',
							items: [
								{ label: 'Write Hooks', slug: 'developer/write-hooks' },
								{ label: 'Manage Memory', slug: 'developer/manage-memory' },
								{ label: 'Set Up Agents', slug: 'developer/set-up-agents' },
							],
						},
						{
							label: 'Reference',
							items: [
								{ label: 'Algorithm Reference', slug: 'developer/algorithm' },
								{ label: 'Hook Types', slug: 'developer/hook-types' },
								{ label: 'Agent Types', slug: 'developer/agent-types' },
								{ label: 'Tools Reference', slug: 'developer/tools-reference' },
							],
						},
					],
				},
				// ── Contributor: Improve PAI ──
				{
					label: 'Contributor \u2014 Improve PAI',
					items: [
						{
							label: 'Understand',
							items: [
								{ label: 'System Architecture', slug: 'contributor/architecture' },
								{ label: 'The Algorithm', slug: 'contributor/the-algorithm' },
								{ label: 'Memory & Learning', slug: 'contributor/memory-and-learning' },
								{ label: 'CLI-First Design', slug: 'contributor/cli-first' },
								{ label: 'SYSTEM/USER Model', slug: 'contributor/system-user-model' },
							],
						},
						{
							label: 'Guides',
							items: [
								{ label: 'Upgrade PAI', slug: 'contributor/upgrade-pai' },
							],
						},
					],
				},
				// ── Site ──
				{
					label: 'Changelog',
					items: [
						{ label: 'Changelog', slug: 'changelog' },
					],
				},
				{
					label: 'About',
					items: [
						{ label: 'About This Site', slug: 'about' },
					],
				},
			],
		}),
	],
});
