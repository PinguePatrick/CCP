"use strict";

/*
 * JrCockpit
 * ----------
 * Frontend-only AI Development Cockpit prototype.
 *
 * Architecture:
 *
 * UI
 *  ↓
 * Application Controller
 *  ↓
 * Service Interfaces
 *  ↓
 * Mock implementations
 *
 * Future backend integrations can replace the mock services without
 * rewriting the UI layer.
 */

/* ============================================================
   SERVICE LAYER
   ============================================================ */

class BaseService {
  constructor(name) {
    this.name = name;
    this.simulated = true;
  }

  delay(ms = 150) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  simulationNotice() {
    return "SIMULATED — no real system operation was performed.";
  }
}

class MockCellService extends BaseService {
  constructor() {
    super("CELL");
    this.status = "ONLINE";
    this.mission = "Maintain coherent L@B operations";
    this.phase = "COORDINATION";
  }

  async statusReport() {
    await this.delay();
    return {
      status: this.status,
      simulated: this.simulated,
      mission: this.mission,
      phase: this.phase,
      pendingApprovals: 1,
      activeOperations: 3,
      health: "NOMINAL",
      sourceOfTruth: "MASTER_LAB_MAP.md"
    };
  }

  async command(command) {
    await this.delay(260);

    const commands = {
      "/status":
        "CELL STATUS\n\nHealth: NOMINAL\nPhase: COORDINATION\nActive operations: 3\nPending approvals: 1\nSource of truth: MASTER_LAB_MAP.md",

      "/agents":
        "ACTIVE WORKERS\n\nCELL       COORDINATING\nXJ-8       INSPECTING\nXJ-9       BUILDING\nXJ-11      REVIEWING\nClaude     WAITING\nCodex      AVAILABLE\nJr         AVAILABLE",

      "/map":
        "L@B MAP\n\nCELL → Jr\nCELL → Elite Teams\nCELL → XJ Seats\nCELL → OllamaBrain\nCELL → Memory\nCELL → Tools\nCELL → Repositories\nCELL → Runtime",

      "/runtime":
        "RUNTIME\n\nEnvironment: SIMULATED\nOllama: SIMULATED\nFilesystem: MOCK\nGit: MOCK\nJob scheduler: MOCK",

      "/memory":
        "MEMORY INDEX\n\n12 active context records\n4 architecture records\n3 governance records\n5 agent activity records",

      "/jobs":
        "JOBS\n\nInspect Cell — XJ-8 — RUNNING\nBuild cockpit — Claude — COMPLETE\nReview patch — XJ-11 — APPROVAL REQUIRED\nMap runtime — CELL — BLOCKED",

      "/governance":
        "GOVERNANCE\n\nAutomatic destructive actions: DISABLED\nRepository push: APPROVAL REQUIRED\nFile deletion: APPROVAL REQUIRED\nDeployment: APPROVAL REQUIRED\nPermission changes: APPROVAL REQUIRED",

      "/search":
        "Search scope: files, agents, systems, jobs, memory, architecture and logs.",

      "/source":
        "SOURCE OF TRUTH\n\nMASTER_LAB_MAP.md\nVerification: SIMULATED\nLast checked: 2026-09-14"
    };

    return commands[command.toLowerCase()] ||
      `CELL received: ${command}\n\nCommand is available in the prototype console.`;
  }
}

class MockAgentService extends BaseService {
  constructor() {
    super("Agents");

    this.agents = [
      {
        id: "cell",
        name: "CELL",
        role: "Operational brain",
        status: "Coordinating",
        avatar: "C"
      },
      {
        id: "jr",
        name: "Jr",
        role: "AI participant",
        status: "Available",
        avatar: "Jr"
      },
      {
        id: "xj8",
        name: "XJ-8",
        role: "Architecture inspection",
        status: "Inspecting",
        avatar: "8"
      },
      {
        id: "xj9",
        name: "XJ-9",
        role: "Implementation",
        status: "Building",
        avatar: "9"
      },
      {
        id: "xj11",
        name: "XJ-11",
        role: "Code review",
        status: "Reviewing",
        avatar: "11"
      },
      {
        id: "claude",
        name: "Claude",
        role: "External AI integration",
        status: "Waiting",
        avatar: "Cl"
      },
      {
        id: "codex",
        name: "Codex",
        role: "External coding integration",
        status: "Available",
        avatar: "Cx"
      }
    ];
  }

  async list() {
    await this.delay();
    return [...this.agents];
  }

  async respond(agent, message, context) {
    await this.delay(550);

    const responses = {
      CELL: {
        text:
          "I have the L@B context loaded. The current workspace is operating in simulated mode. I can coordinate the requested operation, but no filesystem, runtime, or external provider action will occur without a real backend.",
        actions: ["View Context", "Open L@B Map", "Show Governance"]
      },

      Jr: {
        text:
          "I can work on the selected file using the current cockpit context. For this prototype I will propose changes rather than modifying the demo workspace automatically.",
        actions: ["Preview Proposal", "Show Diff", "Ask CELL"]
      },

      "XJ-8": {
        text:
          "Inspection complete. I identified the orchestration boundary and recommend routing implementation through CELL before execution.",
        actions: ["Send to XJ-9", "Send to CELL", "Create Job"]
      },

      "XJ-9": {
        text:
          "Implementation proposal ready. The change should remain governed: inspect the diff first, then require human approval before applying.",
        actions: ["View Diff", "Request Approval", "Ask XJ-11"]
      },

      "XJ-11": {
        text:
          "Review indicates the proposed change is structurally reasonable. Governance still requires operator approval before application.",
        actions: ["View Diff", "Approve", "Reject"]
      },

      Claude: {
        text:
          "Claude integration is represented as a simulated provider. The current context includes the selected workspace, file, CELL and active worker.",
        actions: ["Ask CELL", "Preview Context"]
      },

      Codex: {
        text:
          "Codex integration is represented as a simulated coding provider. I can demonstrate an implementation proposal without executing anything.",
        actions: ["Generate Diff", "Write Tests", "Ask CELL"]
      }
    };

    const response = responses[agent] || responses.CELL;

    return {
      ...response,
      context,
      simulated: true
    };
  }
}

class MockFileService extends BaseService {
  constructor() {
    super("Filesystem");

    this.files = {
      "MASTER_LAB_MAP.md": `# L@B MASTER LAB MAP

> THE MAP IS THE TRUTH

## System

L@B is a local-first AI development laboratory.

## Core

- CELL — operational brain
- Jr — AI participant
- JrCockpit — human/operator interface

## Workers

- XJ-8 — architecture inspection
- XJ-9 — implementation
- XJ-11 — review

## Runtime

- OllamaBrain
- Memory
- Tools
- Repositories
- Runtime

## Governance

AI-proposed changes require human review before application.

## Source of Truth

MASTER_LAB_MAP.md

Status: SIMULATED
Last Checked: 2026-09-14`,

      "CELL_SOUL.md": `# CELL

## Identity

CELL is the operational brain of the L@B.

## Responsibilities

- Coordinate workers
- Maintain operational context
- Surface governance constraints
- Protect source-of-truth integrity

## Principle

The cockpit is not CELL.

CELL is the brain.
JrCockpit is the cockpit.`,

      "JrBrain.py": `class JrBrain:
    """Jr's prototype reasoning interface."""

    def __init__(self, context):
        self.context = context
        self.mode = "SIMULATED"

    def inspect(self, request):
        return {
            "request": request,
            "context": self.context,
            "status": "PROPOSAL_ONLY",
        }

    def propose(self, change):
        return {
            "change": change,
            "requires_approval": True,
        }`,

      "orchestrator.py": `def route_job(job, context):
    """Route a job through the governed worker system."""
    return default_worker(job)


def default_worker(job):
    return {
        "job": job,
        "worker": "XJ-9",
        "status": "SIMULATED",
    }


def request_approval(change):
    return {
        "change": change,
        "status": "APPROVAL_REQUIRED",
    }`,

      "settings.json": `{
  "environment": "SIMULATED",
  "workspace": "L@B",
  "cell": {
    "provider": "mock",
    "status": "online"
  },
  "filesystem": {
    "provider": "mock"
  },
  "governance": {
    "requireHumanApproval": true
  }
}`,

      "README.md": `# L@B

Local-first AI development laboratory.

JrCockpit is the human/operator cockpit.

CELL is the operational brain.

Agents and XJs are workers.

All prototype integrations are simulated.`
    };

    this.folderStructure = [
      {
        name: "Jr",
        folder: true,
        children: [
          { name: "core", folder: true },
          { name: "brain", folder: true },
          { name: "memory", folder: true },
          { name: "tools", folder: true }
        ]
      },
      {
        name: "CELL",
        folder: true,
        children: [
          { name: "identity", folder: true },
          { name: "governance", folder: true },
          { name: "map", folder: true }
        ]
      },
      {
        name: "XJ",
        folder: true,
        children: [
          { name: "XJ-8", folder: true },
          { name: "XJ-9", folder: true },
          { name: "XJ-11", folder: true }
        ]
      },
      { name: "agents", folder: true },
      { name: "repositories", folder: true },
      { name: "runtime", folder: true },
      { name: "docs", folder: true },
      { name: "MASTER_LAB_MAP.md", folder: false },
      { name: "README.md", folder: false }
    ];
  }

  async read(fileName) {
    await this.delay(80);
    return this.files[fileName] ?? `# ${fileName}\n\nNo demo content is available.`;
  }

  async save(fileName, content) {
    await this.delay(180);
    this.files[fileName] = content;
    return {
      success: true,
      simulated: true
    };
  }

  async create(name) {
    await this.delay(100);
    const fileName = name.endsWith(".md") || name.includes(".")
      ? name
      : `${name}.md`;

    this.files[fileName] = `# ${fileName}\n\nNew demo file.\n\nStatus: SIMULATED`;

    return fileName;
  }

  async delete(fileName) {
    await this.delay(100);
    delete this.files[fileName];
    return true;
  }
}

class MockGitService extends BaseService {
  constructor() {
    super("Git");

    this.changes = [
      { state: "M", file: "MASTER_LAB_MAP.md" },
      { state: "M", file: "CELL_SOUL.md" },
      { state: "M", file: "JrBrain.py" },
      { state: "A", file: "new_agent.py" }
    ];
  }

  async status() {
    await this.delay();
    return [...this.changes];
  }

