import express from 'express';
import { getCurrencyExchangeService } from './CurrencyExchangeService.js';

const router = express.Router();

/**
 * GET /api/currency-exchange/currencies - List all currencies
 */
router.get('/currencies', async (req, res) => {
  try {
    const civilizationId = req.query.civilization_id ? parseInt(req.query.civilization_id as string) : undefined;
    const isActive = req.query.is_active ? req.query.is_active === 'true' : undefined;
    const isReserve = req.query.is_reserve ? req.query.is_reserve === 'true' : undefined;
    
    const service = getCurrencyExchangeService();
    const currencies = await service.getCurrencies({ 
      civilization_id: civilizationId, 
      is_active: isActive, 
      is_reserve: isReserve 
    });

    res.json({
      success: true,
      data: currencies,
      count: currencies.length
    });
  } catch (error) {
    console.error('Error fetching currencies:', error);
    res.status(500).json({
      error: 'Failed to fetch currencies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/currency-exchange/currencies/:code - Get specific currency details
 */
router.get('/currencies/:code', async (req, res) => {
  try {
    const currencyCode = req.params.code.toUpperCase();
    const service = getCurrencyExchangeService();
    const currency = await service.getCurrency(currencyCode);

    if (!currency) {
      return res.status(404).json({
        error: 'Currency not found',
        message: `No currency found with code ${currencyCode}`
      });
    }

    res.json({
      success: true,
      data: currency
    });
  } catch (error) {
    console.error('Error fetching currency:', error);
    res.status(500).json({
      error: 'Failed to fetch currency',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/currency-exchange/currencies - Create new currency
 */
router.post('/currencies', async (req, res) => {
  try {
    const service = getCurrencyExchangeService();
    const currency = await service.createCurrency(req.body);

    res.status(201).json({
      success: true,
      data: currency,
      message: 'Currency created successfully'
    });
  } catch (error) {
    console.error('Error creating currency:', error);
    res.status(500).json({
      error: 'Failed to create currency',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/currency-exchange/currencies/:code - Update currency
 */
router.put('/currencies/:code', async (req, res) => {
  try {
    const currencyCode = req.params.code.toUpperCase();
    const service = getCurrencyExchangeService();
    const currency = await service.updateCurrency(currencyCode, req.body);

    res.json({
      success: true,
      data: currency,
      message: 'Currency updated successfully'
    });
  } catch (error) {
    console.error('Error updating currency:', error);
    res.status(500).json({
      error: 'Failed to update currency',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /api/currency-exchange/currencies/:code - Deactivate currency
 */
router.delete('/currencies/:code', async (req, res) => {
  try {
    const currencyCode = req.params.code.toUpperCase();
    const service = getCurrencyExchangeService();
    await service.deactivateCurrency(currencyCode);

    res.json({
      success: true,
      message: 'Currency deactivated successfully'
    });
  } catch (error) {
    console.error('Error deactivating currency:', error);
    res.status(500).json({
      error: 'Failed to deactivate currency',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/currency-exchange/rates - Get current exchange rates
 */
router.get('/rates', async (req, res) => {
  try {
    const baseCurrency = req.query.base as string;
    const quoteCurrency = req.query.quote as string;
    
    const service = getCurrencyExchangeService();
    const rates = await service.getExchangeRates({ 
      base_currency: baseCurrency, 
      quote_currency: quoteCurrency 
    });

    res.json({
      success: true,
      data: rates,
      count: rates.length
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    res.status(500).json({
      error: 'Failed to fetch exchange rates',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/currency-exchange/rates/:base/:quote - Get specific currency pair rate
 */
router.get('/rates/:base/:quote', async (req, res) => {
  try {
    const baseCurrency = req.params.base.toUpperCase();
    const quoteCurrency = req.params.quote.toUpperCase();
    
    const service = getCurrencyExchangeService();
    const rate = await service.getExchangeRate(baseCurrency, quoteCurrency);

    if (!rate) {
      return res.status(404).json({
        error: 'Exchange rate not found',
        message: `No exchange rate found for ${baseCurrency}/${quoteCurrency}`
      });
    }

    res.json({
      success: true,
      data: rate
    });
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    res.status(500).json({
      error: 'Failed to fetch exchange rate',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/currency-exchange/rates/:base/:quote/history - Get historical rates
 */
router.get('/rates/:base/:quote/history', async (req, res) => {
  try {
    const baseCurrency = req.params.base.toUpperCase();
    const quoteCurrency = req.params.quote.toUpperCase();
    const days = parseInt(req.query.days as string) || 30;
    
    const service = getCurrencyExchangeService();
    const history = await service.getExchangeRateHistory(baseCurrency, quoteCurrency, days);

    res.json({
      success: true,
      data: history,
      count: history.length,
      timeframe: `${days} days`
    });
  } catch (error) {
    console.error('Error fetching exchange rate history:', error);
    res.status(500).json({
      error: 'Failed to fetch exchange rate history',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/currency-exchange/rates/calculate - Calculate conversion amount
 */
router.post('/rates/calculate', async (req, res) => {
  try {
    const { from_currency, to_currency, amount } = req.body;
    
    if (!from_currency || !to_currency || !amount) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'from_currency, to_currency, and amount are required'
      });
    }

    const service = getCurrencyExchangeService();
    const exchangeRate = await service.calculateExchangeRate(from_currency.toUpperCase(), to_currency.toUpperCase());
    const convertedAmount = amount * exchangeRate;
    const fee = amount * 0.001; // 0.1% fee

    res.json({
      success: true,
      data: {
        from_currency: from_currency.toUpperCase(),
        to_currency: to_currency.toUpperCase(),
        from_amount: amount,
        to_amount: convertedAmount,
        exchange_rate: exchangeRate,
        transaction_fee: fee,
        total_cost: amount + fee
      }
    });
  } catch (error) {
    console.error('Error calculating conversion:', error);
    res.status(500).json({
      error: 'Failed to calculate conversion',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/currency-exchange/rates/:base/:quote - Update exchange rate
 */
router.put('/rates/:base/:quote', async (req, res) => {
  try {
    const baseCurrency = req.params.base.toUpperCase();
    const quoteCurrency = req.params.quote.toUpperCase();
    const { exchange_rate } = req.body;

    if (!exchange_rate) {
      return res.status(400).json({
        error: 'Missing exchange rate',
        message: 'exchange_rate is required'
      });
    }

    const service = getCurrencyExchangeService();
    const rate = await service.updateExchangeRate(baseCurrency, quoteCurrency, exchange_rate);

    res.json({
      success: true,
      data: rate,
      message: 'Exchange rate updated successfully'
    });
  } catch (error) {
    console.error('Error updating exchange rate:', error);
    res.status(500).json({
      error: 'Failed to update exchange rate',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/currency-exchange/transactions - List currency transactions
 */
router.get('/transactions', async (req, res) => {
  try {
    const civilizationId = req.query.civilization_id ? parseInt(req.query.civilization_id as string) : undefined;
    const currencyCode = req.query.currency_code as string;
    const transactionType = req.query.transaction_type as string;
    const settlementStatus = req.query.settlement_status as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    
    const service = getCurrencyExchangeService();
    const transactions = await service.getCurrencyTransactions({
      civilization_id: civilizationId,
      currency_code: currencyCode,
      transaction_type: transactionType,
      settlement_status: settlementStatus,
      limit
    });

    res.json({
      success: true,
      data: transactions,
      count: transactions.length
    });
  } catch (error) {
    console.error('Error fetching currency transactions:', error);
    res.status(500).json({
      error: 'Failed to fetch currency transactions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/currency-exchange/transactions - Execute currency exchange
 */
router.post('/transactions', async (req, res) => {
  try {
    const service = getCurrencyExchangeService();
    const transaction = await service.executeCurrencyTransaction(req.body);

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Currency transaction executed successfully'
    });
  } catch (error) {
    console.error('Error executing currency transaction:', error);
    res.status(500).json({
      error: 'Failed to execute currency transaction',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/currency-exchange/transactions/:id - Get transaction details
 */
router.get('/transactions/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = getCurrencyExchangeService();
    const transactions = await service.getCurrencyTransactions({ limit: 1000 });
    const transaction = transactions.find(t => t.id === id);

    if (!transaction) {
      return res.status(404).json({
        error: 'Transaction not found',
        message: `No transaction found with ID ${id}`
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({
      error: 'Failed to fetch transaction',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/currency-exchange/transactions/:id/settle - Settle transaction
 */
router.put('/transactions/:id/settle', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = getCurrencyExchangeService();
    const transaction = await service.settleCurrencyTransaction(id);

    res.json({
      success: true,
      data: transaction,
      message: 'Transaction settled successfully'
    });
  } catch (error) {
    console.error('Error settling transaction:', error);
    res.status(500).json({
      error: 'Failed to settle transaction',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/currency-exchange/policies/:currency - Get currency policy
 */
router.get('/policies/:currency', async (req, res) => {
  try {
    const currencyCode = req.params.currency.toUpperCase();
    const service = getCurrencyExchangeService();
    const policy = await service.getCurrencyPolicy(currencyCode);

    if (!policy) {
      return res.status(404).json({
        error: 'Currency policy not found',
        message: `No policy found for currency ${currencyCode}`
      });
    }

    res.json({
      success: true,
      data: policy
    });
  } catch (error) {
    console.error('Error fetching currency policy:', error);
    res.status(500).json({
      error: 'Failed to fetch currency policy',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/currency-exchange/policies - Set currency policy
 */
router.post('/policies', async (req, res) => {
  try {
    const { currency_code, ...policyData } = req.body;
    
    if (!currency_code) {
      return res.status(400).json({
        error: 'Missing currency code',
        message: 'currency_code is required'
      });
    }

    const service = getCurrencyExchangeService();
    const policy = await service.setCurrencyPolicy(currency_code.toUpperCase(), policyData);

    res.status(201).json({
      success: true,
      data: policy,
      message: 'Currency policy set successfully'
    });
  } catch (error) {
    console.error('Error setting currency policy:', error);
    res.status(500).json({
      error: 'Failed to set currency policy',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/currency-exchange/interventions - Execute market intervention
 */
router.post('/interventions', async (req, res) => {
  try {
    const service = getCurrencyExchangeService();
    const intervention = await service.executeCurrencyIntervention(req.body);

    res.status(201).json({
      success: true,
      data: intervention,
      message: 'Currency intervention executed successfully'
    });
  } catch (error) {
    console.error('Error executing currency intervention:', error);
    res.status(500).json({
      error: 'Failed to execute currency intervention',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/currency-exchange/reserves/:civilization - Get reserve holdings
 */
router.get('/reserves/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const service = getCurrencyExchangeService();
    const reserves = await service.getCurrencyReserves(civilizationId);

    res.json({
      success: true,
      data: reserves,
      count: reserves.length
    });
  } catch (error) {
    console.error('Error fetching currency reserves:', error);
    res.status(500).json({
      error: 'Failed to fetch currency reserves',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/currency-exchange/reserves - Update reserve holdings
 */
router.put('/reserves', async (req, res) => {
  try {
    const { civilization_id, currency_code, reserve_type, amount } = req.body;
    
    if (!civilization_id || !currency_code || !reserve_type || amount === undefined) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'civilization_id, currency_code, reserve_type, and amount are required'
      });
    }

    const service = getCurrencyExchangeService();
    const reserve = await service.updateCurrencyReserves(civilization_id, currency_code.toUpperCase(), reserve_type, amount);

    res.json({
      success: true,
      data: reserve,
      message: 'Currency reserves updated successfully'
    });
  } catch (error) {
    console.error('Error updating currency reserves:', error);
    res.status(500).json({
      error: 'Failed to update currency reserves',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/currency-exchange/reserves/:civilization/adequacy - Assess reserve adequacy
 */
router.get('/reserves/:civilization/adequacy', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const service = getCurrencyExchangeService();
    const assessment = await service.getReserveAdequacyAssessment(civilizationId);

    res.json({
      success: true,
      data: assessment,
      count: assessment.length
    });
  } catch (error) {
    console.error('Error assessing reserve adequacy:', error);
    res.status(500).json({
      error: 'Failed to assess reserve adequacy',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/currency-exchange/unions - List currency unions
 */
router.get('/unions', async (req, res) => {
  try {
    const service = getCurrencyExchangeService();
    const unions = await service.getCurrencyUnions();

    res.json({
      success: true,
      data: unions,
      count: unions.length
    });
  } catch (error) {
    console.error('Error fetching currency unions:', error);
    res.status(500).json({
      error: 'Failed to fetch currency unions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/currency-exchange/unions - Create currency union
 */
router.post('/unions', async (req, res) => {
  try {
    const { union_name, common_currency_code } = req.body;
    
    if (!union_name || !common_currency_code) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'union_name and common_currency_code are required'
      });
    }

    const service = getCurrencyExchangeService();
    const union = await service.createCurrencyUnion(union_name, common_currency_code.toUpperCase());

    res.status(201).json({
      success: true,
      data: union,
      message: 'Currency union created successfully'
    });
  } catch (error) {
    console.error('Error creating currency union:', error);
    res.status(500).json({
      error: 'Failed to create currency union',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/currency-exchange/unions/:id/join - Join currency union
 */
router.post('/unions/:id/join', async (req, res) => {
  try {
    const unionId = parseInt(req.params.id);
    const { civilization_id, voting_weight } = req.body;
    
    if (!civilization_id) {
      return res.status(400).json({
        error: 'Missing civilization ID',
        message: 'civilization_id is required'
      });
    }

    const service = getCurrencyExchangeService();
    const member = await service.joinCurrencyUnion(unionId, civilization_id, voting_weight);

    res.status(201).json({
      success: true,
      data: member,
      message: 'Successfully joined currency union'
    });
  } catch (error) {
    console.error('Error joining currency union:', error);
    res.status(500).json({
      error: 'Failed to join currency union',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /api/currency-exchange/unions/:id/leave - Leave currency union
 */
router.delete('/unions/:id/leave', async (req, res) => {
  try {
    const unionId = parseInt(req.params.id);
    const { civilization_id } = req.body;
    
    if (!civilization_id) {
      return res.status(400).json({
        error: 'Missing civilization ID',
        message: 'civilization_id is required'
      });
    }

    const service = getCurrencyExchangeService();
    await service.leaveCurrencyUnion(unionId, civilization_id);

    res.json({
      success: true,
      message: 'Successfully left currency union'
    });
  } catch (error) {
    console.error('Error leaving currency union:', error);
    res.status(500).json({
      error: 'Failed to leave currency union',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/currency-exchange/analytics/strength-index - Currency strength analysis
 */
router.get('/analytics/strength-index', async (req, res) => {
  try {
    const service = getCurrencyExchangeService();
    const strengthIndex = await service.getCurrencyStrengthIndex();

    res.json({
      success: true,
      data: strengthIndex,
      count: strengthIndex.length
    });
  } catch (error) {
    console.error('Error fetching currency strength index:', error);
    res.status(500).json({
      error: 'Failed to fetch currency strength index',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/currency-exchange/analytics/market-summary - Market overview
 */
router.get('/analytics/market-summary', async (req, res) => {
  try {
    const service = getCurrencyExchangeService();
    const marketSummary = await service.getCurrencyMarketSummary();

    res.json({
      success: true,
      data: marketSummary
    });
  } catch (error) {
    console.error('Error fetching market summary:', error);
    res.status(500).json({
      error: 'Failed to fetch market summary',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
