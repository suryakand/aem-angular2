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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.GroupCommand;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.converter.json.GsonBuilderUtils;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import io.wcm.handler.link.Link;
import io.wcm.handler.link.LinkHandler;

/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */
@SuppressWarnings("serial")
@SlingServlet(paths = "/bin/search")
public class SolrSearchServlet extends SlingSafeMethodsServlet {
	private static final Logger LOG = LoggerFactory.getLogger(SolrSearchServlet.class);

	public static final String SEARCH_QUERY_PARAMETER = "q";
	public static final String SEARCH_QUERY_PAGE_PARAMETER = "start";
	public static final int ROWS = 10;

	@Reference
	private SolrSearchServerConfiguration searchServerConfiguration;
	private static final String ROOT_PATH = "/content";

	@Override
	protected void doGet(final SlingHttpServletRequest req, final SlingHttpServletResponse response) throws ServletException, IOException {
		Resource resource = req.getResourceResolver().getResource(ROOT_PATH);
		LinkHandler linkHandler = resource.adaptTo(LinkHandler.class);
		PageManager pageManager = req.getResourceResolver().adaptTo(PageManager.class);

		String queryString = req.getParameter(SEARCH_QUERY_PARAMETER);
		Integer start = NumberUtils.createInteger(req.getParameter(SEARCH_QUERY_PAGE_PARAMETER));

		List<SearchResultEntry> results = query(getSolrQuery(queryString, start), linkHandler, pageManager);

		if(results != null) {
			GsonBuilder gsBuilderUtils = GsonBuilderUtils.gsonBuilderWithBase64EncodedByteArrays();
			Type listOfTestObject = new TypeToken<List<SearchResultEntry>>(){}.getType();
			String jsonResponse = gsBuilderUtils.create().toJson(results, listOfTestObject);

			if(jsonResponse != null) {
				try {
					response.setContentType("application/json");
					PrintWriter out = response.getWriter();
					out.print(jsonResponse);
					out.flush();
				} catch (Exception e) {
					e.printStackTrace();
				}
			} else {
				response.setStatus(404);
				response.getOutputStream().println("<p>Not results!</p>");
			}
		}
	}

	private List<SearchResultEntry> query(SolrQuery query, LinkHandler linkHandler, PageManager pageManager) {
		if (query != null) {
			try {
				HttpSolrClient.Builder builder = new HttpSolrClient.Builder(searchServerConfiguration.getSolrHttpUrl());
				HttpSolrClient client = builder.build();

				GroupCommand groupCommand = null;
				QueryResponse response = client.query(query);

				if (response.getGroupResponse() != null && !response.getGroupResponse().getValues().isEmpty()) {
					groupCommand = response.getGroupResponse().getValues().get(0);
				}
				return getSearchResults(groupCommand, response, linkHandler, pageManager);
			}
			catch (Exception e) {
				LOG.error("Could not perform query " + query, e);
			}
		}

		return null;
	}

	public List<SearchResultEntry> getSearchResults(GroupCommand groupCommand, QueryResponse response, LinkHandler linkHandler, PageManager pageManager) {
		final List<SearchResultEntry> searchResults = new ArrayList<SearchResultEntry>();
		if (groupCommand != null) {
			groupCommand.getValues().iterator().forEachRemaining(group -> {
				group.getResult().iterator().forEachRemaining( solrDocument -> {
					SearchResultEntry entry = getSearchResultEntry(solrDocument, response, linkHandler, pageManager);
					if (entry != null) {
						searchResults.add(entry);
					}
				});
			});
		}
		return searchResults;
	}

	private SearchResultEntry getSearchResultEntry(SolrDocument solrDocument, QueryResponse response, LinkHandler linkHandler, PageManager pageManager) {
		if (solrDocument.containsKey(SolrConstants.PATH_COLLAPSED)) {
			String path = (String)solrDocument.getFirstValue(SolrConstants.PATH_COLLAPSED);
			if (StringUtils.isNotBlank(path)) {
				Page page = pageManager.getContainingPage(ROOT_PATH + path);
				if (page != null) {
					Link link = linkHandler.get(page).build();
					Map<String, List<String>> highlightings = response.getHighlighting().get((String)solrDocument.get(SolrConstants.PATH_EXACT));
					SearchResultEntry ret = new SearchResultEntry(page.getTitle(),link.getMarkup(), highlightings != null && highlightings.containsKey("text")
							? highlightings.get("text").get(0) : null);
					return ret;
				}
			}
		}
		return null;
	}

	private SolrQuery getSolrQuery(String queryString, Integer start) {
		if (StringUtils.isNotBlank(queryString)) {
			SolrQuery query = new SolrQuery();
			query.setQuery(queryString);
			// show only results below the current siteroot
			//query.setFilterQueries(SolrConstants.PATH_DES + ":\\/content");// + ClientUtils.escapeQueryChars(siteRoot.getRootPath()));
			query.setRows(ROWS);
			if (start != null) {
				query.setStart(start);
			}

			query.set("df", "text");

			// enable highlighting
			query.set("hl", "true");
			query.set("hl.fl", "text");
			query.set("hl.fragsize", 400);
			query.set("hl.simple.pre", "<b>");
			query.set("hl.simple.post", "</b>");

			// enable grouping as we only want a single result per page
			query.set("group", "true");
			query.set("group.field", SolrConstants.PATH_COLLAPSED);
			query.set("group.ngroups", "true");
			LOG.debug(query.toQueryString());
			return query;
		}
		return null;
	}

	public static final class SearchResultEntry {

		private final String title;
		private final String link;
		private final String highlighting;

		private SearchResultEntry(String title, String link, String highlighting) {
			this.title = title;
			this.link = link;
			this.highlighting = highlighting;
		}

		public String getTitle() {
			return title;
		}

		public String getLink() {
			return link;
		}

		public String getHighlighting() {
			return highlighting;
		}

	}	
}

