Use the `bce --help` command for more detailed task information.

## Installing

```bash
$ npm install -g bce
```

Note: You should install [ionic](https://www.npmjs.com/package/ionic) first.


## Setup bce webAPP
```bash
$ bce setup bceApp
```
This command will:
 - create project base template from: [bce-app-base](https://github.com/jianling/bce-app-base)
 - install npm packages
 - add cordova plugins
   - cordova-plugin-device
   - cordova-plugin-console
   - cordova-plugin-whitelist
   - cordova-plugin-splashscreen
   - cordova-plugin-statusbar
   - ionic-plugin-keyboard
   - https://github.com/jianling/cordova-HTTP
   - https://github.com/jianling/cordova-plugin-inappbrowser
 - add iOS platform for application

## Build common css and webpack Dll file
```bash
$ bce buildCommon
```
This command will:
 - build common css into www/lib/ionic.css
 - build common js into www/lib/ionic.js
 - write a manifest json file named ionic-manifest.json which contains mappings from real request to module id