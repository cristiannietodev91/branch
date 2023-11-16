# branch-app

react-native app which connects to `branch-be` node app

## Dev environment


### stack

- react-native
- react-navigate v6


### Running project

``yarn install``

###  IOS setup

Install cocoapods

```
sudo gem install cocoapods
brew install watchman
```

POD Install

```
cd ios
remove ios/Podfile.lock``
pod install
```

Config google maps API key

Create a file called `Config.xcconfig` within the `/ios` and set the `MAPS_API_KEY` value.

```
MAPS_API_KEY=google maps api key
```

In a terminal run 

``npx react-native start``

then run (IOS)

``npx react-native run-ios``

and/or run (Android)

``npx react-native run-android``

### Test


