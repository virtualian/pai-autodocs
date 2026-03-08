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
            { type: 'doc', id: 'user/privacy', label: 'Privacy and Your Data' },
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
            { type: 'doc', id: 'user/troubleshooting', label: 'Troubleshooting' },
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
            { type: 'doc', id: 'power-user/system-user-boundary', label: 'SYSTEM vs USER Boundary' },
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
            { type: 'doc', id: 'power-user/voice-notifications', label: 'Configure Voice and Notifications' },
            { type: 'doc', id: 'power-user/customise-behaviour', label: 'Customise PAI Behaviour' },
          ],
        },
        {
          type: 'category',
          label: 'Reference',
          items: [
            { type: 'doc', id: 'power-user/configuration', label: 'Configuration Reference' },
            { type: 'doc', id: 'power-user/steering-rules', label: 'Steering Rules Reference' },
            { type: 'doc', id: 'power-user/context-routing', label: 'Context Routing Reference' },
            { type: 'doc', id: 'power-user/claude-md-anatomy', label: 'CLAUDE.md Anatomy' },
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
            { type: 'doc', id: 'developer/skill-lifecycle', label: 'Skill Lifecycle' },
            { type: 'doc', id: 'developer/agent-architecture', label: 'Agent Architecture' },
          ],
        },
        {
          type: 'category',
          label: 'Tutorials',
          items: [
            { type: 'doc', id: 'developer/first-skill', label: 'Your First Skill' },
            { type: 'doc', id: 'developer/first-hook', label: 'Your First Hook' },
            { type: 'doc', id: 'developer/first-cli-tool', label: 'Your First CLI Tool' },
          ],
        },
        {
          type: 'category',
          label: 'How-to',
          items: [
            { type: 'doc', id: 'developer/write-hooks', label: 'Write Hooks' },
            { type: 'doc', id: 'developer/manage-memory', label: 'Manage Memory' },
            { type: 'doc', id: 'developer/set-up-agents', label: 'Set Up Agents' },
            { type: 'doc', id: 'developer/testing', label: 'Test PAI Components' },
            { type: 'doc', id: 'developer/debugging', label: 'Debug and Troubleshoot' },
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
            { type: 'doc', id: 'developer/skill-file-format', label: 'Skill File Format' },
            { type: 'doc', id: 'developer/workflow-file-format', label: 'Workflow File Format' },
            { type: 'doc', id: 'developer/memory-file-format', label: 'Memory File Format' },
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
          label: 'Tutorials',
          items: [
            { type: 'doc', id: 'contributor/first-contribution', label: 'Your First Contribution' },
          ],
        },
        {
          type: 'category',
          label: 'How-to',
          items: [
            { type: 'doc', id: 'contributor/upgrade-pai', label: 'Upgrade PAI' },
            { type: 'doc', id: 'contributor/add-skill', label: 'Add a Skill to Core' },
            { type: 'doc', id: 'contributor/update-system-files', label: 'Update System Files' },
            { type: 'doc', id: 'contributor/write-principle', label: 'Write a Constitutional Principle' },
          ],
        },
        {
          type: 'category',
          label: 'Reference',
          items: [
            { type: 'doc', id: 'contributor/directory-conventions', label: 'Directory Conventions' },
            { type: 'doc', id: 'contributor/principles', label: 'The 16 Founding Principles' },
            { type: 'doc', id: 'contributor/versioning', label: 'Versioning and Compatibility' },
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
        { type: 'doc', id: 'vercel-web-analytics', label: 'Vercel Web Analytics Guide' },
      ],
    },
  ],
};

export default sidebars;
