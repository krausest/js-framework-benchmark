package net.stefankrause;

import java.io.IOException;
import java.util.*;

import org.json.JSONException;
import org.json.JSONObject;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.*;
import org.openqa.selenium.logging.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public abstract class AbstractMemoryBench extends Bench {
	abstract void init(WebDriver driver, String url);
	abstract void test(WebDriver driver);
	
	public String getType() {
		return "memory";
	}
	
	public Double run(ChromeDriver driver, Framework framework) throws Exception {
		System.out.println(framework.framework + " " + this.getName() + " => init");
		this.init(driver, framework.url);

		driver.executeScript("window.gc();");

		System.out.println(framework.framework + " " + this.getName() + " => run");
		this.test(driver);
		System.out.println("run " + this.getName());

		driver.executeScript("window.gc();");
		Double mem = extractMem(driver);
		System.out.println("Memory from GC: "+mem);

		return mem; //snapMemorySize(driver);
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

	List<Double> submitPerformanceResult(List<LogEntry> perfLogEntries, boolean print)
			throws IOException, JSONException {
		ArrayList<Double> filtered = new ArrayList<>();

		if (print) System.out.println(perfLogEntries.size() + " performance log entries found");
		for (LogEntry entry : perfLogEntries) {
			JSONObject obj = new JSONObject(entry.getMessage());
			String name = getAsString(obj, "message.params.name");
			if (print) System.out.println(entry.getMessage());
			if ("MajorGC".equals(name) && getAsString(obj, "message.params.args.type")==null) {
				filtered.add(Double.valueOf(getAsDouble(obj, "message.params.args.usedHeapSizeAfter")/1024.0/1024.0));
			}
		}

		return filtered;
	}

	Double extractMem(WebDriver driver) throws Exception {
		Logs logs = driver.manage().logs();
		ArrayList<LogEntry> perfEntries = new ArrayList<>();
		for (String lt : logs.getAvailableLogTypes()) {
			List<LogEntry> entries = logs.get(lt).getAll();
			if (LogType.PERFORMANCE.equals(lt)) perfEntries.addAll(entries);
			System.out.println(entries.size() + " " + lt + " log entries found");
		}
		List<Double> filtered = submitPerformanceResult(perfEntries, false);
//		System.out.println(filtered);
		if (filtered.size()==0) return -1.0;
		return filtered.get(filtered.size()-1);
	}
}