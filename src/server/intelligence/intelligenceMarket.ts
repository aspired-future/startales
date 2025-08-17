/**
 * Intelligence Market & Information Trading
 * Task 46: Information Classification & Espionage System
 * 
 * Manages the trading of information assets, brokers, dynamic pricing,
 * and market mechanics for intelligence commerce.
 */

import { InformationAsset, SecurityLevel, InformationType } from './informationClassification.js';

export enum MarketRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER', 
  BROKER = 'BROKER',
  ANALYST = 'ANALYST'
}

export enum TransactionType {
  PURCHASE = 'PURCHASE',
  LEASE = 'LEASE',
  AUCTION = 'AUCTION',
  EXCHANGE = 'EXCHANGE',
  SUBSCRIPTION = 'SUBSCRIPTION'
}

export enum MarketTier {
  BLACK_MARKET = 'BLACK_MARKET',
  GRAY_MARKET = 'GRAY_MARKET',
  LEGITIMATE = 'LEGITIMATE',
  GOVERNMENT = 'GOVERNMENT'
}

export interface MarketParticipant {
  id: string;
  name: string;
  organization: string;
  role: MarketRole;
  reputation: number; // 0-100
  trustScore: number; // 0-1
  creditRating: number; // 0-1000
  specializations: InformationType[];
  accessLevel: number; // 1-10
  marketTier: MarketTier;
  totalTransactions: number;
  successfulTransactions: number;
  averageTransactionValue: number;
  preferredPaymentMethods: string[];
  geographicReach: string[];
  languages: string[];
  joinedAt: Date;
  lastActive: Date;
  verificationStatus: 'unverified' | 'basic' | 'enhanced' | 'premium';
  metadata: {
    contacts?: string[];
    aliases?: string[];
    operatingRegions?: string[];
    riskTolerance?: 'low' | 'medium' | 'high';
  };
}

export interface IntelligenceListing {
  id: string;
  assetId: string;
  sellerId: string;
  title: string;
  description: string;
  category: InformationType;
  securityLevel: SecurityLevel;
  marketTier: MarketTier;
  listingType: TransactionType;
  basePrice: number;
  currentPrice: number;
  minimumBid?: number;
  buyoutPrice?: number;
  leaseDuration?: number; // days
  exclusivity: 'exclusive' | 'non_exclusive' | 'limited';
  maxBuyers?: number;
  currentBuyers: number;
  verificationLevel: 'sample' | 'verified' | 'guaranteed';
  freshness: number; // 0-1
  reliability: number; // 0-1
  strategicValue: number; // 1-100
  tags: string[];
  targetAudience: string[];
  geographicRelevance: string[];
  listedAt: Date;
  expiresAt: Date;
  status: 'active' | 'sold' | 'expired' | 'withdrawn' | 'under_review';
  viewCount: number;
  inquiryCount: number;
  bidCount: number;
  watchers: string[]; // Participant IDs
  restrictions: {
    minimumReputation?: number;
    requiredAccessLevel?: number;
    excludedOrganizations?: string[];
    geographicRestrictions?: string[];
  };
}

export interface IntelligenceTransaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  brokerId?: string;
  assetId: string;
  transactionType: TransactionType;
  agreedPrice: number;
  brokerFee?: number;
  totalCost: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'disputed';
  deliveryMethod: 'digital' | 'physical' | 'in_person' | 'dead_drop';
  deliveryStatus: 'pending' | 'in_transit' | 'delivered' | 'failed';
  escrowService?: string;
  contractTerms: string[];
  exclusivityPeriod?: number; // days
  usageRestrictions?: string[];
  initiatedAt: Date;
  completedAt?: Date;
  disputeStatus?: 'none' | 'raised' | 'investigating' | 'resolved';
  satisfaction: {
    buyerRating?: number; // 1-5
    sellerRating?: number; // 1-5
    buyerFeedback?: string;
    sellerFeedback?: string;
  };
  metadata: {
    referenceNumber?: string;
    legalFramework?: string;
    jurisdiction?: string;
    insuranceCoverage?: boolean;
  };
}

