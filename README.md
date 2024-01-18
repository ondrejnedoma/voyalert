# VoyAlert

<img src="https://img.shields.io/github/package-json/v/ondrejnedoma/voyalert/master?label=version&color
" alt="Versions badge" />
<img src="https://img.shields.io/github/license/ondrejnedoma/voyalert?color" alt="License badge" />
<a href="https://hosted.weblate.org/engage/voyalert/">
<img src="https://hosted.weblate.org/widget/voyalert/translation/svg-badge.svg" alt="Translation status badge" />
</a>
<img src="https://img.shields.io/github/stars/ondrejnedoma/voyalert?style=flat
" alt="Stars badge" />

An app that alerts you (by push notification or a persistent alarm) \
upon the arrival or departure of a public transport vehicle from a stop

## Packages

This is a monorepo managed by npm workspaces. \
The individual components of the app are stored in separate packages:

| Package Name                          | Description                |
| ------------------------------------- | -------------------------- |
| [@voyalert/app](voyalert/app)         | The React Native app       |
| [@voyalert/backend](voyalert/backend) | The Express backend server |
| [@voyalert/utils](voyalert/utils)     | Tiny dev utility scripts   |
| [@voyalert/i18n](voyalert/i18n)       | The i18next JSON files     |

## Development progress

Upcoming features and improvements can be viewed on [the Trello of VoyAlert](https://trello.com/b/P7mUIuCp/voyalert).

## Download

COMING SOON

## Build

This section covers how to build the full app — both [@voyalert/app](voyalert/app) and [@voyalert/backend](voyalert/backend). \
**Consult the README files of the individual packages if you want to run them as dev or build them separately (COMING SOON)**. \
**Note that building for iOS is NOT supported as of now**.

### Requirements

- Node and NPM
- OpenJDK 17 — [download prebuilt from Microsoft](https://learn.microsoft.com/en-us/java/openjdk/download#openjdk-17)
- Android 14 SDK (API 34) (installable within Android Studio)
- Docker
- Git (optional — only for `git clone`, the repository can also be downloaded as a ZIP)

1. Start by cloning this repository and installing the dependencies:

```sh
git clone git@github.com:ondrejnedoma/voyalert.git
cd voyalert
npm i
```

2. Add the Android platform-tools to PATH. This folder is by default %LOCALAPPDATA%\Android\Sdk\platform-tools

3. Create the ANDROID_HOME environment variable. This folder is by default %LOCALAPPDATA%\Android\Sdk

4. Set up the app signing keys and the according gradle variables. \
   Use [these instructions](https://reactnative.dev/docs/signed-apk-android) on the React Native website for reference \
   (more specific instructions COMING SOON).

5. This step is optional. \
   If you want to be able to use the custom built backend with the app (and not only the default prod server), \
   you will need to replace the `voyalert/packages/app/android/app/google-services.json` file with your own one, obtained from the Firebase console. \
   You will also need to generate a Firebase admin credential from the Google API console, \
   and place it in `voyalert/packages/backend/voyalert-xxxxx-firebase.json`. \
   Then rename `voyalert/packages/backend/EXAMPLE.env` to `.env`, \
   and change the `GOOGLE_APPLICATION_CREDENTIALS` variable inside the file to match the Firebase admin credential filename. \
   In this case `voyalert-xxxxx-firebase.json`.

6. Ensure Docker is up and ready to build the backend image:

```sh
docker ps
```

7. Run the `build` command. A new terminal window will pop up (the React Native Metro server), \
   **you need to close that window for the build process to finish**:

```sh
npm run build
```

8. If both the app and backend build process were successful, \
   you will be able to find the app build at `voyalert/packages/app/android/app/build/outputs/bundle/release/app-release.aab`, \
   and the backend will have built as a Docker image `voyalertbackend`.

9. This step is optional. \
   If you want to transfer the docker image to a different system, \
   you can run this command to save it as a file at `voyalert/packages/backend/voyalertbackend.tar`. \
   This file can then be transfered to a different system and loaded with `docker load -i voyalertbackend.tar`:

```sh
npm run backend:save
```

## Contributing

Feel free to open issues and pull requests regarding anything you think would be beneficial for this project!

You can help [translate VoyAlert at Hosted Weblate](https://hosted.weblate.org/engage/voyalert/)

<a href="https://hosted.weblate.org/engage/voyalert/">
<img src="https://hosted.weblate.org/widget/voyalert/translation/multi-auto.svg" alt="Translation status" />
</a>
