/**
 * Information Classification & Security Framework
 * Task 46: Information Classification & Espionage System
 * 
 * Core system for classifying information into security levels and managing
 * access control, information decay, and strategic value assessment.
 */

export enum SecurityLevel {
  PUBLIC = 'PUBLIC',
  PROPRIETARY = 'PROPRIETARY', 
  CLASSIFIED = 'CLASSIFIED',
  TOP_SECRET = 'TOP_SECRET'
}

export enum InformationType {
  RESEARCH_DATA = 'RESEARCH_DATA',
  TECHNOLOGY_SPECS = 'TECHNOLOGY_SPECS',
  MARKET_INTELLIGENCE = 'MARKET_INTELLIGENCE',
  MILITARY_PLANS = 'MILITARY_PLANS',
  DIPLOMATIC_CABLES = 'DIPLOMATIC_CABLES',
  FINANCIAL_RECORDS = 'FINANCIAL_RECORDS',
  PERSONNEL_FILES = 'PERSONNEL_FILES',
  TRADE_SECRETS = 'TRADE_SECRETS'
}

export interface InformationAsset {
  id: string;
  title: string;
  type: InformationType;
  securityLevel: SecurityLevel;
  content: string;
  sourceOrganization: string;
  targetOrganization?: string;
  strategicValue: number; // 1-100
  reliability: number; // 0-1 (confidence in accuracy)
  freshness: number; // 0-1 (how recent/relevant)
  accessLevel: number; // Required clearance level
  tags: string[];
  createdAt: Date;
  expiresAt?: Date;
  lastAccessed?: Date;
  accessCount: number;
  metadata: {
    acquisitionMethod?: 'espionage' | 'purchase' | 'leak' | 'analysis' | 'intercept';
    acquisitionCost?: number;
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
    verificationStatus?: 'unverified' | 'partially_verified' | 'verified' | 'disputed';
    relatedAssets?: string[]; // IDs of related information
  };
}

export interface AccessRequest {
  id: string;
  requesterId: string;
  requesterOrganization: string;
  assetId: string;
  requestedAt: Date;
  justification: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  approvedBy?: string;
  approvedAt?: Date;
  accessDuration?: number; // minutes
  accessConditions?: string[];
}

export interface IntelligenceReport {
  id: string;
  title: string;
  summary: string;
  assets: string[]; // Information asset IDs
  analysisLevel: 'raw' | 'processed' | 'analyzed' | 'strategic';
  confidence: number; // 0-1
  implications: string[];
  recommendations: string[];
  createdBy: string;
  createdAt: Date;
  distributionList: string[];
  securityLevel: SecurityLevel;
}

export class InformationClassificationService {
  private informationAssets: Map<string, InformationAsset> = new Map();
  private accessRequests: Map<string, AccessRequest> = new Map();
  private intelligenceReports: Map<string, IntelligenceReport> = new Map();

  /**
   * Classify information and assign security level
   */
  classifyInformation(
    title: string,
    content: string,
    type: InformationType,
    sourceOrg: string,
    metadata: any = {}
  ): InformationAsset {
    const securityLevel = this.determineSecurityLevel(content, type, metadata);
    const strategicValue = this.calculateStrategicValue(content, type, securityLevel);
    const accessLevel = this.getRequiredAccessLevel(securityLevel);

    const asset: InformationAsset = {
      id: this.generateAssetId(),
      title,
      type,
      securityLevel,
      content,
      sourceOrganization: sourceOrg,
      strategicValue,
      reliability: metadata.reliability || 0.8,
      freshness: 1.0, // New information is fresh
      accessLevel,
      tags: this.extractTags(content, type),
      createdAt: new Date(),
      accessCount: 0,
      metadata: {
        acquisitionMethod: metadata.acquisitionMethod || 'analysis',
        riskLevel: metadata.riskLevel || 'medium',
        verificationStatus: metadata.verificationStatus || 'unverified',
        ...metadata
      }
    };

    // Set expiration based on information type and security level
    asset.expiresAt = this.calculateExpirationDate(asset);

    this.informationAssets.set(asset.id, asset);
    return asset;
  }

