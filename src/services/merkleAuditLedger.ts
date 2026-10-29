import { AuditBlock, UserRole } from '../types';

/**
 * Simple SHA-256 simulation helper for browser environments
 */
export async function sha256(message: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback simple hash for testing environments
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
}

/**
 * Merkle Tree Root Calculator
 */
export async function calculateMerkleRoot(leaves: string[]): Promise<string> {
  if (leaves.length === 0) return await sha256('EMPTY_TREE');
  let currentLayer = [...leaves];

  while (currentLayer.length > 1) {
    const nextLayer: string[] = [];
    for (let i = 0; i < currentLayer.length; i += 2) {
      const left = currentLayer[i];
      const right = i + 1 < currentLayer.length ? currentLayer[i + 1] : left;
      const combined = await sha256(left + right);
      nextLayer.push(combined);
    }
    currentLayer = nextLayer;
  }

  return currentLayer[0];
}

export const INITIAL_GENESIS_BLOCK: AuditBlock = {
  blockIndex: 0,
  timestamp: '2024-01-01T00:00:00Z',
  fdrId: 'GENESIS-AICTE-REGULATION-BUREAU',
  action: 'GENESIS_INITIALIZATION',
  performedBy: 'AICTE Regulation Bureau Root Key',
  role: 'BUREAU_ADMIN',
  dataHash: '0000000000000000000000000000000000000000000000000000000000000000',
  previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
  merkleRoot: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
  ipAddress: '10.244.0.1 (NIC Central Gov Cloud)'
};

export class ImmutableAuditChain {
  private blocks: AuditBlock[] = [INITIAL_GENESIS_BLOCK];

  constructor(initialBlocks?: AuditBlock[]) {
    if (initialBlocks && initialBlocks.length > 0) {
      this.blocks = initialBlocks;
    }
  }

  public getBlocks(): AuditBlock[] {
    return [...this.blocks];
  }

  public async appendBlock(
    fdrId: string,
    action: string,
    performedBy: string,
    role: UserRole,
    payload: object
  ): Promise<AuditBlock> {
    const lastBlock = this.blocks[this.blocks.length - 1];
    const blockIndex = this.blocks.length;
    const timestamp = new Date().toISOString();
    const dataHash = await sha256(JSON.stringify(payload));
    const previousHash = await sha256(JSON.stringify(lastBlock));
    const merkleRoot = await calculateMerkleRoot([previousHash, dataHash]);

    const newBlock: AuditBlock = {
      blockIndex,
      timestamp,
      fdrId,
      action,
      performedBy,
      role,
      dataHash,
      previousHash,
      merkleRoot,
      ipAddress: '14.139.60.22 (NIC AICTE Gateway)'
    };

    this.blocks.push(newBlock);
    return newBlock;
  }

  public async verifyChainIntegrity(): Promise<{ isValid: boolean; brokenAtBlock?: number }> {
    for (let i = 1; i < this.blocks.length; i++) {
      const current = this.blocks[i];
      const previous = this.blocks[i - 1];

      const expectedPrevHash = await sha256(JSON.stringify(previous));
      if (current.previousHash !== expectedPrevHash) {
        return { isValid: false, brokenAtBlock: i };
      }
    }
    return { isValid: true };
  }
}

