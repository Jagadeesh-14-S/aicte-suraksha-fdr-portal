import { describe, it, expect } from 'vitest';
import { evaluateFdrDiscrepancies } from '../src/services/discrepancyDetector';
import { Institution, FdrInstrument } from '../src/types';

describe('AICTE-SURAKSHA 12-Point Discrepancy Detection Algorithm', () => {
  const mockInstitution: Institution = {
    id: 'INST-001',
    aicteId: '1-432890123',
    name: 'Maharashtra Institute of Technology & Research',
    trustName: 'MAEER Educational Trust, Pune',
    region: 'WRO_MUMBAI',
    state: 'Maharashtra',
    city: 'Pune',
    category: 'Engineering & Technology',
    email: 'principal@mitr.ac.in',
    phone: '+91 20 2543 8900',
    totalApprovedIntake: 600,
    establishedYear: 2014,
    activeFdrCount: 1,
    totalDepositValue: 3500000,
    complianceScore: 100
  };

  it('should flag a critical discrepancy when AICTE Regional Officer joint holding clause is missing', () => {
    const invalidFdr: Partial<FdrInstrument> = {
      fdrNumber: 'TEST-001',
      depositAmount: 3500000,
      jointHolderNames: 'MAEER Educational Trust Pune (Sole Holder)', // Missing AICTE RO!
      issueDate: '2024-01-01',
      maturityDate: '2034-01-01',
      ifscCode: 'SBIN0000454',
      accountNumber: '39281729401',
      lienStatus: 'LIEN_CONFIRMED'
    };

    const result = evaluateFdrDiscrepancies(invalidFdr, mockInstitution);
    expect(result.isCompliant).toBe(false);
    expect(result.criticalCount).toBeGreaterThanOrEqual(1);
    const jointFlag = result.discrepancies.find(d => d.code === 'APH-JOINT-CLAUSE-VIOLATION');
    expect(jointFlag).toBeDefined();
    expect(jointFlag?.severity).toBe('CRITICAL');
  });

  it('should flag an amount shortfall when deposit is below AICTE APH prescribed norm', () => {
    const shortfallFdr: Partial<FdrInstrument> = {
      fdrNumber: 'TEST-002',
      depositAmount: 1500000, // Shortfall for Engineering! APH requires 35L
      jointHolderNames: 'Secretary, MAEER Trust & Regional Officer, AICTE WRO Mumbai',
      issueDate: '2024-01-01',
      maturityDate: '2034-01-01',
      ifscCode: 'SBIN0000454',
      accountNumber: '39281729401',
      lienStatus: 'LIEN_CONFIRMED'
    };

    const result = evaluateFdrDiscrepancies(shortfallFdr, mockInstitution);
    expect(result.isCompliant).toBe(false);
    const amtFlag = result.discrepancies.find(d => d.code === 'APH-AMOUNT-SHORTFALL');
    expect(amtFlag).toBeDefined();
    expect(amtFlag?.severity).toBe('CRITICAL');
  });

  it('should pass cleanly when all AICTE Approval Process Handbook criteria are met', () => {
    const validFdr: Partial<FdrInstrument> = {
      fdrNumber: 'SBIN-0029384712',
      depositAmount: 3500000,
      jointHolderNames: 'Secretary, MAEER Educational Trust, Pune and Regional Officer, AICTE Western Regional Office, Mumbai',
      issueDate: '2024-06-15',
      maturityDate: '2034-06-15',
      ifscCode: 'SBIN0000454',
      accountNumber: '39281729401',
      lienStatus: 'LIEN_CONFIRMED',
      region: 'WRO_MUMBAI',
      isForgedSuspect: false,
      forgeryConfidenceScore: 0.02
    };

    const result = evaluateFdrDiscrepancies(validFdr, mockInstitution);
    expect(result.isCompliant).toBe(true);
    expect(result.criticalCount).toBe(0);
    expect(result.complianceScore).toBe(100);
  });
});
