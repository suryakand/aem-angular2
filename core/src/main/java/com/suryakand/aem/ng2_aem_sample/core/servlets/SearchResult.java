package com.suryakand.aem.ng2_aem_sample.core.servlets;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.GroupCommand;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.client.solrj.response.SpellCheckResponse;
import org.apache.solr.common.SolrDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.dam.api.AssetReferenceResolver;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

import io.wcm.handler.link.Link;
import io.wcm.handler.link.LinkHandler;
import io.wcm.sling.models.annotations.AemObject;

@Model(adaptables = SlingHttpServletRequest.class)
public class SearchResult {

	private static final Logger LOG = LoggerFactory.getLogger(SearchResult.class);

	@Self
	private SearchQuery searchQuery;
	@Self
	private SearchQueryLinkHandler searchQueryLinkHandler;
	@AemObject
	private PageManager pageManager;

	private QueryResponse response;
	private List<SearchResultEntry> searchResults;
	private SpellcheckSuggestion spellcheckSuggestion;
	private GroupCommand groupCommand;

	@Inject
	private SolrSearchServerConfiguration searchServerConfiguration;

	@Inject
	private ResourceResolver resourceResolver;

	@Inject
	private AssetReferenceResolver assetReferenceResolver;

	@PostConstruct
	private void activate() {
		query(searchQuery.getSolrQuery(searchQuery.getSearchContentPath()));
	}

	private void query(SolrQuery query) {
		if (query != null) {
			try {
				HttpSolrClient.Builder builder = new HttpSolrClient.Builder(searchServerConfiguration.getSolrHttpUrl());
				HttpSolrClient client = builder.build();

				response = client.query(query);
				if (response.getGroupResponse() != null && !response.getGroupResponse().getValues().isEmpty()) {
					groupCommand = response.getGroupResponse().getValues().get(0);
				}
			}
			catch (Exception e) {
				LOG.error("Could not perform query " + query, e);
			}
		}
	}

	public long getNumberResults() {
		return groupCommand != null ? groupCommand.getNGroups() : 0;
	}

	public double getElapsedTime() {
		return response != null ? response.getElapsedTime() / 1000.0 : 0;
	}

	/**
	 * @return link to this page using an alternative search term.
	 */
	public SpellcheckSuggestion getSpellcheckSuggestion(Page currentPage, LinkHandler linkHandler) {
		if (spellcheckSuggestion == null && response != null) {
			SpellCheckResponse spellcheck = response.getSpellCheckResponse();
			if (spellcheck != null && !spellcheck.getCollatedResults().isEmpty()) {
				SpellCheckResponse.Collation collation = spellcheck.getCollatedResults().get(0);
				Link link = searchQueryLinkHandler.get(currentPage, linkHandler).param(SearchQuery.SEARCH_QUERY_PARAMETER, collation.getCollationQueryString()).build();
				spellcheckSuggestion = new SpellcheckSuggestion(collation.getCollationQueryString(), collation.getNumberOfHits(), link);
			}
		}
		return spellcheckSuggestion;
	}

	public List<LinkItem> getPaging(Page currentPage, LinkHandler linkHandler) {
		long numberPages = groupCommand.getNGroups() / SearchQuery.ROWS;
		int currentPageNumber = searchQuery.getStart() / SearchQuery.ROWS;
		List<LinkItem> ret = new ArrayList<>();
		long startNumber = Math.max(currentPageNumber - 5, 0);
		long endNumber = Math.min(startNumber + 10, numberPages);
		for (long i = startNumber; i <= endNumber && ret.size() < 10; i++) {
			Link link = searchQueryLinkHandler.get(currentPage, linkHandler).searchQuery(searchQuery).start(i * SearchQuery.ROWS).build();
			if (i == currentPageNumber) {
				link.getAnchor().addCssClass("active");
			}
			ret.add(new LinkItem(String.valueOf(i + 1), link));
		}
		return ret;
	}

	public SearchResultWithPagination getSearchResultWithPagination(LinkHandler linkHandler) {
		SearchResultWithPagination resultWithPagination = new SearchResultWithPagination();

		resultWithPagination.setQueryString(searchQuery.getQueryString());
		resultWithPagination.setElapsedTime(getElapsedTime());
		resultWithPagination.setNumberOfResults(getNumberResults());
		resultWithPagination.setSearchResults(getSearchResults(linkHandler));
		resultWithPagination.setCurrentPage(searchQuery.getStart() / SearchQuery.ROWS);
		resultWithPagination.setNumberPages(groupCommand.getNGroups() < SearchQuery.ROWS ? 1 : groupCommand.getNGroups() / SearchQuery.ROWS);

		return resultWithPagination;
	}

