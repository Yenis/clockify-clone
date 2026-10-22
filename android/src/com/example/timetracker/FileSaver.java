package com.example.timetracker;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

// Saves a file that the web app hands over in the phone's Downloads folder.
// In a browser, the browser does this. Inside an app, the app has to.
// The web app reaches it as `AndroidFiles` (see downloadFile in js/reports.js).
public class FileSaver {
    private final Activity activity;

    FileSaver(Activity activity) {
        this.activity = activity;
    }

    // Returns true when the file was saved. If a file with the same name is already
    // in Downloads, Android adds a number to the new one's name instead of replacing it.
    @JavascriptInterface
    public boolean saveText(String name, String text, String mimeType) {
        ContentValues details = new ContentValues();
        details.put(MediaStore.Downloads.DISPLAY_NAME, name);
        details.put(MediaStore.Downloads.MIME_TYPE, mimeType);
        details.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);

        ContentResolver files = activity.getContentResolver();
        Uri file = files.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, details);
        if (file == null) {
            showMessage("The file could not be saved.");
            return false;
        }
        try (OutputStream out = files.openOutputStream(file)) {
            out.write(text.getBytes(StandardCharsets.UTF_8));
        } catch (IOException | NullPointerException e) {
            files.delete(file, null, null);
            showMessage("The file could not be saved.");
            return false;
        }
        showMessage("Saved in Downloads: " + savedName(files, file, name));
        return true;
    }

    // The name Android gave the file, which has a number added if the name was taken.
    private String savedName(ContentResolver files, Uri file, String asked) {
        try (Cursor result = files.query(file, new String[] {MediaStore.Downloads.DISPLAY_NAME}, null, null, null)) {
            if (result != null && result.moveToFirst()) return result.getString(0);
        } catch (RuntimeException e) {
            // Not worth failing over: the file is saved.
        }
        return asked;
    }

    // A short message at the bottom of the screen. The web app calls saveText from a
    // background thread, and messages can only be shown from the main one.
    private void showMessage(final String message) {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(activity, message, Toast.LENGTH_LONG).show();
            }
        });
    }
}
