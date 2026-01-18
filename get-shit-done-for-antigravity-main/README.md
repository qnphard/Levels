# GSD for Antigravity

> **Get Shit Done** — A spec-driven, context-engineered development methodology adapted for Google Antigravity.

[![Based on GSD](https://img.shields.io/badge/based%20on-GSD-blue)](https://github.com/glittercowboy/get-shit-done)

---

## Why This Exists

Vibecoding has a bad reputation. You describe what you want, AI generates code, and you get inconsistent garbage that falls apart at scale.

GSD fixes that. It's the **context engineering layer** that makes AI coding reliable. Describe your idea, let the system extract everything it needs to know, and let the AI get to work.

**No enterprise roleplay.** No sprint ceremonies, story points, stakeholder syncs, or Jira workflows. Just an incredibly effective system for building cool stuff consistently.

The complexity is in the system, not in your workflow.

---

## Who This Is For

People who want to describe what they want and have it built correctly — without pretending they're running a 50-person engineering org.

- Solo developers using AI coding assistants
- Small teams who want structure without overhead
- Anyone tired of AI generating inconsistent garbage

---

## 🚀 Getting Started

**PowerShell (Windows):**
```powershell
# Open your project
cd your-project

# Clone the GSD template
git clone https://github.com/toonight/get-shit-done-for-antigravity.git gsd-template

# Copy to your project
Copy-Item -Recurse gsd-template\.agent .\
Copy-Item -Recurse gsd-template\.gemini .\
Copy-Item -Recurse gsd-template\.gsd .\

# Clean up
Remove-Item -Recurse -Force gsd-template
```

**Bash (Linux/Mac):**
```bash
# open your project
cd your-project

# Clone the GSD template
git clone https://github.com/toonight/get-shit-done-for-antigravity.git gsd-template

# Copy to your project
cp -r gsd-template/.agent ./
cp -r gsd-template/.gemini ./
cp -r gsd-template/.gsd ./

# Clean up
rm -rf gsd-template
```

Then run `/new-project` and follow the prompts.

---

## How It Works

### 1. Initialize → Question → Spec
```
/new-project → Deep questioning → SPEC.md (finalized)
```

### 2. Discuss (Optional) → Context
```
/discuss-phase 1 → Clarify scope → DECISIONS.md
```

### 3. Plan → Research → Tasks
```
/plan 1 → Discovery → PLAN.md with XML tasks
```

### 4. Execute → Verify → Commit
```
/execute 1 → Wave execution → Atomic commits
/verify 1 → Must-haves check → Evidence captured
```

### 5. Repeat
```
/discuss-phase 2 → /plan 2 → /execute 2 → ...
/complete-milestone → Next milestone
```

---

## Why It Works

### Context Engineering

The AI is incredibly powerful *if* you give it the context it needs. Most people don't.

GSD handles it for you:

| File | What it does |
|------|--------------|
| `SPEC.md` | Project vision, always loaded |
| `ARCHITECTURE.md` | System understanding |
| `ROADMAP.md` | Where you're going, what's done |
| `STATE.md` | Decisions, blockers, position — memory across sessions |
| `PLAN.md` | Atomic tasks with XML structure, verification steps |
| `SUMMARY.md` | What happened, what changed |

Size limits based on where AI quality degrades. Stay under, get consistent excellence.

### XML Prompt Formatting

Every plan is structured XML optimized for AI execution:

```xml
<task type="auto">
  <name>Create login endpoint</name>
  <files>src/app/api/auth/login/route.ts</files>
  <action>
    Use jose for JWT (not jsonwebtoken - CommonJS issues).
    Validate credentials against users table.
    Return httpOnly cookie on success.
  </action>
  <verify>curl -X POST localhost:3000/api/auth/login returns 200 + Set-Cookie</verify>
  <done>Valid credentials return cookie, invalid return 401</done>
</task>
```

Precise instructions. No guessing. Verification built in.

### Wave-Based Execution

Plans are grouped into waves based on dependencies:

| Wave | Plans | Parallelization |
|------|-------|-----------------|
| 1 | Foundation tasks | Run together |
| 2 | Depends on Wave 1 | Wait, then run together |
| 3 | Depends on Wave 2 | Wait, then run together |

Each executor gets fresh context. Your main session stays fast.

### Atomic Git Commits

Each task gets its own commit immediately after completion:

```bash
abc123f feat(phase-1): create login endpoint
def456g feat(phase-1): add password validation
hij789k feat(phase-1): implement JWT cookie handling
```

**Benefits:** 
- Git bisect finds exact failing task
- Each task independently revertable
- Clear history for AI in future sessions

### Empirical Verification

No "trust me, it works." Every verification produces evidence:

| Change Type | Evidence Required |
|-------------|-------------------|
| API endpoint | curl output |
| UI change | Screenshot |
| Build | Command output |
| Tests | Test results |

Luca @Kryll.io, [2026-01-18 07:38]
@Toonight78 tu as regardé si Antigravity a la possibilité de lancer des « sous agents » pour paralleliser et clear le contexte ( eviter le context-poisonning ) ?

Luca @Kryll.io, [2026-01-18 08:06]
@Toonight78 je pense qu'il faut pas commit les fichiers ARCHITECTURE.md
DECISIONS.md
JOURNAL.md
ROADMAP.md
SPEC.md
STACK.md
STATE.md
TODO.md
dans .gsd

Luca @Kryll.io, [2026-01-18 08:06]
+ la doc est pas bonne pour l'install| ✅ **Empirical Validation** | Proof required — no "it should work" |

---

## 🌍 Cross-Platform Support

All workflow files include **dual syntax** — both PowerShell and Bash commands:

- **Windows users:** Use the PowerShell blocks
- **Linux/Mac users:** Use the Bash blocks (some may require `jq` for JSON parsing)

**Note:** Git commands (`git add`, `git commit`, `git tag`) are cross-platform and work identically on all systems.

---

## 📁 File Structure

```
.agent/
├── workflows/        # 21 slash commands
└── skills/           # 8 agent specializations

.gemini/
└── GEMINI.md         # Rules enforcement

.gsd/
├── SPEC.md           # ← START HERE (finalize first)
├── ROADMAP.md        # Phases and progress
├── STATE.md          # Session memory
├── ARCHITECTURE.md   # System design (/map output)
├── STACK.md          # Tech inventory
├── DECISIONS.md      # Architecture Decision Records
├── JOURNAL.md        # Session log
├── TODO.md           # Quick capture
├── templates/        # Document templates
└── examples/         # Usage walkthroughs

GSD-STYLE.md          # Complete style guide
```

---

## Typical Session

```
/resume              ← Load context from last session
/progress            ← See where you left off
/discuss-phase 2     ← Clarify requirements (optional)
/plan 2              ← Plan next phase
/execute 2           ← Implement with atomic commits
/verify 2            ← Prove it works (screenshots, tests)
/pause               ← Save state for later
```

---

## 🧪 Testing

Run validation scripts to verify GSD structure:

**PowerShell:**
```powershell
.\scripts\validate-all.ps1      # Run all validators
.\scripts\validate-workflows.ps1  # Workflows only
.\scripts\validate-skills.ps1     # Skills only
```

**Bash:**
```bash
./scripts/validate-all.sh      # Run all validators
./scripts/validate-workflows.sh  # Workflows only
./scripts/validate-skills.sh     # Skills only
```

---

## 📚 Documentation

- [GSD-STYLE.md](GSD-STYLE.md) — Complete style and conventions guide
- [Examples](.gsd/examples/) — Usage walkthroughs and quick reference
- [Templates](.gsd/templates/) — Document templates for plans, verification, etc.

---

## 🧠 Philosophy

- **Plan before building** — SPEC.md matters more than you think
- **Fresh context > polluted context** — State dumps prevent hallucinations
- **Proof over trust** — Screenshots and command outputs, not "looks right"
- **Aggressive atomicity** — 2-3 tasks per plan, atomic commits
- **No enterprise theater** — Solo dev + AI workflow only

---

*Adapted from [glittercowboy/get-shit-done](https://github.com/glittercowboy/get-shit-done) for Google Antigravity*