	public List<SearchResultEntry> getSearchResults(LinkHandler linkHandler) {
		if (searchResults == null && groupCommand != null) {
			searchResults = new ArrayList<>();
			groupCommand.getValues().iterator().forEachRemaining(
					group -> {
						group.getResult().iterator().forEachRemaining(
								solrDocument -> {
									SearchResultEntry entry = getSearchResultEntry(solrDocument, linkHandler);
									if (entry != null) {
										searchResults.add(entry);
									}
								});
					});
		}
		return searchResults;
	}

	private SearchResultEntry getSearchResultEntry(SolrDocument solrDocument, LinkHandler linkHandler) {
		if (solrDocument.containsKey(SolrConstants.PATH_COLLAPSED)) {
			String path = (String)solrDocument.getFirstValue(SolrConstants.PATH_COLLAPSED);
			if (StringUtils.isNotBlank(path)) {
				Resource resouce = resourceResolver.resolve(path);
				if (resouce != null) {
					String link = null;
					String title = null;

					String type = resouce.getValueMap().get("jcr:primaryType", String.class);
					ContentType contentType = ContentType.fromString(type);
					switch(contentType) {
					case PAGE: 
						Page page = pageManager.getContainingPage(path);
						link = linkHandler.get(page).build().getUrl();
						title = page.getTitle();
						break;
					case ASSET:
					case RESOURCE:
						try {
							link = assetReferenceResolver.getResolvedPath(resouce.getPath(), resourceResolver).replaceAll("/jcr:content", "");
							title = "Asset: " + link;
						} catch (Exception e) {
							link = resouce.getPath();
							title = "Other " + resouce.getName();								
							e.printStackTrace();
						}
						break;						
					default:
						link = resouce.getPath();
						title = "Other " + resouce.getName();	
					}

					Map<String, List<String>> highlightings = response.getHighlighting().get((String)solrDocument.get(SolrConstants.PATH_EXACT));
					SearchResultEntry ret =
							new SearchResultEntry(title, link, highlightings != null && highlightings.containsKey("text") ? highlightings.get("text").get(0) : null);
					return ret;
				}
			}
		}
		return null;
	}

	public static enum ContentType {
		PAGE("cq:PageContent"), ASSET("dam:AssetContent"), OTHER("nt:unstructured"), RESOURCE("nt:resource"), UNKNOWN("");

		private String type;
		ContentType(String type) {
			this.type = type;
		}

		public static ContentType fromString(String text) {
			for (ContentType b : ContentType.values()) {
				if (b.type.equalsIgnoreCase(text)) {
					return b;
				}
			}
			return ContentType.UNKNOWN;
		}

		public String getType() {
			return type;
		}

		public void setType(String type) {
			this.type = type;
		}
	}

	public static final class LinkItem {

		private final String title;
		private final Link link;

		public LinkItem(String title, Link link) {
			this.title = title;
			this.link = link;
		}

		public String getTitle() {
			return title;
		}

		public Link getLink() {
			return link;
		}
	}

	public static final class SpellcheckSuggestion {
		private final String queryTerm;
		private final Link link;
		private final long numberOfHits;

		public SpellcheckSuggestion(String queryTerm, long numberOfHits, Link link) {
			this.queryTerm = queryTerm;
			this.link = link;
			this.numberOfHits = numberOfHits;
		}

		public String getQueryTerm() {
			return queryTerm;
		}

		public Link getLink() {
			return link;
		}

		public long getNumberOfHits() {
			return numberOfHits;
		}

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

	public static final class SearchResultWithPagination {
		private List<SearchResultEntry> searchResults;
		private long numberOfResults;
		private double elapsedTime;
		private int numberPages;
		private int currentPage;
		private String queryString;

		public List<SearchResultEntry> getSearchResults() {
			return searchResults;
		}
		public void setSearchResults(List<SearchResultEntry> searchResults) {
			this.searchResults = searchResults;
		}
		public long getNumberOfResults() {
			return numberOfResults;
		}
		public void setNumberOfResults(long numberOfResults) {
			this.numberOfResults = numberOfResults;
		}
		public double getElapsedTime() {
			return elapsedTime;
		}
		public void setElapsedTime(double elapsedTime) {
			this.elapsedTime = elapsedTime;
		}
		public int getNumberPages() {
			return numberPages;
		}
		public void setNumberPages(int numberPages) {
			this.numberPages = numberPages;
		}
		public int getCurrentPage() {
			return currentPage;
		}
		public void setCurrentPage(int currentPage) {
			this.currentPage = currentPage;
		}
		public String getQueryString() {
			return queryString;
		}
		public void setQueryString(String searchTerm) {
			this.queryString = searchTerm;
		}
	}
}
