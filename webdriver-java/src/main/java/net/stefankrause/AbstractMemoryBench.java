package net.stefankrause;

import java.util.*;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.*;
import org.openqa.selenium.logging.*;
import org.openqa.selenium.remote.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public abstract class AbstractMemoryBench implements Bench {
	abstract void init(WebDriver driver, String url);
	abstract void test(WebDriver driver);
	
	public String getType() {
		return "memory";
	}
	
	public Double run(ChromeDriver driver, Framework framework, double lastWait) throws Exception {
		System.out.println(framework.framework + " " + this.getName() + " => init");
		this.init(driver, framework.url);

		WebDriverWait wait = new WebDriverWait(driver, 10);
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));

		Thread.sleep(2000);
		
		System.out.println(framework.framework + " " + this.getName() + " => run");
		this.test(driver);
		System.out.println("run " + this.getName());

		Thread.sleep(20000);

		return snapMemorySize(driver);
	}
	
	private double snapMemorySize(ChromeDriver driver) {
		JavascriptExecutor executor = ((JavascriptExecutor) driver);
		
		Map<String, ?> heapSnapshot = (Map<String, ?>) executor.executeScript(":takeHeapSnapshot");
		
		Map<String, ?> snapshot = (Map<String, ?>) heapSnapshot.get("snapshot");
		Map<String, ?> meta = (Map<String, ?>) snapshot.get("meta");
		ArrayList<String> node_fields = (ArrayList<String>) meta.get("node_fields");
		
		ArrayList<Long> nodes = (ArrayList<Long>) heapSnapshot.get("nodes");
		
		long self_size = 0;
		for(int k = node_fields.indexOf("self_size"), l = nodes.size(), d = node_fields.size(); k < l; k += d) {
			self_size += nodes.get(k);
		}
		
		double memory = self_size / 1024.0 / 1024.0;
		
		System.out.println("Memory " + memory);
		
		return memory;
	}
}