export interface MarketBroker {
  id: string;
  participantId: string;
  specializations: InformationType[];
  marketTiers: MarketTier[];
  commissionRate: number; // 0-1
  successRate: number; // 0-1
  averageDealSize: number;
  clientNetwork: string[]; // Participant IDs
  activeListings: string[];
  completedDeals: number;
  totalCommissions: number;
  languages: string[];
  operatingHours: string;
  contactMethods: string[];
  verificationServices: boolean;
  escrowServices: boolean;
  disputeResolution: boolean;
  insurancePartner?: string;
  bondAmount: number;
  licenseNumber?: string;
  establishedAt: Date;
}

export interface MarketAnalytics {
  timestamp: Date;
  totalListings: number;
  activeListings: number;
  totalTransactions: number;
  totalVolume: number;
  averageTransactionValue: number;
  marketTierDistribution: Record<MarketTier, number>;
  informationTypeDistribution: Record<InformationType, number>;
  securityLevelDistribution: Record<SecurityLevel, number>;
  priceRanges: {
    min: number;
    max: number;
    median: number;
    average: number;
  };
  topCategories: Array<{
    type: InformationType;
    volume: number;
    averagePrice: number;
  }>;
  marketTrends: {
    priceDirection: 'up' | 'down' | 'stable';
    volumeDirection: 'up' | 'down' | 'stable';
    hotCategories: InformationType[];
    emergingMarkets: string[];
  };
}

export class IntelligenceMarketService {
  private participants: Map<string, MarketParticipant> = new Map();
  private listings: Map<string, IntelligenceListing> = new Map();
  private transactions: Map<string, IntelligenceTransaction> = new Map();
  private brokers: Map<string, MarketBroker> = new Map();
  private priceHistory: Map<string, Array<{ date: Date; price: number }>> = new Map();

  /**
   * Register a new market participant
   */
  registerParticipant(
    name: string,
    organization: string,
    role: MarketRole,
    marketTier: MarketTier,
    specializations: InformationType[]
  ): MarketParticipant {
    const participant: MarketParticipant = {
      id: this.generateParticipantId(),
      name,
      organization,
      role,
      reputation: 50, // Start with neutral reputation
      trustScore: 0.5,
      creditRating: 500,
      specializations,
      accessLevel: this.getInitialAccessLevel(marketTier),
      marketTier,
      totalTransactions: 0,
      successfulTransactions: 0,
      averageTransactionValue: 0,
      preferredPaymentMethods: ['cryptocurrency', 'wire_transfer'],
      geographicReach: [],
      languages: ['english'],
      joinedAt: new Date(),
      lastActive: new Date(),
      verificationStatus: 'unverified',
      metadata: {
        riskTolerance: 'medium'
      }
    };

    this.participants.set(participant.id, participant);
    return participant;
  }

  /**
   * Create a new intelligence listing
   */
  createListing(
    assetId: string,
    sellerId: string,
    title: string,
    description: string,
    category: InformationType,
    securityLevel: SecurityLevel,
    listingType: TransactionType,
    basePrice: number,
    options: Partial<IntelligenceListing> = {}
  ): IntelligenceListing {
    const seller = this.participants.get(sellerId);
    if (!seller) {
      throw new Error('Seller not found');
    }

    const marketTier = this.determineMarketTier(securityLevel, seller.marketTier);
    const strategicValue = this.calculateStrategicValue(category, securityLevel);

    const listing: IntelligenceListing = {
      id: this.generateListingId(),
      assetId,
      sellerId,
      title,
      description,
      category,
      securityLevel,
      marketTier,
      listingType,
      basePrice,
      currentPrice: basePrice,
      exclusivity: options.exclusivity || 'non_exclusive',
      currentBuyers: 0,
      verificationLevel: options.verificationLevel || 'sample',
      freshness: options.freshness || 1.0,
      reliability: options.reliability || 0.8,
      strategicValue,
      tags: options.tags || [],
      targetAudience: options.targetAudience || [],
      geographicRelevance: options.geographicRelevance || [],
      listedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      status: 'active',
      viewCount: 0,
      inquiryCount: 0,
      bidCount: 0,
      watchers: [],
      restrictions: options.restrictions || {},
      ...options
    };

    this.listings.set(listing.id, listing);
    this.updatePriceHistory(listing.id, basePrice);
    return listing;
  }

