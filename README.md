# Time Tracker

A simple time tracker for one person, inspired by Clockify: start a timer when you begin working on something, stop it when you're done, and see where your time went.

It is plain HTML, CSS and JavaScript, with no server, no database and nothing to install. It runs in the browser, and as an Android app.

## Features

**Timer**

- Start and stop a timer, with a description and a tag. Only one timer runs at a time.
- A running timer keeps running when you close the app, or turn the laptop or phone off.

**Entries**

- A list of entries, newest first, grouped by day, with a total for each day and for today.
- Add an entry by hand, for when you forgot the timer.
- Edit an entry's description, tag, date, start and end. The app refuses an end before the start, with a clear message.
- Delete an entry, after a confirmation question.

**Reports**

- This week: a total for each day and for the week, with arrows to earlier and later weeks.
- The total time per tag, for the same week.
- Export the entries between two dates to a CSV file for Excel or Google Sheets.

**Also**

- The privacy policy and terms of service, inside the app.
- Works on a phone-sized screen.
- Works offline: even the font is part of the app.

## Run it

Open `index.html` in Chrome or Firefox. That's all.

After changing a file, reload the page (F5) to see the change.

## Build the Android app

The `android/` folder wraps the web app in a small Android app. To build the APK file:

```
bash android/build-apk.sh
```

It needs the Android SDK (build-tools and platform 36) in `~/Android/Sdk`, or wherever `ANDROID_HOME` points, and Java 17. It doesn't need Gradle or Android Studio. The APK is written to `android/build/time-tracker.apk` and runs on Android 10 or newer.

The build copies the web app into the Android app, so there is only one version of the app to change.

## Where your data is kept

Your entries stay on your device: in the browser you use the app in, or inside the Android app. Nothing is sent anywhere. Entries in the laptop's browser and on the phone are separate, and nothing copies them from one to the other.

Clearing the browser's data for the app deletes your entries in the browser. Uninstalling the Android app deletes them on the phone.

## Files

| File | What it does |
|---|---|
| `index.html` | The page: what you see |
| `styles.css` | How it looks |
| `js/time.js` | Working with time: durations, dates, weeks |
| `js/storage.js` | Saving and loading data in the browser |
| `js/pages.js` | Switching between the pages |
| `js/reports.js` | The Reports page: the week, the tags, the export |
| `js/app.js` | The timer, the list of entries, adding and editing |
| `fonts/` | The Rubik font and its license (SIL Open Font License) |
| `android/` | The Android app and its build script |
| `privacy-policy.md`, `terms-of-service.md` | The privacy policy and terms of service |
| `PLAN.md` | The plan: requirements, decisions and steps |
| `TRACKING.md` | Every step, with what changed, why, and how it was checked |
