/**
 * Neuro-Symbolic Multimodal OCR & Document Verification Engine
 * Inspired by:
 * - Xu et al. (KDD 2020): LayoutLM Visual-Text Transformer
 * - Al-Sumaidaee et al. (Elsevier FSIDI 2020): Error Level Analysis (ELA) for Certificate Forgery Detection
 */

export interface OcrExtractionResult {
  fdrNumber: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  depositAmount: number;
  amountInWords: string;
  issueDate: string;
  maturityDate: string;
  tenureYears: number;
  interestRate: number;
  jointHolderNames: string;
  rawConfidence: number; // 0 - 1.0
  elaForgeryScore: number; // 0 - 1.0 (Higher means suspect)
  detectedStamps: { label: string; confidence: number; boundingBox: [number, number, number, number] }[];
  boundingBoxes: { field: string; box: [number, number, number, number]; confidence: number }[];
  extractedHash: string;
}

export async function simulateNeuroSymbolicOcr(
  file: File | { name: string; size: number },
  presetType?: 'valid_sbi' | 'tampered_pnb' | 'shortfall_andhra' | 'single_holder'
): Promise<OcrExtractionResult> {
  // Simulate neural inference delay
  await new Promise(resolve => setTimeout(resolve, 850));

  const fileName = file.name.toLowerCase();

  // If user uploaded a file containing "tamper" or "fake" or "pnb", simulate forgery detection
  if (presetType === 'tampered_pnb' || fileName.includes('tamper') || fileName.includes('fake') || fileName.includes('pnb')) {
    return {
      fdrNumber: 'PNB-0081726354',
      bankName: 'Punjab National Bank',
      branchName: 'Mall Road, Kanpur',
      ifscCode: 'PUNB0024500',
      depositAmount: 1500000,
      amountInWords: 'Rupees Fifteen Lakh Only (Originally Five Lakh)',
      issueDate: '2024-05-10',
      maturityDate: '2034-05-10',
      tenureYears: 10,
      interestRate: 6.50,
      jointHolderNames: 'Uttaranchal Shiksha Parishad & Regional Officer, AICTE Kanpur',
      rawConfidence: 0.74,
      elaForgeryScore: 0.89, // High forgery alert!
      detectedStamps: [
        { label: 'Bank Cashier Stamp (Re-rasterized)', confidence: 0.62, boundingBox: [320, 480, 120, 60] }
      ],
      boundingBoxes: [
        { field: 'depositAmount', box: [120, 240, 180, 32], confidence: 0.58 }, // Low confidence / artifact
        { field: 'amountInWords', box: [120, 280, 420, 32], confidence: 0.61 }
      ],
      extractedHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
    };
  }

  if (presetType === 'single_holder' || fileName.includes('single') || fileName.includes('boi')) {
    return {
      fdrNumber: 'BOI-0077665544',
      bankName: 'Bank of India',
      branchName: 'Arera Colony, Bhopal',
      ifscCode: 'BKID0009012',
      depositAmount: 1500000,
      amountInWords: 'Rupees Fifteen Lakh Only',
      issueDate: '2023-08-10',
      maturityDate: '2033-08-10',
      tenureYears: 10,
      interestRate: 6.70,
      jointHolderNames: 'Shri Saraswati Vidya Samiti (Single Name)', // Missing AICTE RO!
      rawConfidence: 0.94,
      elaForgeryScore: 0.03,
      detectedStamps: [
        { label: 'Official Branch Seal', confidence: 0.96, boundingBox: [340, 490, 110, 55] }
      ],
      boundingBoxes: [
        { field: 'jointHolderNames', box: [110, 200, 380, 30], confidence: 0.95 }
      ],
      extractedHash: '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72'
    };
  }

  if (presetType === 'shortfall_andhra' || fileName.includes('shortfall') || fileName.includes('andhra')) {
    return {
      fdrNumber: 'ANDB-0055443322',
      bankName: 'Union Bank of India',
      branchName: 'Banjara Hills, Hyderabad',
      ifscCode: 'UBIN0800120',
      depositAmount: 1000000, // Shortfall (10L vs 15L)
      amountInWords: 'Rupees Ten Lakh Only',
      issueDate: '2021-07-15',
      maturityDate: '2031-07-15',
      tenureYears: 10,
      interestRate: 6.90,
      jointHolderNames: 'Secretary, Kakatiya Educational Academy & Regional Officer, AICTE SCRO Hyderabad',
      rawConfidence: 0.97,
      elaForgeryScore: 0.03,
      detectedStamps: [
        { label: 'Authorized Officer Seal', confidence: 0.95, boundingBox: [330, 480, 115, 60] }
      ],
      boundingBoxes: [
        { field: 'depositAmount', box: [115, 230, 160, 30], confidence: 0.98 }
      ],
      extractedHash: '68e656b251e67e8358bef8483ab0d51c6619f3e7a1a9f0e75838d41ff368f728'
    };
  }

  // Default clean authentic scan
  return {
    fdrNumber: `SBIN-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    bankName: 'State Bank of India',
    branchName: 'Main Commercial Branch',
    ifscCode: 'SBIN0000454',
    depositAmount: 3500000,
    amountInWords: 'Rupees Thirty Five Lakh Only',
    issueDate: new Date().toISOString().split('T')[0],
    maturityDate: new Date(Date.now() + 10 * 365.25 * 24 * 3600 * 1000).toISOString().split('T')[0],
    tenureYears: 10,
    interestRate: 7.10,
    jointHolderNames: 'Chairman/Secretary & Regional Officer, AICTE',
    rawConfidence: 0.98,
    elaForgeryScore: 0.02,
    detectedStamps: [
      { label: 'SBI Authorized Signatory Seal', confidence: 0.98, boundingBox: [350, 500, 120, 60] },
      { label: 'Non-encashable Lien Marking Stamp', confidence: 0.94, boundingBox: [80, 80, 180, 50] }
    ],
    boundingBoxes: [
      { field: 'depositAmount', box: [120, 220, 180, 30], confidence: 0.99 },
      { field: 'jointHolderNames', box: [120, 260, 400, 30], confidence: 0.97 }
    ],
    extractedHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  };
}

