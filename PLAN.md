# Plan: Time Tracker (a Clockify clone)

## Goal

A simple time tracker for one person. You start a timer when you begin working on something, stop it when you are done, and the app keeps a list of what you worked on and for how long.

## Who it is for

One person, working on their own laptop.

## Requirements

The tiers moved up in the GitHub assignment: everything that was Silver or Gold is now **Bronze**, Gold is now **Silver**, and Platinum is now **Gold**.

**Bronze** (all built in steps 1–12)

- Start and stop a timer, with a description. Only one timer runs at a time, and it shows the time passing.
- A list of entries, newest first, with description, start, end and duration. An entry without a description shows "(no description)".
- Today's total.
- Entries are still there after you close and reopen the app, and a running timer keeps running.
- Edit an entry's description, start and end. The app refuses an end time before the start time.
- Delete an entry, after a confirmation question.

**Silver**

- Add an entry by hand (built in step 11).
- Tags, and the total time per tag.
- This week: the total for each day and for the week.
- Export entries for a range of dates to a CSV file.
- The privacy policy and terms of service inside the app.

**Gold**

- The app on an Android phone, installed from an APK file.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Technology | Plain HTML, CSS and JavaScript | Nothing to install. You open one file in the browser and it runs. |
| Where the data is kept | The browser's own storage (`localStorage`) | It survives closing the browser, and it needs no server and no database. |
| How to run it | Open `index.html` in Chrome or Firefox | The simplest possible way to run an app. |
| Language of the interface | English | Same as the course materials. |
| Time format | 24-hour clock, durations as `h:mm:ss` | What people in Bosnia and Herzegovina are used to. |
| How it looks | Green, calm and plain: a dark green bar at the top, white cards on a pale green background, the Rubik font kept inside the app | Readable, and it looks the same without internet, which the phone app needs. |
| Weeks | Start on Monday | As in Bosnia and Herzegovina. |

**What this means:** the app runs on this laptop, in this browser. The data lives in that browser and nowhere else.

## How an entry is stored

Each entry has five things:

| Field | Example | Meaning |
|---|---|---|
| `id` | `k3x9a2` | A unique name, so we can find the entry to edit or delete it |
| `description` | `Writing the plan` | What you worked on |
| `tag` | `Client work` | One tag, or empty text for no tag (from step 18) |
| `start` | `2026-10-15T07:00:00.000Z` | When you started |
| `end` | `2026-10-15T08:30:00.000Z` | When you stopped |

Times are stored in world time (UTC, the `Z` at the end) and shown in your local time: the two examples above are 09:00 and 10:30 in Sarajevo in October. This keeps durations right on the night the clocks change.

The duration is not stored. It is always worked out from start and end, so the two can never disagree.

## Files

| File | What it does |
|---|---|
| `index.html` | The page: what you see |
| `styles.css` | How it looks |
| `js/time.js` | Working with time: durations, formatting, "is this today?" |
| `js/storage.js` | Saving and loading data in the browser |
| `js/pages.js` | Switching between the pages: Timer and Reports |
| `js/reports.js` | The Reports page: the week, the tags, the export |
| `js/app.js` | Connects the page to the logic: buttons, list, totals |
| `fonts/` | The Rubik font and its license |
| `privacy-policy.md`, `terms-of-service.md` | The privacy policy and terms of service |

## Steps

One step, one commit. Each step is small enough to describe in one sentence, check in two minutes, and undo in one click.

