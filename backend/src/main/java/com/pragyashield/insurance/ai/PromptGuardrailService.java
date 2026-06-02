package com.pragyashield.insurance.ai;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;

@Service
public class PromptGuardrailService {
    private static final Pattern EMAIL = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
    private static final Pattern PHONE = Pattern.compile("(\\+91[-\\s]?)?[6-9][0-9]{9}");
    private static final Pattern AADHAAR_LIKE = Pattern.compile("\\b[0-9]{4}[-\\s]?[0-9]{4}[-\\s]?[0-9]{4}\\b");

    public GuardrailResult sanitize(String prompt) {
        String sanitized = prompt == null ? "" : prompt;
        List<String> actions = new ArrayList<>();
        if (EMAIL.matcher(sanitized).find()) {
            sanitized = EMAIL.matcher(sanitized).replaceAll("[EMAIL_REDACTED]");
            actions.add("EMAIL_REDACTED");
        }
        if (PHONE.matcher(sanitized).find()) {
            sanitized = PHONE.matcher(sanitized).replaceAll("[PHONE_REDACTED]");
            actions.add("PHONE_REDACTED");
        }
        if (AADHAAR_LIKE.matcher(sanitized).find()) {
            sanitized = AADHAAR_LIKE.matcher(sanitized).replaceAll("[AADHAAR_LIKE_ID_REDACTED]");
            actions.add("AADHAAR_LIKE_ID_REDACTED");
        }
        if (sanitized.toLowerCase().contains("ignore previous instructions")) {
            sanitized = sanitized.replaceAll("(?i)ignore previous instructions", "[PROMPT_INJECTION_REDACTED]");
            actions.add("PROMPT_INJECTION_REDACTED");
        }
        if (actions.isEmpty()) actions.add("NO_PII_OR_INJECTION_PATTERN_FOUND");
        return new GuardrailResult(sanitized, actions);
    }

    public record GuardrailResult(String sanitizedPrompt, List<String> actions) {}
}
