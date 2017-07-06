package com.suryakand.aem.ng2_aem_sample.core.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;

import javax.servlet.ServletException;

import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.converter.json.GsonBuilderUtils;

import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.suryakand.aem.ng2_aem_sample.core.servlets.SearchResult.SearchResultWithPagination;

import io.wcm.handler.link.LinkHandler;

/**
 * Servlet that will connect with Solr server and based on Search Terms (q) and provided search path (path) it'll return results. 
 */
@SuppressWarnings("serial")
@SlingServlet(paths = "/bin/search")
public class SolrSearchServlet extends SlingSafeMethodsServlet {
	private static final Logger LOG = LoggerFactory.getLogger(SolrSearchServlet.class);

	@Override
	protected void doGet(final SlingHttpServletRequest req, final SlingHttpServletResponse response) throws ServletException, IOException {
		Resource resource = req.getResourceResolver().getResource(SearchQuery.getSearchPath(req));
		LinkHandler linkHandler = resource.adaptTo(LinkHandler.class);
		SearchResult searchResult = req.adaptTo(SearchResult.class);
		
		SearchResultWithPagination results = searchResult.getSearchResultWithPagination(linkHandler);

		if(results != null) {
			GsonBuilder gsBuilderUtils = GsonBuilderUtils.gsonBuilderWithBase64EncodedByteArrays();
			Type listOfTestObject = new TypeToken<SearchResultWithPagination>(){}.getType();
			String jsonResponse = gsBuilderUtils.create().toJson(results, listOfTestObject);

			if(jsonResponse != null) {
				try {
					response.setContentType("application/json");
					PrintWriter out = response.getWriter();
					out.print(jsonResponse);
					out.flush();
				} catch (Exception e) {
					LOG.error("Error while search request", e);
					e.printStackTrace();
				}
			} else {
				response.setStatus(404);
				response.getOutputStream().println("<p>Not results!</p>");
			}
		}
	}

}
