// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://raph-docs.pages.dev',
	integrations: [
		starlight({
			title: 'raph',
			description:
				'Local-first graph-vector brain for coding agents: realtime codebase sync, ripgrep-style search, scoped memory, rules, local docs and handoffs.',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/tesh254/raph' }],
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'Introduction', slug: 'index' },
						{ label: 'Getting started', slug: 'getting-started' },
						{ label: 'Concepts', slug: 'concepts' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Realtime sync', slug: 'guides/sync' },
						{ label: 'Search', slug: 'guides/search' },
						{ label: 'Memory', slug: 'guides/memory' },
						{ label: 'Rules', slug: 'guides/rules' },
						{ label: 'Documents & handoffs', slug: 'guides/documents' },
						{ label: 'Export & transfer', slug: 'guides/export' },
					],
				},
				{
					label: 'Agents',
					items: [
						{ label: 'MCP & CLI', slug: 'agents/mcp-and-cli' },
						{ label: 'Plugins', slug: 'agents/plugins' },
						{ label: 'Skill', slug: 'agents/skill' },
					],
				},
				{
					label: 'Reference',
					items: [{ label: 'CLI commands', slug: 'reference/cli' }],
				},
			],
		}),
	],
});
