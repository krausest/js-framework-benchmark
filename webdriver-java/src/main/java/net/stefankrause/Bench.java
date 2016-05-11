package net.stefankrause;

import org.openqa.selenium.chrome.ChromeDriver;

public interface Bench {
	Double run(ChromeDriver driver, Framework framework, double lastWait) throws Exception;
	String getName();
	String getPath();
	String getType();
}