  /**
   * Determine security level based on content analysis
   */
  private determineSecurityLevel(
    content: string, 
    type: InformationType, 
    metadata: any
  ): SecurityLevel {
    // Keywords that indicate higher security levels
    const topSecretKeywords = [
      'nuclear', 'classified', 'top secret', 'eyes only', 'compartmented',
      'strategic weapon', 'intelligence source', 'covert operation'
    ];
    
    const classifiedKeywords = [
      'confidential', 'restricted', 'internal only', 'proprietary technology',
      'military capability', 'diplomatic strategy', 'trade secret'
    ];
    
    const proprietaryKeywords = [
      'patent pending', 'proprietary', 'internal use', 'company confidential',
      'research data', 'prototype', 'competitive advantage'
    ];

    const contentLower = content.toLowerCase();

    // Check for explicit security markings
    if (topSecretKeywords.some(keyword => contentLower.includes(keyword))) {
      return SecurityLevel.TOP_SECRET;
    }
    
    if (classifiedKeywords.some(keyword => contentLower.includes(keyword))) {
      return SecurityLevel.CLASSIFIED;
    }
    
    if (proprietaryKeywords.some(keyword => contentLower.includes(keyword))) {
      return SecurityLevel.PROPRIETARY;
    }

    // Type-based classification
    switch (type) {
      case InformationType.MILITARY_PLANS:
      case InformationType.DIPLOMATIC_CABLES:
        return SecurityLevel.TOP_SECRET;
        
      case InformationType.RESEARCH_DATA:
      case InformationType.TECHNOLOGY_SPECS:
      case InformationType.TRADE_SECRETS:
        return SecurityLevel.CLASSIFIED;
        
      case InformationType.FINANCIAL_RECORDS:
      case InformationType.PERSONNEL_FILES:
        return SecurityLevel.PROPRIETARY;
        
      default:
        return SecurityLevel.PUBLIC;
    }
  }

  /**
   * Calculate strategic value of information
   */
  private calculateStrategicValue(
    content: string,
    type: InformationType,
    securityLevel: SecurityLevel
  ): number {
    let baseValue = 10;

    // Security level multiplier
    switch (securityLevel) {
      case SecurityLevel.TOP_SECRET:
        baseValue *= 5;
        break;
      case SecurityLevel.CLASSIFIED:
        baseValue *= 3;
        break;
      case SecurityLevel.PROPRIETARY:
        baseValue *= 2;
        break;
      case SecurityLevel.PUBLIC:
        baseValue *= 1;
        break;
    }

    // Information type multiplier
    switch (type) {
      case InformationType.MILITARY_PLANS:
      case InformationType.TECHNOLOGY_SPECS:
        baseValue *= 2;
        break;
      case InformationType.RESEARCH_DATA:
      case InformationType.TRADE_SECRETS:
        baseValue *= 1.8;
        break;
      case InformationType.MARKET_INTELLIGENCE:
      case InformationType.FINANCIAL_RECORDS:
        baseValue *= 1.5;
        break;
      default:
        baseValue *= 1;
        break;
    }

    // Content analysis for additional value
    const contentLower = content.toLowerCase();
    const highValueKeywords = [
      'breakthrough', 'revolutionary', 'competitive advantage', 'exclusive',
      'patent', 'prototype', 'strategic', 'critical', 'advanced'
    ];

    const keywordMatches = highValueKeywords.filter(keyword => 
      contentLower.includes(keyword)
    ).length;

    baseValue += keywordMatches * 5;

    // Content length factor (more detailed = more valuable)
    const lengthFactor = Math.min(content.length / 1000, 2);
    baseValue *= (1 + lengthFactor * 0.3);

    return Math.min(Math.round(baseValue), 100);
  }

  /**
   * Get required access level for security classification
   */
  private getRequiredAccessLevel(securityLevel: SecurityLevel): number {
    switch (securityLevel) {
      case SecurityLevel.PUBLIC:
        return 1;
      case SecurityLevel.PROPRIETARY:
        return 3;
      case SecurityLevel.CLASSIFIED:
        return 6;
      case SecurityLevel.TOP_SECRET:
        return 9;
      default:
        return 1;
    }
  }

