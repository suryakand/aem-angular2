# Tutorials
Please refer following blog post for details explanation and guidelines for integration
* Part 1: http://suryakand-shinde.blogspot.com/2017/06/part-1-angular-2-with-aem-introduction.html
* Part 2: http://suryakand-shinde.blogspot.com/2017/06/part-2-aem-with-angular-2-building.html
* Part 3: http://suryakand-shinde.blogspot.com/2017/06/part-3-aem-with-angular-2-aem-component.html

## Modules

The main parts of the template are:

* core: Java bundle containing all core functionality like OSGi services, listeners or schedulers, as well as component-related Java code such as servlets or request filters.
* ui.apps: contains the /apps (and /etc) parts of the project, ie JS&CSS clientlibs, components, templates, runmode specific configs as well as Hobbes-tests
* ui.content: contains sample content using the components from the ui.apps
* ui.tests: Java bundle containing JUnit tests that are executed server-side. This bundle is not to be deployed onto production.
* ui.launcher: contains glue code that deploys the ui.tests bundle (and dependent bundles) to the server and triggers the remote JUnit execution

## How to build
To build this project, you will need:
* Node.js - https://nodejs.org/en
* Gulp - http://gulpjs.com
* Maven - https://maven.apache.org
* JDK 1.7 or later - https://www.java.com/en/download
* Angular CLI - ``npm install -g @angular/cli``

Before building the Maven project, the front-end project must be built.
* cd into the ui.apps directory and run ``npm install``
* run ``gulp build``

To build all the modules run in the project root directory the following command with Maven 3:

    mvn clean install

If you have a running AEM instance you can build and package the whole project and deploy into AEM with  

    mvn clean install -PautoInstallPackage
    
Or to deploy it to a publish instance, run

    mvn clean install -PautoInstallPackagePublish
    
Or to deploy only the bundle to the author, run

    mvn clean install -PautoInstallBundle

## Testing

There are three levels of testing contained in the project:

* unit test in core: this show-cases classic unit testing of the code contained in the bundle. To test, execute:

    mvn clean test

* server-side integration tests: this allows to run unit-like tests in the AEM-environment, ie on the AEM server. To test, execute:

    mvn clean integration-test -PintegrationTests

* client-side Hobbes.js tests: JavaScript-based browser-side tests that verify browser-side behavior. To test:

    in the browser, open the page in 'Developer mode', open the left panel and switch to the 'Tests' tab and find the generated 'MyName Tests' and run them.


## Maven settings

The project comes with the auto-public repository configured. To setup the repository in your Maven settings, refer to:

    http://helpx.adobe.com/experience-manager/kb/SetUpTheAdobeMavenRepository.html

