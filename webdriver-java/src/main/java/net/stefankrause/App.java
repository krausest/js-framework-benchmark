package net.stefankrause;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.NumberFormat;
import java.util.*;
import java.util.logging.Level;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.*;
import org.openqa.selenium.logging.*;
import org.openqa.selenium.remote.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import org.apache.commons.math3.stat.descriptive.SummaryStatistics;

public class App {
	
//    private final static String BINARY = "/Applications/Chromium.app/Contents/MacOS/Chromium";
    private final static String BINARY = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    //private final static String BINARY = "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary";
    private final static int REPEAT_RUN = 10;
    private final static int WARMUP_COUNT = 5;
    private final static int DROP_WORST_RUN = 4;

//    private final static Framework frameworks[] = {
//            new Framework("vanillajs") };

    private final static Framework frameworks[] = {
    	new Framework("angular-v1.5.7"),
    	new Framework("angular-v2.0.0-rc4"),
    	new Framework("aurelia-v1.0.0-rc1.0.0"),
    	new Framework("bobril-v4.42.0"),
    	new Framework("cyclejs-v6.0.3"),
    	new Framework("cyclejs-v7.0.0"),
        new Framework("ember-v2.6.1", "ember-v2.6.1/dist"),
        new Framework("inferno-v0.7.13"),
    	new Framework("mithril-v0.2.5"),
        new Framework("plastiq-v1.30.1"),
    	new Framework("preact-v4.8.0"),
    	new Framework("ractive-v0.7.3"),
    	new Framework("react-v0.14.8"),
    	new Framework("react-v15.2.0"),
        new Framework("react-v15.2.0-mobX-v2.3.3"),
    	new Framework("react-lite-v0.15.14"),
    	new Framework("tsers-v1.0.0"),
        new Framework("vanillajs"),
        new Framework("vidom-v0.3.6"),
        new Framework("vue-v1.0.26")
    };
    
    private final static Bench[] benches = new Bench[] {
    	new BenchRun(),
    	new BenchReplaceAll(),
    	new BenchUpdate(),
    	new BenchSelect(),
    	new BenchRemove(),
        new BenchSwapRows(),
    	new BenchRunBig(),
    	new BenchAppendToManyRows(),
    	new BenchClear(),
    	new BenchClear2nd(),
    	new BenchReadyMemory(),
    	new BenchRunMemory()
    };

    public static int BINARY_VERSION = 0;
    
