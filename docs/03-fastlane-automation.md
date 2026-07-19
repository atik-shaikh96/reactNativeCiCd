# 03-fastlane-automation.md

Question:
How do we install Fastlane, handle essential platform security credentials (Keystores, .p8 files, IDs), and leverage advanced automation like auto-version bumping and release notes?

Definition:
A platform-agnostic automation engine that bridges source code changes to deployment tracks using specialized security tokens and dynamic pre-build script manipulations.

Answer:

1. Initialize the ecosystem by moving inside each platform directory (`cd android` or `cd ios`) and executing the command `fastlane init`.
2. For Android, a Keystore acts as a secure cryptographic vault containing a private signing certificate used to verify app identity. This pairs with a GCP Service Account key (`playstore.json`) to authorize store uploads.
3. For iOS, headless CI/CD systems require an App Store Connect API Key (`.p8` file), along with its identifying `Issuer ID` (UUID string) and `Key ID`, to bypass mandatory Apple 2-Factor Authentication (2FA).
4. Automate version bumping using Fastlane commands that query the latest store version numbers and automatically increment project build records before compilation begins.
5. Dynamically inject release notes by referencing changelog parameters directly within the distribution block or linking external markdown assets into the deployment track.

Code:

```ruby
# ==============================================================================
# 1. INITIALIZATION & SETUP COMMANDS
# ==============================================================================
# Step A: Install Ruby platform tools locally (e.g., via Homebrew or standard Ruby installer)
# Step B: Run initialization strings inside native folders:
# cd android && fastlane init
# cd ios && fastlane init

# ==============================================================================
# 2. DETAILED CREDENTIAL CHECKLIST & GLOSSARY
# ==============================================================================
# 🔹 Android Keystore: An encrypted file holding your private app keys. Crucial because
#                      Google Play rejects any update signed with a different key.
# 🔹 Google Play JSON Key: A GCP service key linking automation code straight to API execution rights.
#
# 🔹 iOS .p8 Key File: A private cryptography file permitting programmatic App Store access.
#                      Required to keep non-interactive cloud servers from stalling on SMS/Device 2FA steps.
# 🔹 Issuer ID: A static UUID identifying your overall Apple Developer Team account organization.
# 🔹 Key ID: A unique alphanumeric tag pinpointing that exact downloaded .p8 connection token.

# ==============================================================================
# 3. CREDENTIAL SOURCE PORTALS & SECRETS SETUP GUIDE
# ==============================================================================
# 💻 ANDROID KEYSTORE (The Vault):
# - Open your local command terminal.
# - Run: keytool -genkeypair -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
# - Save the generated `.keystore` / `.jks` file safely. Copy your passwords and alias name.
#
# 🌐 GOOGLE PLAY SERVICE ACCOUNT (The API Handshake):
# - Portal: Google Cloud Console -> IAM & Admin -> Service Accounts.
# - Action: Press "Create Service Account" -> Name it (e.g., `fastlane-api`) -> Grant the "Owner" role.
# - Key Generation: Click the newly created Service Account -> Keys tab -> Add Key -> Create New Key -> Select JSON -> Download.
# - Play Store Binding: Open Google Play Console -> Users & Permissions -> Invite New User -> Paste the Service Account Email -> Grant full Admin/App permissions.
#
# 🍏 APP STORE CONNECT API KEY (The 2FA Bypass):
# - Portal: App Store Connect portal -> Users and Access -> Integrations -> Keys (App Store Connect API).
# - Action: Click the "+" button to generate a new API Key -> Name it -> Set Access Role to Admin or Developer.
# - Downloads & Data: Download the private `.p8` file (Note: You can only download this file ONCE). Copy the listed "Issuer ID" (top of page) and "Key ID" (next to your key entry).
#
# 💻 STEP-BY-STEP: STRATEGY A - LOCAL CONFIGURATION (ios/fastlane/.env)
# 1. Inside your `ios/fastlane/` directory, create a text file named `.env`.
# 2. Write your private environment variables inside it:
#    APPSTORE_KEY_ID="KEYID123"
#    APPSTORE_ISSUER_ID="issuer-uuid-string-here"
# 3. Add `**/fastlane/.env` to your project root `.gitignore` file to ensure local credentials are never leaked.
#
# ☁️ STEP-BY-STEP: STRATEGY B - GITHUB ACTIONS WORKFLOW SECRETS
# 1. Go to your GitHub Repository -> Settings -> Secrets and variables -> Actions.
# 2. Click "New repository secret" and register your production keys:
#    - Name: APPLE_KEY_ID       | Value: (Your Key ID)
#    - Name: APPLE_ISSUER_ID    | Value: (Your Issuer ID)
# 3. Map these secrets into the execution environment within your workflow YAML block:
#    - name: Run Production Deploy
#      run: cd ios && bundle exec fastlane production
#      env:
#        APPSTORE_KEY_ID: ${{ secrets.APPLE_KEY_ID }}
#        APPSTORE_ISSUER_ID: ${{ secrets.APPLE_ISSUER_ID }}

# ==============================================================================
# 4. ANDROID AUTOMATION FILES (android/fastlane/)
# ==============================================================================
# android/fastlane/Appfile
json_key_file("android/playstore.json") # Connected target Google API service key location
package_name("com.reactnativecicd")     # Distinct application package registration path

# android/fastlane/Fastfile
default_platform(:android)

platform :android do
  desc "Generate Staging build"
  lane :staging do
    gradle(task: "assemble", build_type: "Release")
  end

  desc "Generate Production Build"
  lane :production do
    gradle(task: "bundle", build_type: "Release")
  end

  desc "Deploy to Internal Testing"
  lane :deploy do
    gradle(task: "clean assembleRelease")
    upload_to_play_store(
      track: 'internal'
    )
  end
end

# ==============================================================================
# ADDON SPECIFICATION FOR FUTURE ANDROID PRODUCTION UPGRADES:
# To handle automatic store version indexing and release note injections, alter the deploy lane:
#
#  lane :deploy do
#    google_play_track_version_codes(track: 'internal')
#    new_version_code = lane_context[SharedValues::GOOGLE_PLAY_TRACK_VERSION_CODES].max + 1
#    gradle(
#      task: "clean assembleRelease",
#      properties: { "android.injected.version.code" => new_version_code }
#    )
#    upload_to_play_store(
#      track: 'internal',
#      text: "Internal Testing Build ##{new_version_code} - Stability changes."
#    )
#  end
# ==============================================================================

# ==============================================================================
# 5. iOS AUTOMATION FILES (ios/fastlane/)
# ==============================================================================
# ios/fastlane/Appfile
app_identifier("com.reactnativecicd") # Registered bundle storage identity string
# apple_id("developer@company.com")     # Central matching store connection email account

# ios/fastlane/Fastfile
default_platform(:ios)

platform :ios do

  desc "Build Staging IPA"
  lane :staging do
    build_app(
      scheme: "reactNativeCiCd"
    )
  end

  desc "Build Production IPA"
  lane :production do
    build_app(
      scheme: "reactNativeCi"
    )

    app_store_connect_api_key(
      key_id: ENV["APPSTORE_KEY_ID"],
      issuer_id: ENV["APPSTORE_ISSUER_ID"],
      key_filepath: "./AuthKey.p8"
    )
    upload_to_test_flight
  end
end

# ==============================================================================
# ADDON SPECIFICATION FOR FUTURE iOS PRODUCTION UPGRADES:
# To add version bumping and release notes, update the production lane as follows:
#
#  lane :production do
#    api_key = app_store_connect_api_key(
#      key_id: ENV["APPSTORE_KEY_ID"],
#      issuer_id: ENV["APPSTORE_ISSUER_ID"],
#      key_filepath: "./AuthKey.p8"
#    )
#    increment_build_number(
#      build_number: latest_testflight_build_number(api_key: api_key) + 1,
#      xcodeproj: "reactNativeCi.xcodeproj"
#    )
#    build_app(scheme: "reactNativeCi")
#    upload_to_test_flight(api_key: api_key, changelog: "Automated production deployment patch.")
#  end
# ==============================================================================

/_
Key Points:
✔ A Keystore verifies app continuity; losing it stops your ability to issue app store updates under that same package name.
✔ The combination of `.p8`, `Issuer ID`, and `Key ID` provides the programmatic handshake required to clear Apple's security checks hands-free.
✔ Auto-version bumping protects your workspace from collision errors caused by accidentally pushing duplicate version signatures to the app stores.
✔ Release notes can be supplied explicitly inside runtime script strings or loaded systematically out of target localization file structures.
✔ Utilizing `ENV["KEY"]` in the script maps values fluidly from local project `.env` files or remote cloud environment workflows interchangeably.
✔ Always review `.gitignore` layers to prevent private structural parameter configurations from slipping out onto public host repositories.
✔ Block syntax: Ruby lanes must open cleanly with `lane :name do` and terminate with a corresponding `end` token to avoid compilation failures.
_/
```