  /**
   * Extract relevant tags from content
   */
  private extractTags(content: string, type: InformationType): string[] {
    const tags: string[] = [type.toLowerCase()];
    
    // Technology tags
    const techKeywords = [
      'ai', 'quantum', 'nuclear', 'biotech', 'nanotech', 'aerospace',
      'cybersecurity', 'encryption', 'blockchain', 'robotics'
    ];
    
    // Military tags
    const militaryKeywords = [
      'weapon', 'defense', 'missile', 'radar', 'stealth', 'intelligence',
      'surveillance', 'reconnaissance', 'tactical', 'strategic'
    ];
    
    // Economic tags
    const economicKeywords = [
      'trade', 'market', 'financial', 'investment', 'commodity', 'currency',
      'export', 'import', 'sanctions', 'tariff'
    ];

    const contentLower = content.toLowerCase();
    
    [...techKeywords, ...militaryKeywords, ...economicKeywords].forEach(keyword => {
      if (contentLower.includes(keyword)) {
        tags.push(keyword);
      }
    });

    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Calculate expiration date based on information characteristics
   */
  private calculateExpirationDate(asset: InformationAsset): Date {
    const now = new Date();
    let daysValid = 30; // Default

    // Security level affects longevity
    switch (asset.securityLevel) {
      case SecurityLevel.TOP_SECRET:
        daysValid = 7; // Highly sensitive, short lifespan
        break;
      case SecurityLevel.CLASSIFIED:
        daysValid = 30;
        break;
      case SecurityLevel.PROPRIETARY:
        daysValid = 90;
        break;
      case SecurityLevel.PUBLIC:
        daysValid = 365; // Public info lasts longer
        break;
    }

    // Information type affects longevity
    switch (asset.type) {
      case InformationType.MILITARY_PLANS:
        daysValid = Math.min(daysValid, 14); // Military plans expire quickly
        break;
      case InformationType.MARKET_INTELLIGENCE:
        daysValid = Math.min(daysValid, 7); // Market data is time-sensitive
        break;
      case InformationType.TECHNOLOGY_SPECS:
        daysValid = Math.max(daysValid, 180); // Tech specs last longer
        break;
      case InformationType.RESEARCH_DATA:
        daysValid = Math.max(daysValid, 365); // Research has lasting value
        break;
    }

    return new Date(now.getTime() + daysValid * 24 * 60 * 60 * 1000);
  }

  /**
   * Request access to classified information
   */
  requestAccess(
    requesterId: string,
    requesterOrg: string,
    assetId: string,
    justification: string
  ): AccessRequest {
    const asset = this.informationAssets.get(assetId);
    if (!asset) {
      throw new Error('Information asset not found');
    }

    const request: AccessRequest = {
      id: this.generateRequestId(),
      requesterId,
      requesterOrganization: requesterOrg,
      assetId,
      requestedAt: new Date(),
      justification,
      status: 'pending'
    };

    this.accessRequests.set(request.id, request);
    return request;
  }

  /**
   * Approve or deny access request
   */
  processAccessRequest(
    requestId: string,
    approverId: string,
    approved: boolean,
    conditions?: string[]
  ): AccessRequest {
    const request = this.accessRequests.get(requestId);
    if (!request) {
      throw new Error('Access request not found');
    }

    request.status = approved ? 'approved' : 'denied';
    request.approvedBy = approverId;
    request.approvedAt = new Date();

    if (approved && conditions) {
      request.accessConditions = conditions;
      request.accessDuration = 60; // Default 1 hour access
    }

    return request;
  }

  /**
   * Access information asset (if authorized)
   */
  accessInformation(assetId: string, requesterId: string): InformationAsset {
    const asset = this.informationAssets.get(assetId);
    if (!asset) {
      throw new Error('Information asset not found');
    }

    // Check if information has expired
    if (asset.expiresAt && asset.expiresAt < new Date()) {
      throw new Error('Information has expired');
    }

    // For non-public information, check access authorization
    if (asset.securityLevel !== SecurityLevel.PUBLIC) {
      const hasAccess = this.checkAccessAuthorization(assetId, requesterId);
      if (!hasAccess) {
        throw new Error('Access denied - insufficient clearance');
      }
    }

    // Update access tracking
    asset.accessCount++;
    asset.lastAccessed = new Date();

    // Apply information decay
    this.applyInformationDecay(asset);

    return asset;
  }

  /**
   * Check if requester has authorization to access asset
   */
  private checkAccessAuthorization(assetId: string, requesterId: string): boolean {
    // Find approved access requests for this asset and requester
    const approvedRequests = Array.from(this.accessRequests.values()).filter(
      request => 
        request.assetId === assetId &&
        request.requesterId === requesterId &&
        request.status === 'approved' &&
        this.isAccessRequestValid(request)
    );

    return approvedRequests.length > 0;
  }

  /**
   * Check if access request is still valid (not expired)
   */
  private isAccessRequestValid(request: AccessRequest): boolean {
    if (!request.approvedAt || !request.accessDuration) {
      return false;
    }

    const expirationTime = new Date(
      request.approvedAt.getTime() + request.accessDuration * 60 * 1000
    );

    return new Date() < expirationTime;
  }

  /**
   * Apply information decay over time
   */
  private applyInformationDecay(asset: InformationAsset): void {
    const ageInDays = (Date.now() - asset.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    
    // Freshness decays over time
    const decayRate = this.getDecayRate(asset.type, asset.securityLevel);
    asset.freshness = Math.max(0.1, 1 - (ageInDays * decayRate));
    
    // Strategic value decreases with age and access
    const accessPenalty = Math.min(asset.accessCount * 0.01, 0.2);
    const agePenalty = Math.min(ageInDays * 0.005, 0.3);
    asset.strategicValue = Math.max(
      asset.strategicValue * (1 - accessPenalty - agePenalty),
      10
    );
  }

  /**
   * Get decay rate based on information characteristics
   */
  private getDecayRate(type: InformationType, securityLevel: SecurityLevel): number {
    let baseRate = 0.01; // 1% per day

    // Information type affects decay rate
    switch (type) {
      case InformationType.MARKET_INTELLIGENCE:
        baseRate = 0.05; // Market data decays quickly
        break;
      case InformationType.MILITARY_PLANS:
        baseRate = 0.03; // Military plans become outdated
        break;
      case InformationType.TECHNOLOGY_SPECS:
        baseRate = 0.005; // Technology specs last longer
        break;
      case InformationType.RESEARCH_DATA:
        baseRate = 0.002; // Research has lasting value
        break;
    }

    // Higher security information may decay faster due to countermeasures
    switch (securityLevel) {
      case SecurityLevel.TOP_SECRET:
        baseRate *= 1.5;
        break;
      case SecurityLevel.CLASSIFIED:
        baseRate *= 1.2;
        break;
    }

    return baseRate;
  }

  /**
   * Create intelligence report from multiple assets
   */
  createIntelligenceReport(
    title: string,
    summary: string,
    assetIds: string[],
    analysisLevel: 'raw' | 'processed' | 'analyzed' | 'strategic',
    createdBy: string
  ): IntelligenceReport {
    // Verify all assets exist
    const assets = assetIds.map(id => {
      const asset = this.informationAssets.get(id);
      if (!asset) {
        throw new Error(`Information asset ${id} not found`);
      }
      return asset;
    });

    // Determine report security level (highest of constituent assets)
    const securityLevel = this.getHighestSecurityLevel(assets);
    
    // Calculate confidence based on asset reliability
    const confidence = assets.reduce((sum, asset) => sum + asset.reliability, 0) / assets.length;

    const report: IntelligenceReport = {
      id: this.generateReportId(),
      title,
      summary,
      assets: assetIds,
      analysisLevel,
      confidence,
      implications: [],
      recommendations: [],
      createdBy,
      createdAt: new Date(),
      distributionList: [],
      securityLevel
    };

    this.intelligenceReports.set(report.id, report);
    return report;
  }

  /**
   * Get highest security level from a set of assets
   */
  private getHighestSecurityLevel(assets: InformationAsset[]): SecurityLevel {
    const levels = [SecurityLevel.PUBLIC, SecurityLevel.PROPRIETARY, SecurityLevel.CLASSIFIED, SecurityLevel.TOP_SECRET];
    
    let highestLevel = SecurityLevel.PUBLIC;
    for (const asset of assets) {
      if (levels.indexOf(asset.securityLevel) > levels.indexOf(highestLevel)) {
        highestLevel = asset.securityLevel;
      }
    }
    
    return highestLevel;
  }

  /**
   * Get all information assets (filtered by access level)
   */
  getInformationAssets(requesterAccessLevel: number = 1): InformationAsset[] {
    return Array.from(this.informationAssets.values())
      .filter(asset => asset.accessLevel <= requesterAccessLevel)
      .sort((a, b) => b.strategicValue - a.strategicValue);
  }

  /**
   * Search information assets by criteria
   */
  searchInformation(
    query: string,
    type?: InformationType,
    securityLevel?: SecurityLevel,
    tags?: string[],
    requesterAccessLevel: number = 1
  ): InformationAsset[] {
    const queryLower = query.toLowerCase();
    
    return Array.from(this.informationAssets.values())
      .filter(asset => {
        // Access level check
        if (asset.accessLevel > requesterAccessLevel) return false;
        
        // Type filter
        if (type && asset.type !== type) return false;
        
        // Security level filter
        if (securityLevel && asset.securityLevel !== securityLevel) return false;
        
        // Tags filter
        if (tags && !tags.some(tag => asset.tags.includes(tag))) return false;
        
        // Text search
        return asset.title.toLowerCase().includes(queryLower) ||
               asset.content.toLowerCase().includes(queryLower) ||
               asset.tags.some(tag => tag.includes(queryLower));
      })
      .sort((a, b) => b.strategicValue - a.strategicValue);
  }

  // Utility methods
  private generateAssetId(): string {
    return 'INTEL-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  private generateRequestId(): string {
    return 'REQ-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  private generateReportId(): string {
    return 'RPT-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}

export const informationClassification = new InformationClassificationService();