    private static class BenchRun extends AbstractCPUBench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            wait.until(ExpectedConditions.elementToBeClickable(By.id("add")));
        }

        public void test(WebDriver driver) {
            WebElement element = driver.findElement(By.id("add"));
            element.click();
        }

        public String getName() {
            return "create rows";
        }
        public String getDescription() {
            return "Duration for creating 1000 rows after the page loaded.";
        }
        public String getPath() {
            return "01_run1k";
        }
    }

    private static class BenchReplaceAll extends AbstractCPUBench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            for (int i = 0; i< WARMUP_COUNT; i++) {
                driver.findElement(By.id("run")).click();
                wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            }
        }

        public void test(WebDriver driver) {
            WebElement element = driver.findElement(By.id("run"));
            element.click();
        }

        public String getName() {
            return "replace all rows";
        }
        public String getDescription() {
            return "Duration for updating all 1000 rows of the table (with "+WARMUP_COUNT+" warmup iterations).";
        }
        
        public String getPath() {
            return "02_replace1k";
        }
    }

    private static class BenchUpdate extends AbstractCPUBench {
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

        public void test(WebDriver driver) {
            driver.findElement(By.id("update")).click();
        }

        public String getName() {
            return "partial update";
        }
        public String getDescription() {
            return "Time to update the text of every 10th row (with "+WARMUP_COUNT+" warmup iterations).";
        }
        public String getPath() {
            return "03_update10th1k";
        }
    }

    private static class BenchSelect extends AbstractCPUBench {
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

        public void test(WebDriver driver) {
            WebElement element = driver.findElement(By.xpath("//tbody/tr[1]/td[2]/a"));
            element.click();
        }

        public String getName() {
            return "select row";
        }
        public String getDescription() {
            return "Duration to highlight a row in response to a click on the row. (with "+WARMUP_COUNT+" warmup iterations).";
        }
        public String getPath() {
            return "04_select1k";
        }
    }

    private static class BenchSwapRows extends AbstractCPUBench {
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

        public void test(WebDriver driver) {
            driver.findElement(By.id("swaprows")).click();
        }

        public String getName() {
            return "swap rows";
        }
        public String getDescription() {
            return "Time to swap 2 rows on a 1K table. (with "+WARMUP_COUNT+" warmup iterations).";
        }

        public String getPath() { return "05_swap1k"; }
    }

    private static class BenchRemove extends AbstractCPUBench {
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

        public void test(WebDriver driver) {
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = driver.findElement(By.xpath("//tbody/tr[1]/td[3]/a"));
            element.click();
        }

        public String getName() {
            return "remove row";
        }
        public String getDescription() {
            return "Duration to remove a row. (with "+WARMUP_COUNT+" warmup iterations).";
        }

        public String getPath() {
            return "06_remove-one-1k";
        }
    }

    private static class BenchRunBig extends AbstractCPUBench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            wait.until(ExpectedConditions.elementToBeClickable(By.id("runlots")));
        }

        public void test(WebDriver driver) {
            driver.findElement(By.id("runlots")).click();
        }

        public String getName() {
            return "create many rows";
        }
        public String getDescription() {
            return "Duration to create 10,000 rows";
        }

        public String getPath() {
            return "07_create10k";
        }
    }

    private static class BenchAppendToManyRows extends AbstractCPUBench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("runlots")));
            element.click();

            wait.until(ExpectedConditions.elementToBeClickable(By.id("add")));
        }

        public void test(WebDriver driver) {
            driver.findElement(By.id("add")).click();
        }

        public String getName() {
            return "append rows to large table";
        }

        @Override
        public String getDescription() {
            return "Duration for adding 1000 rows on a table of 10,000 rows.";
        }

        public String getPath() {
            return "08_create1k-after10k";
        }
    }
    
    private static class BenchClear extends AbstractCPUBench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("runlots")));
            element.click();
            
            wait.until(ExpectedConditions.elementToBeClickable(By.id("clear")));
        }

        public void test(WebDriver driver) {
            driver.findElement(By.id("clear")).click();
        }

        public String getName() {
            return "clear rows";
        }
        public String getDescription() {
            return "Duration to clear the table filled with 10.000 rows.";
        }

        public String getPath() {
            return "09_clear10k";
        }
    }
    
    private static class BenchClear2nd extends AbstractCPUBench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("runlots")));
            element.click();
            WebElement row = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//tbody/tr[1]/td[2]/a")));
            element = wait.until(ExpectedConditions.elementToBeClickable(By.id("clear")));
            element.click();

            element = wait.until(ExpectedConditions.elementToBeClickable(By.id("runlots")));
            element.click();
            row = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//tbody/tr[1]/td[2]/a")));
        }

        public void test(WebDriver driver) {
            driver.findElement(By.id("clear")).click();
        }

        public String getName() {
            return "clear rows a 2nd time";
        }
        public String getDescription() {
            return "Time to clear the table filled with 10.000 rows. But warmed up with only one iteration.";
        }

        public String getPath() {
            return "10_clear-2nd-time10k";
        }
    }
    
    private static class BenchReadyMemory extends AbstractMemoryBench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
        }

        public void test(WebDriver driver) {
        }

        public String getName() {
            return "ready memory";
        }
        public String getDescription() {
            return "Memory usage after page load.";
        }

        public String getPath() {
            return "21_" + this.getName().replaceAll("(\\s+)", "-");
        }
    }
    
    private static class BenchRunMemory extends AbstractMemoryBench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
        }

        public void test(WebDriver driver) {
        	WebElement element = driver.findElement(By.id("run"));
            element.click();
        }

        public String getName() {
            return "run memory";
        }
        public String getDescription() {
            return "Memory usage after adding 1000 rows.";
        }

        public String getPath() {
            return "22_" + this.getName().replaceAll("(\\s+)", "-");
        }
    }

    private void runTests() throws Exception {

        DesiredCapabilities cap = setUp();

		int length = REPEAT_RUN;
		for (Framework framework : frameworks) {
			System.out.println(framework.framework);
			
			for (Bench bench : benches) {
				System.out.println(bench.getName());
				
				ChromeDriver driver = new ChromeDriver(cap);
				
				try {
					double[] data = new double[length];
					double lastWait = 1000;
					
					for (int i = 0; i < length; i++) {
						Double time = bench.run(driver, framework, lastWait);
						if (time != null) {
							data[i] = time.doubleValue();
							lastWait = data[i];
						}
					}
					
					System.out.println("before "+Arrays.toString(data));
					if (DROP_WORST_RUN>0) {
						Arrays.sort(data);
						data = Arrays.copyOf(data, data.length-DROP_WORST_RUN);
						System.out.println("after "+Arrays.toString(data));
					}
					
					writeSummary(framework.framework, bench, data);
				}
				catch(Exception ex) {
					System.err.println(ex);
				}
				finally {
					driver.quit();
				}
			}
		}
    }
    
    private void writeSummary(String framework, Bench bench, double[] data) throws IOException {
    	NumberFormat nf = NumberFormat.getInstance(Locale.ENGLISH);
        nf.setMaximumFractionDigits(2);
        nf.setMinimumFractionDigits(2);
        nf.setGroupingUsed(false);
        
        if (!Files.exists(Paths.get("results"))) {
            Files.createDirectories(Paths.get("results"));
        }
        
        SummaryStatistics summary = new SummaryStatistics();
        for (int i = 0; i < data.length; i++) {
        	summary.addValue(data[i]);
        }
        
        StringBuilder line = new StringBuilder();
        line.append("{");
        line.append("\n\t\"framework\": \"").append(framework).append("\"");
        line.append(",\n\t\"benchmark\": \"").append(bench.getName()).append("\"");
        line.append(",\n\t\"description\": \"").append(bench.getDescription()).append("\"");
        line.append(",\n\t\"type\": \"").append(bench.getType()).append("\"");
        line.append(",\n\t\"min\": ").append(nf.format(summary.getMin()));
        line.append(",\n\t\"max\": ").append(nf.format(summary.getMax()));
        line.append(",\n\t\"mean\": ").append(nf.format(summary.getMean()));
        line.append(",\n\t\"geometricMean\": ").append(nf.format(summary.getGeometricMean()));
        line.append(",\n\t\"quadraticMean\": ").append(nf.format(summary.getQuadraticMean()));
        line.append(",\n\t\"standardDeviation\": ").append(nf.format(summary.getStandardDeviation()));
        line.append("\n}");
        System.out.println(line.toString());
        
        Files.write(Paths.get("results", framework + "_" + bench.getPath() + ".json"), line.toString().getBytes("utf-8"));
        
        System.out.println("==== Results for " + framework + "_" + bench.getPath() + " written to results directory");
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
        options.addArguments("--js-flags=--expose-gc");
        cap.setCapability(ChromeOptions.CAPABILITY, options);

        return cap;
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
