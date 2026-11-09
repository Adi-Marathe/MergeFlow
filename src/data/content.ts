export const siteCopy = {
  brand: "MergeFlow",
  mascotAlt: "MergeFlow mark",
  skipLink: "Skip to content",
  primaryNavLabel: "Primary navigation",
  footerNavLabel: "Footer navigation",
  navLinks: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Rules", href: "#rules" },
    { label: "Contributors", href: "#contributors" },
    { label: "Questions", href: "#questions" },
  ],
};

export const heroCopy = {
  titleLines: ["AI-assisted pull", "request triage for", "open-source maintainers"],
  summary: "For open-source maintainers, MergeFlow uses code knowledge graphs to connect each pull request to the files and systems it can affect.",
  installLabel: "Install on GitHub",
  demoLabel: "Open the live demo",
  queueLabel: "Open pull requests",
  queueCount: "5",
  facts: [
    { title: "Shadow mode by default", description: "Maintainers see the queue, contributors see nothing." },
    { title: "One reason per pull request", description: "A line you can read at a glance." },
    { title: "Your rules and weights", description: "Start from a preset and replay it on closed pull requests." },
    { title: "Never closes or merges", description: "You make every call." },
    { title: "No source code stored", description: "Only file and symbol names." },
  ],
};

export type PullRequest = {
  rank: number;
  title: string;
  number: string;
  status: string;
  reason: string;
  author: string;
  files: string;
  age: string;
  priority?: boolean;
};

export const pullRequests: PullRequest[] = [
  {
    rank: 1,
    title: "Fix race in token refresh",
    number: "#4821",
    status: "Review first",
    reason: "Changes auth code that 14 files depend on.",
    author: "Returning",
    files: "6 files",
    age: "1d",
    priority: true,
  },
  {
    rank: 2,
    title: "Add retry to webhook client",
    number: "#4809",
    status: "Standard",
    reason: "One module touched, tests added.",
    author: "Returning",
    files: "2 files",
    age: "2d",
  },
  {
    rank: 3,
    title: "Support Windows paths",
    number: "#4802",
    status: "Needs info",
    reason: "No linked issue and no tests.",
    author: "New",
    files: "4 files",
    age: "3d",
  },
  {
    rank: 4,
    title: "Rename config keys",
    number: "#4790",
    status: "Standard",
    reason: "Touches config that 5 modules read.",
    author: "Returning",
    files: "7 files",
    age: "4d",
  },
  {
    rank: 5,
    title: "Fix typo in README",
    number: "#4817",
    status: "Likely low effort",
    reason: "Docs only, nothing depends on it.",
    author: "New",
    files: "1 file",
    age: "1d",
  },
  {
    rank: 6,
    title: "Bump lodash",
    number: "#4796",
    status: "Likely low effort",
    reason: "Lockfile change only.",
    author: "Returning",
    files: "1 file",
    age: "5d",
  },
  {
    rank: 7,
    title: "Update CI matrix",
    number: "#4779",
    status: "Standard",
    reason: "Workflow file only.",
    author: "Returning",
    files: "1 file",
    age: "6d",
  },
];

export const heroQueueItems = [
  pullRequests[0],
  pullRequests[1],
  pullRequests[2],
  { ...pullRequests[4], rank: 4 },
  { ...pullRequests[5], rank: 5 },
];
export const rulesQueueItems = [
  pullRequests[0],
  pullRequests[1],
  pullRequests[2],
  { ...pullRequests[4], rank: 4 },
];

export const pileCopy = {
  statement: "A diff shows what changed, not what depends on it. MergeFlow maps your repo at install, shows what each pull request affects, and puts the one that needs you on top.",
  items: [
    "auth/token.ts",
    "api/session.ts",
    "api/refresh.ts",
    "middleware/auth.ts",
    "models/user.ts",
    "config/jwt.ts",
    "db/pool.ts",
    "utils/retry.ts",
    "test/token.test.ts",
    "webhooks/client.ts",
  ],
};

