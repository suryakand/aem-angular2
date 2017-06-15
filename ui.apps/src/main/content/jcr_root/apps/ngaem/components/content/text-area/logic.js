use(function () {
    var message = "Hello World";
    var pageName = currentPage.name;
    var title = currentPage.properties.get("jcr:title");
    var resourceName = granite.resource;
    var resourceTitle = properties.get("jcr:title");

    return {
        hello: message,
        pageName: pageName,
        title: title,
        resourceName: resourceName,
        resourceTitle: resourceTitle
    };
});