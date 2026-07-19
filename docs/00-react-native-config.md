# 00-react-native-config.md

Question:
How do we set up multi-environment support using react-native-config to dynamic change settings without hardcoding variables?

Definition:
A plugin setup that binds localized file-based variables directly into native Android Gradle configurations and JavaScript states during compilation.

Answer:

1. We create distinct environmental dot-files (.env(for staging), .env.prod) inside the root directory.
2. We explicitly instruct Git to ignore these configuration files via .gitignore to prevent accidental credential leaks.
3. We connect the plugin inside the native build framework (`android/app/build.gradle`) by applying the dynamic dependency module runner script.
4. We set up environment runtime scripts inside package.json using prefix variables (`ENVFILE=`) to route compilation engines to separate targets.
5. The application imports the compilation configuration variables natively within UI components to safely adjust execution paths.

Code:
\*/
// 1. Android build system integration layer (android/app/build.gradle)
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"

// 2. Package scripts router setup (package.json)
{
"scripts": {
"android:staging": "ENVFILE=.env.staging react-native run-android", // Output: Spawns application targeting staging environments
"android:prod": "ENVFILE=.env.prod react-native run-android" // Output: Spawns application targeting live production APIs
}
}

// 3. Application core component execution reference (App.tsx)

import { StyleSheet, Text, View } from 'react-native';
import Config from 'react-native-config';

function App() {
return (
<View style={styles.container}>
<Text>My APP ENV {Config.API_URL}</Text>
<Text>My APP ENV {Config.APP_ENV}</Text>
</View>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
},
});

export default App;
/\*
Key Points:
✔ Dot-files containing API keys or secure tokens must be listed under .gitignore parameters.
✔ Gradle requires explicit dotenv helper imports to correctly forward environmental assets downstream during builds.
✔ Changing running environment targets requires clean system rebuild commands to reliably flush previous memory values.
\_/