export const howItWorksCopy = {
  title: "How a pull request gets its place in the queue.",
  stages: [
    {
      title: "Reads the pull request",
      detail: "Reads pull request #4821, its changed files and the context around the change.",
    },
    {
      title: "Checks your rules",
      detail: "Linked issue passes, tests warn, the template fails, and AI-assistance disclosure passes.",
    },
    {
      title: "Traces the graph",
      detail: "Finds which files and symbols depend on what changed. It also overlaps with #4809.",
    },
    {
      title: "Ranks it and says why",
      detail: "Graph impact 0.40, linked issue 0.20, tests 0.20, template 0.10, and AI-assistance disclosure 0.10.",
    },
  ],
  readLines: [
    "Changes auth code that 14 files depend on.",
    "6 files changed; linked issue #4755.",
  ],
  checks: [
    { label: "Linked issue", status: "pass", value: "Linked to #4755." },
    { label: "Tests", status: "warn", value: "No tests changed." },
    { label: "Template", status: "fail", value: "Description is incomplete." },
    { label: "AI-assistance disclosure", status: "pass", value: "Disclosure present." },
  ],
  weights: [
    { label: "Graph impact", value: "0.40" },
    { label: "Linked issue", value: "0.20" },
    { label: "Tests", value: "0.20" },
    { label: "Template", value: "0.10" },
    { label: "AI-assistance disclosure", value: "0.10" },
  ],
  resultStatus: "Review first",
  graphTitle: "Fix race in token refresh",
  graphNumber: "#4821",
  graphAlt: "A dependency graph connecting auth/token.ts to related files.",
  graphFiles: [
    { label: "api/session.ts", x: 80, y: 60, style: "filled" },
    { label: "api/refresh.ts", x: 240, y: 45, style: "filled" },
    { label: "middleware/auth.ts", x: 400, y: 60, style: "filled" },
    { label: "test/token.test.ts", x: 75, y: 230, style: "outline" },
    { label: "config/jwt.ts", x: 240, y: 245, style: "outline" },
    { label: "models/user.ts", x: 405, y: 230, style: "outline" },
  ],
  changedFile: "auth/token.ts",
  overlapLabel: "Overlaps with",
  overlapNumber: "#4809",
};

export const queueCopy = {
  title: "Open the queue and the first row is the one to review.",
  filters: ["Review first", "New contributor", "Sensitive paths"],
  inspectorTitlePrefix: "Why",
  inspectorTitleSuffix: "is first",
  signals: [
    { result: "warn", name: "graph_impact", weight: "0.40", description: "Changes token refresh, which 14 files depend on." },
    { result: "pass", name: "linked_issue", weight: "0.20", description: "Linked to #4755." },
    { result: "pass", name: "tests", weight: "0.20", description: "Tests changed in 2 files." },
    { result: "pass", name: "template", weight: "0.10", description: "Template filled in." },
    { result: "pass", name: "ai_disclosure", weight: "0.10", description: "Disclosure present." },
  ],
  actions: ["Open on GitHub", "Ask for info", "Label", "Snooze", "Mark reviewed"],
};

export const queueSignalDetails: Record<string, { status: string; descriptions: string[] }> = {
  "#4821": {
    status: "Review first",
    descriptions: [
      "Changes token refresh, which 14 files depend on.",
      "Linked to #4755.",
      "Tests changed in 2 files.",
      "Template filled in.",
      "Disclosure present.",
    ],
  },
  "#4809": {
    status: "Standard",
    descriptions: [
      "Changes one webhook module with no dependents.",
      "Linked to #4744.",
      "Tests changed in 1 file.",
      "Template filled in.",
      "Disclosure present.",
    ],
  },
  "#4802": {
    status: "Needs info",
    descriptions: [
      "Touches Windows path handling with 3 dependents.",
      "No linked issue found.",
      "No tests changed.",
      "Description needs more detail.",
      "Disclosure present.",
    ],
  },
  "#4790": {
    status: "Standard",
    descriptions: [
      "Changes config keys read by 5 modules.",
      "Linked to #4739.",
      "Tests changed in 2 files.",
      "Template filled in.",
      "Disclosure present.",
    ],
  },
  "#4817": {
    status: "Likely low effort",
    descriptions: [
      "Documentation change with no code dependents.",
      "Linked to #4701.",
      "No tests needed for a documentation change.",
      "Template filled in.",
      "No AI assistance disclosed.",
    ],
  },
  "#4796": {
    status: "Likely low effort",
    descriptions: [
      "Lockfile change only, with no changed source files.",
      "Linked to #4695.",
      "No tests changed.",
      "Template filled in.",
      "Disclosure present.",
    ],
  },
  "#4779": {
    status: "Standard",
    descriptions: [
      "Updates the CI workflow used by 4 jobs.",
      "Linked to #4668.",
      "Workflow checks are passing.",
      "Template filled in.",
      "Disclosure present.",
    ],
  },
};

