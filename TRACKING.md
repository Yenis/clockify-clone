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

---

## Step 6: Entries are saved

**Date:** 2026-10-15

**What:** added `js/storage.js`, which saves the entries in the browser's own storage every time the timer stops, and loads them when the page opens. Closing the tab, or the whole browser, no longer loses your entries.

**Why:** a time tracker that forgets everything when you close it is not much use. This is the last Silver requirement about the list.

**Decided against:**

- Saving to a file on the laptop. A web page opened from a file isn't allowed to write files, and getting around that would mean installing a server.
- Trusting the saved data blindly. If what is saved is broken or in an unexpected shape, the app starts with an empty list instead of crashing.

**Found while checking:** in a browser that doesn't allow sites to store data, the first version crashed while loading, and then even the timer stopped working. Now the app keeps working without storage: the timer and the list still work, and it warns you that your entries can't be saved.

**Checked:** added two entries, closed the tab, opened `index.html` again: both entries were still there, newest first.

---

## Step 7: A running timer survives closing the app

**Date:** 2026-10-15

**What:** when you press Start, the app now also saves the start time and the description of the running timer, and keeps the description up to date while you type. When the page opens and a timer was still running, it carries on: the clock shows the full time since you pressed Start, and the description is back in its field. Stopping the timer forgets the running timer.

**Why:** people close tabs and laptops while the timer runs. Without this, closing the tab would throw away the time since Start.

**Decided against:**

- Stopping the timer automatically when the page closes. You may close the tab and still be working, so the time should keep counting.
- Keeping two open tabs in step with each other. If you open the app in two tabs, each shows what was saved when it opened. One tab is enough for now.

**Detail worth knowing:** when you press Stop, the entry is saved first and the running timer is cleared second. If something went wrong between the two, you would get a duplicate entry, which is easy to delete, instead of losing the time.

**Checked:** started the timer, typed a description, closed the tab, reopened `index.html` a minute later: the timer was still running with the full time and the same description. Stopped it: the entry has the right start and end.

---

## Step 8: Today's total

**Date:** 2026-10-15

**What:** above the list, on the right, the app shows **Today** with the total time of today's entries. While the timer runs, the total counts up with it, second by second.

**Why:** "how much did I work today?" is the question people open a time tracker to answer. This was the last Silver requirement.

**Decisions:**

- **The running timer counts in the total.** The plan said "today's entries only", but a total that stands still while you are working looked broken. The total now grows with the clock, and stays the same when you press Stop, because the time moves from the timer into an entry.
- **An entry counts for the day it started on.** An entry from 23:30 to 00:30 counts for the first day, all of it.

**Decided against:**

- Splitting entries at midnight. It would be more exact, but it makes the total harder to check by hand, and working past midnight is rare.
- A total per day for every day in the list. That is a nice extra, not a requirement.

**Checked:** with entries from yesterday and today, the total adds up today's only. Started the timer: the total counted up with it. Stopped it: the total stayed the same.

**Silver is done.**

---

## Step 9: Delete an entry

**Date:** 2026-10-15

**What:** every row in the list has a **Delete** button at the end. Clicking it asks "Delete "…"? This cannot be undone." If you confirm, the entry disappears, today's total updates, and the change is saved. If you cancel, nothing happens.

**Why:** mistakes happen: a timer started by accident, a test entry, a duplicate. This is the first Gold requirement.

**Decided against:**

- Deleting without asking. One click in the wrong place would lose an entry for good.
- An "undo" button after deleting. It is friendlier than a question, but it is more work, and the question is enough for now.

**Checked:** deleted an entry and cancelled: nothing changed. Deleted it again and confirmed: gone, and the total went down by its duration. Reopened the app: still gone.

---

## Step 10: Edit an entry

**Date:** 2026-10-15

**What:** every row has an **Edit** button next to Delete. Clicking it turns that row into fields: description, date, start time and end time, with **Save** and **Cancel**. Enter in a field saves, Escape cancels. After saving, the duration and today's total update, and the change is saved.

**Why:** a timer you forgot to stop, or started late, leaves a wrong entry. Editing fixes it without deleting and starting over. This is the second Gold requirement.

**Decisions:**

