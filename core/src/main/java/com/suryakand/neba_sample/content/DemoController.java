package com.suryakand.neba_sample.content;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import io.neba.api.annotations.ResourceParam;

@Controller
public class DemoController {

	@RequestMapping("/echo/{param}")
	@ResponseBody
	public String echo(@PathVariable("param") String paramToEcho) {
		return paramToEcho;
	}

	/**
	 * 
	 * @param page - a request parameter "page" is expected to contain a path to a resource 
	 * (e.g. http://localhost:4502/bin/mvc.do/echo/pagetitle?page=content/nebasample/en.html).
	 * @return
	 */
    @RequestMapping("/echo/pagetitle")
    @ResponseBody
    public String echo(@ResourceParam com.day.cq.wcm.api.Page page) {
       return page.getTitle();
    }
}