  async commit(message) {
    await this.delay(300);
    return {
      success: true,
      message,
      simulated: true
    };
  }
}

class MockTerminalService extends BaseService {
  constructor() {
    super("Terminal");
  }

  async execute(command) {
    await this.delay(220);

    const normalized = command.trim().toLowerCase();

    const outputs = {
      "lab status":
        "L@B STATUS\nEnvironment: SIMULATED\nCELL: ONLINE\nOllama: SIMULATED\nAgents: 7 registered",

      "cell status":
        "CELL\nONLINE\nPhase: COORDINATION\nHealth: NOMINAL\nPending approvals: 1",

      "agents":
        "CELL   COORDINATING\nXJ-8   INSPECTING\nXJ-9   BUILDING\nXJ-11  REVIEWING\nClaude WAITING\nCodex  AVAILABLE\nJr     AVAILABLE",

      "jobs":
        "Inspect Cell      XJ-8   RUNNING\nBuild cockpit      Claude COMPLETE\nReview patch       XJ-11  APPROVAL REQUIRED\nMap runtime        CELL   BLOCKED",

      "ollama status":
        "Ollama: SIMULATED\nEndpoint: not configured\nModel runtime: unavailable",

      "git status":
        "On branch main\nChanges not staged for commit: 3\nNew file: new_agent.py\n\nSIMULATED GIT"
    };

    return outputs[normalized] ||
      `Command: ${command}\n\nNo real shell command was executed.\n${this.simulationNotice()}`;
  }
}

class MockRuntimeService extends BaseService {
  constructor() {
    super("Runtime");
  }

  async status() {
    await this.delay();
    return {
      environment: "SIMULATED",
      cell: "ONLINE",
      ollama: "SIMULATED",
      filesystem: "MOCK",
      git: "MOCK",
      jobs: "MOCK"
    };
  }
}

class MockMemoryService extends BaseService {
  constructor() {
    super("Memory");
  }

