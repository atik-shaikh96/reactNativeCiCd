# React Native CI/CD Template

This is a [**React Native**](https://reactnative.dev) project bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli), enhanced with a fully integrated, platform-agnostic native automation engine using **Fastlane**.

---

## 🚀 CI/CD & Fastlane Automation

This repository includes custom configuration pipelines located in `android/fastlane/` and `ios/fastlane/` to eliminate manual native compilations (`xcodebuild` and `./gradlew`) and simplify multi-environment deployments.

### Platform Architecture Matrix

| Platform    | Deployment Lane       | Execution Task                         | Distribution Target                    |
| :---------- | :-------------------- | :------------------------------------- | :------------------------------------- |
| **Android** | `fastlane staging`    | `gradle(task: "assemble")`             | Local Staging APK                      |
|             | `fastlane production` | `gradle(task: "bundle")`               | Local Production AAB                   |
|             | `fastlane deploy`     | Native Build & Clean                   | Google Play Store (Internal Track)     |
| **iOS**     | `fastlane staging`    | `build_app(scheme: "reactNativeCiCd")` | Local Staging IPA                      |
|             | `fastlane production` | `build_app(scheme: "reactNativeCi")`   | Apple TestFlight (Hands-Free Delivery) |

---

### Key Automation Operations

> 💡 For a granular, step-by-step breakdown of key storage profiles, developer portal steps, and underlying mechanics, read the complete documentation file at: **`docs/03-fastlane-automation.md`**.

- **Secrets Storage & 2FA Bypass:** Built to map private variables via environment interfaces using local `.env` files (git-ignored) or dynamically mapped cloud keys via repository runner tools.
- **App Store Connect Integration:** Utilizes an API key (`.p8`) infrastructure to execute non-interactive TestFlight distribution commands without triggering Apple device 2-Factor Authentication blockades.
- **Advanced Scale Addons:** The environment is pre-configured to handle automatic store sequence version increments (`latest_testflight_build_number` / `google_play_track_version_codes`) and inline changelog injections to prevent duplicate build metadata errors during remote cloud delivery jobs.

---

## 🛠️ Getting Started

> **Note**: Make sure you have completed the official React Native [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

### Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native. Run the following command from the root directory:

`````sh
# Using npm
npm start

# OR using Yarn
yarn start# React Native Native Engine: CI/CD & Fastlane Automation Template

This repository serves exclusively as a production-grade orchestration framework for automating the compilation, signing, and store delivery pipelines of a cross-platform React Native codebase. By encapsulating automated toolchains within platform-agnostic configuration directories (`android/fastlane/` and `ios/fastlane/`), it abstracts away manual execution of native building engines (`xcodebuild` and `gradlew`).

---

## 📂 Repository Architecture & Documentation Matrix

The project is structured to keep native build orchestration clear and separation of concerns high. Deep implementation logic, raw scripts, and operational runbooks are modularly split into the `docs/` workspace:

````text
├── docs/
│   ├── 01-environment-setup.md      # Local system variables, Ruby Bundler layers, and CI environments
│   ├── 02-native-configuration.md   # Android keystore hooks, build flavors, and iOS bundle provisioning
│   └── 03-fastlane-automation.md    # Complete Fastfile lane configurations and store deployment scripts
├── android/
│   └── fastlane/                    # Appfile, Fastfile, and automated execution lanes for Android
└── ios/
    └── fastlane/                    # Appfile, Fastfile, and automated execution lanes for iOS
`````

---

### 🗂️ Documentation Overview

**01-Environment Setup:**  
Details the prerequisite runtime matrix (Ruby versions, CocoaPods dependencies, SDK paths) required to initialize the local or cloud automation environments.

**02-Native Configuration:**  
Outlines workspace configurations, build flavors (Staging vs. Production), and native compile schemas.

**03-Fastlane Automation:**  
Provides copy-pasteable configuration files, automated sequence version bumping rules, changelog insertion parameters, and advanced cloud-agent continuous delivery pipelines.

---

### 🔐 Required Core Credentials & Identity Infrastructure

To execute remote compilations and hands-free store delivery without manual developer console access, you must generate and map the following secure operational assets:

#### 🤖 Android: Code Signing & Play Console Linkage

- **Java Keystore (.keystore / .jks):**

  - _What it is:_ A secure cryptographic certificate file that acts as your digital application signature. Android requires every package uploaded to the Play Store to be signed with a persistent key to verify author identity.
  - _Automation Role:_ Fastlane's gradle action injects this key's properties dynamically during runtime to sign output artifacts (.apk / .aab).

- **Google Play Service Account Key (.json):**
  - _What it is:_ An API credential generated through the Google Cloud Console linked to the Google Play Developer Console.
  - _Automation Role:_ Grants the Fastlane engine machine-to-machine permissions to create internal tracks, modify release metadata, and upload application packages—completely bypassing two-factor authentication requirements.

#### 🍏 iOS: Provisioning & App Store Connect Engine

- **App Store Connect API Key (.p8):**

  - _What it is:_ A private, secure programmatic token generated directly inside the Apple Developer Portal under Users and Access.
  - _Automation Role:_ Replaces the legacy, interactive Apple ID password logins. It acts as the backbone authorization vector for Fastlane spaceship actions, permitting CI environments to push .ipa binaries directly to Apple TestFlight without triggering 2FA blockades or prompt timeouts.

- **App Provisioning Profiles & Certificates (.mobileprovision / .p12):**
  - _What it is:_ Identity manifests defining which explicit device IDs, capabilities (Push, iCloud), and developer certificates are cleared to run specific iOS App Bundles.
  - _Automation Role:_ Managed dynamically via Fastlane’s provisioning actions (`match` or `sigh`), automatically downloading missing profiles to the build node inside ephemeral keychain frames.

---

### 🚀 Native Fastlane Automation Matrix

Automated workflows map into isolated native build commands as follows:

| Operating System | Command Engine        | Native Task Processed                        | Destination Target                                  |
| ---------------- | --------------------- | -------------------------------------------- | --------------------------------------------------- |
| **Android**      | `fastlane staging`    | gradle(task: "assemble", flavor: "Staging")  | Compiles an ad-hoc .apk for internal testing        |
|                  | `fastlane production` | gradle(task: "bundle", flavor: "Production") | Generates an optimized production .aab asset        |
|                  | `fastlane deploy`     | Full Code Sign, Clean, & Push                | Direct delivery to Google Play Store Internal Track |
| **iOS**          | `fastlane staging`    | build_app(scheme: "AppStaging")              | Outputs an ad-hoc .ipa binary file for testing      |
|                  | `fastlane production` | build_app(scheme: "AppProduction")           | Synchronizes, signs, and delivers to TestFlight     |

---

### 🔁 Integrated Advanced Scale Operations

- **Zero-Overlapping Store Versioning:**  
  Both tracks are pre-wired to extract current distribution sequence configurations natively via `latest_testflight_build_number` and `google_play_track_version_codes`. Fastlane hooks bump these automatically at compile time to ensure no cloud execution job ever fails due to a "Duplicate Version String/Metadata" rejection error.

- **Dynamic Release Note Injection:**  
  Real-time log scraping is injected into the metadata layers during store delivery scripts, populating "what's new" prompts inside Google Internal testing tracks or Apple TestFlight distribution emails automatically.

---

### ⚙️ Environment Variables Config (`.env`)

To protect access configurations, this framework utilizes an environment variable decoupling layer. Local execution relies on a git-ignored root `.env` file, while cloud environments ingest them via standard repository runners.

#### Example `.env` Secret Mapping

```env
# Android Deployment Secrets
ANDROID_PLAY_STORE_JSON_KEY_PATH="./android/google-play-key.json"
ANDROID_KEYSTORE_PATH="./android/app/release.keystore"
ANDROID_KEYSTORE_PASSWORD="your_keystore_password"
ANDROID_KEYSTORE_ALIAS="your_key_alias"

# iOS Deployment Secrets
APP_STORE_CONNECT_API_KEY_ID="ABC123XYZ"
APP_STORE_CONNECT_API_ISSUER_ID="12345678-abcd-ef01-2345-6789abcdef01"
APP_STORE_CONNECT_API_KEY_PATH="./ios/auth_key.p8"
```

---

For comprehensive guidance regarding pipeline setup, step-by-step token recovery processes, and troubleshooting configuration exceptions, refer to the detailed breakdowns within the `docs/` subdirectory.

---

## 📄 Additional Reference: Usage in README and Extended Guidance

> **Note:**  
> The content above complements the [README.md](./README.md) file in this repository, which provides a higher-level overview including:
>
> - **Project Setup (Quickstart):**  
>   Make sure you have completed the official React Native [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.
>   1. Install dependencies:
>      ```sh
>      npm install
>      ```
>   2. Start the Metro bundler:
>      ```sh
>      npm start
>      ```
>   3. To run on Android:
>      ```sh
>      npm run android
>      ```
>   4. To run on iOS:
>      ```sh
>      npm run ios
>      ```
>      (Or use `yarn` equivalents.)
> - Summary table of platform, deployment lane, execution task, and target, i.e.
>   | Platform | Deployment Lane | Execution Task | Distribution Target |
>   | :--- | :--- | :--- | :--- |
>   | **Android** | `fastlane staging` | `gradle(task: "assemble")` | Local Staging APK |
>   | | `fastlane production` | `gradle(task: "bundle")` | Local Production AAB |
>   | | `fastlane deploy` | Native Build & Clean | Google Play Store (Internal Track) |
>   | **iOS** | `fastlane staging` | `build_app(scheme: "reactNativeCiCd")` | Local Staging IPA |
>   | | `fastlane production` | `build_app(scheme: "reactNativeCi")` | Apple TestFlight (Hands-Free Delivery) |
> - Pointers to the [docs/03-fastlane-automation.md](docs/03-fastlane-automation.md) for _step-by-step_ Fastlane and CI/CD usage details.
