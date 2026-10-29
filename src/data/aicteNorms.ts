import { InstitutionCategory, RegionalOffice } from '../types';

export interface AicteDepositNorm {
  category: InstitutionCategory;
  standardNormAmount: number; // in INR (e.g. 35,00,000 for Engineering)
  concessionNormAmount: number; // For Women/SC/ST/NER/J&K institutions
  mandatoryLockInYears: number; // Usually 8 to 10 years
  jointNamePattern: string;
  regulatoryClause: string;
}

export const AICTE_DEPOSIT_NORMS: Record<InstitutionCategory, AicteDepositNorm> = {
  'Engineering & Technology': {
    category: 'Engineering & Technology',
    standardNormAmount: 3500000, // 35 Lakhs
    concessionNormAmount: 2800000, // 28 Lakhs (Concessional)
    mandatoryLockInYears: 10,
    jointNamePattern: "Chairman/Secretary, [Trust Name] and Regional Officer, AICTE [Region]",
    regulatoryClause: "AICTE APH Chapter 1, Section 1.4.2 & Appendix 14: Security Deposit in Joint FDR format"
  },
  'Management (MBA/PGDM)': {
    category: 'Management (MBA/PGDM)',
    standardNormAmount: 1500000, // 15 Lakhs
    concessionNormAmount: 1200000,
    mandatoryLockInYears: 10,
    jointNamePattern: "Chairman/Secretary, [Trust Name] and Regional Officer, AICTE [Region]",
    regulatoryClause: "AICTE APH Chapter 1, Clause 1.4.3: Security Deposit for Standalone Management Institutes"
  },
  'Pharmacy': {
    category: 'Pharmacy',
    standardNormAmount: 1500000, // 15 Lakhs
    concessionNormAmount: 1200000,
    mandatoryLockInYears: 10,
    jointNamePattern: "Chairman/Secretary, [Trust Name] and Regional Officer, AICTE [Region]",
    regulatoryClause: "AICTE APH Chapter 1, Clause 1.4.4: Corpus / FDR maintenance for Technical Pharmacy Programs"
  },
  'Computer Applications (MCA)': {
    category: 'Computer Applications (MCA)',
    standardNormAmount: 1500000, // 15 Lakhs
    concessionNormAmount: 1200000,
    mandatoryLockInYears: 10,
    jointNamePattern: "Chairman/Secretary, [Trust Name] and Regional Officer, AICTE [Region]",
    regulatoryClause: "AICTE APH Chapter 1, Clause 1.4.5: Fixed Deposit Receipt for Computer Applications"
  },
  'Architecture & Planning': {
    category: 'Architecture & Planning',
    standardNormAmount: 1500000, // 15 Lakhs
    concessionNormAmount: 1200000,
    mandatoryLockInYears: 10,
    jointNamePattern: "Chairman/Secretary, [Trust Name] and Regional Officer, AICTE [Region]",
    regulatoryClause: "AICTE APH Chapter 1, Clause 1.4.6: Security Deposit for Built Environment Programs"
  },
  'Polytechnic Diploma': {
    category: 'Polytechnic Diploma',
    standardNormAmount: 1500000, // 15 Lakhs
    concessionNormAmount: 1000000,
    mandatoryLockInYears: 10,
    jointNamePattern: "Chairman/Secretary, [Trust Name] and Regional Officer, AICTE [Region]",
    regulatoryClause: "AICTE APH Chapter 1, Clause 1.4.7: Polytechnic Security Deposit & RPGF Rules"
  }
};

export const REGIONAL_OFFICES_METADATA: Record<RegionalOffice, { name: string; city: string; statesCovered: string[] }> = {
  'WRO_MUMBAI': {
    name: 'Western Regional Office (WRO)',
    city: 'Mumbai',
    statesCovered: ['Maharashtra', 'Goa']
  },
  'SRO_CHENNAI': {
    name: 'Southern Regional Office (SRO)',
    city: 'Chennai',
    statesCovered: ['Tamil Nadu', 'Puducherry']
  },
  'SWRO_BENGALURU': {
    name: 'South-Western Regional Office (SWRO)',
    city: 'Bengaluru',
    statesCovered: ['Karnataka', 'Kerala', 'Lakshadweep']
  },
  'NRO_KANPUR': {
    name: 'Northern Regional Office (NRO)',
    city: 'Kanpur',
    statesCovered: ['Uttar Pradesh', 'Uttarakhand']
  },
  'NWRO_CHANDIGARH': {
    name: 'North-Western Regional Office (NWRO)',
    city: 'Chandigarh',
    statesCovered: ['Punjab', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Delhi']
  },
  'CRO_BHOPAL': {
    name: 'Central Regional Office (CRO)',
    city: 'Bhopal',
    statesCovered: ['Madhya Pradesh', 'Chhattisgarh', 'Gujarat']
  },
  'SCRO_HYDERABAD': {
    name: 'South-Central Regional Office (SCRO)',
    city: 'Hyderabad',
    statesCovered: ['Andhra Pradesh', 'Telangana']
  },
  'ERO_KOLKATA': {
    name: 'Eastern Regional Office (ERO)',
    city: 'Kolkata',
    statesCovered: ['West Bengal', 'Bihar', 'Odisha', 'Jharkhand', 'Assam', 'North-East States', 'Andaman & Nicobar']
  }
};