  async search(query) {
    await this.delay(180);

    return [
      {
        title: "CELL governance model",
        source: "CELL_SOUL.md",
        snippet: "AI-proposed changes require human review before application."
      },
      {
        title: "L@B architecture",
        source: "MASTER_LAB_MAP.md",
        snippet: "CELL coordinates workers and protects the source of truth."
      },
      {
        title: "Jr context interface",
        source: "JrBrain.py",
        snippet: "The prototype reasoning interface receives workspace context."
      }
    ].filter(item =>
      `${item.title} ${item.source} ${item.snippet}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }
}

class MockJobService extends BaseService {
  constructor() {
    super("Jobs");

    this.jobs = [
      {
        name: "Inspect Cell",
        agent: "XJ-8",
        status: "RUNNING"
      },
      {
        name: "Build cockpit",
        agent: "Claude",
        status: "COMPLETE"
      },
      {
        name: "Review patch",
        agent: "XJ-11",
        status: "APPROVAL REQUIRED"
      },
      {
        name: "Map runtime",
        agent: "CELL",
        status: "BLOCKED"
      }
    ];
  }

  async list() {
    await this.delay();
    return [...this.jobs];
  }

  async create(name, agent) {
    await this.delay(180);

    const job = {
      name,
      agent,
      status: "QUEUED"
    };

    this.jobs.unshift(job);
    return job;
  }
}

class MockProviderService extends BaseService {
  constructor() {
    super("Providers");
  }

  async list() {
    await this.delay();
    return [
      {
        name: "Ollama",
        status: "SIMULATED",
        type: "Local model runtime"
      },
      {
        name: "Claude",
        status: "SIMULATED",
        type: "External AI provider"
      },
      {
        name: "OpenAI / Codex",
        status: "SIMULATED",
        type: "External coding provider"
      }
    ];
  }
}

/* ============================================================
   SERVICE REGISTRY
   ============================================================ */

const Services = {
  cell: new MockCellService(),
  agents: new MockAgentService(),
  files: new MockFileService(),
  git: new MockGitService(),
  terminal: new MockTerminalService(),
  runtime: new MockRuntimeService(),
  memory: new MockMemoryService(),
  jobs: new MockJobService(),
  providers: new MockProviderService()
};

/* ============================================================
   STATE
   ============================================================ */

const state = {
  currentFile: "MASTER_LAB_MAP.md",
  openTabs: [
    {
      name: "MASTER_LAB_MAP.md",
      modified: false
    },
    {
      name: "CELL_SOUL.md",
      modified: false
    },
    {
      name: "JrBrain.py",
      modified: false
    },
    {
      name: "orchestrator.py",
      modified: true
    }
  ],

  expandedFolders: new Set(["Jr", "CELL", "XJ"]),

  activeAgent: "CELL",

  editorContent: "",
  editorOriginal: "",

  bottomPanel: "terminal",
  bottomCollapsed: false,

  sidebarView: "home",

  commandIndex: 0,

  shellMode: "SIMULATED",
  pendingApproval: {
    id: "proposal-orchestrator-routing",
    file: "orchestrator.py",
    agent: "XJ-9",
    risk: "MEDIUM",
    status: "PENDING"
  },

  notifications: 3,

  contextFiles: [
    "MASTER_LAB_MAP.md",
    "CELL_SOUL.md",
    "JrBrain.py"
  ],

  booted: false
};

/* ============================================================
   DOM HELPERS
   ============================================================ */

const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function nowTime() {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date());
}

/* ============================================================
   BOOT
   ============================================================ */

function boot() {
  const progress = $("#bootProgress");

  let value = 0;

  const interval = setInterval(() => {
    value += Math.floor(Math.random() * 18) + 8;

    if (value >= 100) {
      value = 100;
      clearInterval(interval);

      setTimeout(() => {
        $("#bootScreen").classList.add("hidden");
        $("#cockpit").classList.remove("hidden");
        state.booted = true;

        initializeApplication();
      }, 450);
    }

    progress.style.width = `${value}%`;
  }, 180);
}

/* ============================================================
   INITIALIZATION
   ============================================================ */

async function initializeApplication() {
  await loadCurrentFile();
  renderTabs();
  renderHome();
  renderExplorer();
  renderBottomPanel();
  renderAgentMenu();
  renderContext();
  renderInitialChat();
  updateCursorPosition();

  showToast(
    "Workspace Ready",
    "JrCockpit initialized in simulated mode."
  );
}

/* ============================================================
   EDITOR
   ============================================================ */

async function loadCurrentFile() {
  const content = await Services.files.read(state.currentFile);

  state.editorOriginal = content;
  state.editorContent = content;

  $("#editor").textContent = content;

  renderLineNumbers();
  renderMinimap();
  updateEditorLabels();
}

function renderLineNumbers() {
  const lines = $("#editor").innerText.split("\n");
  $("#editorLines").innerHTML = lines
    .map((_, index) => `<div>${index + 1}</div>`)
    .join("");
}

function renderMinimap() {
  const content = $("#editor").innerText;

  const fragments = content
    .split("\n")
    .slice(0, 150)
    .map(line => {
      const width = Math.min(
        96,
        Math.max(10, line.length * 1.7)
      );

      const color =
        line.trim().startsWith("#")
          ? "#72b7ff"
          : line.includes(":")
            ? "#83d5de"
            : line.includes("\"")
              ? "#8bd49c"
              : "#4b5968";

      return `
        <div style="
          height:2px;
          margin:2px 3px;
          width:${width}px;
          background:${color};
          opacity:.65;
        "></div>
      `;
    })
    .join("");

  $("#minimap").innerHTML = fragments;
}

function updateEditorLabels() {
  $("#breadcrumbFile").textContent = state.currentFile;
  $("#topCurrentFile").textContent = state.currentFile;
}

function updateModifiedState() {
  const current = $("#editor").innerText;

  const tab = state.openTabs.find(
    item => item.name === state.currentFile
  );

  if (tab) {
    tab.modified = current !== state.editorOriginal;
  }

  renderTabs();
}

function renderEditorHighlight() {
  /*
   * The editable surface intentionally remains plain text so it is
   * dependency-free. This function provides a subtle visual refresh.
   */
  $("#editor").style.backgroundColor = "transparent";
}

function saveCurrentFile() {
  const content = $("#editor").innerText;

  Services.files.save(state.currentFile, content).then(() => {
    state.editorOriginal = content;

    const tab = state.openTabs.find(
      item => item.name === state.currentFile
    );

    if (tab) {
      tab.modified = false;
    }

    renderTabs();

    showToast(
      "Saved",
      `${state.currentFile} saved to the simulated workspace.`
    );
  });
}

function renderTabs() {
  $("#tabs").innerHTML = state.openTabs
    .map(tab => `
      <div
        class="tab ${tab.name === state.currentFile ? "active" : ""}"
        data-file="${escapeHTML(tab.name)}"
      >
        <span class="tab-icon">${getFileIcon(tab.name)}</span>
        <span class="tab-name">${escapeHTML(tab.name)}</span>
        ${tab.modified
          ? `<span class="tab-modified">●</span>`
          : ""
        }
        <button
          class="tab-close"
          data-close-tab="${escapeHTML(tab.name)}"
          title="Close ${escapeHTML(tab.name)}"
        >×</button>
      </div>
    `)
    .join("");
}

function getFileIcon(fileName) {
  if (fileName.endsWith(".py")) return "PY";
  if (fileName.endsWith(".json")) return "{}";
  if (fileName.endsWith(".md")) return "M";
  return "•";
}

async function openFile(fileName) {
  if (!state.openTabs.some(tab => tab.name === fileName)) {
    state.openTabs.push({
      name: fileName,
      modified: false
    });
  }

  state.currentFile = fileName;

  await loadCurrentFile();

  renderTabs();
  renderContext();

  showToast(
    "File Opened",
    `${fileName} is now active.`
  );
}

function closeTab(fileName) {
  const index = state.openTabs.findIndex(
    tab => tab.name === fileName
  );

  if (index === -1) return;

  const tab = state.openTabs[index];

  if (
    tab.modified &&
    !confirm(
      `${fileName} has unsaved simulated changes. Close anyway?`
    )
  ) {
    return;
  }

  state.openTabs.splice(index, 1);

  if (state.currentFile === fileName) {
    const replacement =
      state.openTabs[index] ||
      state.openTabs[index - 1] ||
      state.openTabs[0];

    if (replacement) {
      state.currentFile = replacement.name;
      loadCurrentFile();
    } else {
      state.currentFile = "";
      $("#editor").textContent = "";
    }
  }

  renderTabs();
}

/* ============================================================
   EXPLORER
   ============================================================ */

function renderExplorer() {
  if (state.sidebarView !== "explorer") return;

  $("#sidebarTitle").textContent = "EXPLORER";

  $("#sidebarContent").innerHTML = `
    <div class="tree-root">
      <div class="tree-row">
        <span class="tree-arrow">⌄</span>
        <span class="tree-icon folder">▾</span>
        <span class="tree-name">L@B</span>
      </div>
      <div class="tree-indent">
        ${renderTreeItems(Services.files.folderStructure)}
      </div>
    </div>
  `;
}

function renderTreeItems(items) {
  return items.map(item => {
    if (item.folder) {
      const expanded = state.expandedFolders.has(item.name);

      return `
        <div>
          <div
            class="tree-row folder"
            data-folder="${escapeHTML(item.name)}"
          >
            <span class="tree-arrow">${expanded ? "⌄" : "›"}</span>
            <span class="tree-icon">${expanded ? "▾" : "▸"}</span>
            <span class="tree-name">${escapeHTML(item.name)}</span>
          </div>

          ${expanded && item.children?.length
            ? `
              <div class="tree-indent">
                ${renderTreeItems(item.children)}
              </div>
            `
            : ""
          }
        </div>
      `;
    }

    return `
      <div
        class="tree-row ${item.name === state.currentFile ? "selected" : ""}"
        data-file="${escapeHTML(item.name)}"
      >
        <span class="tree-arrow"></span>
        <span class="tree-icon">${getFileIcon(item.name)}</span>
        <span class="tree-name">${escapeHTML(item.name)}</span>
      </div>
    `;
  }).join("");
}

/* ============================================================
   SIDEBAR VIEWS
   ============================================================ */

async function switchSidebarView(view) {
  state.sidebarView = view;

  $$(".activity-button").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.view === view
    );
  });

  const titles = {
    home: "JR HOME",
    explorer: "EXPLORER",
    search: "SEARCH",
    "source-control": "SOURCE CONTROL",
    run: "RUN & JOBS",
    extensions: "EXTENSIONS",
    agents: "AGENTS",
    cell: "CELL",
    "lab-map": "L@B MAP",
    memory: "MEMORY",
    approvals: "APPROVALS",
    terminal: "TERMINAL",
    settings: "SETTINGS"
  };

  $("#sidebarTitle").textContent =
    titles[view] || view.toUpperCase();

  if (view === "home") {
    renderHome();
  } else if (view === "explorer") {
    renderExplorer();
  } else if (view === "search") {
    renderSidebarSearch();
  } else if (view === "source-control") {
    await renderSourceControl();
  } else if (view === "run") {
    await renderJobs();
  } else if (view === "extensions") {
    renderExtensions();
  } else if (view === "agents") {
    await renderAgents();
  } else if (view === "cell") {
    await renderCellSidebar();
  } else if (view === "lab-map") {
    renderMap();
  } else if (view === "memory") {
    renderMemory();
  } else if (view === "approvals") {
    renderApprovals();
  } else if (view === "terminal") {
    renderTerminalSidebar();
  } else if (view === "settings") {
    openSettings();
  }
}

function renderHome() {
  const template = $("#homeViewTemplate");

  $("#sidebarContent").innerHTML = template
    ? template.innerHTML
    : `
      <div class="home-view">
        <div class="home-hero">
          <span class="eyebrow">JRCOCKPIT / COMMAND CENTER</span>
          <h1>Make JrCockpit the one.</h1>
          <p>One governed environment for the L@B.</p>
        </div>
      </div>
    `;

  $$("#sidebarContent [data-home-action]").forEach(button => {
    button.addEventListener("click", () => {
      switchSidebarView(button.dataset.homeAction);
    });
  });
}

function renderApprovals() {
  const approval = state.pendingApproval;

  $("#sidebarContent").innerHTML = `
    <div class="panel-section">
      <div class="panel-section-title">
        <span>PENDING APPROVALS</span>
        <span style="color:var(--yellow)">1</span>
      </div>

      <div class="approval-card">
        <strong>${escapeHTML(approval.file)} · ${escapeHTML(approval.risk)} RISK</strong>
        <span>${escapeHTML(approval.agent)} proposes governed job-routing changes.</span>
        <span>Nothing is applied automatically. Operator review is required.</span>

        <div class="approval-actions">
          <button class="primary-button" id="reviewApproval">Review Diff</button>
          <button class="secondary-button" id="rejectApproval">Reject</button>
        </div>
      </div>
    </div>

    <div class="panel-section">
      <div class="panel-section-title">
        <span>GOVERNANCE</span>
        <span style="color:var(--green)">ENFORCED</span>
      </div>
      <div style="color:var(--text-3);font-size:9px;line-height:1.55">
        Destructive actions, repository pushes, deployments and permission changes remain approval-gated in this prototype.
      </div>
    </div>
  `;

  $("#reviewApproval").addEventListener("click", openDiff);
  $("#rejectApproval").addEventListener("click", rejectDiff);
}

function renderSidebarSearch() {
  $("#sidebarContent").innerHTML = `
    <div class="panel-section">
      <input
        id="sidebarSearchInput"
        class="setting-input"
        style="
          width:100%;
          padding:8px;
          color:var(--text);
          background:#0a0f14;
          border:1px solid var(--border);
          border-radius:4px;
          outline:none;
        "
        placeholder="Search workspace..."
      />
    </div>

    <div id="sidebarSearchResults" class="panel-section">
      <div class="empty-state" style="height:180px">
        <span class="empty-icon">⌕</span>
        <p>Search files, systems and agents.</p>
      </div>
    </div>
  `;

  $("#sidebarSearchInput").addEventListener(
    "input",
    event => {
      renderSidebarSearchResults(event.target.value);
    }
  );
}

function renderSidebarSearchResults(query) {
  const results = globalSearch(query);

  $("#sidebarSearchResults").innerHTML = results.length
    ? results.map(renderSearchResult).join("")
    : `
      <div class="empty-state" style="height:180px">
        <span class="empty-icon">⌕</span>
        <p>No matching demo records.</p>
      </div>
    `;
}

/* ============================================================
   SOURCE CONTROL
   ============================================================ */

async function renderSourceControl() {
  const changes = await Services.git.status();

  $("#sidebarContent").innerHTML = `
    <div class="panel-section">
      <div class="panel-section-title">
        <span>CHANGES</span>
        <button onclick="renderSourceControl()">↻</button>
      </div>

      <div class="change-list">
        ${changes.map(change => `
          <div
            class="change-row"
            data-file="${escapeHTML(change.file)}"
          >
            <span style="
              color:${change.state === "A" ? "var(--green)" : "var(--yellow)"};
              font-weight:700;
              margin-right:7px;
            ">${change.state}</span>
            <span>${escapeHTML(change.file)}</span>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="panel-section">
      <button
        class="primary-button"
        id="commitButton"
        style="width:100%"
      >
        Commit Changes
      </button>
    </div>

    <div class="panel-section">
      <span style="color:var(--text-4);font-size:9px">
        Git operations are simulated.
      </span>
    </div>
  `;

  $("#commitButton").addEventListener("click", async () => {
    const message = prompt(
      "Commit message:",
      "Update L@B cockpit"
    );

    if (!message) return;

    await Services.git.commit(message);

    showToast(
      "Commit Created",
      "Simulated commit recorded locally in the prototype."
    );
  });
}

/* ============================================================
   AGENTS
   ============================================================ */

async function renderAgents() {
  const agents = await Services.agents.list();

  $("#sidebarContent").innerHTML = `
    <div class="panel-section">
      <div class="panel-section-title">
        <span>ACTIVE WORKERS</span>
        <span style="color:var(--text-4)">7</span>
      </div>

      <div class="agent-list">
        ${agents.map(agent => `
          <div class="agent-card" role="button" tabindex="0">
            <div class="agent-avatar ${agent.id.startsWith("xj") ? "xj" : agent.id === "claude" ? "claude" : agent.id === "codex" ? "codex" : ""}">
              ${escapeHTML(agent.avatar)}
            </div>

            <div class="agent-info">
              <strong>${escapeHTML(agent.name)}</strong>
              <span>${escapeHTML(agent.role)}</span>
            </div>

            <span class="agent-status">
              ${escapeHTML(agent.status)}
            </span>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="panel-section">
      <button
        class="secondary-button"
        style="width:100%"
        id="handoffButton"
      >
        Create Agent Handoff
      </button>
    </div>
  `;

  $("#handoffButton").addEventListener("click", () => {
    showToast(
      "Handoff Created",
      "XJ-8 → XJ-9 · Architecture inspection handed off."
    );
  });
}

/* ============================================================
   CELL SIDEBAR
   ============================================================ */

async function renderCellSidebar() {
  const report = await Services.cell.statusReport();

  $("#sidebarContent").innerHTML = `
    <div class="panel-section">
      <div style="display:flex;align-items:center;gap:8px">
        <span
          class="status-dot green"
          style="width:8px;height:8px"
        ></span>
        <strong style="font-size:15px">CELL</strong>
      </div>

      <div style="
        margin-top:5px;
        color:var(--text-4);
        font-size:9px;
      ">
        L@B Operational Brain
      </div>
    </div>

    <div class="panel-section">
      <div class="panel-section-title">
        <span>CURRENT MISSION</span>
      </div>

      <div style="
        color:var(--text-2);
        line-height:1.5;
        font-size:10px;
      ">
        ${escapeHTML(report.mission)}
      </div>
    </div>

    <div class="panel-section">
      ${renderMetric("PHASE", report.phase)}
      ${renderMetric("HEALTH", report.health)}
      ${renderMetric("ACTIVE OPS", report.activeOperations)}
      ${renderMetric("APPROVALS", report.pendingApprovals)}
    </div>

    <div class="panel-section">
      <div class="panel-section-title">
        <span>SOURCE OF TRUTH</span>
      </div>

      <div style="color:var(--cyan);font:10px var(--font-code)">
        ${escapeHTML(report.sourceOfTruth)}
      </div>

      <div style="color:var(--text-4);font-size:8px;margin-top:4px">
        VERIFIED / SIMULATED
      </div>
    </div>

    <div class="panel-section">
      <button
        id="cellCommandButton"
        class="primary-button"
        style="width:100%"
      >
        Open CELL Console
      </button>
    </div>
  `;

  $("#cellCommandButton").addEventListener("click", () => {
    switchActiveAgent("CELL");
  });
}

function renderMetric(label, value) {
  return `
    <div style="
      display:flex;
      justify-content:space-between;
      padding:5px 0;
      font-size:9px;
    ">
      <span style="color:var(--text-4)">${label}</span>
      <b style="color:var(--text-2)">${escapeHTML(value)}</b>
    </div>
  `;
}

/* ============================================================
   JOBS
   ============================================================ */

async function renderJobs() {
  const jobs = await Services.jobs.list();

  $("#sidebarContent").innerHTML = `
    <div class="panel-section">
      <div class="panel-section-title">
        <span>JOBS</span>
        <button id="newJobSidebar">＋</button>
      </div>

      <div class="job-list">
        ${jobs.map(job => `
          <div class="job-row">
            <div>
              <div class="job-name">${escapeHTML(job.name)}</div>
              <div class="job-agent">${escapeHTML(job.agent)}</div>
            </div>

            <span class="job-state ${jobStateClass(job.status)}">
              ${escapeHTML(job.status)}
            </span>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  $("#newJobSidebar").addEventListener("click", async () => {
    const jobName = prompt(
      "Demo job name:",
      "Inspect workspace"
    );

    if (!jobName) return;

    await Services.jobs.create(jobName, state.activeAgent);

    showToast(
      "Job Created",
      `${jobName} queued for ${state.activeAgent}.`
    );

    renderJobs();
  });
}

function jobStateClass(status) {
  switch (status) {
    case "RUNNING":
      return "state-running";
    case "COMPLETE":
      return "state-complete";
    case "WAITING":
      return "state-waiting";
    case "BLOCKED":
      return "state-blocked";
    case "APPROVAL REQUIRED":
      return "state-approval";
    default:
      return "state-waiting";
  }
}

/* ============================================================
   EXTENSIONS
   ============================================================ */

function renderExtensions() {
  const extensions = [
    ["CELL Tools", "Operational command integration", "SIMULATED"],
    ["L@B Explorer", "Architecture and source-of-truth navigation", "SIMULATED"],
    ["Agent Handoff", "Route work between AI workers", "SIMULATED"],
    ["Governance", "Human approval workflows", "ENABLED"]
  ];

  $("#sidebarContent").innerHTML = `
    <div class="panel-section">
      <div class="panel-section-title">
        <span>EXTENSIONS</span>
      </div>

      <div class="job-list">
        ${extensions.map(ext => `
          <div class="job-row">
            <div>
              <div class="job-name">${ext[0]}</div>
              <div class="job-agent">${ext[1]}</div>
            </div>
            <span class="job-state state-running">${ext[2]}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

/* ============================================================
   MAP
   ============================================================ */

function renderMap() {
  $("#sidebarContent").innerHTML = `
    <div class="panel-section">
      <div class="panel-section-title">
        <span>ARCHITECTURE</span>
      </div>

      <div style="
        padding:10px;
        color:var(--cyan);
        border:1px solid #20444c;
        background:#10242a;
        border-radius:5px;
        font-size:9px;
        text-align:center;
      ">
        THE MAP IS THE TRUTH
      </div>
    </div>

    <div class="panel-section">
      ${[
        ["CELL", "Operational brain"],
        ["Jr", "AI participant"],
        ["XJ", "Workers"],
        ["Memory", "Context"],
        ["Runtime", "Execution"],
        ["Governance", "Safety"]
      ].map(item => `
        <div
          style="
            padding:8px 4px;
            border-bottom:1px solid var(--border);
            cursor:pointer;
          "
          data-map-item="${item[0]}"
        >
          <strong>${item[0]}</strong>
          <div style="color:var(--text-4);font-size:8px">
            ${item[1]}
          </div>
        </div>
      `).join("")}
    </div>
  `;

  renderMainMap();
}

function renderMainMap() {
  $("#editor").innerHTML = "";
  $("#editorLines").innerHTML = "";

  $("#tabs").innerHTML = `
    <div class="tab active">
      <span class="tab-icon">⌘</span>
      <span class="tab-name">L@B Architecture Map</span>
    </div>
  `;

  $(".editor-toolbar").innerHTML = `
    <div class="breadcrumbs">
      <span>L@B</span>
      <span>›</span>
      <span>Architecture</span>
    </div>
    <div class="editor-tools">
      <span style="color:var(--text-4);font-size:9px">
        CLICK NODES TO INSPECT
      </span>
    </div>
  `;

  const canvas = document.createElement("div");
  canvas.className = "map-view";
  canvas.innerHTML = `
    <div class="map-header">
      <span class="eyebrow">L@B ARCHITECTURE</span>
      <h2>System Map</h2>
      <p>
        Interactive prototype representation of the L@B operational topology.
      </p>
      <span class="map-truth">THE MAP IS THE TRUTH</span>
    </div>

    <div class="map-canvas">
      <div class="map-node primary" style="left:43%;top:8%" data-node="CELL">
        <span class="map-node-status"></span>
        <div class="map-node-title">CELL</div>
        <div class="map-node-sub">Operational Brain</div>
      </div>

      <div class="map-node" style="left:13%;top:38%" data-node="Jr">
        <span class="map-node-status"></span>
        <div class="map-node-title">Jr</div>
        <div class="map-node-sub">AI Participant</div>
      </div>

      <div class="map-node" style="left:34%;top:38%" data-node="Elite Teams">
        <span class="map-node-status"></span>
        <div class="map-node-title">Elite Teams</div>
        <div class="map-node-sub">Specialized Workers</div>
      </div>

      <div class="map-node" style="left:55%;top:38%" data-node="XJ Seats">
        <span class="map-node-status"></span>
        <div class="map-node-title">XJ Seats</div>
        <div class="map-node-sub">XJ-8 / XJ-9 / XJ-11</div>
      </div>

      <div class="map-node" style="left:76%;top:38%" data-node="OllamaBrain">
        <span class="map-node-status"></span>
        <div class="map-node-title">OllamaBrain</div>
        <div class="map-node-sub">Local Models</div>
      </div>

      <div class="map-node" style="left:24%;top:68%" data-node="Memory">
        <span class="map-node-status"></span>
        <div class="map-node-title">Memory</div>
        <div class="map-node-sub">Context Store</div>
      </div>

      <div class="map-node" style="left:45%;top:68%" data-node="Tools">
        <span class="map-node-status"></span>
        <div class="map-node-title">Tools</div>
        <div class="map-node-sub">Capabilities</div>
      </div>

      <div class="map-node" style="left:66%;top:68%" data-node="Runtime">
        <span class="map-node-status"></span>
        <div class="map-node-title">Runtime</div>
        <div class="map-node-sub">Execution Layer</div>
      </div>
    </div>

    <div class="map-inspector-hint">
      All node information is prototype/simulated unless connected to a real backend.
    </div>
  `;

  $(".editor-container").prepend(canvas);

  const oldBody = $(".editor-body");
  oldBody.style.display = "none";

  $$(".map-node").forEach(node => {
    node.addEventListener("click", () => {
      openNodeInspector(node.dataset.node);
    });
  });
}

/* ============================================================
   MEMORY
   ============================================================ */

function renderMemory() {
  $("#sidebarContent").innerHTML = `
    <div class="panel-section">
      <div class="panel-section-title">
        <span>MEMORY</span>
      </div>

      <input
        id="memorySearchInput"
        placeholder="Search memory..."
        style="
          width:100%;
          padding:8px;
          color:var(--text);
          background:#0a0f14;
          border:1px solid var(--border);
          border-radius:4px;
          outline:none;
        "
      />
    </div>

    <div id="memoryResults" class="panel-section">
      <div class="empty-state" style="height:160px">
        <span class="empty-icon">◎</span>
        <p>Search context records.</p>
      </div>
    </div>
  `;

  $("#memorySearchInput").addEventListener(
    "input",
    async event => {
      const results = await Services.memory.search(
        event.target.value
      );

      $("#memoryResults").innerHTML = results.length
        ? results.map(result => `
          <div class="search-result">
            <div class="search-result-title">
              ${escapeHTML(result.title)}
            </div>
            <div class="search-result-meta">
              ${escapeHTML(result.source)}
            </div>
            <div class="search-result-snippet">
              ${escapeHTML(result.snippet)}
            </div>
          </div>
        `).join("")
        : `<div style="color:var(--text-4);font-size:9px">No records.</div>`;
    }
  );
}

/* ============================================================
   TERMINAL SIDEBAR
   ============================================================ */

function renderTerminalSidebar() {
  $("#sidebarContent").innerHTML = `
    <div class="panel-section">
      <div class="panel-section-title">
        <span>QUICK COMMANDS</span>
      </div>

      ${[
        "lab status",
        "cell status",
        "agents",
        "jobs",
        "ollama status",
        "git status"
      ].map(command => `
        <button
          class="secondary-button terminal-quick-command"
          data-command="${command}"
          style="width:100%;margin-bottom:5px;text-align:left;font-family:var(--font-code)"
        >
          ${command}
        </button>
      `).join("")}
    </div>

    <div class="panel-section">
      <span style="color:var(--text-4);font-size:9px">
        Commands are simulated.
      </span>
    </div>
  `;

  $$(".terminal-quick-command").forEach(button => {
    button.addEventListener("click", async () => {
      await executeTerminalCommand(button.dataset.command);
    });
  });
}

/* ============================================================
   BOTTOM PANEL
   ============================================================ */

function renderBottomPanel() {
  if (state.bottomCollapsed) return;

  const container = $("#bottomContent");

  if (state.bottomPanel === "terminal") {
    renderTerminal();
  } else if (state.bottomPanel === "output") {
    container.innerHTML = `
      <div class="terminal-output">
        [SIMULATED] JrCockpit initialized.
        [SIMULATED] CELL status: ONLINE.
        [SIMULATED] Workspace loaded.
        [SIMULATED] No external systems connected.
      </div>
    `;
  } else if (state.bottomPanel === "problems") {
    renderProblems();
  } else if (state.bottomPanel === "jobs") {
    renderBottomJobs();
  } else if (state.bottomPanel === "logs") {
    renderLogs();
  }
}

function renderTerminal() {
  $("#bottomContent").innerHTML = `
    <div id="terminalOutput">
      <div class="terminal-line">
        <span class="terminal-prompt">jr@cockpit</span>
        <span class="terminal-command">~</span>
      </div>

      <div class="terminal-output">
JrCockpit terminal
Environment: SIMULATED
Type "help" for available demo commands.
      </div>
    </div>

    <div class="terminal-input-line">
      <span class="terminal-prompt">›</span>
      <input
        id="terminalInput"
        autocomplete="off"
        placeholder="Enter simulated command..."
      />
    </div>
  `;

  $("#terminalInput").addEventListener(
    "keydown",
    async event => {
      if (event.key === "Enter") {
        const command = event.target.value.trim();

        if (!command) return;

        await executeTerminalCommand(command);

        event.target.value = "";
      }
    }
  );
}

async function executeTerminalCommand(command) {
  state.bottomCollapsed = false;
  state.bottomPanel = "terminal";

  $("#bottomPanel").classList.remove("collapsed");
  renderBottomPanel();

  const output = await Services.terminal.execute(command);

  const outputContainer = $("#terminalOutput");

  if (!outputContainer) return;

  const line = document.createElement("div");

  line.innerHTML = `
    <div class="terminal-line">
      <span class="terminal-prompt">›</span>
      <span class="terminal-command">${escapeHTML(command)}</span>
    </div>

    <div class="terminal-output">
${escapeHTML(output)}
    </div>
  `;

  outputContainer.appendChild(line);

  $("#bottomContent").scrollTop =
    $("#bottomContent").scrollHeight;
}

function renderProblems() {
  $("#bottomContent").innerHTML = `
    <div class="problem-list">
      <div class="problem-row">
        <span class="problem-icon error">●</span>
        <div>
          <div>default_worker is not defined in type contract</div>
          <div class="problem-file">orchestrator.py</div>
        </div>
        <span class="problem-line">42</span>
      </div>

      <div class="problem-row">
        <span class="problem-icon warning">▲</span>
        <div>
          <div>Simulated provider has no real endpoint configured</div>
          <div class="problem-file">settings.json</div>
        </div>
        <span class="problem-line">5</span>
      </div>
    </div>
  `;
}

async function renderBottomJobs() {
  const jobs = await Services.jobs.list();

  $("#bottomContent").innerHTML = `
    <div class="job-list">
      ${jobs.map(job => `
        <div class="job-row">
          <div>
            <div class="job-name">${escapeHTML(job.name)}</div>
            <div class="job-agent">${escapeHTML(job.agent)}</div>
          </div>
          <span class="job-state ${jobStateClass(job.status)}">
            ${escapeHTML(job.status)}
          </span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderLogs() {
  $("#bottomContent").innerHTML = `
    <div class="terminal-output">
[17:04:12] cockpit.boot             INFO  Workspace initialized
[17:04:12] cell.connection          INFO  CELL simulated online
[17:04:13] agent.registry            INFO  7 demo workers registered
[17:04:13] filesystem.provider      INFO  Mock filesystem ready
[17:04:13] governance.engine        INFO  Human approval policy enabled
[17:04:14] context.manager          INFO  3 files loaded into context
[17:04:14] runtime.health            INFO  System health nominal
[17:04:15] job.scheduler             INFO  4 demo jobs discovered
    </div>
  `;
}

/* ============================================================
   AI AGENT UI
   ============================================================ */

function renderAgentMenu() {
  const agents = Services.agents.agents;

  $("#agentMenu").innerHTML = agents
    .map(agent => `
      <button
        class="agent-option"
        data-agent="${escapeHTML(agent.name)}"
      >
        <span class="agent-avatar ${
          agent.id.startsWith("xj")
            ? "xj"
            : agent.id === "claude"
              ? "claude"
              : agent.id === "codex"
                ? "codex"
                : ""
        }">${escapeHTML(agent.avatar)}</span>

        <span style="flex:1">
          <strong style="display:block;font-size:10px">
            ${escapeHTML(agent.name)}
          </strong>
          <small style="color:var(--text-4);font-size:8px">
            ${escapeHTML(agent.role)}
          </small>
        </span>

        <span style="font-size:8px;color:var(--text-4)">
          ${escapeHTML(agent.status)}
        </span>
      </button>
    `)
    .join("");
}

function switchActiveAgent(agentName) {
  state.activeAgent = agentName;

  const agent = Services.agents.agents.find(
    item => item.name === agentName
  );

  $("#activeAgentName").textContent = agentName;
  $("#aiPanelTitle").textContent = agentName;
  $("#contextAgent").textContent = agentName;

  const avatar = document.querySelector(
    "#activeAgentButton .agent-avatar"
  );

  avatar.textContent = agent?.avatar || "AI";

  renderContext();

  $("#agentMenu").classList.add("hidden");

  addChatMessage(
    agentName,
    `Switched active worker to ${agentName}. Context remains scoped to the current L@B workspace.`,
    []
  );
}

function renderContext() {
  $("#contextFiles").innerHTML = state.contextFiles
    .map(file => `
      <div class="context-file">
        ${getFileIcon(file)} ${escapeHTML(file)}
      </div>
    `)
    .join("");
}

function renderInitialChat() {
  $("#chatMessages").innerHTML = "";

  addChatMessage(
    "CELL",
    `L@B cockpit online. I have the current workspace context loaded.

The environment is explicitly <strong>SIMULATED</strong>. No filesystem, Git, terminal, provider, or runtime operation is real.

The current source of truth is <strong>MASTER_LAB_MAP.md</strong>.`,
    [
      "View Context",
      "Open L@B Map",
      "Show Governance"
    ]
  );

  addChatMessage(
    "XJ-9",
    `Implementation workspace is ready. I can propose a governed change to <strong>orchestrator.py</strong> for inspection.`,
    [
      "View Diff",
      "Request Approval"
    ]
  );
}

function addChatMessage(sender, message, actions = []) {
  const isUser = sender === "Operator";

  const avatar =
    sender === "CELL"
      ? "C"
      : sender === "Jr"
        ? "Jr"
        : sender === "Claude"
          ? "Cl"
          : sender === "Codex"
            ? "Cx"
            : sender.startsWith("XJ")
              ? sender.replace("XJ-", "")
              : "H";

  const messageElement = document.createElement("article");

  messageElement.className = "chat-message";

  messageElement.innerHTML = `
    <div class="message-head">
      <span class="message-avatar ${isUser ? "user" : ""}">
        ${escapeHTML(avatar)}
      </span>

      <span class="message-name">${escapeHTML(sender)}</span>

      <span class="message-time">${nowTime()}</span>
    </div>

    <div class="message-body">
      ${message}
    </div>

    ${
      actions.length
        ? `
          <div class="message-actions">
            ${actions.map(action => `
              <button
                data-chat-action="${escapeHTML(action)}"
                class="${
                  action === "Approve" ||
                  action === "Approve & Apply"
                    ? "approve"
                    : ""
                }"
              >
                ${escapeHTML(action)}
              </button>
            `).join("")}
          </div>
        `
        : ""
    }
  `;

  $("#chatMessages").appendChild(messageElement);

  $("#chatMessages").scrollTop =
    $("#chatMessages").scrollHeight;
}

async function sendChatMessage(text) {
  if (!text.trim()) return;

  addChatMessage(
    "Operator",
    escapeHTML(text),
    []
  );

  $("#chatInput").value = "";

  if (text.trim().startsWith("/")) {
    const result = await Services.cell.command(
      text.trim()
    );

    addChatMessage(
      "CELL",
      `<pre class="ai-code">${escapeHTML(result)}</pre>`,
      []
    );

    return;
  }

  const context = {
    workspace: "L@B",
    file: state.currentFile,
    files: state.contextFiles,
    system: "CELL",
    agent: state.activeAgent
  };

  const response = await Services.agents.respond(
    state.activeAgent,
    text,
    context
  );

  addChatMessage(
    state.activeAgent,
    response.text,
    response.actions
  );
}

/* ============================================================
   AI ACTIONS
   ============================================================ */

function executeAIAction(action) {
  const activeFile = state.currentFile || "orchestrator.py";

  switch (action) {
    case "Explain this":
      addChatMessage(
        state.activeAgent,
        `The selected workspace is <strong>${escapeHTML(activeFile)}</strong>. The prototype editor is currently operating on the file as editable demo content. Its surrounding context comes from CELL, L@B architecture, agents, memory and governance.`,
        ["Ask Another Agent"]
      );
      break;

    case "Fix this":
      addChatMessage(
        state.activeAgent,
        `I found a simulated issue candidate in <strong>${escapeHTML(activeFile)}</strong>. I recommend generating a proposal first rather than directly editing the workspace.`,
        ["Preview", "Diff"]
      );
      break;

    case "Refactor":
      addChatMessage(
        state.activeAgent,
        `Refactoring proposal: preserve the existing interface, isolate worker selection behind CELL, and require approval before application.`,
        ["View Diff", "Request Approval"]
      );
      break;

    case "Add feature":
      addChatMessage(
        state.activeAgent,
        `Feature proposal created for <strong>${escapeHTML(activeFile)}</strong>. The change remains proposal-only until the operator approves it.`,
        ["View Diff", "Ask CELL"]
      );
      break;

    case "Find bug":
      addChatMessage(
        state.activeAgent,
        `Potential defect detected: <strong>orchestrator.py</strong> references a default worker path while the governed routing layer is intended to select a worker through CELL.`,
        ["View Diff", "Ask XJ-11"]
      );
      break;

    case "Write tests":
      addChatMessage(
        state.activeAgent,
        `Suggested tests: worker selection, approval enforcement, rejected changes, and simulated provider failures.`,
        ["Preview Tests", "Create Job"]
      );
      break;

    case "Ask CELL":
      switchActiveAgent("CELL");
      $("#chatInput").value =
        `Review ${activeFile} in the context of the L@B architecture.`;
      $("#chatInput").focus();
      break;

    case "Ask Jr":
      switchActiveAgent("Jr");
      $("#chatInput").value =
        `Inspect ${activeFile} and propose improvements.`;
      $("#chatInput").focus();
      break;

    case "View Diff":
    case "Diff":
      openDiff();
      break;

    case "Request Approval":
      openDiff();
      break;

    case "Ask Another Agent":
      switchActiveAgent("XJ-11");
      break;

    case "Send to XJ-9":
      createHandoff("XJ-8", "XJ-9");
      break;

    case "Send to CELL":
      createHandoff("XJ-8", "CELL");
      break;

    case "Create Job":
      Services.jobs
        .create(
          "Review proposed implementation",
          state.activeAgent
        )
        .then(() => {
          showToast(
            "Job Created",
            `Job queued for ${state.activeAgent}.`
          );
        });
      break;

    case "Open L@B Map":
      switchSidebarView("lab-map");
      break;

    case "Show Governance":
      openSettings("governance");
      break;

    case "View Context":
      showToast(
        "Context",
        "Workspace, files, CELL, agent and source-of-truth context are loaded."
      );
      break;

    case "Preview Proposal":
    case "Preview":
      openDiff();
      break;

    case "Approve":
    case "Approve & Apply":
      approveDiff();
      break;

    case "Reject":
      rejectDiff();
      break;

    case "Edit":
      showToast(
        "Edit Mode",
        "Prototype diff editing would occur here; no backend change has been made."
      );
      break;

    case "Open File":
      openFile(activeFile);
      break;

    case "Generate Diff":
      openDiff();
      break;

    case "Write Tests":
      executeAIAction("Write tests");
      break;

    case "Preview Tests":
      showToast(
        "Test Preview",
        "Four simulated governance and routing tests proposed."
      );
      break;

    default:
      addChatMessage(
        state.activeAgent,
        `Action <strong>${escapeHTML(action)}</strong> is represented in the prototype workflow.`,
        []
      );
  }
}

function createHandoff(from, to) {
  showToast(
    "Agent Handoff",
    `${from} → ${to} · Architecture inspection handed off.`
  );

  addChatMessage(
    "CELL",
    `<strong>${from} → ${to}</strong><br>Architecture inspection handed off through the simulated coordination layer.`,
    ["Create Job"]
  );
}

/* ============================================================
   DIFF
   ============================================================ */

function openDiff() {
  $("#diffOverlay").classList.remove("hidden");
}

function approveDiff() {
  state.pendingApproval.status = "APPROVED";
  closeOverlay("diffOverlay");
  showToast(
    "Change Approved",
    "Approval recorded. No real filesystem, Git, runtime, or provider operation was performed."
  );
  if (state.sidebarView === "approvals") {
    renderApprovals();
  }
}

function rejectDiff() {
  $("#diffOverlay").classList.add("hidden");

  addChatMessage(
    "CELL",
    `<strong>Proposal rejected.</strong> The simulated change remains unapplied.`,
    []
  );

  showToast(
    "Rejected",
    "Proposed change was rejected."
  );
}

/* ============================================================
   GLOBAL SEARCH
   ============================================================ */

function globalSearch(query) {
  const records = [
    ...Object.keys(Services.files.files).map(file => ({
      title: file,
      source: "FILE",
      snippet: Services.files.files[file].slice(0, 180)
    })),

    ...Services.agents.agents.map(agent => ({
      title: agent.name,
      source: "AGENT",
      snippet: `${agent.role} — ${agent.status}`
    })),

    {
      title: "CELL",
      source: "SYSTEM",
      snippet: "L@B operational brain — coordination and governance"
    },

    {
      title: "OllamaBrain",
      source: "RUNTIME",
      snippet: "Local model runtime — simulated"
    },

    {
      title: "Governance",
      source: "POLICY",
      snippet: "Human approval required for privileged changes"
    },

    {
      title: "Runtime",
      source: "SYSTEM",
      snippet: "Execution layer — simulated"
    }
  ];

  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return records.slice(0, 10);
  }

  return records.filter(record =>
    `${record.title} ${record.source} ${record.snippet}`
      .toLowerCase()
      .includes(normalized)
  );
}

function renderSearchResult(result) {
  return `
    <div
      class="search-result"
      data-search-file="${escapeHTML(result.title)}"
    >
      <div class="search-result-title">
        ${escapeHTML(result.title)}
      </div>

      <div class="search-result-meta">
        ${escapeHTML(result.source)}
      </div>

      <div class="search-result-snippet">
        ${escapeHTML(result.snippet)}
      </div>
    </div>
  `;
}

function openGlobalSearch() {
  $("#globalSearchOverlay").classList.remove("hidden");

  $("#globalSearchInput").value = "";

  renderGlobalSearchResults("");

  setTimeout(() => {
    $("#globalSearchInput").focus();
  }, 30);
}

function renderGlobalSearchResults(query) {
  const results = globalSearch(query);

  $("#globalSearchResults").innerHTML = results.length
    ? results.map(renderSearchResult).join("")
    : `
      <div class="empty-state">
        <span class="empty-icon">⌕</span>
        <p>No matching records.</p>
      </div>
    `;
}

/* ============================================================
   COMMAND PALETTE
   ============================================================ */

const commands = [
  {
    label: "Open File",
    icon: "▤",
    action: () => {
      openGlobalSearch();
    }
  },
  {
    label: "Search",
    icon: "⌕",
    action: () => {
      openGlobalSearch();
    }
  },
  {
    label: "Ask CELL",
    icon: "C",
    action: () => switchActiveAgent("CELL")
  },
  {
    label: "Ask Jr",
    icon: "Jr",
    action: () => switchActiveAgent("Jr")
  },
  {
    label: "Ask XJ-9",
    icon: "9",
    action: () => switchActiveAgent("XJ-9")
  },
  {
    label: "Ask Claude",
    icon: "Cl",
    action: () => switchActiveAgent("Claude")
  },
  {
    label: "Ask Codex",
    icon: "Cx",
    action: () => switchActiveAgent("Codex")
  },
  {
    label: "Open Terminal",
    icon: "›_",
    action: () => {
      state.bottomPanel = "terminal";
      state.bottomCollapsed = false;
      $("#bottomPanel").classList.remove("collapsed");
      renderBottomPanel();
    }
  },
  {
    label: "Show Jobs",
    icon: "▷",
    action: () => {
      state.bottomPanel = "jobs";
      state.bottomCollapsed = false;
      $("#bottomPanel").classList.remove("collapsed");
      renderBottomPanel();
    }
  },
  {
    label: "Show L@B Map",
    icon: "⌘",
    action: () => switchSidebarView("lab-map")
  },
  {
    label: "Show Memory",
    icon: "◎",
    action: () => switchSidebarView("memory")
  },
  {
    label: "Show Governance",
    icon: "✓",
    action: () => openSettings("governance")
  },
  {
    label: "Open Settings",
    icon: "⚙",
    action: () => openSettings()
  }
];

function openCommandPalette() {
  $("#commandPalette").classList.remove("hidden");

  $("#commandInput").value = "";

  state.commandIndex = 0;

  renderCommands();

  setTimeout(() => {
    $("#commandInput").focus();
  }, 20);
}

function closeCommandPalette() {
  $("#commandPalette").classList.add("hidden");
}

function filteredCommands() {
  const query = $("#commandInput").value
    .trim()
    .toLowerCase();

  return commands.filter(command =>
    command.label.toLowerCase().includes(query)
  );
}

function renderCommands() {
  const filtered = filteredCommands();

  $("#commandList").innerHTML = filtered
    .map((command, index) => `
      <div
        class="command-item ${
          index === state.commandIndex ? "selected" : ""
        }"
        data-command-index="${commands.indexOf(command)}"
      >
        <span>
          <b style="width:22px;color:var(--text-4)">
            ${escapeHTML(command.icon)}
          </b>
          ${escapeHTML(command.label)}
        </span>

        <span class="command-key">
          ${index === 0 ? "↵" : ""}
        </span>
      </div>
    `)
    .join("");
}

function executeCommand(index) {
  const command = commands[index];

  if (!command) return;

  closeCommandPalette();
  command.action();
}

/* ============================================================
   NODE INSPECTOR
   ============================================================ */

function openNodeInspector(name) {
  const records = {
    CELL: {
      type: "Operational Brain",
      status: "VERIFIED / SIMULATED",
      owner: "L@B",
      source: "MASTER_LAB_MAP.md",
      dependencies: "Jr, Agents, Memory, Runtime",
      dependents: "JrCockpit, Agents"
    },

    Jr: {
      type: "AI Participant",
      status: "SIMULATED",
      owner: "L@B",
      source: "MASTER_LAB_MAP.md",
      dependencies: "CELL, Memory",
      dependents: "JrCockpit"
    },

    "Elite Teams": {
      type: "Worker Group",
      status: "SIMULATED",
      owner: "CELL",
      source: "MASTER_LAB_MAP.md",
      dependencies: "CELL, Tools",
      dependents: "Jobs"
    },

    "XJ Seats": {
      type: "Agent Workers",
      status: "SIMULATED",
      owner: "CELL",
      source: "MASTER_LAB_MAP.md",
      dependencies: "CELL, Tools",
      dependents: "Jobs"
    },

    OllamaBrain: {
      type: "Local Model Runtime",
      status: "SIMULATED",
      owner: "L@B",
      source: "MASTER_LAB_MAP.md",
      dependencies: "Runtime",
      dependents: "Agents"
    },

    Memory: {
      type: "Context Store",
      status: "SIMULATED",
      owner: "CELL",
      source: "MASTER_LAB_MAP.md",
      dependencies: "Filesystem",
      dependents: "CELL, Jr, Agents"
    },

    Tools: {
      type: "Capabilities",
      status: "SIMULATED",
      owner: "CELL",
      source: "MASTER_LAB_MAP.md",
      dependencies: "Runtime",
      dependents: "Agents"
    },

    Runtime: {
      type: "Execution Layer",
      status: "SIMULATED",
      owner: "L@B",
      source: "MASTER_LAB_MAP.md",
      dependencies: "Local environment",
      dependents: "OllamaBrain, Tools"
    }
  };

  const record = records[name] || {
    type: "Unknown",
    status: "UNKNOWN",
    owner: "UNKNOWN",
    source: "UNKNOWN",
    dependencies: "UNKNOWN",
    dependents: "UNKNOWN"
  };

  $("#inspectorTitle").textContent = name;

  $("#inspectorContent").innerHTML = `
    <div class="inspector-content">
      <span class="inspector-status">
        <span class="status-dot ${
          record.status.includes("VERIFIED")
            ? "green"
            : "yellow"
        }"></span>
        ${escapeHTML(record.status)}
      </span>

      <div class="inspector-grid">
        <div class="inspector-label">Name</div>
        <div class="inspector-value">${escapeHTML(name)}</div>

        <div class="inspector-label">Type</div>
        <div class="inspector-value">${escapeHTML(record.type)}</div>

        <div class="inspector-label">Owner</div>
        <div class="inspector-value">${escapeHTML(record.owner)}</div>

        <div class="inspector-label">Source of Truth</div>
        <div class="inspector-value">${escapeHTML(record.source)}</div>

        <div class="inspector-label">Dependencies</div>
        <div class="inspector-value">${escapeHTML(record.dependencies)}</div>

        <div class="inspector-label">Dependents</div>
        <div class="inspector-value">${escapeHTML(record.dependents)}</div>
      </div>

      <div style="
        margin-top:14px;
        padding:10px;
        color:var(--text-4);
        background:#0d1319;
        border:1px solid var(--border);
        border-radius:5px;
        font-size:9px;
        line-height:1.5;
      ">
        Prototype inspector data is explicitly simulated.
        No live L@B state is being asserted.
      </div>
    </div>
  `;

  $("#inspectorOverlay").classList.remove("hidden");
}

/* ============================================================
   SETTINGS
   ============================================================ */

function openSettings(section = "general") {
  $("#settingsOverlay").classList.remove("hidden");
  renderSettings(section);
}

const settingsPages = {
  general: {
    title: "General",
    description: "Core JrCockpit application behavior.",
    html: `
      ${settingInput(
        "Workspace",
        "L@B",
        "Current prototype workspace."
      )}

      ${settingToggle(
        "Confirm privileged actions",
        true,
        "Require explicit operator confirmation before privileged workflows."
      )}

      ${settingToggle(
        "Show simulated-state indicators",
        true,
        "Keep simulation labels visible throughout the interface."
      )}
    `
  },

  appearance: {
    title: "Appearance",
    description: "Visual configuration for the cockpit.",
    html: `
      ${settingSelect(
        "Theme",
        ["Dark", "Dark High Contrast"],
        "Dark"
      )}

      ${settingSelect(
        "Density",
        ["Compact", "Comfortable"],
        "Compact"
      )}

      ${settingToggle(
        "Minimap",
        true,
        "Show the editor minimap."
      )}
    `
  },

  providers: {
    title: "AI Providers",
    description: "Conceptual provider connection points. API keys are never stored in this prototype.",
    html: `
      ${settingInput(
        "Ollama endpoint",
        "http://localhost:11434",
        "Placeholder only — no connection is currently made."
      )}

      ${settingInput(
        "Claude connection",
        "Not configured",
        "Provider integration placeholder."
      )}

      ${settingInput(
        "OpenAI / Codex connection",
        "Not configured",
        "Provider integration placeholder."
      )}
    `
  },

  agents: {
    title: "Agents",
    description: "Worker registration and permissions.",
    html: `
      ${settingToggle(
        "Allow agent handoffs",
        true,
        "Enable simulated worker-to-worker handoffs."
      )}

      ${settingToggle(
        "Require approval for proposed changes",
        true,
        "Changes remain proposals until approved."
      )}
    `
  },

  cell: {
    title: "CELL",
    description: "Operational brain integration.",
    html: `
      ${settingInput(
        "CELL provider",
        "MockCellService",
        "Future backend replacement point."
      )}

      ${settingSelect(
        "Mode",
        ["Simulated", "Connected"],
        "Simulated"
      )}
    `
  },

  lab: {
    title: "L@B",
    description: "Laboratory workspace configuration.",
    html: `
      ${settingInput(
        "Workspace root",
        "L@B",
        "Prototype workspace identifier only."
      )}

      ${settingInput(
        "Source of truth",
        "MASTER_LAB_MAP.md",
        "Architecture provenance marker."
      )}
    `
  },

  ollama: {
    title: "Ollama",
    description: "Local model runtime settings.",
    html: `
      ${settingInput(
        "Host",
        "localhost",
        "Placeholder configuration."
      )}

      ${settingInput(
        "Port",
        "11434",
        "Placeholder configuration."
      )}
    `
  },

  git: {
    title: "Git",
    description: "Repository integration settings.",
    html: `
      ${settingInput(
        "Branch",
        "main",
        "Simulated repository branch."
      )}

      ${settingToggle(
        "Require approval before push",
        true,
        "Never allow autonomous pushes in the cockpit."
      )}
    `
  },

  terminal: {
    title: "Terminal",
    description: "Terminal behavior.",
    html: `
      ${settingInput(
        "Shell",
        "Simulated Shell",
        "No real shell is executed."
      )}

      ${settingToggle(
        "Confirm destructive commands",
        true,
        "Safety policy for future connected runtime."
      )}
    `
  },

  shortcuts: {
    title: "Keyboard Shortcuts",
    description: "JrCockpit keyboard controls.",
    html: `
      ${shortcut("Ctrl + P", "Quick Open")}
      ${shortcut("Ctrl + Shift + P", "Command Palette")}
      ${shortcut("Ctrl + F", "Find in File")}
      ${shortcut("Ctrl + Shift + F", "Global Search")}
      ${shortcut("Ctrl + S", "Save")}
      ${shortcut("Ctrl + W", "Close Tab")}
      ${shortcut("Ctrl + `", "Toggle Terminal")}
      ${shortcut("Ctrl + B", "Toggle Sidebar")}
      ${shortcut("Ctrl + J", "Toggle Bottom Panel")}
    `
  },

  security: {
    title: "Security",
    description: "Privileged cockpit safeguards.",
    html: `
      ${securityItem("Filesystem writes", "APPROVAL REQUIRED")}
      ${securityItem("File deletion", "APPROVAL REQUIRED")}
      ${securityItem("Repository push", "APPROVAL REQUIRED")}
      ${securityItem("Deployment", "APPROVAL REQUIRED")}
      ${securityItem("Permission changes", "APPROVAL REQUIRED")}
    `
  },

  governance: {
    title: "Governance",
    description: "Human-in-the-loop controls.",
    html: `
      ${securityItem("AI changes", "HUMAN APPROVAL")}
      ${securityItem("Destructive operations", "BLOCKED BY DEFAULT")}
      ${securityItem("Governance modification", "HUMAN APPROVAL")}
      ${securityItem("External provider actions", "HUMAN APPROVAL")}
    `
  }
};

function settingInput(label, value, description) {
  return `
    <div class="setting">
      <label class="setting-label">${label}</label>
      <input value="${escapeHTML(value)}" />
      <div class="setting-description">${description}</div>
    </div>
  `;
}

function settingSelect(label, options, selected) {
  return `
    <div class="setting">
      <label class="setting-label">${label}</label>
      <select>
        ${options.map(option => `
          <option ${option === selected ? "selected" : ""}>
            ${escapeHTML(option)}
          </option>
        `).join("")}
      </select>
    </div>
  `;
}

function settingToggle(label, enabled, description) {
  return `
    <div class="setting">
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        max-width:480px;
      ">
        <span class="setting-label" style="margin:0">
          ${label}
        </span>

        <button
          class="toggle ${enabled ? "on" : ""}"
          data-toggle="${escapeHTML(label)}"
        >
          <span></span>
        </button>
      </div>

      <div class="setting-description">
        ${description}
      </div>
    </div>
  `;
}

function shortcut(key, description) {
  return `
    <div class="setting" style="
      display:flex;
      justify-content:space-between;
      max-width:480px;
      border-bottom:1px solid var(--border);
      padding-bottom:9px;
    ">
      <span style="color:var(--text-2);font-size:10px">
        ${description}
      </span>

      <kbd style="
        color:var(--text-4);
        border:1px solid var(--border);
        padding:3px 7px;
        border-radius:3px;
        font-size:8px;
      ">
        ${key}
      </kbd>
    </div>
  `;
}

function securityItem(label, status) {
  return `
    <div class="setting" style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      max-width:560px;
      padding:10px;
      border:1px solid var(--border);
      background:#0e141a;
      border-radius:5px;
    ">
      <span style="color:var(--text-2);font-size:10px">
        ${label}
      </span>

      <span style="
        color:var(--yellow);
        font-size:8px;
        letter-spacing:.5px;
      ">
        ${status}
      </span>
    </div>
  `;
}

function renderSettings(section) {
  const page =
    settingsPages[section] ||
    settingsPages.general;

  $$(".settings-nav-item").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.settings === section
    );
  });

  $("#settingsContent").innerHTML = `
    <div class="settings-section">
      <h3>${page.title}</h3>
      <p>${page.description}</p>
      ${page.html}
    </div>
  `;

  $$(".toggle").forEach(toggle => {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("on");
    });
  });
}

/* ============================================================
   CURSOR
   ============================================================ */

function updateCursorPosition() {
  const selection = window.getSelection();

  if (!selection || !selection.rangeCount) {
    $("#cursorPosition").textContent = "Ln 1, Col 1";
    return;
  }

  const range = selection.getRangeAt(0);

  if (!$("#editor").contains(range.startContainer)) {
    return;
  }

  const textBefore = range.startContainer.textContent
    ?.slice(0, range.startOffset) || "";

  const line = textBefore.split("\n").length;

  const column =
    textBefore.split("\n").at(-1).length + 1;

  $("#cursorPosition").textContent =
    `Ln ${line}, Col ${column}`;
}

/* ============================================================
   TOASTS
   ============================================================ */

function showToast(title, message) {
  const toast = document.createElement("div");

  toast.className = "toast";

  toast.innerHTML = `
    <div class="toast-title">${escapeHTML(title)}</div>
    <div class="toast-message">${escapeHTML(message)}</div>
  `;

  $("#toastContainer").appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3600);
}

/* ============================================================
   EVENT HANDLERS
   ============================================================ */

function initializeEvents() {

  /* Explorer */

  $("#sidebarContent").addEventListener("click", async event => {
    const fileElement = event.target.closest("[data-file]");

    if (fileElement) {
      await openFile(fileElement.dataset.file);
      return;
    }

    const folderElement =
      event.target.closest("[data-folder]");

    if (folderElement) {
      const folder = folderElement.dataset.folder;

      if (state.expandedFolders.has(folder)) {
        state.expandedFolders.delete(folder);
      } else {
        state.expandedFolders.add(folder);
      }

      renderExplorer();
    }

    const mapItem =
      event.target.closest("[data-map-item]");

    if (mapItem) {
      openNodeInspector(mapItem.dataset.mapItem);
    }
  });

  /* Tabs */

  $("#tabs").addEventListener("click", event => {
    const close = event.target.closest("[data-close-tab]");

    if (close) {
      closeTab(close.dataset.closeTab);
      event.stopPropagation();
      return;
    }

    const tab = event.target.closest(".tab");

    if (tab?.dataset.file) {
      openFile(tab.dataset.file);
    }
  });

  /* Activity bar */

  $$(".activity-button").forEach(button => {
    button.addEventListener("click", () => {
      const view = button.dataset.view;

      if (view === "settings") {
        openSettings();
      } else {
        switchSidebarView(view);
      }
    });
  });

  /* New file */

  $("#newFileButton").addEventListener("click", async () => {
    const name = prompt(
      "New demo filename:",
      "new_agent.py"
    );

    if (!name) return;

    const file = await Services.files.create(name);

    state.openTabs.push({
      name: file,
      modified: false
    });

    await openFile(file);

    showToast(
      "Demo File Created",
      `${file} exists only inside the simulated workspace.`
    );
  });

  /* Editor */

  $("#editor").addEventListener("input", () => {
    renderLineNumbers();
    renderMinimap();
    updateModifiedState();
  });

  $("#editor").addEventListener(
    "keyup",
    updateCursorPosition
  );

  $("#editor").addEventListener(
    "click",
    updateCursorPosition
  );

  /* Editor AI actions */

  $$(".editor-ai-bar button").forEach(button => {
    button.addEventListener("click", () => {
      executeAIAction(button.dataset.aiAction);
    });
  });

  /* Save */

  document.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();

    if ((event.ctrlKey || event.metaKey) && key === "s") {
      event.preventDefault();
      saveCurrentFile();
    }

    if ((event.ctrlKey || event.metaKey) && key === "p") {
      event.preventDefault();
      openGlobalSearch();
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      key === "p"
    ) {
      event.preventDefault();
      openCommandPalette();
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      key === "f"
    ) {
      event.preventDefault();
      openGlobalSearch();
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      key === "f"
    ) {
      event.preventDefault();
      openEditorFind();
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      key === "w"
    ) {
      event.preventDefault();
      closeTab(state.currentFile);
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      key === "b"
    ) {
      event.preventDefault();

      const sidebar = $("#sidebar");

      if (sidebar.style.display === "none") {
        sidebar.style.display = "flex";
      } else {
        sidebar.style.display = "none";
      }
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      key === "j"
    ) {
      event.preventDefault();
      toggleBottomPanel();
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      key === "`"
    ) {
      event.preventDefault();

      state.bottomPanel = "terminal";
      state.bottomCollapsed = false;
      $("#bottomPanel").classList.remove("collapsed");
      renderBottomPanel();
    }

    if (event.key === "Escape") {
      closeAllOverlays();
    }
  });

  /* Bottom tabs */

  $$(".bottom-tab").forEach(button => {
    button.addEventListener("click", () => {
      state.bottomPanel = button.dataset.panel;

      $$(".bottom-tab").forEach(tab => {
        tab.classList.toggle(
          "active",
          tab === button
        );
      });

      state.bottomCollapsed = false;
      $("#bottomPanel").classList.remove("collapsed");

      renderBottomPanel();
    });
  });

  $("#collapseBottom").addEventListener(
    "click",
    toggleBottomPanel
  );

  $("#clearBottom").addEventListener("click", () => {
    $("#bottomContent").innerHTML = "";
  });

  /* AI selector */

  $("#activeAgentButton").addEventListener("click", () => {
    $("#agentMenu").classList.toggle("hidden");
  });

  $("#agentMenu").addEventListener("click", event => {
    const option =
      event.target.closest("[data-agent]");

    if (!option) return;

    switchActiveAgent(option.dataset.agent);
  });

  /* AI chat */

  $("#sendChat").addEventListener("click", () => {
    sendChatMessage($("#chatInput").value);
  });

  $("#chatInput").addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        sendChatMessage(event.target.value);
      }
    }
  );

