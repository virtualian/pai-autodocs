/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    // ── Users ──
    {
      type: 'category',
      label: 'Users',
      items: [
        { type: 'doc', id: 'user/overview', label: 'Start Here' },
        {
          type: 'category',
          label: 'Explanation',
          items: [
            { type: 'doc', id: 'user/what-is-pai', label: 'What is Personal AI Infrastructure?' },
            { type: 'doc', id: 'user/the-algorithm', label: 'The Algorithm' },
            { type: 'doc', id: 'user/telos', label: 'Telos: Your Goals' },
            { type: 'doc', id: 'user/fabric', label: 'Fabric Patterns' },
            { type: 'doc', id: 'user/memory', label: 'Your AI Remembers' },
            { type: 'doc', id: 'user/self-improvement', label: 'Your AI Gets Better' },
          ],
        },
        {
          type: 'category',
          label: 'Tutorials',
          items: [
            { type: 'doc', id: 'user/install-pai', label: 'Install PAI' },
            { type: 'doc', id: 'user/first-session', label: 'Your First Session' },
            { type: 'doc', id: 'user/set-up-telos', label: 'Set Up Your Telos' },
            { type: 'doc', id: 'user/first-fabric-pattern', label: 'Your First Fabric Pattern' },
            { type: 'doc', id: 'user/first-rating', label: 'Your First Rating' },
          ],
        },
        {
          type: 'category',
          label: 'How-to',
          items: [
            { type: 'doc', id: 'user/working-with-skills', label: 'Work With Skills' },
            { type: 'doc', id: 'user/research-topics', label: 'Research a Topic' },
            { type: 'doc', id: 'user/analyze-content', label: 'Analyze Content' },
            { type: 'doc', id: 'user/use-fabric-patterns', label: 'Use Fabric Patterns' },
            { type: 'doc', id: 'user/think-through-decisions', label: 'Think Through Decisions' },
            { type: 'doc', id: 'user/create-visuals', label: 'Create Visual Content' },
            { type: 'doc', id: 'user/manage-goals', label: 'Manage Your Goals' },
            { type: 'doc', id: 'user/manage-memory', label: 'Manage Your Memory' },
            { type: 'doc', id: 'user/giving-feedback', label: 'Give Feedback' },
          ],
        },
        {
          type: 'category',
          label: 'Reference',
          items: [
            { type: 'doc', id: 'user/skills-catalog', label: 'Skills Catalog' },
            { type: 'doc', id: 'user/telos-reference', label: 'Telos Reference' },
            { type: 'doc', id: 'user/fabric-patterns-reference', label: 'Fabric Patterns Reference' },
            { type: 'doc', id: 'user/memory-reference', label: 'Memory Reference' },
          ],
        },
      ],
    },
    // ── Power-Users ──
    {
      type: 'category',
      label: 'Power-Users',
      items: [
        { type: 'doc', id: 'power-user/overview', label: 'Start Here' },
        {
          type: 'category',
          label: 'Explanation',
          items: [
            { type: 'doc', id: 'power-user/how-customization-works', label: 'How Customisation Works' },
          ],
        },
        {
          type: 'category',
          label: 'Tutorials',
          items: [
            { type: 'doc', id: 'power-user/customize-your-ai', label: 'Customise Your AI' },
          ],
        },
        {
          type: 'category',
          label: 'How-to',
          items: [
            { type: 'doc', id: 'power-user/configure-skills', label: 'Configure Skills' },
          ],
        },
        {
          type: 'category',
          label: 'Reference',
          items: [
            { type: 'doc', id: 'power-user/configuration', label: 'Configuration Reference' },
          ],
        },
      ],
    },
    // ── Developers ──
    {
      type: 'category',
      label: 'Developers',
      items: [
        { type: 'doc', id: 'developer/overview', label: 'Start Here' },
        {
          type: 'category',
          label: 'Explanation',
          items: [
            { type: 'doc', id: 'developer/extension-model', label: 'The Extension Model' },
          ],
        },
        {
          type: 'category',
          label: 'Tutorials',
          items: [
            { type: 'doc', id: 'developer/first-skill', label: 'Your First Skill' },
            { type: 'doc', id: 'developer/first-hook', label: 'Your First Hook' },
          ],
        },
        {
          type: 'category',
          label: 'How-to',
          items: [
            { type: 'doc', id: 'developer/write-hooks', label: 'Write Hooks' },
            { type: 'doc', id: 'developer/manage-memory', label: 'Manage Memory' },
            { type: 'doc', id: 'developer/set-up-agents', label: 'Set Up Agents' },
          ],
        },
        {
          type: 'category',
          label: 'Reference',
          items: [
            { type: 'doc', id: 'developer/algorithm', label: 'Algorithm Reference' },
            { type: 'doc', id: 'developer/hook-types', label: 'Hook Types' },
            { type: 'doc', id: 'developer/agent-types', label: 'Agent Types' },
            { type: 'doc', id: 'developer/tools-reference', label: 'Tools Reference' },
          ],
        },
      ],
    },
    // ── Contributors ──
    {
      type: 'category',
      label: 'Contributors',
      items: [
        { type: 'doc', id: 'contributor/overview', label: 'Start Here' },
        {
          type: 'category',
          label: 'Explanation',
          items: [
            { type: 'doc', id: 'contributor/architecture', label: 'System Architecture' },
            { type: 'doc', id: 'contributor/the-algorithm', label: 'The PAI Algorithm' },
            { type: 'doc', id: 'contributor/memory-and-learning', label: 'Memory & Learning' },
            { type: 'doc', id: 'contributor/cli-first', label: 'CLI-First Design' },
            { type: 'doc', id: 'contributor/system-user-model', label: 'SYSTEM/USER Model' },
          ],
        },
        {
          type: 'category',
          label: 'How-to',
          items: [
            { type: 'doc', id: 'contributor/upgrade-pai', label: 'Upgrade PAI' },
          ],
        },
      ],
    },
    // ── Site pages ──
    {
      type: 'category',
      label: 'About This Site',
      items: [
        { type: 'doc', id: 'about', label: 'Overview' },
        { type: 'doc', id: 'changelog', label: 'Changelog' },
      ],
    },
  ],
};

export default sidebars;
