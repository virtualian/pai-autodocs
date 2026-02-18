// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'PAI Auto-Docs',
			description: 'AI-generated documentation for Personal AI Infrastructure',
			customCss: ['./src/styles/custom.css'],
			social: [
				{ icon: 'github', label: 'PAI by Daniel Miessler', href: 'https://github.com/danielmiessler/Personal_AI_Infrastructure' },
			],
			components: {
				Footer: './src/components/Footer.astro',
			},
			head: [
				// ── Banner: Daniel Miessler attribution ──
				{
					tag: 'script',
					content: `
						document.addEventListener('DOMContentLoaded', () => {
							if (!document.querySelector('.pai-banner')) {
								const banner = document.createElement('div');
								banner.className = 'pai-banner';
								banner.innerHTML = '<strong><a href="https://github.com/danielmiessler">Daniel Miessler</a></strong>\\'s <a href="https://github.com/danielmiessler/Personal_AI_Infrastructure">PAI</a> \\u2014 Unofficial, AI-generated documentation \\u00b7 <a href="/about/">About this site</a>';
								document.body.prepend(banner);
							}
						});
					`,
				},
				// ── Source badges + Diataxis type labels ──
				{
					tag: 'script',
					content: `
						document.addEventListener('DOMContentLoaded', () => {
							var path = window.location.pathname.replace(/^\\/|\\/$|^\\/pai-autodocs\\//g, '');
							if (!path || path === 'about' || path === 'changelog') return;

							var sourceMap = {
								'user/what-is-pai': ['SKILL.md', 'SYSTEM/PAISYSTEMARCHITECTURE.md'],
								'user/install-pai': ['README.md'],
								'user/first-session': ['SKILL.md', 'SYSTEM/PAISYSTEMARCHITECTURE.md'],
								'user/memory': ['SYSTEM/MEMORYSYSTEM.md'],
								'user/self-improvement': ['SKILL.md', 'SYSTEM/MEMORYSYSTEM.md'],
								'user/working-with-skills': ['SKILL.md', 'SYSTEM/SKILLSYSTEM.md'],
								'user/giving-feedback': ['SKILL.md', 'SYSTEM/MEMORYSYSTEM.md'],
								'user/skills-catalog': ['SYSTEM/SKILLSYSTEM.md'],
								'power-user/how-customization-works': ['SYSTEM/PAISYSTEMARCHITECTURE.md', 'settings.json'],
								'power-user/customize-your-ai': ['settings.json'],
								'power-user/configure-skills': ['SYSTEM/SKILLSYSTEM.md'],
								'power-user/configuration': ['settings.json', 'SYSTEM/MEMORYSYSTEM.md'],
								'developer/extension-model': ['SYSTEM/SKILLSYSTEM.md', 'SYSTEM/THEHOOKSYSTEM.md', 'SYSTEM/PAIAGENTSYSTEM.md'],
								'developer/first-skill': ['SKILL.md', 'SYSTEM/SKILLSYSTEM.md'],
								'developer/first-hook': ['SYSTEM/THEHOOKSYSTEM.md'],
								'developer/write-hooks': ['SYSTEM/THEHOOKSYSTEM.md', 'settings.json'],
								'developer/manage-memory': ['SYSTEM/MEMORYSYSTEM.md'],
								'developer/set-up-agents': ['SYSTEM/PAIAGENTSYSTEM.md', 'SYSTEM/THEDELEGATIONSYSTEM.md'],
								'developer/algorithm': ['SKILL.md', 'SYSTEM/PAISYSTEMARCHITECTURE.md'],
								'developer/hook-types': ['SYSTEM/THEHOOKSYSTEM.md', 'settings.json'],
								'developer/agent-types': ['SYSTEM/PAIAGENTSYSTEM.md', 'SYSTEM/THEDELEGATIONSYSTEM.md'],
								'developer/tools-reference': ['SYSTEM/TOOLS.md', 'SYSTEM/BROWSERAUTOMATION.md', 'SYSTEM/THENOTIFICATIONSYSTEM.md'],
								'contributor/architecture': ['SKILL.md', 'SYSTEM/PAISYSTEMARCHITECTURE.md', 'README.md'],
								'contributor/the-algorithm': ['SKILL.md', 'SYSTEM/PAISYSTEMARCHITECTURE.md'],
								'contributor/cli-first': ['SYSTEM/CLIFIRSTARCHITECTURE.md', 'SYSTEM/PAISYSTEMARCHITECTURE.md'],
								'contributor/system-user-model': ['SYSTEM/PAISYSTEMARCHITECTURE.md'],
								'contributor/memory-and-learning': ['SYSTEM/MEMORYSYSTEM.md'],
								'contributor/upgrade-pai': ['settings.json']
							};

							var diataxisMap = {
								'user/what-is-pai': 'explanation',
								'user/memory': 'explanation',
								'user/self-improvement': 'explanation',
								'user/install-pai': 'tutorial',
								'user/first-session': 'tutorial',
								'user/giving-feedback': 'how-to',
								'user/working-with-skills': 'how-to',
								'user/skills-catalog': 'reference',
								'power-user/how-customization-works': 'explanation',
								'power-user/customize-your-ai': 'tutorial',
								'power-user/configure-skills': 'how-to',
								'power-user/configuration': 'reference',
								'developer/extension-model': 'explanation',
								'developer/first-skill': 'tutorial',
								'developer/first-hook': 'tutorial',
								'developer/write-hooks': 'how-to',
								'developer/manage-memory': 'how-to',
								'developer/set-up-agents': 'how-to',
								'developer/algorithm': 'reference',
								'developer/hook-types': 'reference',
								'developer/agent-types': 'reference',
								'developer/tools-reference': 'reference',
								'contributor/architecture': 'explanation',
								'contributor/the-algorithm': 'explanation',
								'contributor/memory-and-learning': 'explanation',
								'contributor/cli-first': 'explanation',
								'contributor/system-user-model': 'explanation',
								'contributor/upgrade-pai': 'how-to'
							};

							var labels = {
								'explanation': 'Explanation',
								'tutorial': 'Tutorial',
								'how-to': 'How-to Guide',
								'reference': 'Reference'
							};

							var titleEl = document.querySelector('main h1');
							if (!titleEl) return;

							var dtype = diataxisMap[path];
							if (dtype) {
								var badge = document.createElement('span');
								badge.className = 'diataxis-badge diataxis-badge--' + dtype;
								badge.textContent = labels[dtype];
								titleEl.parentNode.insertBefore(badge, titleEl);
							}

							var sources = sourceMap[path];
							if (sources && sources.length > 0) {
								var container = document.createElement('div');
								container.className = 'source-badges';
								container.setAttribute('aria-label', 'PAI source files');
								sources.forEach(function(source) {
									var a = document.createElement('a');
									a.className = 'source-badge';
									a.href = 'https://github.com/danielmiessler/Personal_AI_Infrastructure/blob/main/' + source;
									a.target = '_blank';
									a.rel = 'noopener';
									a.textContent = source.replace('SYSTEM/', '');
									container.appendChild(a);
								});
								titleEl.parentNode.insertBefore(container, titleEl.nextSibling);
							}
						});
					`,
				},
				// ── OG metadata ──
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
				// ── Mermaid diagrams ──
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
								primaryColor: '#60A5FA',
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
							label: 'Explanation',
							items: [
								{ label: 'What is PAI?', slug: 'user/what-is-pai' },
								{ label: 'Your AI Remembers', slug: 'user/memory' },
								{ label: 'Your AI Gets Better', slug: 'user/self-improvement' },
							],
						},
						{
							label: 'Tutorials',
							items: [
								{ label: 'Install PAI', slug: 'user/install-pai' },
								{ label: 'Your First Session', slug: 'user/first-session' },
							],
						},
						{
							label: 'How-to Guides',
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
							label: 'Explanation',
							items: [
								{ label: 'How Customisation Works', slug: 'power-user/how-customization-works' },
							],
						},
						{
							label: 'Tutorials',
							items: [
								{ label: 'Customise Your AI', slug: 'power-user/customize-your-ai' },
							],
						},
						{
							label: 'How-to Guides',
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
							label: 'Explanation',
							items: [
								{ label: 'The Extension Model', slug: 'developer/extension-model' },
							],
						},
						{
							label: 'Tutorials',
							items: [
								{ label: 'Your First Skill', slug: 'developer/first-skill' },
								{ label: 'Your First Hook', slug: 'developer/first-hook' },
							],
						},
						{
							label: 'How-to Guides',
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
							label: 'Explanation',
							items: [
								{ label: 'System Architecture', slug: 'contributor/architecture' },
								{ label: 'The Algorithm', slug: 'contributor/the-algorithm' },
								{ label: 'Memory & Learning', slug: 'contributor/memory-and-learning' },
								{ label: 'CLI-First Design', slug: 'contributor/cli-first' },
								{ label: 'SYSTEM/USER Model', slug: 'contributor/system-user-model' },
							],
						},
						{
							label: 'How-to Guides',
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