- **Editing happens in the row itself**, not in a separate window. You see what you are changing in its place in the list.
- **Times you don't touch keep their seconds.** The time fields show hours and minutes only. If you change only the description, the start and end stay exactly as they were, so the duration doesn't change by a few seconds.
- **For now, wrong input gets a simple pop-up message** and nothing is saved: an end time before the start time, or an empty field. Step 12 replaces these pop-ups with clearer messages next to the fields.

**Decided against:**

- A separate end date. The end is always on the same date as the start. An entry that ran past midnight can still be edited as long as its times aren't changed. Changing them to cross midnight isn't possible yet, which is rare enough to leave for now.

**Checked:** changed only the description: the duration stayed the same, seconds included. Changed the end time: the duration and today's total followed. Cancelled an edit: nothing changed. Entered an end before the start: refused with a message, still in edit mode. Moved an entry to another date: it left today's total. Reopened the app: all changes were kept.

---

## Step 11: Add an entry by hand

**Date:** 2026-10-15

**What:** under the timer there is a link **Add an entry by hand**. It opens a small form: description, date, start and end, and an **Add** button. The date is filled in with today. After adding, the entry appears in its right place in the list, today's total updates, and the form is cleared for the next one, keeping the date.

**Why:** for when you forgot to start the timer. This is the last Gold requirement.

**Decisions:**

- **The form is folded away until you need it.** Most of the time you use the timer, so the form shouldn't take up space.
- **The checks on the times are now shared** between editing and adding: one place that decides what is wrong with a start and an end. Before, the rules lived inside the editing code. Now step 12 can improve the messages in one place for both.

**Decided against:**

- Adding the new entry at the top of the list. The list is ordered by start time, so an entry for this morning belongs among this morning's entries, wherever that is.

**Checked:** added an entry between two others: it appeared between them, and the total went up by its duration. Added one for an earlier day: it went to the bottom, and today's total didn't change. Tried an end before the start, and an empty end: refused with a message, nothing added, and the fields kept what I typed. Reopened the app: the entries were still there.

---

## Step 12: Clear messages when the input is wrong

**Date:** 2026-10-15

**What:** the pop-ups from steps 10 and 11 are gone. When a date or time is missing or wrong, the app now shows a red message right where you are working: under the form when adding by hand, and in a line under the row when editing. The field that needs fixing gets a red border and the cursor. As soon as you start typing in the form, the message goes away. Nothing is saved until the input is right.

The messages say exactly what to fix:

| Problem | Message |
|---|---|
| No date | Please choose a date. |
| No start time | Please fill in the start time. |
| No end time | Please fill in the end time. |
| A date or time that doesn't exist | This date or time is not a real one. Please check it. |
| End before or equal to start | The end time must be after the start time. Entries can't go past midnight yet. |

**Why:** a pop-up blocks the page, says the same thing for several different problems, and disappears before you have fixed anything. A message next to the field says which field and what is wrong, and stays until you fix it.

**Decided against:**

- The browser's own built-in checks on the fields. Each browser shows them differently, in its own words, and some don't show them at all.
- Refusing entries in the future, or entries that overlap. Both can be legitimate, for example planning a meeting, and they were not part of the plan.
- A pop-up for "your entries could not be saved". That one stays a pop-up on purpose: it is rare, it is serious, and it isn't about one field.

**Checked:** in the form, left each field empty in turn: each time the right message, the right field marked, and the cursor in it. Typing in the form made the message go away. An end before the start: message, nothing added. Then the same while editing: the message appeared under the row and went away when I fixed the time. No pop-ups anywhere.

**Gold is done.**

---

## Step 13: Update the plan for the new tiers

**Date:** 2026-10-22

**What:** `PLAN.md` now follows the tiers from the GitHub assignment: old Silver and Gold together are the new **Bronze**, old Gold is **Silver**, and old Platinum is **Gold**. It lists the new requirements and steps 13 to 27, and two new decisions: how the app looks, and that weeks start on Monday.

**Why:** the app already has everything in the new Bronze. The plan should say what comes next before we build it.

**Decided against:**

- Starting a new plan file. The old steps are the history of how Bronze was built, so they stay, and the new steps continue the numbering.

