---
name: create-pr
description: Create a GitHub pull request for the current branch
disable-model-invocation: true
user-invocable: true
allowed-tools: Bash(git *), Bash(gh *)
---

Create a pull request for the current branch. Follow these steps:

1. Run in parallel to gather context:
   - `git log main..HEAD --oneline` — commits to include
   - `git diff main...HEAD` — full diff

2. Draft a PR title and body in English:
   - **Title**: Short and imperative, under 70 characters
   - **Body**:
     ```
     ## Summary
     - <bullet points>

     ## Test plan
     - [ ] <what to verify>

     🤖 Generated with [Claude Code](https://claude.com/claude-code)
     ```

3. Push and create the PR:
   ```bash
   git push -u origin HEAD
   gh pr create --title "<title>" --body "$(cat <<'EOF'
   <body>
   EOF
   )"
   ```

4. Output the PR URL to the user.
