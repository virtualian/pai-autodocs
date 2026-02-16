// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'PAI Documentation',
			description: 'Documentation for Personal AI Infrastructure — Agentic AI that magnifies human capabilities.',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/danielmiessler/Personal_AI_Infrastructure' },
			],
			head: [
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
			],
		}),
	],
});