**Checked:** read the new requirements against section 6 of the GitHub assignment: every feature is in the plan.

---

## Step 14: `.gitignore`

**Date:** 2026-10-22

**What:** added `.gitignore`, which lists files git must never track: secrets (`.env`), installed packages (`node_modules/`), generated files (`dist/`, `build/`), and Claude Code's local settings for this folder.

**Why:** the repository will be public on GitHub, and a push sends every committed file in every commit. `.gitignore` only protects files that were never committed, so it goes in before the first push.

**Checked:** `git ls-files` lists only the app's own files and the two documents: no secrets, packages or generated files were ever committed. `git status` shows `.gitignore` as the only new file.

---

## Step 15: Keep the font inside the app

**Date:** 2026-10-22

**What:** added the **Rubik** font to a new `fonts/` folder, with its license, and the app now uses it for all its text.

**Why:** the next step gives the app a new look, built around this font. The font file is part of the app, not loaded from the internet, so the app looks the same offline, and the phone app (Gold) will need no internet at all.

**Decided against:**

- Loading the font from Google Fonts. Without internet, the browser would quietly fall back to another font.
- The font's separate files for each weight. Rubik comes as one "variable" file that has every weight from light to black.

**Checked:** opened `index.html` straight from the file: the browser reports Rubik as loaded, and the text is in Rubik. Rubik's license (SIL Open Font License) allows shipping it inside an app, as long as the license file goes with it.

---

## Step 16: The green look

**Date:** 2026-10-22

**What:** a new look for the whole app. A dark green bar at the top with a small stopwatch logo; white cards with rounded corners on a pale green background; a bigger clock; green buttons, and a red Stop button. While the timer runs, the timer card gets a green edge and the clock turns green. Today's total sits in a green label next to the "Entries" heading. Adding by hand opens with a round plus sign.

On a phone-sized screen everything goes into one column: the clock and Stop share a line under the description, and each entry becomes a small card with its description and duration on top and the date, times and buttons underneath. While editing on a small screen, each field shows its name above it, because the column headings are hidden there.

**Why:** the old look was a quick first version. The new one is calmer and easier to read, and the phone layout is needed for Gold, when the app runs on a phone.

**Decided against:**

- A menu down the left side. It takes space the list needs, and on a phone it would have to fold away. The pages we add later go in the green bar at the top instead.
- Round "pill" buttons and a decorative heading font. Rounded corners with one plain font keep it simple and easy to read.
- Changing what the app does. This step changes only how it looks, so if something breaks, we know it's the look.

**Checked:** with seven entries over three days and a running timer, on a wide window and on a phone-sized one (390 pixels wide): the timer, the form, the list, an entry being edited and an entry without a description all look right, and nothing overflows. Start, Stop, Edit, Save and Delete still work as before.

---

## Step 17: Entries grouped by day, with a total for each day

**Date:** 2026-10-22

**What:** the list now has a heading for each day, newest day first: **Today**, **Yesterday**, then for example **Monday, 19.10.2026**, with that day's total on the right. Under each heading are that day's entries, newest first. Each entry shows its description, its start and end as one range (`08:20 – 08:45`), its duration, and Edit and Delete. The date column and the column headings are gone: the day heading says the date.

Editing an entry now opens a small form across the whole row, with the name of each field above it: description, date, start, end, the duration, and Save and Cancel. A message about wrong input appears under the fields, inside the same row.

**Why:** with two weeks of entries, one long table is hard to read. Clockify groups by day too, and a total for each day answers "how much did I work on Tuesday?" at a glance. It is also a first step towards the week report in Silver.

**Decisions:**

- **Today's heading shows the same total as the Today label at the top,** running timer included, and counts up with it.
- **An entry belongs to the day it started on,** the same rule as today's total.

**Decided against:**

- Keeping the column headings. With a heading for each day they repeated themselves, and on a phone they were already hidden.
- A separate row for the message under an entry being edited. It is simpler inside the edit form, and it can't end up under the wrong row.

**Checked:** with 23 entries over six days (from the sample data) and a running timer: each day has its heading and the right total, and today's heading and the Today label count up together. Edited an entry with an end before its start: the message appeared under the fields and nothing was saved. Checked on a wide window and on a phone-sized one.