  $(".quick-prompts").addEventListener(
    "click",
    event => {
      const button =
        event.target.closest("[data-prompt]");

      if (!button) return;

      $("#chatInput").value =
        button.dataset.prompt;

      sendChatMessage(button.dataset.prompt);
    }
  );

  $("#chatMessages").addEventListener(
    "click",
    event => {
      const button =
        event.target.closest("[data-chat-action]");

      if (!button) return;

      executeAIAction(
        button.dataset.chatAction
      );
    }
  );

  $("#refreshContext").addEventListener(
    "click",
    () => {
      renderContext();

      showToast(
        "Context Refreshed",
        "Simulated context index refreshed."
      );
    }
  );

  $("#closeAiPanel").addEventListener(
    "click",
    () => {
      $("#aiPanel").classList.toggle("closed");
    }
  );

  /* Find */

  $("#findButton").addEventListener(
    "click",
    openEditorFind
  );

  $("#editorFindClose").addEventListener(
    "click",
    closeEditorFind
  );

  $("#editorFindInput").addEventListener(
    "input",
    findInEditor
  );

  /* Minimap */

  $("#minimapButton").addEventListener(
    "click",
    () => {
      const minimap = $("#minimap");

      minimap.style.display =
        minimap.style.display === "none"
          ? "block"
          : "none";
    }
  );

