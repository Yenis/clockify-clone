#!/usr/bin/env bash
# Builds the Android app, android/build/time-tracker.apk, from the web app.
# Needs the Android SDK (build-tools and platform 36) and Java. No Gradle, no Android Studio.
#
# Run it from anywhere:  bash android/build-apk.sh
# A debug build, which Chrome's chrome://inspect can look inside:  DEBUG=1 bash android/build-apk.sh
set -euo pipefail

cd "$(dirname "$0")"
SDK="${ANDROID_HOME:-$HOME/Android/Sdk}"
TOOLS="$SDK/build-tools/$(ls "$SDK/build-tools" | sort -V | tail -1)"
ANDROID_JAR="$SDK/platforms/android-36/android.jar"
KEYSTORE="$HOME/.android/debug.keystore"
DEBUG_FLAG=""
if [ "${DEBUG:-}" = 1 ]; then DEBUG_FLAG="--debug-mode"; fi
OUT=build

echo "1/7 Start with an empty build folder"
rm -rf "$OUT"
mkdir -p "$OUT/assets/www" "$OUT/gen" "$OUT/classes" "$OUT/dex"

echo "2/7 Copy the web app into the Android app"
cp -r ../index.html ../styles.css ../js ../fonts "$OUT/assets/www/"

echo "3/7 Prepare the icon and colours"
"$TOOLS/aapt2" compile --dir res -o "$OUT/res.zip"
"$TOOLS/aapt2" link -o "$OUT/unsigned.apk" -I "$ANDROID_JAR" \
  --manifest AndroidManifest.xml --min-sdk-version 29 --target-sdk-version 36 \
  --version-code 1 --version-name 1.0 $DEBUG_FLAG \
  -A "$OUT/assets" --java "$OUT/gen" "$OUT/res.zip"

echo "4/7 Compile the Java code"
javac -source 8 -target 8 -bootclasspath "$ANDROID_JAR" -Xlint:-options -encoding UTF-8 \
  -d "$OUT/classes" $(find src "$OUT/gen" -name '*.java')

echo "5/7 Turn it into Android's format (classes.dex) and add it to the app"
"$TOOLS/d8" --min-api 29 --lib "$ANDROID_JAR" --output "$OUT/dex" $(find "$OUT/classes" -name '*.class')
(cd "$OUT/dex" && zip -q ../unsigned.apk classes.dex)
"$TOOLS/zipalign" -f -p 4 "$OUT/unsigned.apk" "$OUT/aligned.apk"

echo "6/7 Sign it with this laptop's debug key"
if [ ! -f "$KEYSTORE" ]; then
  mkdir -p "$(dirname "$KEYSTORE")"
  keytool -genkeypair -keystore "$KEYSTORE" -storepass android -alias androiddebugkey \
    -keypass android -keyalg RSA -keysize 2048 -validity 10000 \
    -dname "CN=Android Debug,O=Android,C=US" >/dev/null 2>&1
fi
"$TOOLS/apksigner" sign --ks "$KEYSTORE" --ks-pass pass:android --key-pass pass:android \
  --out "$OUT/time-tracker.apk" "$OUT/aligned.apk"

echo "7/7 Check the signature"
"$TOOLS/apksigner" verify "$OUT/time-tracker.apk"

echo "Done: android/$OUT/time-tracker.apk"
