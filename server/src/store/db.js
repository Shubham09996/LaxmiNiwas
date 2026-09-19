import { initialDossiers, initialApiKeys, initialAuditLogs, initialMetrics } from './seedData.js';
import { SERVICES_CATALOG } from '../config/constants.js';

class InMemoryDatabase {
  constructor() {
    this.dossiers = [...initialDossiers];
    this.apiKeys = [...initialApiKeys];
    this.auditLogs = [...initialAuditLogs];
    this.services = [...SERVICES_CATALOG];
    this.metrics = { ...initialMetrics };
  }

  // Dossier Methods
  getDossiers({ type, status, search, limit = 50, offset = 0 } = {}) {
    let result = [...this.dossiers];

    if (type && type !== 'ALL') {
      result = result.filter(d => d.type === type);
    }

    if (status && status !== 'ALL') {
      result = result.filter(d => d.status === status);
    }

    if (search) {
      const q = search.toLowerCase().trim();
      result = result.filter(d => 
        (d.id && d.id.toLowerCase().includes(q)) ||
        (d.refId && d.refId.toLowerCase().includes(q)) ||
        (d.entityName && d.entityName.toLowerCase().includes(q)) ||
        (d.entityIdentifier && d.entityIdentifier.toLowerCase().includes(q)) ||
        (d.serviceTitle && d.serviceTitle.toLowerCase().includes(q))
      );
    }

    // Sort descending by timestamp
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const total = result.length;
    const paginated = result.slice(Number(offset), Number(offset) + Number(limit));

    return { total, dossiers: paginated };
  }

  getDossierById(id) {
    return this.dossiers.find(d => d.id === id || d.refId === id);
  }

  addDossier(dossier) {
    this.dossiers.unshift(dossier);
    this.metrics.totalVerifications += 1;
    
    // Log to audit
    this.addAuditLog({
      action: 'VERIFICATION_EXECUTED',
      service: dossier.serviceTitle,
      entity: `${dossier.entityName} (${dossier.entityIdentifier})`,
      actor: dossier.actor || 'User Interactive',
      status: dossier.status === 'FAILED' ? 'FAILED' : 'SUCCESS',
      ipAddress: dossier.ipAddress || '127.0.0.1',
      details: `Generated certified dossier ${dossier.id} (${dossier.refId}). Trust score: ${dossier.trustScore}%`
    });

    return dossier;
  }

  // Services Catalog
  getServices() {
    return this.services;
  }

  getServiceById(id) {
    return this.services.find(s => s.id === id || s.code === id);
  }

  // API Keys
  getApiKeys() {
    return this.apiKeys;
  }

  createApiKey({ name, environment, rateLimitRps = 100, permissions = ['ALL_SERVICES'], webhookUrl }) {
    const isLive = environment === 'LIVE';
    const prefix = isLive ? 'lxm_live_' : 'lxm_test_';
    const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const key = `${prefix}${randomHex}`;
    const masked = `${prefix}••••••••••••${randomHex.slice(-4)}`;

    const newKey = {
      id: `key-${Date.now()}`,
      name,
      environment: environment || 'SANDBOX',
      keyPrefix: prefix,
      maskedKey: masked,
      rawKeyPreview: key,
      status: 'ACTIVE',
      createdDate: new Date().toISOString(),
      lastUsed: 'Never',
      rateLimitRps: Number(rateLimitRps),
      permissions,
      webhookUrl: webhookUrl || ''
    };

    this.apiKeys.unshift(newKey);

    this.addAuditLog({
      action: 'API_KEY_CREATED',
      service: 'API Key Gateway',
      entity: `${name} (${environment})`,
      actor: 'Admin User',
      status: 'SUCCESS',
      ipAddress: '127.0.0.1',
      details: `Generated new ${environment} API Key credentials with ${rateLimitRps} RPS rate limit.`
    });

    return newKey;
  }

  revokeApiKey(id) {
    const key = this.apiKeys.find(k => k.id === id);
    if (key) {
      key.status = 'REVOKED';
      this.addAuditLog({
        action: 'API_KEY_REVOKED',
        service: 'API Key Gateway',
        entity: `${key.name} (${key.environment})`,
        actor: 'Admin User',
        status: 'SUCCESS',
        ipAddress: '127.0.0.1',
        details: `Revoked API Key ${key.maskedKey}.`
      });
      return true;
    }
    return false;
  }

  // Audit Logs
  getAuditLogs({ limit = 50, offset = 0, search } = {}) {
    let result = [...this.auditLogs];

    if (search) {
      const q = search.toLowerCase().trim();
      result = result.filter(l =>
        l.action.toLowerCase().includes(q) ||
        l.service.toLowerCase().includes(q) ||
        l.entity.toLowerCase().includes(q) ||
        l.actor.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return {
      total: result.length,
      logs: result.slice(Number(offset), Number(offset) + Number(limit))
    };
  }

  addAuditLog(log) {
    const fullLog = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    this.auditLogs.unshift(fullLog);
    return fullLog;
  }

  // Metrics
  getMetrics() {
    return {
      ...this.metrics,
      totalDossiersCount: this.dossiers.length,
      recentCertifications: this.dossiers.slice(0, 5)
    };
  }
}

export const db = new InMemoryDatabase();
