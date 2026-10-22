package com.example.timetracker;

import android.app.Activity;
import android.content.pm.ApplicationInfo;
import android.graphics.Color;
import android.graphics.Insets;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;

// The one screen of the app: a WebView, a browser window without the browser around it,
// showing the web app that the build script copied into the app (assets/www).
public class MainActivity extends Activity {
    // The dark green of the bar at the top of the web app, behind the phone's status bar.
    private static final int FOREST = Color.rgb(0x16, 0x38, 0x2a);

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // In a debug build (DEBUG=1 bash build-apk.sh), Chrome on the laptop can look inside
        // the app's WebView: open chrome://inspect with the phone connected.
        if ((getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        // The web app keeps its entries in the browser's storage (localStorage).
        settings.setDomStorageEnabled(true);
        // Links open inside the app, not in the phone's browser.
        webView.setWebViewClient(new WebViewClient());

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(FOREST);
        root.addView(webView);
        setContentView(root);
        fitBetweenSystemBars(root);

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl("file:///android_asset/www/index.html");
        }

        if (Build.VERSION.SDK_INT >= 33) handleBackOnNewerAndroid();
    }

    // The app draws behind the status bar and the navigation bar, which newer Android
    // versions require. The padding keeps the web app between them, and above the keyboard.
    @SuppressWarnings("deprecation")
    private void fitBetweenSystemBars(View root) {
        getWindow().setStatusBarColor(Color.TRANSPARENT);
        getWindow().setNavigationBarColor(Color.TRANSPARENT);
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            root.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
                @Override
                public WindowInsets onApplyWindowInsets(View view, WindowInsets insets) {
                    Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.ime());
                    view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
                    return WindowInsets.CONSUMED;
                }
            });
        } else {
            root.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
            root.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
                @Override
                public WindowInsets onApplyWindowInsets(View view, WindowInsets insets) {
                    view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                            insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
                    return insets.consumeSystemWindowInsets();
                }
            });
        }
    }

    // Back goes to the previous page of the web app (Reports -> Timer, for example).
    // On the first page, it puts the app in the background, as Back does in other apps.
    private void goBack() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            moveTaskToBack(true);
        }
    }

    // Android 13 and newer.
    private void handleBackOnNewerAndroid() {
        getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                OnBackInvokedDispatcher.PRIORITY_DEFAULT, new OnBackInvokedCallback() {
                    @Override
                    public void onBackInvoked() {
                        goBack();
                    }
                });
    }

    // Android 10 to 12.
    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        goBack();
    }

    // Keeps the page you were on when Android recreates the screen.
    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }
}
