/*
 *  Copyright 2015 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.suryakand.aem.ng2_aem_sample.core.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;

import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.SuggesterResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.converter.json.GsonBuilderUtils;

import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

/**
 * Servlet that will connect with Solr server and based on Search Terms (q) and provided search path (path) it'll return results. 
 */
@SuppressWarnings("serial")
@SlingServlet(paths = "/bin/search/suggestions")
public class SolrSuggestionServlet extends SlingSafeMethodsServlet {
	private static final Logger LOG = LoggerFactory.getLogger(SolrSuggestionServlet.class);

	@Reference
	private SolrSearchServerConfiguration searchServerConfiguration;

	@Override
	protected void doGet(final SlingHttpServletRequest req, final SlingHttpServletResponse response) throws ServletException, IOException {
		SolrQuery query = new SolrQuery();
		query.setRequestHandler("/suggest");
		HttpSolrClient.Builder builder = new HttpSolrClient.Builder(searchServerConfiguration.getSolrHttpUrl());
		HttpSolrClient client = builder.build();
		String searchTerm = req.getParameter("q");
		String suggester = "mySuggester";

		try {
			query.set("suggest.dictionary", suggester);
			query.set("suggest", "true");
			query.set("wt", "json");
			query.set("suggest.q", searchTerm);
			SuggesterResponse suggestions = client.query(query).getSuggesterResponse();


			if(suggestions != null) {
				Map<String, List<String>> results = suggestions.getSuggestedTerms();
				GsonBuilder gsBuilderUtils = GsonBuilderUtils.gsonBuilderWithBase64EncodedByteArrays();
				Type listOfTestObject = new TypeToken<Map<String, List<String>>>(){}.getType();

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
		} catch (SolrServerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
	}

}