export const rulesCopy = {
  title: "Your rules set the order.",
  summary: "Start from a preset, change the weights and replay the result on your closed pull requests before you save.",
  presets: ["Open-source default", "Strict", "Light"],
  weights: [
    { label: "graph_impact", value: 0.4 },
    { label: "tests", value: 0.2 },
    { label: "linked_issue", value: 0.2 },
  ],
  replayLabel: "Replay on closed pull requests",
};

export const rulesQueueOrder = {
  default: ["#4821", "#4809", "#4802", "#4817"],
  byWeight: {
    graph_impact: {
      low: ["#4817", "#4809", "#4802", "#4821"],
      default: ["#4821", "#4809", "#4802", "#4817"],
      high: ["#4821", "#4802", "#4809", "#4817"],
    },
    tests: {
      low: ["#4817", "#4809", "#4821", "#4802"],
      default: ["#4821", "#4809", "#4802", "#4817"],
      high: ["#4802", "#4821", "#4809", "#4817"],
    },
    linked_issue: {
      low: ["#4821", "#4809", "#4817", "#4802"],
      default: ["#4821", "#4809", "#4802", "#4817"],
      high: ["#4802", "#4821", "#4809", "#4817"],
    },
  },
  presets: [
    { weights: [40, 20, 20], order: ["#4821", "#4809", "#4802", "#4817"] },
    { weights: [80, 75, 80], order: ["#4802", "#4821", "#4809", "#4817"] },
    { weights: [20, 10, 10], order: ["#4817", "#4809", "#4821", "#4802"] },
  ],
};

export const contributorsCopy = {
  title: "Contributors see one check and one comment.",
  summary: "They never see the rank, and they need no account.",
  pullRequestTitle: "Support Windows paths",
  pullRequestNumber: "#4802",
  pullRequestState: "open",
  botInitial: "M",
  botName: "MergeFlow",
  botLabel: "bot",
  postedAt: "just now",
  comment: "Thanks for the pull request. Two things are missing: a linked issue and tests for the changed code. Push a fix or comment",
  recheckCommand: "/intake recheck",
  commentEnd: "and this comment updates.",
  checksLabel: "Checks",
  checkName: "Intake",
  pendingStatus: "Pending",
  checkStatus: "Needs info",
  missingCount: "2 of 4 items missing",
};

export const ledgerCopy = {
  title: "What stays yours.",
  principles: [
    "Every close.",
    "Every merge.",
    "The final call on every pull request.",
    "Your source code, which is never stored.",
  ],
  disclaimer: "Not in the first version: bug finding, automatic closing, GitLab and Bitbucket, org-wide dashboards, self-hosting.",
};

export const questionsCopy = {
  title: "Questions.",
  items: [
    {
      question: "What is shadow mode?",
      answer: "The default. MergeFlow ranks your pull requests in the dashboard and writes nothing to GitHub, so contributors see nothing until you trust the results.",
    },
    {
      question: "What do contributors see?",
      answer: "They see the normal pull request, one intake check, and a concise bot comment. The maintainer ranking stays in the dashboard, and contributors need no account.",
    },
    {
      question: "Does it close or merge pull requests?",
      answer: "No. MergeFlow ranks and explains pull requests. Maintainers make every close and merge decision.",
    },
    {
      question: "What does the language model do?",
      answer: "It helps explain why a pull request needs attention. Your rules set the order, and the queue shows the signals behind each result.",
    },
    {
      question: "Is my source code stored?",
      answer: "No source code is stored. MergeFlow keeps only file and symbol names.",
    },
    {
      question: "Which Git hosts does it support?",
      answer: "GitHub is supported in the first version. GitLab and Bitbucket are not included yet.",
    },
  ],
};

export const closeCopy = {
  title: "Start with the pull request that needs you.",
  footerStatement: "MergeFlow is a GitHub App. It never closes or merges a pull request.",
};
