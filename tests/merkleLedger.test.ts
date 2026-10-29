import { describe, it, expect } from 'vitest';
import { ImmutableAuditChain, calculateMerkleRoot, sha256 } from '../src/services/merkleAuditLedger';

describe('AICTE-SURAKSHA Cryptographic Merkle Audit Ledger', () => {
  it('should calculate deterministic SHA-256 hash', async () => {
    const hash1 = await sha256('AICTE_REGULATION_BUREAU');
    const hash2 = await sha256('AICTE_REGULATION_BUREAU');
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBeGreaterThan(10);
  });

  it('should compute Merkle root from leaf node hashes', async () => {
    const leaves = [
      await sha256('BLOCK_DATA_1'),
      await sha256('BLOCK_DATA_2'),
      await sha256('BLOCK_DATA_3')
    ];

    const root = await calculateMerkleRoot(leaves);
    expect(root).toBeDefined();
    expect(typeof root).toBe('string');
  });

  it('should append blocks and verify chain integrity', async () => {
    const chain = new ImmutableAuditChain();
    
    await chain.appendBlock(
      'FDR-TEST-001',
      'SUBMITTED',
      'Registrar XYZ',
      'INSTITUTION_USER',
      { amount: 3500000 }
    );

    await chain.appendBlock(
      'FDR-TEST-001',
      'BANK_LIEN_CONFIRMED',
      'Chief Manager SBI',
      'BANK_OFFICER',
      { cbsRef: 'CBS-SBI-9912' }
    );

    const blocks = chain.getBlocks();
    expect(blocks.length).toBe(3); // Genesis + 2

    const integrity = await chain.verifyChainIntegrity();
    expect(integrity.isValid).toBe(true);
  });
});
