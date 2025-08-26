import { OAuth2Client } from 'google-auth-library';

/**
 * Google OAuth Configuration
 */
export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes?: string[];
}

/**
 * OAuth Token Response
 */
export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  tokenType: string;
  scope?: string;
}

/**
 * Google OAuth Service for VEO 3 Video Generation
 * 
 * This service handles Google OAuth authentication for accessing
 * VEO 3 video generation APIs through Google's services.
 */
export class GoogleOAuthService {
  private oauth2Client: OAuth2Client;
  private config: GoogleOAuthConfig;
  private tokens: OAuthTokens | null = null;

  constructor(config: GoogleOAuthConfig) {
    this.config = {
      scopes: [
        'https://www.googleapis.com/auth/generative-language',
        'https://www.googleapis.com/auth/cloud-platform'
      ],
      ...config
    };

    this.oauth2Client = new OAuth2Client(
      this.config.clientId,
      this.config.clientSecret,
      this.config.redirectUri
    );
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.config.scopes,
      prompt: 'consent'
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<OAuthTokens> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      
      this.tokens = {
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(tokens.expiry_date!),
        tokenType: tokens.token_type || 'Bearer',
        scope: tokens.scope
      };

      // Set credentials for future API calls
      this.oauth2Client.setCredentials(tokens);

      return this.tokens;
    } catch (error) {
      console.error('Failed to exchange code for tokens:', error);
      throw new Error(`OAuth token exchange failed: ${error.message}`);
    }
  }

  /**
   * Refresh access token if needed
   */
  async refreshAccessToken(): Promise<string> {
    if (!this.tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      
      this.tokens = {
        ...this.tokens,
        accessToken: credentials.access_token!,
        expiresAt: new Date(credentials.expiry_date!),
        tokenType: credentials.token_type || 'Bearer'
      };

      return this.tokens.accessToken;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  /**
   * Get valid access token (refresh if needed)
   */
  async getValidAccessToken(): Promise<string> {
    if (!this.tokens) {
      throw new Error('No tokens available. Please authenticate first.');
    }

    // Check if token is expired (with 5 minute buffer)
    const now = new Date();
    const expiresAt = new Date(this.tokens.expiresAt.getTime() - 5 * 60 * 1000);

    if (now >= expiresAt) {
      console.log('Access token expired, refreshing...');
      return this.refreshAccessToken();
    }

    return this.tokens.accessToken;
  }

  /**
   * Set tokens from stored data (e.g., database)
   */
  setTokens(tokens: OAuthTokens): void {
    this.tokens = tokens;
    this.oauth2Client.setCredentials({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expiry_date: tokens.expiresAt.getTime(),
      token_type: tokens.tokenType,
      scope: tokens.scope
    });
  }

  /**
   * Get current tokens
   */
  getTokens(): OAuthTokens | null {
    return this.tokens;
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    return this.tokens !== null && new Date() < this.tokens.expiresAt;
  }

  /**
   * Clear tokens (logout)
   */
  clearTokens(): void {
    this.tokens = null;
    this.oauth2Client.setCredentials({});
  }

  /**
   * Get OAuth client for direct API calls
   */
  getOAuthClient(): OAuth2Client {
    return this.oauth2Client;
  }

  /**
   * Make authenticated API request
   */
  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const accessToken = await this.getValidAccessToken();
    
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    return fetch(url, {
      ...options,
      headers
    });
  }

  /**
   * Create service from environment variables
   */
  static fromEnvironment(): GoogleOAuthService {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4000/auth/google/callback';

    if (!clientId || !clientSecret) {
      throw new Error('Missing Google OAuth credentials. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
    }

    return new GoogleOAuthService({
      clientId,
      clientSecret,
      redirectUri
    });
  }

  /**
   * Create service with API key (alternative to OAuth)
   */
  static withApiKey(apiKey: string): { getValidAccessToken: () => Promise<string> } {
    return {
      async getValidAccessToken(): Promise<string> {
        return apiKey;
      }
    };
  }
}

/**
 * Token storage interface for persistence
 */
export interface TokenStorage {
  saveTokens(userId: string, tokens: OAuthTokens): Promise<void>;
  loadTokens(userId: string): Promise<OAuthTokens | null>;
  deleteTokens(userId: string): Promise<void>;
}

/**
 * Simple in-memory token storage (for development)
 */
export class MemoryTokenStorage implements TokenStorage {
  private tokens = new Map<string, OAuthTokens>();

  async saveTokens(userId: string, tokens: OAuthTokens): Promise<void> {
    this.tokens.set(userId, tokens);
  }

  async loadTokens(userId: string): Promise<OAuthTokens | null> {
    return this.tokens.get(userId) || null;
  }

  async deleteTokens(userId: string): Promise<void> {
    this.tokens.delete(userId);
  }
}

export { OAuth2Client };

