package com.pragyashield.insurance.ai;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MockGenerativeAiClient implements AiProviderClient {
    @Override
    public AiProviderResponse complete(AiProviderRequest request) {
        String contextSummary = String.join(" | ", request.retrievedContext());
        String text = "Generated with governed mock LLM. "
                + "Role=" + request.role()
                + "; groundedContext=" + contextSummary
                + "; answerStyle=explainable, auditable, production-safe. "
                + "Use this response as a deterministic local replacement for OpenAI/Azure OpenAI/Gemini integration.";
        int promptTokens = Math.max(20, request.systemPrompt().length() / 4 + request.userPrompt().length() / 4);
        int completionTokens = Math.max(30, text.length() / 4);
        return new AiProviderResponse("mock-ai-provider", "astraclaim-domain-llm-v2", text, promptTokens, completionTokens, 96,
                List.of("PII_FILTERED", "RAG_GROUNDED", "NO_FINAL_LEGAL_DECISION"));
    }
}
