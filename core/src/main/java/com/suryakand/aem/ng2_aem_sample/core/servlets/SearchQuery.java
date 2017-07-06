package com.suryakand.aem.ng2_aem_sample.core.servlets;

import java.nio.charset.Charset;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.wcm.handler.url.ui.SiteRoot;

@Model(adaptables = SlingHttpServletRequest.class)
public class SearchQuery {
	private static final Logger LOG = LoggerFactory.getLogger(SearchQuery.class);

	public static final String SEARCH_QUERY_PARAMETER = "q";
	public static final String SEARCH_QUERY_PAGE_PARAMETER = "start";
	public static final String SEARCH_PATH = "path";
	public static final int ROWS = 10;

	@SlingObject
	private SlingHttpServletRequest request;

	private String queryString;
	private Integer start;
	private String searchContentPath;

	@Self
	private SiteRoot siteRoot;

	@PostConstruct
	private void activate() {
		queryString = request.getParameter(SEARCH_QUERY_PARAMETER);
		start = NumberUtils.createInteger(request.getParameter(SEARCH_QUERY_PAGE_PARAMETER));
		searchContentPath = SearchQuery.getSearchPath(request);

		if (start == null) {
			start = 0;
		}
	}

	public static String getSearchPath(HttpServletRequest request) {
		return request.getParameter(SEARCH_PATH) != null ? request.getParameter(SEARCH_PATH) : "/content";
	}

	public String getQueryString() {
		return queryString;
	}

	public int getStart() {
		return start;
	}

	public String getSearchContentPath() {
		return searchContentPath;
	}

	public List<NameValuePair> getQueryStringPairs() {
		return URLEncodedUtils.parse(request.getQueryString(), Charset.forName("UTF-8"));
	}

	public SolrQuery getSolrQuery(String searchContentPath) {
		if (StringUtils.isNotBlank(queryString)) {
			SolrQuery query = new SolrQuery();
			query.setQuery(queryString);
			// show only results below the current siteroot
			query.setFilterQueries(
					SolrConstants.PATH_DES + ":" + ClientUtils.escapeQueryChars(searchContentPath)
//					, ClientUtils.escapeQueryChars("jcr:primaryType") + ":" + ClientUtils.escapeQueryChars("cq:Page")
//					, ClientUtils.escapeQueryChars("jcr:primaryType") + ":" + ClientUtils.escapeQueryChars("dam:AssetContent")
					); //ClientUtils.escapeQueryChars(siteRoot.getRootPath()));
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
			
			// Spell correction 
			query.set("spellcheck.q", queryString);
			query.set("spellcheck", true);
			query.set("spellcheck.collateParam.q.op", "AND");
					
			LOG.debug(query.toQueryString());
			return query;
		}
		return null;
	}

}
