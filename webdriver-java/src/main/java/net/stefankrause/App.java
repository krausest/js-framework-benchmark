package net.stefankrause;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.OpenOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.text.NumberFormat;
import java.util.*;
import java.util.logging.Level;
import java.util.stream.Collectors;
import java.util.stream.DoubleStream;
import java.util.stream.Stream;

import com.google.common.collect.HashBasedTable;
import com.google.common.collect.Table;
import org.json.*;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.*;
import org.openqa.selenium.logging.*;
import org.openqa.selenium.remote.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class App {

        
    private final static String BINARY = "/Applications/Chromium.app/Contents/MacOS/Chromium";
    //private final static String BINARY = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    //private final static String BINARY = "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary";
    private final static int REPEAT_RUN = 10;
    private final static int WARMUP_COUNT = 5;
    private final static int DROP_WORST_RUN = 4;

    private static class Framework {
        private final String framework;
        private final  String url;
        public Framework(String name) {
            this.framework = name;
            this.url = name;
        }
        public Framework(String framework, String url) {
            this.framework = framework;
            this.url = url;
        }
    }

    private final static Framework frameworks[] = {
    	new Framework("angular-v1.5.3"),
    	new Framework("angular-v2.0.0-beta.2"),
    	new Framework("angular-v2.0.0-beta.15"),
    	new Framework("aurelia"),
        new Framework("ember", "ember/dist"),
        new Framework("inferno-v0.7.6"),
    	new Framework("mithril-v0.2.3"),
    	new Framework("plastiq-v1.28.0"),
        new Framework("plastiq-v1.30.0"),
    	new Framework("preact-v2.8.3"),
    	new Framework("ractive-v0.7.3"),
    	new Framework("react-v0.14.8"),
    	new Framework("react-v15.0.1"),
    	new Framework("react-lite-v0.0.18"),
    	new Framework("react-lite-v0.15.9"),
        new Framework("vanillajs"),
        new Framework("vidom-v0.1.7"),
        new Framework("vue-v1.0.21")
    };
    
    private final static Bench[] benches = new Bench[] {
    	new BenchRun(),
    	new BenchRunHot(),
    	new BenchUpdate(),
    	new BenchSelect(),
    	new BenchRemove(),
    	new BenchHideAll(),
    	new BenchShowAll(),
    	new BenchRunBig(),
    	new BenchRunBigHot(),
    	new BenchClear(),
    	new BenchClearHot(),
    	new BenchSelectBig(),
    	new BenchSwapRows(),
    	new BenchRecycle()
    };

    private static int BINARY_VERSION = 0;
    
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

    public interface Bench {
        void init(WebDriver driver, String url);
        void run(WebDriver driver, String url);
        String getName();
    }

    private static class BenchRun implements Bench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
        }

        public void run(WebDriver driver, String url) {
            WebElement element = driver.findElement(By.id("run"));
            element.click();
        }

        public String getName() {
            return "create 1000 rows";
        }
    }

    private static class BenchRunHot implements Bench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            for (int i = 0; i< WARMUP_COUNT; i++) {
                driver.findElement(By.id("run")).click();
                wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            }
        }

        public void run(WebDriver driver, String url) {
            WebElement element = driver.findElement(By.id("run"));
            element.click();
        }

        public String getName() {
            return "update 1000 rows (hot)";
        }
    }

    private static class BenchUpdate implements Bench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            element.click();
            for (int i = 0; i< WARMUP_COUNT; i++) {
                driver.findElement(By.id("update")).click();
                wait.until(ExpectedConditions.elementToBeClickable(By.id("update")));
            }
        }

        public void run(WebDriver driver, String url) {
            driver.findElement(By.id("update")).click();
        }

        public String getName() {
            return "partial update";
        }
    }

    private static class BenchSelect implements Bench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            element.click();
            for (int i = 0; i< WARMUP_COUNT; i++) {
                element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//tbody/tr["+(i+1)+"]/td[2]/a")));
                element.click();
            }
        }

        public void run(WebDriver driver, String url) {
            WebElement element = driver.findElement(By.xpath("//tbody/tr[1]/td[2]/a"));
            element.click();
        }

        public String getName() {
            return "select row";
        }
    }

    private static class BenchRemove implements Bench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            element.click();
            for (int i=3+WARMUP_COUNT;i>=3;i--) {
                element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//tbody/tr["+i+"]/td[3]/a")));
                element.click();
            }
        }

        public void run(WebDriver driver, String url) {
            WebElement element = driver.findElement(By.xpath("//tbody/tr[1]/td[3]/a"));
            element.click();
        }

        public String getName() {
            return "remove row";
        }
    }
    
    private static class BenchHideAll implements Bench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            element.click();
            
            wait.until(ExpectedConditions.elementToBeClickable(By.id("hideall")));
        }

        public void run(WebDriver driver, String url) {
           driver.findElement(By.id("hideall")).click();
        }

        public String getName() {
            return "hide all";
        }
    }
    
    private static class BenchShowAll implements Bench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            element.click();
            element = wait.until(ExpectedConditions.elementToBeClickable(By.id("hideall")));
            element.click();
            
            wait.until(ExpectedConditions.elementToBeClickable(By.id("showall")));
        }

        public void run(WebDriver driver, String url) {
           driver.findElement(By.id("showall")).click();
        }

        public String getName() {
            return "show all";
        }
    }
    
    private static class BenchRunBig implements Bench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            wait.until(ExpectedConditions.elementToBeClickable(By.id("runlots")));
        }

        public void run(WebDriver driver, String url) {
            driver.findElement(By.id("runlots")).click();
        }

        public String getName() {
            return "create lots of rows";
        }
    }
    
    private static class BenchRunBigHot implements Bench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("runlots")));
            element.click();
            
            wait.until(ExpectedConditions.elementToBeClickable(By.id("add")));
        }

        public void run(WebDriver driver, String url) {
            driver.findElement(By.id("add")).click();
        }

        public String getName() {
            return "add 1000 rows after lots of rows";
        }
    }
    
    private static class BenchClear implements Bench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("runlots")));
            element.click();
            
            wait.until(ExpectedConditions.elementToBeClickable(By.id("clear")));
        }

        public void run(WebDriver driver, String url) {
            driver.findElement(By.id("clear")).click();
        }

        public String getName() {
            return "clear rows";
        }
    }
    
    private static class BenchClearHot implements Bench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("runlots")));
            element.click();
            
            element = wait.until(ExpectedConditions.elementToBeClickable(By.id("clear")));
            element.click();
            
            element = wait.until(ExpectedConditions.elementToBeClickable(By.id("runlots")));
            element.click();
            
            wait.until(ExpectedConditions.elementToBeClickable(By.id("clear")));
        }

        public void run(WebDriver driver, String url) {
            driver.findElement(By.id("clear")).click();
        }

        public String getName() {
            return "clear rows a 2nd time";
        }
    }
    
    private static class BenchSelectBig implements Bench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("runlots")));
            element.click();
            
            for (int i = 0; i< WARMUP_COUNT; i++) {
                element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//tbody/tr["+(i+1)+"]/td[2]/a")));
                element.click();
            }
        }

        public void run(WebDriver driver, String url) {
            WebElement element = driver.findElement(By.xpath("//tbody/tr[1]/td[2]/a"));
            element.click();
        }

        public String getName() {
            return "select row on big list";
        }
    }
    
    private static class BenchSwapRows implements Bench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            element.click();
            for (int i = 0; i< WARMUP_COUNT; i+=2) {
                driver.findElement(By.id("swaprows")).click();
                wait.until(ExpectedConditions.elementToBeClickable(By.id("swaprows")));
            }
        }

        public void run(WebDriver driver, String url) {
            driver.findElement(By.id("swaprows")).click();
        }

        public String getName() {
            return "swap rows";
        }
    }
    
    private static class BenchRecycle implements Bench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            element.click();
            
            element = wait.until(ExpectedConditions.elementToBeClickable(By.id("clear")));
            element.click();
            
            wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
        }

        public void run(WebDriver driver, String url) {
            driver.findElement(By.id("run")).click();
        }

        public String getName() {
            return "recycle rows";
        }
    }

    private void runTests() throws Exception {

        DesiredCapabilities cap = setUp();

        int length = REPEAT_RUN;
        Table<String, String, DoubleSummaryStatistics> results = HashBasedTable.create();

			for (Framework framework : frameworks) {
				System.out.println(framework);
				for (Bench bench : benches) {
					System.out.println(bench.getName());
					ChromeDriver driver = new ChromeDriver(cap);
					try {
						double[] data = new double[length];
						double lastWait = 1000;
						for (int i = 0; i < length; i++) {
							System.out.println(framework.framework+" "+bench.getName()+" => init");
							bench.init(driver, framework.url);
	
							WebDriverWait wait = new WebDriverWait(driver, 10);
							WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
	
							Thread.sleep(2000);
							printLog(driver, false, "aurelia".equals(framework.framework));
							System.out.println(framework.framework+" "+bench.getName()+" => run");
							bench.run(driver, framework.url);
							System.out.println("run " + bench.getName());
	
							element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
							Thread.sleep(1000 + (int) lastWait);
	
							Double res = printLog(driver, true, "aurelia".equals(framework.framework));
							if (res != null) {
								data[i] = res.doubleValue();
								lastWait = data[i];
							}
						}
                        System.out.println("before "+Arrays.toString(data));
						if (DROP_WORST_RUN>0) {
							Arrays.sort(data);
							data = Arrays.copyOf(data, data.length-DROP_WORST_RUN);
							System.out.println("after "+Arrays.toString(data));
						}
                        DoubleSummaryStatistics stats = DoubleStream.of(data).summaryStatistics();
                        results.put(framework.framework, bench.getName(), stats);
					} finally {
						driver.quit();
					}
				}
                logResult(framework.framework, results);
			}
    }

    private void logResult(String framework, Table<String, String, DoubleSummaryStatistics> results) throws IOException {
        NumberFormat nf = NumberFormat.getInstance(Locale.ENGLISH);
        nf.setMaximumFractionDigits(2);
        nf.setMinimumFractionDigits(2);
        nf.setGroupingUsed(false);

        StringBuilder line = new StringBuilder();
        line.append("{").append("\"framework\": \"").append(framework).append("\", ")
                .append("\"results\":[");
        line.append(Arrays.stream(benches).map(bench ->
                "{\"benchmark\": \""+bench.getName()+"\", "
                        +"\"min\": "+nf.format(results.get(framework, bench.getName()).getMin())+", "
                        +"\"max\": "+nf.format(results.get(framework, bench.getName()).getMax())+", "
                        +"\"avg\": "+nf.format(results.get(framework, bench.getName()).getAverage())+"}"
        ).collect(Collectors.joining(", ")));
        line.append("]}");

        Files.write(Paths.get("results",framework+".txt"), line.toString().getBytes("utf-8"));
        System.out.println("==== Results for "+framework+" written to results directory");
    }

    public DesiredCapabilities setUp() throws Exception {

        DesiredCapabilities cap = DesiredCapabilities.chrome();
        LoggingPreferences logPrefs = new LoggingPreferences();
        logPrefs.enable(LogType.PERFORMANCE, Level.ALL);
        logPrefs.enable(LogType.BROWSER, Level.ALL);
        cap.setCapability(CapabilityType.LOGGING_PREFS, logPrefs);
        Map<String, Object> perfLogPrefs = new HashMap<>();
        perfLogPrefs.put("traceCategories", "browser,devtools.timeline,devtools"); // comma-separated trace categories
        ChromeOptions options = new ChromeOptions();
        options.setExperimentalOption("perfLoggingPrefs", perfLogPrefs);
        options.setBinary(BINARY);
        cap.setCapability(ChromeOptions.CAPABILITY, options);

        return cap;

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
        long tsAfter = isAurelia && BINARY_VERSION > 48 ? tsEventFire : tsEvent;
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

    public static void main(String[] argv) throws Exception {
        Path root = Paths.get(BINARY).resolveSibling("../Versions").toAbsolutePath();
        int length = root.toString().length();
        Files.walk(root, 1).filter(Files::isDirectory).forEach(filePath -> {
        	String path = filePath.toString();
			if(path.length() > length) {
				path = path.substring(path.lastIndexOf("/") + 1);
				int version = Integer.parseInt(path.substring(0, path.indexOf(".")));
				if(version > BINARY_VERSION) {
					BINARY_VERSION = version;
				}
			}
        });
        System.out.println("Running with " + Paths.get(BINARY).getFileName() + " v" + BINARY_VERSION);
        
        System.setProperty("webdriver.chrome.driver", "node_modules/webdriver-manager/selenium/chromedriver");
        App test = new App();
        test.runTests();
    }

}
