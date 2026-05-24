# React Native Solar API Library

This project is a React Native port of the Google Solar API Library.

## Prerequisites

1.  **Google Maps API Key:** You need a valid API key with Google Maps SDK for Android/iOS and Solar API enabled.
2.  **Native Configuration:**
    *   **Android:**
        *   Add your API key to `android/app/src/main/AndroidManifest.xml`:
            ```xml
            <meta-data
                android:name="com.google.android.geo.API_KEY"
                android:value="YOUR_API_KEY"/>
            ```
    *   **iOS:**
        *   Add your API key to `ios/YourProjectName/AppDelegate.m` (or `.mm`):
            ```objectivec
            [GMSServices provideAPIKey:@"YOUR_API_KEY"];
            ```
3.  **Fonts:**
    *   This project uses the `Kameron` font. Ensure you have added the font assets to your project and configured them.

## Dependencies

The following key dependencies are used:
- `react-native-maps`: For displaying the satellite map and GeoTIFF overlays.
- `geotiff`: For parsing the GeoTIFF data layers.
- `proj4`: For coordinate transformation from UTM to LatLng.
- `buffer`: Polyfill for Node.js Buffer, required by `geotiff`.

## Installation

1.  Navigate to the `rn_solar_api` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the project:
    ```bash
    npx react-native run-android
    # or
    npx react-native run-ios
    ```
