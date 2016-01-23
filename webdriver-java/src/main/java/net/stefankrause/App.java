package net.stefankrause;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.OpenOption;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
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

    public final static int REPEAT_RUN = 5;

    public interface Bench {
        void init(WebDriver driver, String framework);
        void run(WebDriver driver, String framework);
        String getName();
    }

    private static class BenchRun implements Bench {
        public void init(WebDriver driver, String framework) {
            driver.get("localhost:8080/" + framework + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
        }

        public void run(WebDriver driver, String framework) {
            WebElement element = driver.findElement(By.id("run"));
            element.click();
        }

        public String getName() {
            return "create 1000 rows";
        }
    }

    private static class BenchRunHot implements Bench {
        public void init(WebDriver driver, String framework) {
            driver.get("localhost:8080/" + framework + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            for (int i=0;i<5;i++) {
                driver.findElement(By.id("run")).click();
                element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            }
        }

        public void run(WebDriver driver, String framework) {
            WebElement element = driver.findElement(By.id("run"));
            element.click();
        }

        public String getName() {
            return "update 1000 rows (hot)";
        }
    }

    private static class BenchUpdate implements Bench {
        public void init(WebDriver driver, String framework) {
            driver.get("localhost:8080/" + framework + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            element.click();
            for (int i=0;i<5;i++) {
                driver.findElement(By.id("update")).click();
                element = wait.until(ExpectedConditions.elementToBeClickable(By.id("update")));
            }
        }

        public void run(WebDriver driver, String framework) {
            driver.findElement(By.id("update")).click();
        }

        public String getName() {
            return "partial update";
        }
    }

    private static class BenchSelect implements Bench {
        public void init(WebDriver driver, String framework) {
            driver.get("localhost:8080/" + framework + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            element.click();
            for (int i=0;i<5;i++) {
                element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//tbody/tr["+(i+1)+"]/td[2]/a")));
                element.click();
            }
        }

        public void run(WebDriver driver, String framework) {
            WebElement element = driver.findElement(By.xpath("//tbody/tr[1]/td[2]/a"));
            element.click();
        }

        public String getName() {
            return "select row";
        }
    }

    private static class BenchRemove implements Bench {
        public void init(WebDriver driver, String framework) {
            driver.get("localhost:8080/" + framework + "/");
            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
            element.click();
            for (int i=8;i>=3;i--) {
                element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//tbody/tr["+i+"]/td[3]/a")));
                element.click();
            }
        }

        public void run(WebDriver driver, String framework) {
            WebElement element = driver.findElement(By.xpath("//tbody/tr[1]/td[3]/a"));
            element.click();
        }

        public String getName() {
            return "remove row";
        }
    }

    private void runTests() throws Exception {

        DesiredCapabilities cap = setUp();


        String frameworks[] = {"angular", "angular2","aurelia", "ember/dist", "mithril", "ractive", "react",  "vidom", "vue"};
        Bench[] benches = new Bench[] {new BenchRun(), new BenchRunHot(), new BenchUpdate(), new BenchSelect(), new BenchRemove()};
        int length = REPEAT_RUN;
        Table<String, String, DoubleSummaryStatistics> results = HashBasedTable.create();

        for (String framework : frameworks) {
            System.out.println(framework);
            for (Bench bench : benches) {
                System.out.println(bench.getName());
                ChromeDriver driver = new ChromeDriver(cap);
                try {
                    double[] data = new double[length];
                    double lastWait = 1000;
                    for (int i = 0; i < length; i++) {
                        System.out.println(framework+" "+bench.getName()+" => init");
                        bench.init(driver, framework);

                        WebDriverWait wait = new WebDriverWait(driver, 10);
                        WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));

                        Thread.sleep(2000);
                        printLog(driver, false, "aurelia".equals(framework));
                        System.out.println(framework+" "+bench.getName()+" => run");
                        bench.run(driver, framework);
                        System.out.println("run " + bench.getName());

                        element = wait.until(ExpectedConditions.elementToBeClickable(By.id("run")));
                        Thread.sleep(1000 + (int) lastWait);

                        Double res = printLog(driver, true, "aurelia".equals(framework));
                        if (res != null) {
                            data[i] = res.doubleValue();
                            lastWait = data[i];
                        }
                    }
                    DoubleSummaryStatistics stats = DoubleStream.of(data).summaryStatistics();
                    results.put(framework, bench.getName(), stats);
                } finally {
                    driver.quit();
                }
            }
        }

        String labels = Stream.of(benches).map(b -> b.getName()).collect(Collectors.joining("','", "'", "'"));
        StringBuilder str = new StringBuilder("var data = { labels : ["+labels+"], datasets: [");

        for (int i=0;i<frameworks.length;i++) {
            if (i>0) str.append(",");
            str.append(createChartData(i, frameworks[i], benches, results));
        }
        String fin = str + "]};";
        System.out.println("\n"+fin);
        Files.write(Paths.get("chartData.js"), fin.getBytes());

        for (Bench b : benches) {
            System.out.println(b.getName()+":");
            for (String f : frameworks) {
                System.out.println(f+": "+results.get(f, b.getName()));
            }
        }
    }

    private String createChartData(int idx, String framework, Bench[] benches, Table<String, String, DoubleSummaryStatistics> results) {
        int colors[] = {0x00AAA0, 0x8ED2C9, 0x44B3C2, 0xF1A94E, 0xE45641, 0x5D4C46, 0x7B8D8E, 0xF4D00C, 0x462066 };
        int r = (colors[idx % colors.length] >> 16) & 0xff;
        int g = (colors[idx % colors.length] >> 8) & 0xff;
        int b = (colors[idx % colors.length]) & 0xff;

        String data = Stream.of(benches).map(bench -> bench.getName())
                .mapToDouble(benchname -> results.get(framework, benchname).getAverage()).mapToObj(d ->  Double.toString(d))
                .collect(Collectors.joining("','", "'", "'"));
        return "{"
                + "label: '" + framework + "',"
                + "fillColor: 'rgba("+r+", "+g+" ,"+b+", 0.5)',"
                + "strokeColor: 'rgba("+r+", "+g+" ,"+b+", 0.8)',"
                + "highlightFill: 'rgba("+r+", "+g+" , "+b+", 0.7)',"
                + "highlightStroke: 'rgba("+r+", "+g+" ,"+b+", 0.9)',"
                + "data: [" + data + "]"
        +"}";
    }

    public DesiredCapabilities setUp() throws Exception {

        DesiredCapabilities cap = DesiredCapabilities.chrome();
        LoggingPreferences logPrefs = new LoggingPreferences();
        logPrefs.enable(LogType.PERFORMANCE, Level.ALL);
        logPrefs.enable(LogType.BROWSER, Level.ALL);
        cap.setCapability(CapabilityType.LOGGING_PREFS, logPrefs);

        Map<String, Object> perfLogPrefs = new HashMap<String, Object>();
        perfLogPrefs.put("traceCategories", "browser,devtools.timeline,devtools"); // comma-separated trace categories
        ChromeOptions options = new ChromeOptions();
        options.setExperimentalOption("perfLoggingPrefs", perfLogPrefs);
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
        List<PLogEntry> filtered = submitPerformanceResult(logs.get(LogType.PERFORMANCE).getAll(), print);

        Optional<PLogEntry> evt = filtered.stream().filter(pe -> "EventDispatch".equals(pe.getName())).findFirst();
        long tsEvent = evt.map(pe -> pe.ts).orElse(0L);
        // First TimerFire
        Optional<PLogEntry> evtTimer = filtered.stream().filter(pe -> "TimerFire".equals(pe.getName())).filter(pe -> pe.ts > tsEvent).findFirst();
        long tsEventFire = evtTimer.map(pe -> pe.ts).orElse(0L);
        // First Paint afer TimerFire
        long tsAfter = isAurelia ? tsEventFire : tsEvent;
        Optional<PLogEntry> lastPaint = filtered.stream().filter(pe -> "Paint".equals(pe.getName())).
                filter(pe -> pe.ts > tsAfter).findFirst();
//        Optional<PLogEntry> lastPaint = filtered.stream().filter(pe -> "Paint".equals(pe.getName())).reduce((a, b) -> b);

        if (print) System.out.println("************************ filtered");
        filtered.forEach(e -> System.out.println(e));
        if (evt.isPresent() && lastPaint.isPresent()) {
            if (print) System.out.println("Duration "+(lastPaint.get().ts + lastPaint.get().duration - evt.get().ts)/1000.0);
            return (lastPaint.get().ts + lastPaint.get().duration - evt.get().ts)/1000.0;
        }
        return null;

    }

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
                    ;
            }
//            System.out.println(entry);
        }

        return filtered;
    }

    public static void main(String[] argv) throws Exception {
        System.setProperty("webdriver.chrome.driver", "./chromedriver");
        App test = new App();
        test.runTests();
    }

}
