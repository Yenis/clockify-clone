# Tracking

A running log of the work. Every step gets an entry: what we did, why, what we decided against, and how we checked it. The newest entry is at the bottom.

See [PLAN.md](PLAN.md) for the plan itself.

---

## Step 1: Plan

**Date:** 2026-10-15

**What:** wrote `PLAN.md`: the goal, the Silver and Gold requirements, the decisions, how an entry is stored, the files, and twelve steps.

**Why:** we agree on what we are building before building anything. Changing a plan is cheap; changing an app is not.

**Decided against:**

- A server and a database. Not needed for one person on one laptop, and it would mean installing things before we can even start.
- Storing the duration of an entry. It can always be worked out from start and end, and storing it as well means the two could disagree after an edit.

**Checked:** read the plan and agreed with it.

---

## Step 2: Tracking document

**Date:** 2026-10-15

**What:** created this file.

**Why:** git records **what** changed. This file records **why**, so that anyone who opens the project later, including Claude in a new conversation, can follow the reasoning.

**Checked:** the file exists.

---

## Step 3: An empty page with the app's layout

**Date:** 2026-10-15

**What:** created `index.html` (the page) and `styles.css` (how it looks). The page shows the title, a field for the description, a clock at 0:00:00, a Start button, and "No entries yet." Nothing works yet: the button does nothing.

**Why:** we see the shape of the app before adding any behaviour. Each later step fills in one part of this page.

**Decided against:**

- Adding the JavaScript files now, empty. Files are added in the step that needs them, so each commit shows something real.
- Putting the styles inside the HTML file. A separate file keeps "what is on the page" apart from "how it looks", which makes the changes in later steps easier to follow.

**Checked:** opened `index.html` in the browser: title, input, clock, Start button and "No entries yet." are all there.