| # | Step | How to check it |
|---|---|---|
| 1 | Plan | This file exists and we agree with it |
| 2 | Tracking document | `TRACKING.md` exists |
| 3 | An empty page with the app's layout | Open `index.html`: you see the title, an empty input, a Start button and "No entries yet" |
| 4 | The timer counts while it runs | Click Start: the clock counts up and the button says Stop. Click Stop: it goes back to 0:00:00 |
| 5 | Stopping the timer adds an entry to the list | Type a description, start, wait, stop: a row appears with description, start, end and duration |
| 6 | Entries are saved | Add two entries, close the tab, open `index.html` again: both are still there |
| 7 | A running timer survives closing the app | Start the timer, close the tab, wait a minute, reopen: it is still running and the minute is counted |
| 8 | Today's total | Add entries: the total at the top adds up the durations of today's entries only |
| | **Silver is done** | |
| 9 | Delete an entry | Click Delete on a row and confirm: it is gone, also after reopening |
| 10 | Edit an entry | Click Edit, change the description and the end time, save: the row and the total update |
| 11 | Add an entry by hand | Fill in description, date, start and end, click Add: the entry appears in the right place |
| 12 | Clear messages when the input is wrong | Try an end time before the start time: the app says what is wrong and saves nothing |
| | **Bronze is done** (the tiers moved up) | |
| 13 | Update the plan for the new tiers | This file lists the new tiers and steps |
| 14 | `.gitignore` | Secrets, installed packages and generated files are listed, and `git status` doesn't show them |
| 15 | Keep the font inside the app | Turn the internet off and reload: the text is still in Rubik |
| 16 | The green look | Header, timer, form and list look like one app, also on a phone-sized window |
| 17 | Entries grouped by day, with a total for each day | Entries from two days show under two headings, each with its own total |
| 18 | Tags | Give an entry a tag when you start, add or edit it: the tag shows next to the description |
| 19 | Two pages: Timer and Reports | The links at the top switch between them, and the page stays after reloading |
| 20 | This week: a total for each day and for the week | Compare two days with the list; the arrows move a week back and forward |
| 21 | Total per tag | Tag three entries and add their times up yourself |
| 22 | Export to CSV | Export a range of dates and open the file in Excel or Google Sheets |
| 23 | Privacy policy and terms of service | `privacy-policy.md` and `terms-of-service.md` exist |
| 24 | Both documents inside the app | Open each from a link at the bottom of the app |
| | **Silver is done** | |
| 25 | Plan the phone app | This file has the answers to the two questions from the assignment |
| 26 | An Android app around the web app | `android/build-apk.sh` makes an APK file |
| 27 | Export works on the phone | Export a CSV on the phone: it lands in Downloads |
| | **Gold is done** | |

## The phone app (Gold)

Before building anything for the phone, the assignment asks two questions.

**1. "If I had told you at the very start that this app must also work on my Android phone, what would you have planned differently?"**

Less than you might think, because of one early decision: plain HTML, CSS and JavaScript, with the data in the browser's own storage and no server. That is exactly what an Android app can carry inside itself and show in a built-in browser window (a **WebView**). What we would have done differently:

- **Designed for a phone screen first,** and then made it wider for the laptop. We added the phone layout later, in step 16.
- **Kept the font inside the app from the start** (done in step 15). A phone app shouldn't need the internet to look right.
- **Planned how the CSV export saves a file.** A browser saves downloads by itself. A WebView inside an app doesn't: the app has to save the file.
- **Planned the Back button.** On Android, Back should go to the previous page of the app, and only leave the app from the first page.
- **Said clearly where the data lives.** On the phone, the entries are kept inside the app, on that phone. They are separate from the entries in the laptop's browser, and nothing copies them from one to the other.

**2. "The app is already built. What are my options for getting it onto my phone now, and what does each one cost me?"**

| Option | What you get | What it costs |
|---|---|---|
| **Open it as a website on the phone** | The app in the phone's browser | It has to be put on a web server first (deploying, later in the course). It isn't an APK, so it isn't Gold. |
| **An installable web app (PWA)** | An icon on the home screen, from the browser | It also needs a web server with HTTPS. Still not an APK file. |
| **Capacitor** (a tool that wraps a web app in an Android project) | An APK, and ready-made extras for files, sharing and notifications | Node packages, Gradle and usually Android Studio: several gigabytes to install, and many files we didn't write. |
| **A small Android app of our own around a WebView** | An APK with the web app inside it | One Java file, one manifest and a build script, built with the Android SDK's own command-line tools. We write the file saving and the Back button ourselves. Android only. |
| **Rewrite it as a native app** (Kotlin, Flutter, React Native) | The most "phone-like" app | Weeks of work, and a second version of the app to keep in step with the first. |

**Our choice: a small Android app of our own around a WebView.** The Android SDK and Java are already on this laptop, so nothing big has to be installed, and every file in the Android app is one we wrote and can read. The web app stays the only version of the app: the build script copies it into the Android app.

| Decision | Choice | Why |
|---|---|---|
| Lowest Android version | Android 10 (API 29) | Saving a file to Downloads works the same way on every version from 10, without asking for storage permission. Almost every phone in use today has 10 or newer. |
| App ID | `com.example.timetracker` | Fine for installing from an APK file. It must be changed to a name of our own before the app could go on Google Play. |
| Signing | The Android debug key on this laptop | Android only installs signed APKs. A debug key is enough for our own phones; Google Play would need a release key. |
| How it is built | `android/build-apk.sh`, with the SDK's `aapt2`, `javac`, `d8`, `zipalign` and `apksigner` | No Gradle and no Android Studio: one script you can read from top to bottom. |

## Rules for working

- **Start every step with a clean `git status`**, and finish every step with a commit.
- **Every commit updates `TRACKING.md`**: what changed, why, and what we decided against.
- **Commit messages** have a short title that says what changed, and a body that says why:
  `git commit -m "Title" -m "Why we did it"`.
- If a step goes wrong three times, go back to the last commit and make the step smaller.
