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

---

## Step 4: The timer counts while it runs

**Date:** 2026-10-15

**What:** added `js/time.js` (formats a duration as h:mm:ss) and `js/app.js` (the Start/Stop button and the clock), and loaded both in `index.html`. Start makes the clock count up and turns the button into a red Stop button. Stop puts the clock back to 0:00:00. Nothing is saved yet.

**Why:** the timer is the heart of the app. We make it work on its own before connecting it to the list of entries.

**Decided against:**

- Adding one second to the clock on every tick. Browsers sometimes run timers late, for example in a background tab, so the clock would drift. Instead, every tick works out the time again from the moment you pressed Start.

**Checked:** clicked Start, watched the clock count, clicked Stop: back to 0:00:00 and the button says Start again.

---

## Step 5: Stopping the timer adds an entry to the list

**Date:** 2026-10-15

**What:** when you click Stop, the app creates an entry with the description, the start time and the end time, clears the description field, and shows the entry in a table: description, date, start, end and duration, newest first. An entry without a description shows "(no description)". The entries are kept only while the page is open: reloading the page loses them. That is the next step.

**Why:** this turns the timer into a record of your work, which is what the app is for.

**Changed in the plan:** times are now stored in world time (UTC) instead of local time, and shown in local time. Local time without a time zone is ambiguous on the night in October when the clocks go back: 02:30 happens twice. With world time, every duration stays correct. `PLAN.md` is updated to match.

**Decided against:**

- Storing the duration. As planned, it is worked out from start and end every time.
- Building the table rows from text with HTML in it. A description like `<b>hello</b>` would then change the page. Each cell is filled as plain text, so whatever you type is shown exactly as typed.

**Checked:** started and stopped the timer three times, one of them without a description: three rows, newest first, with the right times and durations.