  /**
   * Search intelligence listings
   */
  searchListings(
    query: string,
    filters: {
      category?: InformationType;
      securityLevel?: SecurityLevel;
      marketTier?: MarketTier;
      priceRange?: { min: number; max: number };
      freshness?: number;
      reliability?: number;
      tags?: string[];
      geographicRelevance?: string[];
    } = {},
    participantId?: string
  ): IntelligenceListing[] {
    const participant = participantId ? this.participants.get(participantId) : null;
    const queryLower = query.toLowerCase();

    return Array.from(this.listings.values())
      .filter(listing => {
        // Status filter
        if (listing.status !== 'active') return false;

        // Access level check
        if (participant && listing.restrictions.requiredAccessLevel && 
            participant.accessLevel < listing.restrictions.requiredAccessLevel) {
          return false;
        }

        // Reputation check
        if (participant && listing.restrictions.minimumReputation &&
            participant.reputation < listing.restrictions.minimumReputation) {
          return false;
        }

        // Organization exclusion check
        if (participant && listing.restrictions.excludedOrganizations &&
            listing.restrictions.excludedOrganizations.includes(participant.organization)) {
          return false;
        }

        // Text search
        if (query && !(
          listing.title.toLowerCase().includes(queryLower) ||
          listing.description.toLowerCase().includes(queryLower) ||
          listing.tags.some(tag => tag.toLowerCase().includes(queryLower))
        )) {
          return false;
        }

        // Filters
        if (filters.category && listing.category !== filters.category) return false;
        if (filters.securityLevel && listing.securityLevel !== filters.securityLevel) return false;
        if (filters.marketTier && listing.marketTier !== filters.marketTier) return false;
        if (filters.priceRange) {
          if (listing.currentPrice < filters.priceRange.min || 
              listing.currentPrice > filters.priceRange.max) return false;
        }
        if (filters.freshness && listing.freshness < filters.freshness) return false;
        if (filters.reliability && listing.reliability < filters.reliability) return false;
        if (filters.tags && !filters.tags.some(tag => listing.tags.includes(tag))) return false;
        if (filters.geographicRelevance && 
            !filters.geographicRelevance.some(geo => listing.geographicRelevance.includes(geo))) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by strategic value, then freshness, then price
        if (a.strategicValue !== b.strategicValue) {
          return b.strategicValue - a.strategicValue;
        }
        if (a.freshness !== b.freshness) {
          return b.freshness - a.freshness;
        }
        return a.currentPrice - b.currentPrice;
      });
  }

