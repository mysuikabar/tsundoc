---
name: commit
description: Commit staged changes with an appropriate message
disable-model-invocation: true
user-invocable: true
allowed-tools: Bash(git *)
---

Commit the currently staged changes. Follow these steps:

1. Run `git diff --cached` to review staged changes
2. Run `git log --oneline -5` to check recent commit message style
3. Based on the diff, write a concise commit message in English that describes the "why" not the "what"
4. Commit using a HEREDOC format:

```bash
git commit -m "$(cat <<'EOF'
<commit message>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

Rules:
- If there are no staged changes, inform the user and do nothing
- Never use `--no-verify` or skip hooks
- Never amend previous commits unless explicitly asked
- Commit message must be in English
