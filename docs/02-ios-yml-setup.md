# 02-ios-yml-setup.md

Question:
How do we build an iOS app automatically, and why do we need a Mac to do it?

Definition:
An automation script that specifically uses Apple's own cloud computers and tools (`xcodebuild`) to compile your iOS app.

Answer:

1. Apple requires a macOS operating system to build iOS apps, so we ask GitHub for a Mac cloud runner instead of Linux.
2. The Mac computer downloads your code and project files.
3. It runs `npm install` followed by `pod install` to download and link all your iOS-specific plugins and packages.
4. It installs Fastlane to handle advanced deployment steps later down the road.
5. It uses Xcode's command-line tool (`xcodebuild`) to compile your code into a production-ready Release configuration.
6. The compiled binary is packaged up and saved securely directly onto GitHub's platform as a downloadable artifact.

Code:
\*/
name: iOS CI

on:
push:
branches: - staging - main

jobs:
ios-build:
runs-on: macos-latest # Standard runner environment for Apple compilation toolchains

    steps:
      - name: Checkout branch
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm install

      - name: Pod install
        run: |
          cd ios
          pod install # Output: Resolves and installs CocoaPods dependencies

      - name: Fastlane Install
        run: gem install fastlane

      - name: Test Cases
        run: npm test

      - name: Staging IPA build
        if: github.ref == 'refs/heads/staging'
        run: |
          cd ios
          xcodebuild -workspace reactNativeCiCd.xcworkspace \
                     -scheme reactNativeCiCd \
                     -configuration Release \
                     -sdk iphoneos \
                     -allowProvisioningUpdates
                     # Output: Natively compiles the iOS project using Release settings

      - name: Staging IPA upload
        if: github.ref == 'refs/heads/staging'
        uses: actions/upload-artifact@v4 # Note: Correct action name is upload-artifact (singular)
        with:
          name: staging-ipa
          path: ios/*.ipa

/_
Key Points:
✔ iOS integration testing requires direct, dedicated macOS operating system instances.
✔ Cocoapods configuration runs immediately following standard package installation layers.
✔ Branch checks handle the dynamic execution of environment logic blocks.
_/
