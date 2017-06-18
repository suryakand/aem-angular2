package com.suryakand.neba_sample.content;

import java.util.List;

import org.apache.sling.api.resource.Resource;
import org.springframework.beans.factory.annotation.Autowired;

import io.neba.api.annotations.Children;
import io.neba.api.annotations.Path;
import io.neba.api.annotations.ResourceModel;
import io.neba.api.annotations.This;

@ResourceModel(types = {"wcm/foundation/components/page", "ngaem/components/structure/page"})
public class Page {

	@Autowired
	private SimpleSpringBean simpleSpringBean;

	private String pageTitle;

	@Children
	private List<Resource> children;	

	@Path("/content/ngaem")
	@Children
	private List<com.day.cq.wcm.api.Page> childPages;
	
	@Path("cq:tags")
	private String[] tags;

	/**
	 * {@link This} conveniently injects the resource adapted to the current model.
	 */
	@This
	private Resource resource;

	public Page getPage() {
		System.out.println("**** getPage");
		Page p = this.resource.adaptTo(Page.class);
		System.out.println(p);
		return p;
	}
	
	public String getPath() {
		return resource.getPath();
	}

	public Resource getResource() {
		return resource;
	}

	public void setResource(Resource resource) {
		this.resource = resource;
	}

	public String getPageTitle() {
		return pageTitle + ", Today's Date (from Spring Bean): " + this.simpleSpringBean.getCurrentDate();
	}

	public void setPageTitle(String pageTitle) {
		this.pageTitle = pageTitle;
	}

	public List<Resource> getChildren() {
		return children;
	}

	public void setChildren(List<Resource> children) {
		this.children = children;
	}

	public List<com.day.cq.wcm.api.Page> getChildPages() {
		return childPages;
	}

	public void setChildPages(List<com.day.cq.wcm.api.Page> childPages) {
		this.childPages = childPages;
	}

	public SimpleSpringBean getSimpleSpringBean() {
		return simpleSpringBean;
	}

	public void setSimpleSpringBean(SimpleSpringBean simpleSpringBean) {
		this.simpleSpringBean = simpleSpringBean;
	}

	public String[] getTags() {
		return tags;
	}

	public void setTags(String[] tags) {
		this.tags = tags;
	}
	
}
