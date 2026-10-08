import { describe, it, expect } from 'vitest';
import { calculateTimeLeft } from '../src/components/ui/CountdownTimer';
import { calculateProgress } from '../src/components/ui/FlashSaleProgressBar';
import { prisma } from '../src/lib/db';

describe('Flash Sale Realtime Calculations', () => {
  describe('CountdownTimer Time Calculation', () => {
    it('calculates remaining hours, minutes, seconds for future target date', () => {
      const now = Date.now();
      // Target: 2 hours, 15 minutes, 30 seconds from now
      const target = new Date(now + (2 * 3600 + 15 * 60 + 30) * 1000);
      const timeLeft = calculateTimeLeft(target);

      expect(timeLeft.total).toBeGreaterThan(0);
      expect(timeLeft.hours).toBe(2);
      expect(timeLeft.minutes).toBe(15);
      expect(timeLeft.seconds).toBeGreaterThanOrEqual(29);
      expect(timeLeft.seconds).toBeLessThanOrEqual(30);
    });

    it('returns zero for past dates (expired countdown)', () => {
      const past = new Date(Date.now() - 5000);
      const timeLeft = calculateTimeLeft(past);

      expect(timeLeft.total).toBe(0);
      expect(timeLeft.hours).toBe(0);
      expect(timeLeft.minutes).toBe(0);
      expect(timeLeft.seconds).toBe(0);
    });
  });

  describe('FlashSaleProgressBar Heat Calculation', () => {
    it('calculates normal progress when sold quantity is moderate', () => {
      const progress = calculateProgress(25, 100);
      expect(progress.percent).toBe(25);
      expect(progress.remaining).toBe(75);
      expect(progress.isSoldOut).toBe(false);
      expect(progress.isNearlySoldOut).toBe(false);
    });

    it('detects nearly sold out status when progress exceeds 80%', () => {
      const progress = calculateProgress(85, 100);
      expect(progress.percent).toBe(85);
      expect(progress.remaining).toBe(15);
      expect(progress.isSoldOut).toBe(false);
      expect(progress.isNearlySoldOut).toBe(true);
    });

    it('detects sold out status when sold reaches or exceeds limit', () => {
      const exactSoldOut = calculateProgress(50, 50);
      expect(exactSoldOut.percent).toBe(100);
      expect(exactSoldOut.remaining).toBe(0);
      expect(exactSoldOut.isSoldOut).toBe(true);
      expect(exactSoldOut.isNearlySoldOut).toBe(false);

      const overSoldOut = calculateProgress(65, 50);
      expect(overSoldOut.percent).toBe(100);
      expect(overSoldOut.remaining).toBe(0);
      expect(overSoldOut.isSoldOut).toBe(true);
    });
  });

  describe('Database FlashSale Models', () => {
    it('has flashSale and flashSaleItem models on prisma client', () => {
      expect(prisma.flashSale).toBeDefined();
      expect(typeof prisma.flashSale.findMany).toBe('function');
      expect(prisma.flashSaleItem).toBeDefined();
      expect(typeof prisma.flashSaleItem.findMany).toBe('function');
    });
  });
});
