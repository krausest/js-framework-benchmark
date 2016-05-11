package net.stefankrause;

import java.io.IOException;
import java.util.*;

import com.google.common.collect.HashBasedTable;
import com.google.common.collect.Table;
import org.json.*;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.*;
import org.openqa.selenium.logging.*;
import org.openqa.selenium.remote.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public abstract class AbstractCPUBench implements Bench {
	abstract void init(WebDriver driver, String url);
	abstract void test(WebDriver driver);
	
	private static class PLogEntry {
        private final String name;
        private final long ts;
        private final long duration;
        private final String message;

        public PLogEntry(String name, long ts, long duration, String message) {
            this.name = name;
            this.ts = ts;
            this.duration = duration;
            this.message = message;
        }

        public String getName() {
            return name;
        }

        public long getTs() {
            return ts;
        }

        public long getDuration() {
            return duration;
        }

        public String getMessage() {
            return message;
        }

        @Override
        public String toString() {
            return "PLogEntry{" +
                    "name='" + name + '\'' +
                    ", ts=" + ts +
                    ", duration=" + duration +
                    ", message='" + message + '\'' +
                    '}';
        }
    }
    
    public String getType() {
		return "cpu";
	}
	
	public Double run(ChromeDriver driver, Framework framework, double lastWait) throws Exception {
		System.out.println(framework.framework + " " + this.getName() + " => init");
		this.init(driver, framework.url);

		WebDriverWait wait = new WebDriverWait(driver, 10);
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));

		Thread.sleep(2000);
		
		printLog(driver, false, "aurelia".equals(framework.framework));
		
		System.out.println(framework.framework + " " + this.getName() + " => run");
		this.test(driver);
		System.out.println("run " + this.getName());

		element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
		Thread.sleep(1000 + (int) lastWait);

		return printLog(driver, true, "aurelia".equals(framework.framework));
	}
	
	public String getAsString(JSONObject root, String path) {
		return getAsStringRec(root, Arrays.asList(path.split("\\.")));
	}

	public double getAsLong(JSONObject root, String path) {
		Double r = getAsLongRec(root, Arrays.asList(path.split("\\.")));
		if (r==null) {
			return 0;
		} else {
			return r.doubleValue();
		}
	}


	public String getAsStringRec(JSONObject root, List<String> path) {
		JSONObject obj = root;
		if (!root.has(path.get(0)))
			return null;

		if (path.size()==1) {
			return root.getString(path.get(0));
		} else {
			return getAsStringRec(root.getJSONObject(path.get(0)), path.subList(1, path.size()));
		}
	}

	public Double getAsLongRec(JSONObject root, List<String> path) {
		JSONObject obj = root;
		if (!root.has(path.get(0)))
			return null;

		if (path.size()==1) {
			return Double.valueOf(root.getDouble(path.get(0)));
		} else {
			return getAsLongRec(root.getJSONObject(path.get(0)), path.subList(1, path.size()));
		}
	}

	

	List<PLogEntry> submitPerformanceResult(List<LogEntry> perfLogEntries, boolean print)
			throws IOException, JSONException {
		ArrayList<PLogEntry> filtered = new ArrayList<>();

		if (print) System.out.println(perfLogEntries.size() + " performance log entries found");
		for (LogEntry entry : perfLogEntries) {
			JSONObject obj = new JSONObject(entry.getMessage());
			String name = getAsString(obj, "message.params.name");
			if (print) System.out.println(entry.getMessage());
			if ("EventDispatch".equals(name)
					&& "click".equals(getAsString(obj, "message.params.args.data.type"))
				|| "Paint".equals(name)
					|| "TimerFire".equals(name)) {
				filtered.add(new PLogEntry(name,
						(long)getAsLong(obj, "message.params.ts"),
						(long)getAsLong(obj, "message.params.dur"),
						entry.getMessage()));
			}
		}

		return filtered;
	}
	
	Double printLog(WebDriver driver, boolean print, boolean isAurelia) throws Exception {
		List<LogEntry> entries = driver.manage().logs().get(LogType.BROWSER).getAll();
		System.out.println(entries.size() + " " + LogType.BROWSER + " log entries found");
		for (LogEntry entry : entries) {
			if (print) System.out.println(
					new Date(entry.getTimestamp()) + " " + entry.getLevel() + " " + entry.getMessage());
		}

		Logs logs = driver.manage().logs();
		if (print) System.out.println("Log types: " + logs.getAvailableLogTypes());
		List<PLogEntry> filtered = submitPerformanceResult(logs.get(LogType.PERFORMANCE).getAll(), false);

		// Chrome 49 reports a Paint very short after the Event Dispatch which I can't find in the timeline
		//   it also seems to have a performance regression that can be seen in the timeline
		//   we're using the last paint event to fix measurement
		Optional<PLogEntry> evt = filtered.stream().filter(pe -> "EventDispatch".equals(pe.getName())).findFirst();
		long tsEvent = evt.map(pe -> pe.ts+pe.duration).orElse(0L);
		// First TimerFire
		Optional<PLogEntry> evtTimer = filtered.stream().filter(pe -> "TimerFire".equals(pe.getName())).filter(pe -> pe.ts > tsEvent).findFirst();
		long tsEventFire = evtTimer.map(pe -> pe.ts+pe.duration).orElse(0L);
		// First Paint after TimerFire only for Aurelia
		long tsAfter = isAurelia && App.BINARY_VERSION > 48 ? tsEventFire : tsEvent;
		Optional<PLogEntry> lastPaint = filtered.stream().filter(pe -> "Paint".equals(pe.getName())).
				filter(pe -> pe.ts > tsAfter).reduce((p1,p2) -> p2);

		if (print) System.out.println("************************ filtered events");
		if (print) filtered.forEach(e -> System.out.println(e));
		if (evt.isPresent() && lastPaint.isPresent()) {
			if (print) System.out.println("Duration "+(lastPaint.get().ts + lastPaint.get().duration - evt.get().ts)/1000.0);
			return (lastPaint.get().ts + lastPaint.get().duration - evt.get().ts)/1000.0;
		}
		return null;

	}
}