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
								banner.innerHTML = 'Docs for <a href="https://github.com/danielmiessler/Personal_AI_Infrastructure">PAI</a> v3.0 (Algorithm v1.5.0) by <strong>Daniel Miessler</strong> — AI-generated and community-maintained.';
								document.body.prepend(banner);
							}
						});
					`,
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:title',
						content: 'PAI Auto-Docs — AI-Generated Documentation for Personal AI Infrastructure',
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
				{
					label: 'Getting Started',
					items: [
						{ label: 'What is PAI?', slug: 'getting-started/what-is-pai' },
						{ label: 'Install PAI', slug: 'getting-started/install-pai' },
						{ label: 'First Session', slug: 'getting-started/first-session' },
					],
				},
				{
					label: 'Using PAI',
					items: [
						{ label: 'Your AI Remembers', slug: 'using-pai/memory' },
						{ label: 'Your AI Gets Better', slug: 'using-pai/self-improvement' },
						{ label: 'Working With Skills', slug: 'using-pai/working-with-skills' },
						{ label: 'Giving Feedback', slug: 'using-pai/giving-feedback' },
						{ label: 'Skills Catalog', slug: 'using-pai/skills-catalog' },
					],
				},
				{
					label: 'Customizing PAI',
					items: [
						{ label: 'Customize Your AI', slug: 'customizing/customize-your-ai' },
						{ label: 'Configure Skills', slug: 'customizing/configure-skills' },
						{ label: 'Configuration Reference', slug: 'customizing/configuration' },
					],
				},
				{
					label: 'Developing PAI',
					items: [
						{ label: 'Your First Skill', slug: 'developing/first-skill' },
						{ label: 'Your First Hook', slug: 'developing/first-hook' },
						{ label: 'Write Hooks', slug: 'developing/write-hooks' },
						{ label: 'Manage Memory', slug: 'developing/manage-memory' },
						{ label: 'Set Up Agents', slug: 'developing/set-up-agents' },
						{ label: 'Algorithm Reference', slug: 'developing/algorithm' },
						{ label: 'Hook Types', slug: 'developing/hook-types' },
						{ label: 'Agent Types', slug: 'developing/agent-types' },
						{ label: 'Tools Reference', slug: 'developing/tools-reference' },
						{ label: 'Architecture', slug: 'developing/architecture' },
						{ label: 'The Algorithm', slug: 'developing/the-algorithm' },
						{ label: 'CLI-First Design', slug: 'developing/cli-first' },
						{ label: 'SYSTEM/USER Model', slug: 'developing/system-user-model' },
						{ label: 'Memory and Learning', slug: 'developing/memory-and-learning' },
					],
				},
				{
					label: 'Contributing',
					items: [
						{ label: 'Upgrade PAI', slug: 'contributing/upgrade-pai' },
					],
				},
				{
					label: 'Changelog',
					items: [
						{ label: 'Changelog', slug: 'changelog' },
					],
				},
			],
		}),
	],
});