  /* Global search */

  $("#globalSearchInput").addEventListener(
    "input",
    event => {
      renderGlobalSearchResults(
        event.target.value
      );
    }
  );

  $("#globalSearchResults").addEventListener(
    "click",
    event => {
      const result =
        event.target.closest(
          "[data-search-file]"
        );

      if (!result) return;

      const name = result.dataset.searchFile;

      if (Services.files.files[name]) {
        closeOverlay("globalSearchOverlay");
        openFile(name);
      }
    }
  );

  /* Notifications */

  $("#notificationsButton").addEventListener(
    "click",
    () => {
      showToast(
        "Notifications",
        "1 approval request · 1 agent handoff · 1 completed job."
      );
    }
  );

  /* Settings */

  $("#settingsButton").addEventListener(
    "click",
    () => openSettings()
  );

  $$(".settings-nav-item").forEach(button => {
    button.addEventListener("click", () => {
      renderSettings(button.dataset.settings);
    });
  });

  /* Diff */

  $("#approveDiff").addEventListener(
    "click",
    approveDiff
  );

  $("#rejectDiff").addEventListener(
    "click",
    rejectDiff
  );

  $("#previewDiff").addEventListener(
    "click",
    () => {
      showToast(
        "Preview",
        "This is the proposed governed change."
      );
    }
  );

