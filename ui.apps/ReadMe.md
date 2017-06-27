#Notes:
- Not yet ready for use as lots of bugs are there. Need to fix it before it can be utilized
- If an angular2 component needs to be used globally then it must be added to array of bootstrap[] in module
- A component added in bootstrap[] array is available globally but, you can't use same component twice on same page

# Add new JS Angular2 dependecny
- Install it using npm install [library] --save
- Add the entry in systemjs.config.js
- Add entry on gulpfile.js
- Run maven build (mvn clean install -PautoInstallPackage)

#TODO:
- Figure out a way to make component reusable without bootstraping them at global level
- Create documentation
- Minification and remove .js.map files from production builds