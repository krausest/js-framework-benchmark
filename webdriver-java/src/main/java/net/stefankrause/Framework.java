package net.stefankrause;

public final class Framework {
	public final String framework;
	public final String url;
	
	public Framework(String name) {
		this.framework = name;
		this.url = name;
	}
	public Framework(String framework, String url) {
		this.framework = framework;
		this.url = url;
	}
}