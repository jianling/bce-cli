Use the `bce --help` command for more detailed task information.

## Installing

```bash
$ npm install -g bce
```

Note: You should install [ionic(v2.1.13)](https://www.npmjs.com/package/ionic) first.


## Setup bce webAPP
```bash
$ bce setup bceApp
```
This command will:
 - create project base template from: [bce-app-base](https://github.com/jianling/bce-app-base)
 - install npm packages
 - add cordova plugins
   - cordova-hot-code-push-plugin
   - cordova-plugin-app-version
   - https://github.com/jianling/cordova-plugin-bdpush
   - cordova-plugin-compat
   - cordova-plugin-console
   - cordova-plugin-device
   - cordova-plugin-file
   - https://github.com/jianling/cordova-HTTP
   - https://github.com/jianling/cordova-plugin-inappbrowser
   - https://github.com/jianling/cordova-plugin-mtj
   - https://github.com/jianling/cordova-plugin-multiview
   - cordova-plugin-nativestorage
   - https://github.com/jianling/cordova-plugin-payment.git
   - cordova-plugin-splashscreen
   - cordova-plugin-statusbar
   - cordova-plugin-whitelist
   - ionic-plugin-keyboard
   - call-number
 - add iOS platform for application

## Build common css and webpack Dll file
```bash
$ bce buildCommon
```
This command will:
 - build common css into www/lib/ionic.css
 - build common js into www/lib/ionic.js
 - write a manifest json file named ionic-manifest.json which contains mappings from real request to module id


## Hot Code Push Plugin CLI

### build `hcp.json` and `hcp.manifest`

```bash
$ bce hcp build [www_directory]
```

 - `[www_directory]` - path to the directory with your web project. If not specified - www is used.

Command is used to prepare project for deployment and to generate plugin specific configuration files inside www folder:

 - `hcp.json` - holds release related information.
 - `hcp.manifest` - holds information about web project files: their names (relative paths) and hashes.

### deploy www files to [BOS](https://cloud.baidu.com/product/bos.html)

```bash
$ bce hcp deploy [www_directory]
```

 - `[www_directory]` - path to the directory with your web project. If not specified - www is used.

Command is used to upload all www file to bos bucket.


