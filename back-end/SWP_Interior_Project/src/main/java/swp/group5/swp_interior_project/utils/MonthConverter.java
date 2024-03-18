package swp.group5.swp_interior_project.utils;

import java.time.Month;
import java.util.HashMap;
import java.util.Map;

public class MonthConverter {
    
    private static final Map<Integer, String> monthMap;
    
    static {
        monthMap = new HashMap<>();
        for (Month month : Month.values()) {
            monthMap.put(month.getValue(), month.toString());
        }
    }
    
    public static String convertToMonthName(int month) {
        return monthMap.getOrDefault(month, "");
    }
}
