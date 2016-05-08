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

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.*;
import org.openqa.selenium.logging.*;
import org.openqa.selenium.remote.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import org.apache.commons.math3.stat.descriptive.SummaryStatistics;

public class App {
	
    private final static String BINARY = "/Applications/Chromium.app/Contents/MacOS/Chromium";
    //private final static String BINARY = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    //private final static String BINARY = "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary";
    private final static int REPEAT_RUN = 10;
    private final static int WARMUP_COUNT = 5;
    private final static int DROP_WORST_RUN = 4;

    private final static Framework frameworks[] = {
    	new Framework("angular-v1.5.3"),
    	new Framework("angular-v2.0.0-beta.15"),
    	new Framework("aurelia"),
    	new Framework("cyclejs-v6.0.3"),
        new Framework("ember", "ember/dist"),
        new Framework("inferno-v0.7.6"),
    	new Framework("mithril-v0.2.4"),
    	new Framework("plastiq-v1.28.0"),
        new Framework("plastiq-v1.30.0"),
    	new Framework("preact-v2.8.3"),
    	new Framework("ractive-v0.7.3"),
    	new Framework("react-v0.14.8"),
    	new Framework("react-v15.0.1"),
    	new Framework("react-lite-v0.0.18"),
    	new Framework("react-lite-v0.15.9"),
    	new Framework("tsers-v1.0.0"),
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
    	new BenchRecycle(),
    	new BenchReadyMemory(),
    	new BenchRunMemory()
    };

    public static int BINARY_VERSION = 0;
    
    private static class BenchRun extends AbstractCPUBench {
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
            return "create 1000 rows";
        }
        
        public String getPath() {
            return "01_create1k";
        }
    }

    private static class BenchRunHot extends AbstractCPUBench {
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
            return "update 1000 rows (hot)";
        }
        
        public String getPath() {
            return "02_run1k-hot";
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
        
        public String getPath() {
            return "03_" + this.getName().replaceAll("(\\s+)", "-");
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
        
        public String getPath() {
            return "04_" + this.getName().replaceAll("(\\s+)", "-");
        }
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
            WebElement element = driver.findElement(By.xpath("//tbody/tr[1]/td[3]/a"));
            element.click();
        }

        public String getName() {
            return "remove row";
        }
        
        public String getPath() {
            return "05_" + this.getName().replaceAll("(\\s+)", "-");
        }
    }
    
    private static class BenchHideAll extends AbstractCPUBench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            element.click();
            
            wait.until(ExpectedConditions.elementToBeClickable(By.id("hideall")));
        }

        public void test(WebDriver driver) {
           driver.findElement(By.id("hideall")).click();
        }

        public String getName() {
            return "hide all";
        }
        
        public String getPath() {
            return "06_" + this.getName().replaceAll("(\\s+)", "-");
        }
    }
    
    private static class BenchShowAll extends AbstractCPUBench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            element.click();
            element = wait.until(ExpectedConditions.elementToBeClickable(By.id("hideall")));
            element.click();
            
            wait.until(ExpectedConditions.elementToBeClickable(By.id("showall")));
        }

        public void test(WebDriver driver) {
           driver.findElement(By.id("showall")).click();
        }

        public String getName() {
            return "show all";
        }
        
        public String getPath() {
            return "07_" + this.getName().replaceAll("(\\s+)", "-");
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
            return "create lots of rows";
        }
        
        public String getPath() {
            return "08_create10k";
        }
    }
    
    private static class BenchRunBigHot extends AbstractCPUBench {
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
            return "add 1000 rows after lots of rows";
        }
        
        public String getPath() {
            return "09_create1k-after10k";
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
        
        public String getPath() {
            return "10_" + this.getName().replaceAll("(\\s+)", "-");
        }
    }
    
    private static class BenchClearHot extends AbstractCPUBench {
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

        public void test(WebDriver driver) {
            driver.findElement(By.id("clear")).click();
        }

        public String getName() {
            return "clear rows a 2nd time";
        }
        
        public String getPath() {
            return "11_clear-rows-2nd-time";
        }
    }
    
    private static class BenchSelectBig extends AbstractCPUBench {
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

        public void test(WebDriver driver) {
            WebElement element = driver.findElement(By.xpath("//tbody/tr[1]/td[2]/a"));
            element.click();
        }

        public String getName() {
            return "select row on big list";
        }
        
        public String getPath() {
            return "12_select-row-10k";
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
        
        public String getPath() {
            return "13_" + this.getName().replaceAll("(\\s+)", "-");
        }
    }
    
    private static class BenchRecycle extends AbstractCPUBench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            element.click();
            
            element = wait.until(ExpectedConditions.elementToBeClickable(By.id("clear")));
            element.click();
            
            wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
        }

        public void test(WebDriver driver) {
            driver.findElement(By.id("run")).click();
        }

        public String getName() {
            return "recycle rows";
        }
        
        public String getPath() {
            return "14_" + this.getName().replaceAll("(\\s+)", "-");
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
        
        public String getPath() {
            return "15_" + this.getName().replaceAll("(\\s+)", "-");
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
        
        public String getPath() {
            return "16_" + this.getName().replaceAll("(\\s+)", "-");
        }
    }

    private void runTests() throws Exception {

        DesiredCapabilities cap = setUp();

		int length = REPEAT_RUN;
		for (Framework framework : frameworks) {
			System.out.println(framework);
			
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
