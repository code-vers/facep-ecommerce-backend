import { describe, expect, it } from '@jest/globals';
import { OrderValidation } from './order.validation';

describe('OrderValidation', () => {
  describe('getMyOrdersQuerySchema', () => {
    it('accepts valid query parameters with allowed status tab', () => {
      const result = OrderValidation.getMyOrdersQuerySchema.safeParse({
        query: {
          page: '1',
          limit: '10',
          search: 'FCP-123456',
          status: 'Ordered'
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts empty query parameters', () => {
      const result = OrderValidation.getMyOrdersQuerySchema.safeParse({
        query: {}
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid status tab', () => {
      const result = OrderValidation.getMyOrdersQuerySchema.safeParse({
        query: {
          status: 'InvalidStatus'
        }
      });
      expect(result.success).toBe(false);
    });
  });

  describe('cancelOrderSchema', () => {
    it('accepts valid cancellation reason', () => {
      const result = OrderValidation.cancelOrderSchema.safeParse({
        body: {
          reason: 'Changed my mind'
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts empty body without reason', () => {
      const result = OrderValidation.cancelOrderSchema.safeParse({
        body: {}
      });
      expect(result.success).toBe(true);
    });

    it('rejects cancellation reason longer than 500 characters', () => {
      const result = OrderValidation.cancelOrderSchema.safeParse({
        body: {
          reason: 'a'.repeat(501)
        }
      });
      expect(result.success).toBe(false);
    });
  });
});