  $("#editDiff").addEventListener(
    "click",
    () => {
      showToast(
        "Edit",
        "Prototype diff editing mode selected."
      );
    }
  );

  /* Generic overlay close */

  $$("[data-close-overlay]").forEach(button => {
    button.addEventListener("click", () => {
      closeOverlay(
        button.dataset.closeOverlay
      );
    });
  });

  /* Command palette */

  $("#commandInput").addEventListener(
    "input",
    () => {
      state.commandIndex = 0;
      renderCommands();
    }
  );

  $("#commandInput").addEventListener(
    "keydown",
    event => {
      const filtered = filteredCommands();

      if (event.key === "ArrowDown") {
        event.preventDefault();

        state.commandIndex =
          (state.commandIndex + 1) %
          Math.max(filtered.length, 1);

        renderCommands();
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();

        state.commandIndex =
          (state.commandIndex - 1 + filtered.length) %
          Math.max(filtered.length, 1);

        renderCommands();
      }

      if (event.key === "Enter") {
        event.preventDefault();

        const command =
          filtered[state.commandIndex];

        if (command) {
          executeCommand(
            commands.indexOf(command)
          );
        }
      }
    }
  );

  $("#commandList").addEventListener(
    "click",
    event => {
      const item =
        event.target.closest(
          "[data-command-index]"
        );

      if (!item) return;

      executeCommand(
        Number(item.dataset.commandIndex)
      );
    }
  );

