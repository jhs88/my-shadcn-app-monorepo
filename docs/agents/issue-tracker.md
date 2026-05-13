# Issue tracker: Local markdown + GitHub

Primary issue tracking is local markdown files under `.scratch/<feature>/`. Issues can optionally be published to GitHub Issues when needed (e.g., for collaboration).

## Local markdown (primary)

- **Create an issue**: Write a new file `.scratch/<feature>/<short-slug>.md` with frontmatter:
  ```markdown
  ---
  title: "Short descriptive title"
  status: open
  labels: [needs-triage]
  created: YYYY-MM-DD
  ---

  ## Description
  ...

  ## Acceptance criteria
  - [ ] ...
  ```
- **List issues**: `find .scratch -name '*.md' | sort`
- **Read an issue**: Read the `.md` file directly.
- **Update status/labels**: Edit the frontmatter of the file.
- **Close an issue**: Set `status: closed` in frontmatter, optionally add closing notes.

## GitHub (when publishing)

When a skill says "publish to the issue tracker" and the context requires GitHub:

- **Create**: `gh issue create --title "..." --body "..."`
- **Read**: `gh issue view <number> --comments`
- **List**: `gh issue list --state open`
- **Comment**: `gh issue comment <number> --body "..."`
- **Labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v` — `gh` does this automatically.

## When a skill says "publish to the issue tracker"

Create a local markdown file under `.scratch/`. If the user requests GitHub publishing, also create a GitHub issue with `gh issue create`.

## When a skill says "fetch the relevant ticket"

Read the corresponding `.scratch/<feature>/<slug>.md` file. If a GitHub issue number is referenced, use `gh issue view <number> --comments`.
