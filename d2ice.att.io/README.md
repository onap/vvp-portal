# ice

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

KT:
- We created the base project with yeoman generator running
- When a new library is added to the project we need to perform 'bower install' and 'npm install'
- package.json is the generated file by NPM after performing 'npm install  <3'rdParty> --save' the output is inserted to the node_modules
- bower.json is enhanced after performing 'bower install <3'rd party> --save'
  The output directory is: bower_components
- 'grunt build' the dist directoy. Gruntfile.js hold all the grunt targets (e.g build, serve)
	- build: mostly building the dist directory
	- serve: this is used only for dev mode (for example building the app.env.js with settings to dev mode)
  grunt --stack will show in verbose mode
  
app directory:
- index.html is the automatically called when site is accessed
- <!-- bower:css --> section is identified by bower to add the css from 3'rd party

- body: declaring the main controller 'App Controller'

- app.module.js: declaring the main module: 'ice' it holds all other modules: infrastructure models such ngSanitize and applicative modules such as ice.vf.service

- app.controller.js: The main controller
- app.config: All sort of angular configuration such as interceptors (for error handling) 
- app.constants enums
- app.run: this could have written in the controller but it runs after the app.controller.
  runBlock: gloabals on the rootScopes
  Event that is fired when the state is changed (state = url), we clean the alert object
- cache service holds all urls of all services. '@' sign is replaced in each service with the uuid (e.g eng_uuid)
- app.route: this is the router: when it get the url in the browser it need to combine MVC combination. Otherwise is when he's not familiar with any pattern --> go to login
The page section. the router is touting by state.go(stateName) or ui-sref(state)
-activation directory hold all logic related to the user 

Each page (login, signup, dashboard etc) is composed from 4files:
- XXX.module. state name (e.g app.login) is the identifier of the router
- url is the client side address of the page
- views: there is a seperation between the page section. each view has its controller, it's view (html) and the model (data from server)

XXX.controller:
- starts with init(). Each page has it
- the header (app/core/layout/full-page-with-header) holds the headerTiltle and headerDescription set in the controller
- ice.loadre is the progree bar when requesting something from the EM 

Each function or variable we want to reflect from the controller to the html (or vise versa) should start with 'vm' (e.g vm.submitForm() this will call the function submitForm)

XXX.html
- directive (piece of code that performs something). <ice-loader...> has a jquery selector to find the class of the div and show the loader
- ice-messages show the message with type if alert.message==true
- the page is divided to cols. bootstrap allows 12 colls

XXX.less - turns into css after grant build
holds all classes under body-class (this is defined in the XXX.module)
There are also bootstrap inline css e.g class=form-group

Filters - you can define in the html "|" that takes a variable and format it (e.g trusted that manipulate it as a valid html)

Core:
toolbar - upper bar (log, dashboard caption, logout)
controller fetch the number of notifications
left side of dashboard - Engagement list. The data is publisehd to the right side by broadcast event. dashboard listens to the event (.$on(eventName, args))





