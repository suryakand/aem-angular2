package com.suryakand.aem.ng2_aem_sample.core.servlets;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.message.BasicNameValuePair;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;

import com.day.cq.wcm.api.Page;

import io.wcm.handler.link.Link;
import io.wcm.handler.link.LinkHandler;

@Model(adaptables = SlingHttpServletRequest.class)
public class SearchQueryLinkHandler {

	@Self
	private SearchQuery searchQuery;

	public SearchQueryLinkBuilder get(Page page, LinkHandler linkHandler) {
		return new SearchQueryLinkBuilder(linkHandler, page);
	}

	public static class SearchQueryLinkBuilder {

		private final Map<String, NameValuePair> params = new HashMap<>();
		private final Page page;
		private final LinkHandler linkHandler;

		public SearchQueryLinkBuilder(LinkHandler linkHandler, Page page) {
			this.page = page;
			this.linkHandler = linkHandler;
		}

		public SearchQueryLinkBuilder param(String name, String value) {
			params.put(name, new BasicNameValuePair(name, value));
			return this;
		}

		public SearchQueryLinkBuilder searchQuery(SearchQuery searchQuery) {
			params.putAll(searchQuery.getQueryStringPairs().stream().collect(Collectors.toMap(NameValuePair::getName, item -> item, (item1, item2) -> {
				return item1;
			})));
			return this;
		}

		public SearchQueryLinkBuilder queryTerm(String queryTerm) {
			return param(SearchQuery.SEARCH_QUERY_PARAMETER, queryTerm);
		}

		public SearchQueryLinkBuilder start(long start) {
			return param(SearchQuery.SEARCH_QUERY_PAGE_PARAMETER, String.valueOf(start));
		}

		public String buildQueryString() {
			return URLEncodedUtils.format(new ArrayList(params.values()), "UTF-8");
		}

		public Link build() {
			return linkHandler.get(page).queryString(buildQueryString()).build();
		}

	}

}
