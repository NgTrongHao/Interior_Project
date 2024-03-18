package swp.group5.swp_interior_project.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ErrorResponseBuilder {
    
    public static Map<String, Object> buildErrorResponse(
            String userMessage,
            String internalMessage,
            int code,
            List<String> errors
    ) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> error = new HashMap<>();
        error.put("userMessage", userMessage);
        error.put("internalMessage", internalMessage);
        error.put("code", code);
        error.put("errors", errors);
        response.put("error", error);
        return response;
    }
}
