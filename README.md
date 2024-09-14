# VoyAlert

![Version](https://img.shields.io/github/package-json/v/ondrejnedoma/voyalert/master?label=version&color=6AD826)
![License](https://img.shields.io/github/license/ondrejnedoma/voyalert?color=6AD826)
![Stars](https://img.shields.io/github/stars/ondrejnedoma/voyalert?style=flat)

An app that alerts you (by push notification or persistent alarm) upon the arrival or departure of a public transport vehicle from a stop

## Packages

This is a monorepo managed by npm workspaces. The individual components of this project are stored in separate packages:

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

This section covers how to build the full project — both [@voyalert/app](voyalert/app) and [@voyalert/backend](voyalert/backend). **Note that iOS is NOT supported as of now**.

### Requirements

- Node and NPM
- OpenJDK 17 — [download prebuilt from Microsoft](https://learn.microsoft.com/en-us/java/openjdk/download#openjdk-17)
- Android Studio and Android 14 SDK (API 34)
- Docker
- Git (optional — only for `git clone`)

### Steps

1. Start by cloning this repository and installing the dependencies:

```sh
git clone https://github.com/ondrejnedoma/voyalert
cd voyalert
npm i
```

2. Add the Android Studio platform-tools to PATH. This folder is by default %LOCALAPPDATA%\Android\Sdk\platform-tools

3. Create the ANDROID_HOME environment variable. This folder is by default %LOCALAPPDATA%\Android\Sdk

4. Set up the app signing keys and the according gradle variables. Use [these React Native instructions](https://reactnative.dev/docs/signed-apk-android) for reference.

<!-- TODO -->

5. This step is optional.
   If you want to be able to use a custom backend with the app (and not only the default prod one), replace the `voyalert/packages/app/android/app/google-services.json` file with your own one, obtained from the [Firebase console](https://console.firebase.google.com/). Generate a Firebase service account private key, and place it in `voyalert/packages/backend/firebase.json`.

6. Ensure Docker is up and ready to build the backend image:

```sh
docker ps
```

7. Run the `build` command. A new terminal window will pop up (the React Native Metro server), close that window for the build process to finish:

```sh
npm run build
```

8. After the build finishes, the app AAB can be found in `voyalert/packages/app/android/app/build/outputs/bundle/release/app-release.aab`, and the backend as a Docker image `voyalertbackend`.

## Contributing

Feel free to open issues and pull requests regarding anything you think would be beneficial for this project!
