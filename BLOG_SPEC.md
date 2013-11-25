# Stacks of BACN: Delicious!

## What Does BACN Mean?

In addition to sounding like the Best Food Ever, BACN stands for four of the
best examples of the equally-many components a good Hybrid Mobile Web App needs:

 - Bootstrap (UI) - The "UI" layer is responsible for structuring the _look and
 feel_ of the application. Other examples include Foundation and Lungo.
 - AngularJS (MVC) - The "MVC" layer (even if it's actually an MVVM or MVP
 framework) is responsible for structuring the _behaviour_ of the client
 application. Other examples include Backbone and Knockout.
 - Cordova (Device API) - The "Device API" layer is responsible for providing
 _low-level support_ for everything from rendering the UI to offline
 MVC persistence. Other examples include PhoneGap and Trigger.io.
 - Node.js (API Server) - The "API Server" layer is responsible for providing
 the _business logic_ of the application. Other examples include Ruby on Rails
 and Play.

## BACN Bits

While the name BACN is derived from the four components of its architecture,
"BACN" (or, more specifically, `bacn`) is also the name of a developer tool
for building applications on the BACN stack. This tool codifies the _process_
of building these applications through the following commands:

 - `bacn create PATH [ID] [NAME]` - Creates a new project at `PATH` with the
 optional `NAME` and reverse-domain `ID`. This project consists of a parent
 folder at `PATH` with two sub-directories, `client` and `server`.
 `client` is a valid Cordova project with updated assets in its `www` folder.
 Client work is done in this `www` folder. `server`, on the other hand, is
 a valid LoopBack project. Server work is done in the `server` folder directly.
 - `bacn build` - Builds and bundles the client application into a
 distributable format, such as `.app` folders for iOS applications. Any
 catchable errors will be raised at this point.
 - `bacn run` - Runs the bundled client application in an appropriate emulator
 alongside the server application.
 - `bacn log [-f]` - Prints the log output of the client application to the
 terminal. If `-f` is provided, `bacn log` will not exit after the end is
 reached. Instead, future log messages will be appended to the terminal as they
 are received.
 - `bacn deploy` - Deploys the client application to an Enterprise application
 server and the server application to a PaaS provider.

## How Do I Get This Deliciousness?

Bacn is available through NPM (like all good tools these days, it seems), and
so should be installed globally like so:

```
npm install -g bacn
```

In addition to the `bacn` tool, you'll need to install the SDK for the
platform(s) you wish to develop clients for:

 - [Android SDK](http://developer.android.com/sdk/index.html)
 - [iOS SDK](https://developer.apple.com/devcenter/ios/index.action)

## Get Cooking

Now that you've got BACN installed, take the default scaffolding for a spin
by developing an iOS application:

```
bacn create bacn-tutorial
cd bacn-tutorial
bacn build
bacn run
```

At this point, the iOS emulator should be displayed with a simple demo
application. We can illustrate the BACN workflow by making some changes to
`bacn-tutorial/client/www/index.html`. Find:

```
<script type="text/html" id="example-template">
  <p class="version">BACN v<%= version %> loaded.</p>
</script>
```

And add a line inside that `<script>` block:

```
<p>Whoa! That was easy!</p>
```

Then re-run our iterative BACN commands:

```
bacn build
bacn run
```

If you closed the emulator after the last `run`, it should be back. Otherwise,
it should update in place with the new content.

_Technical Details_: What happened here can be found in the included `main.js`
script: the template in that `<script>` block was rendered to the `#main` div
once Cordova told us the device was ready to be rendered to. Updating that
template, of course, updated what was rendered. In this default application,
that rendering is handled by Backbone and its extension, Marionette.

## Next Steps

Now that you've gone through the motions of creating and updating your first
BACN application, you can continue to build powerful Hybrid Mobile Web Apps.
We recommend familiarizing yourself with the rest of the power provided
out-of-the-box:

 - [Bootstrap](http://getbootstrap.com/)
 - [jQuery](http://api.jquery.com/)
 - [MarionetteJS](http://marionettejs.com/)
 - [Cordova](http://cordova.apache.org/docs/en/2.8.0/)
 - [Node.js](http://nodejs.org/api/)
 - [LoopBack](http://docs.strongloop.com/display/DOC/LoopBack)

## BACN Grease

We're iterating on the entire BACN workflow. Here are a few features we've
considered putting some elbow grease behind:

 - `bacn create` should support updating the scaffolding of an existing BACN
 application when that recommended scaffolding is updated.
 - `bacn build` should integrate Grunt for LESS, Sass, and JSHint support.
 These transpilation and hinting steps could
 - `bacn log` could display logs from connected devices in addition to those
 from the simulator.
 - `bacn deploy` could facilitate client deploys to services like TestFlight.
 - `bacn deploy` could deploy the server to any git-receive server, such as
 `Heroku` or an on-premises `pushover` instance.
 - A command should exist to verify the installation(s) of platform SDK(s).
 - Better log and error messages all around.

### Addendum: Hybrid Mobi-What-Now?

In this article and around the StrongLoop offices (or at least my head),
"Hybrid Mobile Web Application" is defined as the combination of a majority
of these key design decisions:

 - A server-provided API should provide consistent behaviour for all users
 in a client-agnostic fashion (Ex: REST API)
 - A subset of the client applications' features should be made available to
 offline users, requiring the application to be installed locally rather than
 downloaded from a web server.
 - The client applications' features require device features unavailable to
 browsers. (Ex: Bluetooth)
 - Both visual and functional behaviour for clients is defined using web
 technologies and languages (e.g. HTML5 and JavaScript) instead of native
 technologies and languages (e.g. Cocoa and Objective-C).

This definition is supported by other industry leaders.
[This white paper](http://public.dhe.ibm.com/common/ssi/ecm/en/wsw14182usen/WSW14182USEN.PDF)
was published by IBM in April 2012 describing some of the same decisions
in building mobile applications, and is recommended reading.
