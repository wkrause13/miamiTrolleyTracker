# Miami Trolley Tracker

This is an open source (MIT License) vehicle tracking and route visualization app for some of the City of Miami's transit options. It is available for beta testing for Android users in the [Releases Page](https://github.com/wkrause13/miamiTrolleyTracker/releases) and will be available on iOS when released. Currently it supports Miami's trolley system and Citi Bike program. Support for the Metro Mover will be added shortly. The app may support the bus and train systems at a later date.

## Screenshots
### Cross Platform (Android & iOS)
<img src="https://github.com/wkrause13/miamiTrolleyTracker/blob/master/screenshots/dualscreens.png?raw=true" alt="directional.png"  height="300" width="350.50">

### Directional information on Trolley icons
<img src="https://github.com/wkrause13/miamiTrolleyTracker/blob/master/screenshots/directional.png?raw=true" alt="directional.png"  height="300" width="168.75">

### Support for both English and Spanish

<img src="https://github.com/wkrause13/miamiTrolleyTracker/blob/master/screenshots/multi-language.png?raw=true" alt="directional.png"  height="300" width="168.75">

## User Testing
For android users, there is a pre-compiled apk associated with each release. This project uses [CodePush](https://microsoft.github.io/code-push/) so most updates will be pushed out automatically. However, each upgrade of React Native or the addition of certain React Native libraries may require a new apk. New apks will only be built in such cases. 

For ios, let me know if you'd like to be a beta tester. You'll likely need to use the TestFlight app to access the image. Currently I don't have all of the required assets (icons and splash screens with the correct pixel ratios) to upload the application. I will attempt to address this soon, though help here would be appreciated. 

## Project Details
This project is the product of the Code For Miami transit team. Making the use of public transit a little easier is one small way to help reduce traffic, carbon emissions and improve the lives of those that rely on the system as their primary mode of transit. 

## Want to Help?
Long term I'd like this project to be easily extensible to other cities. Since I can only work on this some nights and weekends, help is always welcome. Ideally I would like to work with another React developer on this project. UX and Design help would also be very welcome. There's an immediate need for someone with experience submiting apps through the Apple and Google Play approval process. If you know anyone who might be interested in collaborating, please message me. Here are a couple of things I'd like to see added soon and would make for a good pull request:

1. Better app icon
2. Better splash screens
3. Metro Mover support
4. User preferences (favorite routes, default stop)
5. Push notification when trolley is X stops away
6. Better test coverage of at least the redux code