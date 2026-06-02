import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AiChatIntent, UserRole } from '../models/models';

export interface AstraClaimChatRequest {
  conversationId?: string;
  role: UserRole;
  prompt: string;
  runtimeMode: 'RAG + Tool Calling' | 'Rules Fallback' | 'Governance Mode';
  contextTags: string[];
}

export interface AstraClaimToolTraceDto {
  toolName: string;
  status: string;
  latencyMs: number;
  outputSummary: string;
}

export interface AstraClaimChatResponse {
  conversationId: string;
  chatbotName: string;
  intent: AiChatIntent;
  confidence: number;
  answer: string;
  retrievalContext: string[];
  suggestedActions: string[];
  guardrails: string[];
  toolTraces: AstraClaimToolTraceDto[];
  auditReference: string;
  respondedAt: string;
}

@Injectable({ providedIn: 'root' })
export class AstraClaimApiService {
  private readonly baseUrl = `${environment.apiUrl}/ai/astraclaim`;

  constructor(private http: HttpClient) {}

  chat(request: AstraClaimChatRequest): Observable<AstraClaimChatResponse> {
    return this.http.post<AstraClaimChatResponse>(`${this.baseUrl}/chat`, request);
  }

  technicalProfile(): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(`${this.baseUrl}/profile`);
  }
}
