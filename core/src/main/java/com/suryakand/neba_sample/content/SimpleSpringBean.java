package com.suryakand.neba_sample.content;

import java.util.Date;

import org.springframework.stereotype.Component;

@Component
public class SimpleSpringBean {

	public Date getCurrentDate() {
		return new Date();
	}
}