  /* Workspace */

  $("#workspaceButton").addEventListener(
    "click",
    () => {
      showToast(
        "Workspace",
        "L@B is the active simulated workspace."
      );
    }
  );

  $("#sidebarContent").addEventListener("keydown", event => {
    const target = event.target.closest("[role='button'][data-home-action]");
    if (target && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      switchSidebarView(target.dataset.homeAction);
    }
  });

  $("#brandButton").addEventListener(
    "click",
    () => {
      showToast(
        "JrCockpit",
        "Human/operator cockpit for the L@B."
      );
    }
  );
}

/* ============================================================
   FIND
   ============================================================ */

function openEditorFind() {
  $("#editorFind").classList.remove("hidden");

  $("#editorFindInput").focus();
}

function closeEditorFind() {
  $("#editorFind").classList.add("hidden");
}

function findInEditor() {
  const query = $("#editorFindInput").value
    .trim()
    .toLowerCase();

  if (!query) {
    $("#editorFindCount").textContent = "";
    return;
  }

  const content = $("#editor").innerText
    .toLowerCase();

  let index = 0;
  let count = 0;

  while ((index = content.indexOf(query, index)) !== -1) {
    count++;
    index += query.length;
  }

  $("#editorFindCount").textContent =
    `${count} result${count === 1 ? "" : "s"}`;
}

/* ============================================================
   PANEL / OVERLAY HELPERS
   ============================================================ */

function toggleBottomPanel() {
  state.bottomCollapsed =
    !state.bottomCollapsed;

  $("#bottomPanel").classList.toggle(
    "collapsed",
    state.bottomCollapsed
  );
}

function closeOverlay(id) {
  const element = document.getElementById(id);

  if (element) {
    element.classList.add("hidden");
  }
}

function closeAllOverlays() {
  [
    "commandPalette",
    "globalSearchOverlay",
    "diffOverlay",
    "inspectorOverlay",
    "settingsOverlay"
  ].forEach(closeOverlay);

  $("#agentMenu").classList.add("hidden");
}

/* ============================================================
   START
   ============================================================ */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    initializeEvents();
    boot();
  }
);

/* ============================================================
   RUNTIME SAFETY
   ============================================================ */

window.addEventListener("error", event => {
  showToast(
    "Runtime Error",
    event.message || "An unexpected client-side error occurred."
  );
});

window.addEventListener("unhandledrejection", event => {
  const reason = event.reason instanceof Error
    ? event.reason.message
    : String(event.reason || "Unknown async error");

  showToast("Async Error", reason);
});
