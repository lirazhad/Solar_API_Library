# Expo Solar API Library

This project is an Expo-based port of the Google Solar API Library.

## Prerequisites

1.  **Google Maps API Key:** You need a valid API key with Google Maps SDK for Android/iOS and Solar API enabled.
2.  **Native Configuration (for development builds):**
    *   If using Expo Go, some features might be limited. For full Google Maps support, it is recommended to create a development build.
    *   **app.json:** Your API key should be added to `app.json` under `android.config.googleMaps.apiKey` and `ios.config.googleMapsApiKey`.

## Installation

1.  Navigate to the `rn_solar_api` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the project:
    ```bash
    npx expo start
    ```

## Fonts
This project uses the `Kameron` font. It's configured in the styles, but for Expo, you might need to load it using `expo-font`.