  /**
   * Initiate a transaction
   */
  initiateTransaction(
    listingId: string,
    buyerId: string,
    transactionType: TransactionType,
    offeredPrice?: number,
    brokerId?: string
  ): IntelligenceTransaction {
    const listing = this.listings.get(listingId);
    const buyer = this.participants.get(buyerId);
    
    if (!listing) throw new Error('Listing not found');
    if (!buyer) throw new Error('Buyer not found');
    if (listing.status !== 'active') throw new Error('Listing is not active');

    const seller = this.participants.get(listing.sellerId)!;
    const broker = brokerId ? this.brokers.get(brokerId) : undefined;

    // Determine final price
    let agreedPrice = offeredPrice || listing.currentPrice;
    if (transactionType === TransactionType.AUCTION && offeredPrice) {
      if (listing.minimumBid && offeredPrice < listing.minimumBid) {
        throw new Error('Bid below minimum');
      }
      agreedPrice = offeredPrice;
      listing.currentPrice = Math.max(listing.currentPrice, offeredPrice);
      listing.bidCount++;
    }

    // Calculate fees
    const brokerFee = broker ? agreedPrice * broker.commissionRate : 0;
    const totalCost = agreedPrice + brokerFee;

    const transaction: IntelligenceTransaction = {
      id: this.generateTransactionId(),
      listingId,
      buyerId,
      sellerId: listing.sellerId,
      brokerId,
      assetId: listing.assetId,
      transactionType,
      agreedPrice,
      brokerFee,
      totalCost,
      paymentMethod: buyer.preferredPaymentMethods[0],
      paymentStatus: 'pending',
      deliveryMethod: this.determineDeliveryMethod(listing.securityLevel),
      deliveryStatus: 'pending',
      contractTerms: this.generateContractTerms(listing, transactionType),
      initiatedAt: new Date(),
      satisfaction: {},
      metadata: {
        referenceNumber: this.generateReferenceNumber(),
        jurisdiction: this.determineJurisdiction(listing.marketTier),
        insuranceCoverage: listing.marketTier === MarketTier.LEGITIMATE
      }
    };

    this.transactions.set(transaction.id, transaction);

    // Update listing
    listing.currentBuyers++;
    if (listing.exclusivity === 'exclusive' || 
        (listing.maxBuyers && listing.currentBuyers >= listing.maxBuyers)) {
      listing.status = 'sold';
    }

    return transaction;
  }

  /**
   * Complete a transaction
   */
  completeTransaction(
    transactionId: string,
    buyerRating?: number,
    sellerRating?: number,
    buyerFeedback?: string,
    sellerFeedback?: string
  ): IntelligenceTransaction {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    transaction.paymentStatus = 'completed';
    transaction.deliveryStatus = 'delivered';
    transaction.completedAt = new Date();
    
    if (buyerRating) transaction.satisfaction.buyerRating = buyerRating;
    if (sellerRating) transaction.satisfaction.sellerRating = sellerRating;
    if (buyerFeedback) transaction.satisfaction.buyerFeedback = buyerFeedback;
    if (sellerFeedback) transaction.satisfaction.sellerFeedback = sellerFeedback;

    // Update participant statistics
    this.updateParticipantStats(transaction.buyerId, transaction, 'buyer');
    this.updateParticipantStats(transaction.sellerId, transaction, 'seller');
    
    if (transaction.brokerId) {
      this.updateBrokerStats(transaction.brokerId, transaction);
    }

    return transaction;
  }

  /**
   * Register a market broker
   */
  registerBroker(
    participantId: string,
    specializations: InformationType[],
    marketTiers: MarketTier[],
    commissionRate: number
  ): MarketBroker {
    const participant = this.participants.get(participantId);
    if (!participant) {
      throw new Error('Participant not found');
    }

    if (participant.role !== MarketRole.BROKER) {
      throw new Error('Participant must have broker role');
    }

    const broker: MarketBroker = {
      id: this.generateBrokerId(),
      participantId,
      specializations,
      marketTiers,
      commissionRate,
      successRate: 0.8, // Start with good success rate
      averageDealSize: 0,
      clientNetwork: [],
      activeListings: [],
      completedDeals: 0,
      totalCommissions: 0,
      languages: participant.languages,
      operatingHours: '24/7',
      contactMethods: ['encrypted_message', 'secure_call'],
      verificationServices: true,
      escrowServices: true,
      disputeResolution: true,
      bondAmount: 100000,
      establishedAt: new Date()
    };

    this.brokers.set(broker.id, broker);
    return broker;
  }

