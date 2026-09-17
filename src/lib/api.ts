const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_REMITLYTICS_API_KEY || 'remitlytics_local_dev_key';

export interface Invoice {
  id: string;
  clientId: string;
  clientName?: string;
  amountCents: number;
  platformFeeCents: number | null;
  taxCents: number | null;
  totalCents: number | null;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'ESCALATED' | 'CANCELLED';
  dueDate: string;
  createdAt: string;
}

export interface WebhookEvent {
  id: string;
  tenantId: string;
  eventType: string;
  payload: string;
  targetUrl: string;
  status: 'DELIVERED' | 'FAILED' | 'PENDING';
  attempts: number;
  lastErrorMessage: string | null;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string; // e.g. "remit_live_..."
  status: 'ACTIVE' | 'REVOKED';
  rateLimitReqPerMin: number;
  remainingTokens: number;
  createdAt: string;
  lastUsedAt: string | null;
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log("Fetching from URL:", fullUrl);
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
  }

  return response;
}

export const api = {
  // Fetch all invoices
  async getInvoices(): Promise<Invoice[]> {
    const res = await fetchWithAuth('/invoices');
    return res.json();
  },

  // Create a new draft invoice
  async createInvoice(data: { clientId: string; amountCents: number; dueDate: string }): Promise<Invoice> {
    const res = await fetchWithAuth('/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Download PDF invoice
  async downloadPdf(invoiceId: string): Promise<Blob> {
    const res = await fetchWithAuth(`/invoices/${invoiceId}/pdf`, {
      headers: { Accept: 'application/pdf' },
    });
    return res.blob();
  },

  // Fetch all webhook delivery events
  async getWebhookEvents(): Promise<WebhookEvent[]> {
    const res = await fetchWithAuth('/webhooks');
    return res.json();
  },

  // Retry dispatching a failed webhook event
  async retryWebhookEvent(eventId: string): Promise<WebhookEvent> {
    const res = await fetchWithAuth(`/admin/webhooks/${eventId}/retry`, {
      method: 'POST',
    });
    return res.json();
  },

  // Fetch all tenant API keys
  async getApiKeys(): Promise<ApiKey[]> {
    const res = await fetchWithAuth('/api-keys');
    return res.json();
  },

  // Generate a new tenant API key
  async createApiKey(data: { name: string; rateLimitReqPerMin: number }): Promise<{ apiKey: ApiKey; rawSecret: string }> {
    const res = await fetchWithAuth('/api-keys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Revoke an existing API key
  async revokeApiKey(keyId: string): Promise<void> {
    await fetchWithAuth(`/api-keys/${keyId}`, {
      method: 'DELETE',
    });
  },
  
  async updateInvoiceStatus(
    invoiceId: string, 
    status: Invoice['status'], 
    reason?: string
  ): Promise<Invoice> {
    const res = await fetchWithAuth(`/invoices/${invoiceId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        reason: reason || `Transitioned to ${status} via dashboard UI`,
      }),
    });
    return res.json();
  },

  async processOverdueInvoices(): Promise<{ message: string; processedCount: number }> {
    const res = await fetchWithAuth('/process-overdue', {
      method: 'POST',
    });
    return res.json();
  },
};