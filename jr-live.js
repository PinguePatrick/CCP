"use strict";

/*
 * jr-live.js — patches CCP-upgraded.js Services with real Jr API calls.
 * Runs after CCP-upgraded.js in the same global scope.
 * The box is at 127.0.0.1:7907 via SSH tunnel (Windows side).
 */

const JR_BASE = (() => {
  const o = window.location.origin;
  return o === "null" || o.startsWith("file:") ? "http://127.0.0.1:7907" : "";
})();

async function _jrPing() {
  try {
    const r = await fetch(JR_BASE + "/health", { signal: AbortSignal.timeout(2500) });
    return r.ok ? "LIVE" : "DEGRADED";
  } catch {
    return "OFFLINE";
  }
}

async function _jrAsk(q) {
  try {
    const r = await fetch(JR_BASE + "/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q }),
      signal: AbortSignal.timeout(20000),
    });
    const d = await r.json();
    return { text: d.said || "(no response)", live: true };
  } catch (e) {
    return { text: "[Jr unreachable: " + e.message + "]", live: false };
  }
}

// --- patch Services (defined by CCP-upgraded.js in same global scope) ---

Services.agents.respond = async function (agent, message) {
  const res = await _jrAsk(message);
  return {
    text: res.text,
    actions: res.live ? ["Ask again", "Open hub"] : ["Check tunnel", "Retry"],
    simulated: !res.live,
  };
};

Services.cell.statusReport = async function () {
  const status = await _jrPing();
  return {
    status: status,
    simulated: status !== "LIVE",
    mission: "Keep Father solvent and shipping",
    phase: status === "LIVE" ? "ACTIVE" : "OFFLINE",
    pendingApprovals: 0,
    activeOperations: status === "LIVE" ? 1 : 0,
    health: status === "LIVE" ? "NOMINAL" : "CHECK",
    sourceOfTruth: "JrSeedOsX @ 100.115.17.86",
  };
};

Services.cell.command = async function (cmd) {
  // Route /commands to Jr
  const res = await _jrAsk(cmd.replace(/^\//, ""));
  return res.text;
};

// --- live status overlay on DOMContentLoaded ---

document.addEventListener("DOMContentLoaded", () => {
  // Give the main boot animation a moment, then apply live state
  setTimeout(async () => {
    const status = await _jrPing();
    const live = status === "LIVE";

    // Remove or update SIMULATED badges
    document.querySelectorAll(".simulation-badge").forEach((el) => {
      el.textContent = live ? "LIVE · " + (JR_BASE || window.location.origin) : "Jr OFFLINE";
      el.style.background = live ? "#0a2a1a" : "#2a1010";
      el.style.color = live ? "#55d187" : "#f87171";
      el.style.border = "1px solid " + (live ? "#1a4a2e" : "#4a1a1a");
    });

    document.querySelectorAll(".simulation-status").forEach((el) => {
      el.textContent = live ? "LIVE · Jr" : "Jr OFFLINE";
      el.style.color = live ? "#55d187" : "#f87171";
    });

    // Update all .status-label spans
    document.querySelectorAll(".status-label").forEach((el) => {
      el.textContent = live ? "LIVE" : "OFFLINE";
      el.style.color = live ? "#55d187" : "#f87171";
    });

    // Agent state badge in AI panel
    const agentState = document.querySelector(".agent-state");
    if (agentState) {
      agentState.textContent = "● " + (live ? "LIVE" : "OFFLINE");
      agentState.style.color = live ? "#55d187" : "#f87171";
    }

    // Mission strip
    const missionFacts = document.querySelector(".mission-facts");
    if (missionFacts) {
      const modeBit = missionFacts.querySelector("span");
      if (modeBit) modeBit.innerHTML = "<b>MODE</b> " + (live ? "LIVE" : "OFFLINE");
    }

    // Boot services items (still visible briefly during boot)
    document.querySelectorAll(".boot-services > div").forEach((row, i) => {
      const b = row.querySelector("b");
      if (!b) return;
      const labels = ["Jr", "Ollama", "Board", "n8n"];
      if (i === 0) {
        b.textContent = status;
        b.style.color = live ? "#39d4b8" : "#f87171";
      } else {
        b.textContent = live ? "OK" : "UNKNOWN";
        b.style.color = live ? "#39d4b8" : "#7a7a85";
      }
    });

    // Poll every 30 s
    setInterval(async () => {
      const s = await _jrPing();
      document.querySelectorAll(".status-dot.green").forEach((d) => {
        d.style.background = s === "LIVE" ? "#55d187" : "#f87171";
      });
    }, 30000);
  }, 900);
});