  /**
   * Get market analytics
   */
  getMarketAnalytics(): MarketAnalytics {
    const listings = Array.from(this.listings.values());
    const transactions = Array.from(this.transactions.values());
    const completedTransactions = transactions.filter(t => t.paymentStatus === 'completed');

    const totalVolume = completedTransactions.reduce((sum, t) => sum + t.agreedPrice, 0);
    const averageTransactionValue = completedTransactions.length > 0 ? 
      totalVolume / completedTransactions.length : 0;

    // Market tier distribution
    const marketTierDistribution = {} as Record<MarketTier, number>;
    Object.values(MarketTier).forEach(tier => {
      marketTierDistribution[tier] = listings.filter(l => l.marketTier === tier).length;
    });

    // Information type distribution
    const informationTypeDistribution = {} as Record<InformationType, number>;
    Object.values(InformationType).forEach(type => {
      informationTypeDistribution[type] = listings.filter(l => l.category === type).length;
    });

    // Security level distribution
    const securityLevelDistribution = {} as Record<SecurityLevel, number>;
    Object.values(SecurityLevel).forEach(level => {
      securityLevelDistribution[level] = listings.filter(l => l.securityLevel === level).length;
    });

    // Price ranges
    const prices = listings.map(l => l.currentPrice).sort((a, b) => a - b);
    const priceRanges = {
      min: prices[0] || 0,
      max: prices[prices.length - 1] || 0,
      median: prices[Math.floor(prices.length / 2)] || 0,
      average: prices.reduce((sum, p) => sum + p, 0) / prices.length || 0
    };

    // Top categories by volume
    const categoryVolumes = new Map<InformationType, { volume: number; totalPrice: number; count: number }>();
    completedTransactions.forEach(t => {
      const listing = this.listings.get(t.listingId);
      if (listing) {
        const current = categoryVolumes.get(listing.category) || { volume: 0, totalPrice: 0, count: 0 };
        current.volume += t.agreedPrice;
        current.totalPrice += t.agreedPrice;
        current.count++;
        categoryVolumes.set(listing.category, current);
      }
    });

    const topCategories = Array.from(categoryVolumes.entries())
      .map(([type, data]) => ({
        type,
        volume: data.volume,
        averagePrice: data.totalPrice / data.count
      }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);

    return {
      timestamp: new Date(),
      totalListings: listings.length,
      activeListings: listings.filter(l => l.status === 'active').length,
      totalTransactions: transactions.length,
      totalVolume,
      averageTransactionValue,
      marketTierDistribution,
      informationTypeDistribution,
      securityLevelDistribution,
      priceRanges,
      topCategories,
      marketTrends: {
        priceDirection: 'stable', // Would need historical data for real calculation
        volumeDirection: 'up',
        hotCategories: topCategories.slice(0, 3).map(c => c.type),
        emergingMarkets: ['cyber_intelligence', 'biotech_research']
      }
    };
  }

  /**
   * Calculate dynamic pricing based on market conditions
   */
  calculateDynamicPrice(
    category: InformationType,
    securityLevel: SecurityLevel,
    freshness: number,
    reliability: number,
    strategicValue: number
  ): number {
    let basePrice = 1000; // Base price

    // Category multiplier
    const categoryMultipliers: Record<InformationType, number> = {
      [InformationType.MILITARY_PLANS]: 5.0,
      [InformationType.TECHNOLOGY_SPECS]: 4.0,
      [InformationType.TRADE_SECRETS]: 3.5,
      [InformationType.RESEARCH_DATA]: 3.0,
      [InformationType.DIPLOMATIC_CABLES]: 2.5,
      [InformationType.FINANCIAL_RECORDS]: 2.0,
      [InformationType.MARKET_INTELLIGENCE]: 1.5,
      [InformationType.PERSONNEL_FILES]: 1.0
    };

    basePrice *= categoryMultipliers[category];

    // Security level multiplier
    const securityMultipliers: Record<SecurityLevel, number> = {
      [SecurityLevel.TOP_SECRET]: 10.0,
      [SecurityLevel.CLASSIFIED]: 5.0,
      [SecurityLevel.PROPRIETARY]: 2.0,
      [SecurityLevel.PUBLIC]: 0.5
    };

    basePrice *= securityMultipliers[securityLevel];

    // Quality factors
    basePrice *= (0.5 + freshness * 0.5); // 50-100% based on freshness
    basePrice *= (0.5 + reliability * 0.5); // 50-100% based on reliability
    basePrice *= (strategicValue / 100); // 0-100% based on strategic value

    // Market demand (simplified)
    const demandMultiplier = this.calculateDemandMultiplier(category, securityLevel);
    basePrice *= demandMultiplier;

    return Math.round(basePrice);
  }

  // Private helper methods
  private getInitialAccessLevel(marketTier: MarketTier): number {
    switch (marketTier) {
      case MarketTier.GOVERNMENT: return 8;
      case MarketTier.LEGITIMATE: return 5;
      case MarketTier.GRAY_MARKET: return 3;
      case MarketTier.BLACK_MARKET: return 1;
      default: return 1;
    }
  }

  private determineMarketTier(securityLevel: SecurityLevel, participantTier: MarketTier): MarketTier {
    // Higher security information typically trades in more restricted markets
    if (securityLevel === SecurityLevel.TOP_SECRET) {
      return MarketTier.BLACK_MARKET;
    }
    if (securityLevel === SecurityLevel.CLASSIFIED) {
      return participantTier === MarketTier.LEGITIMATE ? MarketTier.GRAY_MARKET : participantTier;
    }
    return participantTier;
  }

  private calculateStrategicValue(category: InformationType, securityLevel: SecurityLevel): number {
    let value = 50; // Base value

    // Category value
    const categoryValues: Record<InformationType, number> = {
      [InformationType.MILITARY_PLANS]: 90,
      [InformationType.TECHNOLOGY_SPECS]: 85,
      [InformationType.TRADE_SECRETS]: 80,
      [InformationType.RESEARCH_DATA]: 75,
      [InformationType.DIPLOMATIC_CABLES]: 70,
      [InformationType.FINANCIAL_RECORDS]: 60,
      [InformationType.MARKET_INTELLIGENCE]: 55,
      [InformationType.PERSONNEL_FILES]: 40
    };

    value = categoryValues[category];

    // Security level bonus
    const securityBonuses: Record<SecurityLevel, number> = {
      [SecurityLevel.TOP_SECRET]: 20,
      [SecurityLevel.CLASSIFIED]: 10,
      [SecurityLevel.PROPRIETARY]: 5,
      [SecurityLevel.PUBLIC]: 0
    };

    value += securityBonuses[securityLevel];

    return Math.min(100, value);
  }

  private updatePriceHistory(listingId: string, price: number): void {
    const history = this.priceHistory.get(listingId) || [];
    history.push({ date: new Date(), price });
    
    // Keep only last 30 price points
    if (history.length > 30) {
      history.shift();
    }
    
    this.priceHistory.set(listingId, history);
  }

  private determineDeliveryMethod(securityLevel: SecurityLevel): IntelligenceTransaction['deliveryMethod'] {
    switch (securityLevel) {
      case SecurityLevel.TOP_SECRET:
        return 'in_person';
      case SecurityLevel.CLASSIFIED:
        return 'dead_drop';
      case SecurityLevel.PROPRIETARY:
        return 'digital';
      default:
        return 'digital';
    }
  }

  private generateContractTerms(listing: IntelligenceListing, transactionType: TransactionType): string[] {
    const terms = [
      'Information is provided as-is without warranty',
      'Buyer assumes all risks associated with information use',
      'Seller retains no liability for information accuracy'
    ];

    if (listing.exclusivity === 'exclusive') {
      terms.push('Exclusive rights granted to buyer');
      terms.push('Seller agrees not to distribute to other parties');
    }

    if (transactionType === TransactionType.LEASE) {
      terms.push('Information access limited to lease duration');
      terms.push('Buyer must return or destroy information at lease end');
    }

    if (listing.securityLevel === SecurityLevel.TOP_SECRET || listing.securityLevel === SecurityLevel.CLASSIFIED) {
      terms.push('Buyer agrees to maintain information security');
      terms.push('Unauthorized disclosure prohibited');
      terms.push('Information must be handled according to security protocols');
    }

    return terms;
  }

  private determineJurisdiction(marketTier: MarketTier): string {
    switch (marketTier) {
      case MarketTier.GOVERNMENT:
        return 'government_classified';
      case MarketTier.LEGITIMATE:
        return 'commercial_law';
      case MarketTier.GRAY_MARKET:
        return 'international_arbitration';
      case MarketTier.BLACK_MARKET:
        return 'none';
      default:
        return 'commercial_law';
    }
  }

  private updateParticipantStats(participantId: string, transaction: IntelligenceTransaction, role: 'buyer' | 'seller'): void {
    const participant = this.participants.get(participantId);
    if (!participant) return;

    participant.totalTransactions++;
    participant.successfulTransactions++;
    participant.lastActive = new Date();

    // Update average transaction value
    const totalValue = participant.averageTransactionValue * (participant.totalTransactions - 1) + transaction.agreedPrice;
    participant.averageTransactionValue = totalValue / participant.totalTransactions;

    // Update reputation based on ratings
    const rating = role === 'buyer' ? transaction.satisfaction.sellerRating : transaction.satisfaction.buyerRating;
    if (rating) {
      const reputationChange = (rating - 3) * 2; // -4 to +4 change
      participant.reputation = Math.max(0, Math.min(100, participant.reputation + reputationChange));
    }

    // Update trust score
    participant.trustScore = Math.min(1, participant.trustScore + 0.01);
  }

  private updateBrokerStats(brokerId: string, transaction: IntelligenceTransaction): void {
    const broker = this.brokers.get(brokerId);
    if (!broker) return;

    broker.completedDeals++;
    broker.totalCommissions += transaction.brokerFee || 0;
    
    // Update average deal size
    const totalValue = broker.averageDealSize * (broker.completedDeals - 1) + transaction.agreedPrice;
    broker.averageDealSize = totalValue / broker.completedDeals;

    // Update success rate (simplified)
    broker.successRate = Math.min(1, broker.successRate + 0.005);
  }

  private calculateDemandMultiplier(category: InformationType, securityLevel: SecurityLevel): number {
    // Simplified demand calculation based on recent transactions
    const recentTransactions = Array.from(this.transactions.values())
      .filter(t => {
        const listing = this.listings.get(t.listingId);
        return listing && 
               listing.category === category && 
               listing.securityLevel === securityLevel &&
               t.initiatedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
      });

    const demandScore = Math.min(recentTransactions.length / 10, 2); // 0-2x multiplier
    return 0.8 + demandScore * 0.4; // 0.8x to 2.0x multiplier
  }

  // ID generators
  private generateParticipantId(): string {
    return 'PRT-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  private generateListingId(): string {
    return 'LST-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  private generateTransactionId(): string {
    return 'TXN-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  private generateBrokerId(): string {
    return 'BRK-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  private generateReferenceNumber(): string {
    return 'REF-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 3).toUpperCase();
  }

  // Getters
  getParticipants(): MarketParticipant[] {
    return Array.from(this.participants.values());
  }

  getListings(): IntelligenceListing[] {
    return Array.from(this.listings.values());
  }

  getTransactions(): IntelligenceTransaction[] {
    return Array.from(this.transactions.values());
  }

  getBrokers(): MarketBroker[] {
    return Array.from(this.brokers.values());
  }
}

export const intelligenceMarket = new IntelligenceMarketService();
