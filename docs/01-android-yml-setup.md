# 01-android-yml-setup.md

Question:
How does GitHub Actions take my code and turn it into a working Android app file (.apk)?

Definition:
A file that tells GitHub's cloud computers to automatically download your code, set up Java, and build your app so you don't have to do it manually.

Answer:

1. GitHub starts up a fresh, clean cloud computer running Linux.
2. It copies your project code into this new cloud computer.
3. It installs Java 17, which is required to build Android applications.
4. It downloads your project's npm packages and runs your tests to make sure nothing is broken.
5. It runs the Gradle build command (`./gradlew assembleRelease`) to compile the code into a final `.apk` file.
6. It saves this file onto GitHub so you can easily download it.

Code:
\*/
name: Android CI

on:
push:
branches: - staging - main

jobs:
android-build:
runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '17'

      - name: Cache setup
        uses: actions/cache@v4
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-{{ hashFiles('package-lock.json') }}

      - name: Install Fastlane
        run: gem install fastlane

      - name: Install dependencies
        run: npm install

      - name: Test Lint
        run: npm lint

      - name: Test Cases
        run: npm test

      - name: Generate Staging Build
        if: github.ref == 'refs/heads/staging'
        run: |
          cd android
          ./gradlew assembleRelease # Output: Compiles the staging APK file natively

      - name: Upload Staging Artifacts
        if: github.ref == 'refs/heads/staging'
        uses: actions/upload-artifact@v4
        with:
          name: release-apk
          path: android/app/build/outputs/apk/release/app-release.apk

      - name: Upload Production Release Artifacts
        if: github.ref == 'refs/heads/main'
        uses: actions/upload-artifact@v4
        with:
          name: release-bundle
          path: android/app/build/outputs/aab/release/app-bundle.aab

/_
Key Points:
✔ Every build starts on a completely fresh machine that wipes itself clean afterward.
✔ Caching saves time by remembering previously downloaded npm packages.
✔ Artifact uploading lets you download the final app directly from your GitHub dashboard.
_/
