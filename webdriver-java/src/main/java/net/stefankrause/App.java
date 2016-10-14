package net.stefankrause;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.NumberFormat;
import java.util.*;
import java.util.logging.Level;
import java.util.regex.Pattern;

import com.google.common.base.Predicate;
import jdk.nashorn.internal.runtime.regexp.RegExp;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.*;
import org.openqa.selenium.logging.*;
import org.openqa.selenium.remote.*;
import org.openqa.selenium.support.ui.ExpectedCondition;
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

    private static Framework f(String name) {
        return new Framework(name);
    }
    private static Framework f(String name, String url) {
        return new Framework(name, url);
    }

    private final static Framework frameworks[] = {
            f("angular-v1.5.8"),
            f("angular-v2.0.0"),
            f("aurelia-v1.0.3", "aurelia-v1.0.3/dist"),
            f("bobril-v4.44.1"),
            f("cyclejs-v7.0.0"),
            f("domvm-v1.2.10"),
            f("elm-v0.17.1"),
            f("inferno-v1.0.0-alpha7"),
            f("kivi-v1.0.0-rc0"),
            f("mithril-v0.2.5"),
            f("mithril-v1.0.0-alpha"),
            f("plastiq-v1.33.0"),
            f("preact-v6.0.2"),
            f("ractive-v0.7.3"),
            f("ractive-edge"),
            f("react-lite-v0.15.17"),
            f("react-v15.3.1"),
            f("react-v15.3.1-mobX-v2.5.0"),
            f("react-v15.3.2-redux-v3.6.0"),
            f("riot-v2.6.1"),
            f("tsers-v1.0.0"),
            f("vanillajs"),
            f("vidom-v0.3.18"),
            f("vue-v1.0.26"),
            f("vue-v2.0.0-beta1")
    };

    private final static Bench[] benches = new Bench[] {
    	new BenchRun(),
    	new BenchReplaceAll(),
    	new BenchUpdate(),
    	new BenchSelect(),
        new BenchSwapRows(),
    	new BenchRemove(),
    	new BenchRunBig(),
    	new BenchAppendToManyRows(),
    	new BenchClear(),
    	new BenchClear2nd(),
    	new BenchReadyMemory(),
    	new BenchRunMemory()
    };

    public static ExpectedCondition<Boolean> textContains(final By locator, final String value) {
        return new ExpectedCondition<Boolean>() {
            private String currentValue = null;

            public Boolean apply(WebDriver driver) {
                try {
                    this.currentValue = driver.findElement(locator).getText();
                    return Boolean.valueOf(this.currentValue.contains(value));
                } catch (Exception var3) {
                    return Boolean.valueOf(false);
                }
            }

            public String toString() {
                return String.format("text to be contained pattern \"%s\". Current text: \"%s\"", new Object[]{value, this.currentValue});
            }
        };
    }
    public static ExpectedCondition<Boolean> classContains(final By locator, final String value) {
        return new ExpectedCondition<Boolean>() {
            private String currentValue = null;

            public Boolean apply(WebDriver driver) {
                try {
                    this.currentValue = driver.findElement(locator).getAttribute("class");
                    return Boolean.valueOf(this.currentValue.contains(value));
                } catch (Exception var3) {
                    return Boolean.valueOf(false);
                }
            }

            public String toString() {
                return String.format("class name to be contained pattern \"%s\". Current text: \"%s\"", new Object[]{value, this.currentValue});
            }
        };
    }

    public static void testElementById(WebDriver driver, String id) {
        WebDriverWait wait = new WebDriverWait(driver, 10);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id(id)));
    }

    public static void clickElementById(WebDriver driver, String id) {
        WebDriverWait wait = new WebDriverWait(driver, 10);
        driver.findElement(By.id(id)).click();
    }

    public static void clickElementByXPath(WebDriver driver, String xpath) {
        WebDriverWait wait = new WebDriverWait(driver, 10);
        driver.findElement(By.xpath(xpath)).click();
    }

    public static void testElementLocatedByXpath(WebDriver driver, String xpath) {
        WebDriverWait wait = new WebDriverWait(driver, 10);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(xpath)));
    }

    public static void testElementNotLocatedByXPath(WebDriver driver, String xpath) {
        WebDriverWait wait = new WebDriverWait(driver, 10);
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.xpath(xpath)));
    }

    public static void testTextContains(WebDriver driver, String xpath, String value) {
        WebDriverWait wait = new WebDriverWait(driver, 10);
        wait.until(textContains(By.xpath(xpath), value));
    }

    public static void testTextContainsNot(WebDriver driver, String xpath, String value) {
        WebDriverWait wait = new WebDriverWait(driver, 10);
        wait.until(ExpectedConditions.not(textContains(By.xpath(xpath), value)));
    }

    public static void testClassContains(WebDriver driver, String xpath, String className) {
        WebDriverWait wait = new WebDriverWait(driver, 10);
        wait.until(classContains(By.xpath(xpath), className));
    }

    public static String getTextByXPath(WebDriver driver, String xpath) {
        return driver.findElement(By.xpath(xpath)).getText();
    }


    public static int BINARY_VERSION = 0;

    private static class BenchRun extends AbstractCPUBench {
        public void init(WebDriver driver, String url) {
            driver.get("localhost:8080/" + url + "/");
            testElementById(driver, "add");
        }

        public void test(WebDriver driver) {
            clickElementById(driver, "add");
            testElementLocatedByXpath(driver,"//tbody/tr[1000]/td[2]/a");
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
            testElementById(driver, "run");
            for (int i = 0; i< WARMUP_COUNT; i++) {
                clickElementById(driver, "run");
            }
        }

        public void test(WebDriver driver) {
            clickElementById(driver,"run");
            testTextContains(driver,"//tbody/tr[1]/td[1]","5001");
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
            testElementById(driver, "run");
            clickElementById(driver,"run");
            for (int i = 0; i< WARMUP_COUNT; i++) {
                clickElementById(driver,"update");
            }
        }

        public void test(WebDriver driver) {
            StringBuilder str = new StringBuilder();
            for (int i=0;i<WARMUP_COUNT+1;i++)
                str.append(" !!!");
            String expected = str.toString();
            clickElementById(driver,"update");
            testTextContains(driver,"//tbody/tr[1]/td[2]/a", expected);
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
            testElementById(driver, "run");
            clickElementById(driver,"run");
            testElementLocatedByXpath(driver, "//tbody/tr[1]/td[2]/a");
            for (int i=0;i<WARMUP_COUNT;i++) {
                clickElementByXPath(driver,"//tbody/tr["+(i+1)+"]/td[2]/a");
            }
        }

        public void test(WebDriver driver) {
            clickElementByXPath(driver,"//tbody/tr[2]/td[2]/a");
            testClassContains(driver,"//tbody/tr[2]", "danger");
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
            testElementById(driver, "run");
            clickElementById(driver,"run");
            testElementLocatedByXpath(driver,"//tbody/tr[1]/td[2]/a");
            for (int i = 0; i< WARMUP_COUNT; i++) {
                String val = getTextByXPath(driver,"//tbody/tr[5]/td[2]/a");
                clickElementById(driver,"swaprows");
                testTextContains(driver,"//tbody/tr[10]/td[2]/a", val);
            }
        }

        public void test(WebDriver driver) {
            String text = getTextByXPath(driver,"//tbody/tr[5]/td[2]/a");
            clickElementById(driver,"swaprows");
            testTextContains(driver,"//tbody/tr[10]/td[2]/a", text);
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
            testElementById(driver, "run");
            clickElementById(driver,"run");
            for (int i = 0; i< WARMUP_COUNT; i++) {
                clickElementByXPath(driver, "//tbody/tr["+(WARMUP_COUNT-i+4)+"]/td[3]/a");
            }
        }

        public void test(WebDriver driver) {
            String text = getTextByXPath(driver, "//tbody/tr[4]/td[2]/a");
            clickElementByXPath(driver, "//tbody/tr[4]/td[3]/a");
            testTextContainsNot(driver, "//tbody/tr[4]/td[2]/a", text);
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
            testElementById(driver, "runlots");
        }

        public void test(WebDriver driver) {
            clickElementById(driver, "runlots");
            testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a");
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
            testElementById(driver, "runlots");
            clickElementById(driver, "runlots");
            testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a");
        }

        public void test(WebDriver driver) {
            clickElementById(driver, "add");
            testElementLocatedByXpath(driver, "//tbody/tr[11000]/td[2]/a");
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
            testElementById(driver, "runlots");
            clickElementById(driver, "runlots");
            testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a");
        }

        public void test(WebDriver driver) {
            clickElementById(driver, "clear");
            testElementNotLocatedByXPath(driver, "//tbody/tr[1]");
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
            testElementById(driver, "runlots");
            clickElementById(driver, "runlots");
            testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a");
            clickElementById(driver, "clear");
            testElementNotLocatedByXPath(driver, "//tbody/tr[1]");
            clickElementById(driver, "runlots");
            testElementLocatedByXpath(driver, "//tbody/tr[10000]/td[2]/a");
        }

        public void test(WebDriver driver) {
            clickElementById(driver, "clear");
            testElementNotLocatedByXPath(driver, "//tbody/tr[1]");
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
            testElementById(driver, "add");
        }

        public void test(WebDriver driver) {
            testElementNotLocatedByXPath(driver, "//tbody/tr[1]");
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
            testElementById(driver, "add");
        }

        public void test(WebDriver driver) {
            clickElementById(driver, "add");
            testElementLocatedByXpath(driver,"//tbody/tr[1000]/td[2]/a");
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

					for (int i = 0; i < length; i++) {
						Double time = bench.run(driver, framework);
						if (time != null) {
							data[i] = time.doubleValue();
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

        System.setProperty("webdriver.chrome.driver", "node_modules/chromedriver/lib/chromedriver/chromedriver");
        App test = new App();
        test.runTests();
    }

}
