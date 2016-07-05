package net.stefankrause;

import org.json.JSONObject;
import org.openqa.selenium.chrome.ChromeDriver;

import java.util.Arrays;
import java.util.List;

public abstract class Bench {
	public abstract Double run(ChromeDriver driver, Framework framework, double lastWait) throws Exception;
	public abstract String getName();
	public abstract String getDescription();
	public abstract String getPath();
	public abstract String getType();

	public String getAsString(JSONObject root, String path) {
		return getAsStringRec(root, Arrays.asList(path.split("\\.")));
	}

	public double getAsDouble(JSONObject root, String path) {
		Double r = getAsDoubleRec(root, Arrays.asList(path.split("\\.")));
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

	public Double getAsDoubleRec(JSONObject root, List<String> path) {
		JSONObject obj = root;
		if (!root.has(path.get(0)))
			return null;

		if (path.size()==1) {
			return Double.valueOf(root.getDouble(path.get(0)));
		} else {
			return getAsDoubleRec(root.getJSONObject(path.get(0)), path.subList(1, path.size()));
		}
	}
}