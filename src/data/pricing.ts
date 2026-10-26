export interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  limits?: string[];
  ctaText: string;
  ctaAction: 'students' | 'colleges' | 'together';
  popular?: boolean;
}

export interface PayPerUseItem {
  name: string;
  price: string;
  description: string;
}

export const PRICING_DATA = {
  currency: '₹',
  tiers: [
    {
      id: 'university',
      name: 'University Plan',
      badge: 'For Colleges',
      description: 'A cohort-wide readiness program for placement departments preparing final-year students for recruitment drives.',
      price: '₹449',
      period: '+ GST per student / 3 months',
      features: [
        'Readiness scores across Technical, Aptitude, Communication & HR',
        'Cohort-wide placement readiness dashboard',
        'Early-intervention filter for students needing support (< 60 days)',
        'Cohort skill-gap analytics by branch and target role',
        'Unlimited learning roadmaps, readiness updates & job matching',
      ],
      limits: [
        '100–200 ATS resume reviews per student',
        '30 mock interviews per student',
        '60 aptitude tests per student',
        '5 project recommendations per student',
      ],
      ctaText: 'Talk to us about your college',
      ctaAction: 'colleges',
      popular: true,
    },
    {
      id: 'individual',
      name: 'Individual Plan',
      badge: 'For Students',
      description: 'Self-serve monthly access for students, graduates, and job-seekers preparing independently.',
      price: '₹349',
      period: 'per month',
      features: [
        'Full access to all 9 readiness modules',
        'Continuous readiness score calculation',
        'Adaptive personalized learning roadmap',
        'Role suitability match against target benchmarks',
        'Daily prioritized actions in the Command Center',
      ],
      limits: [
        '100–200 ATS resume reviews / month',
        '30 mock interviews / month',
        '60 aptitude tests / month',
        '5 project recommendations / month',
      ],
      ctaText: 'Get early access',
      ctaAction: 'students',
      popular: false,
    },
  ] as PricingTier[],

  payPerUse: [
    {
      name: 'ATS Resume Review & Formatting',
      price: '₹59',
      description: 'Score your resume against a target job description with keyword gap analysis and bullet improvements.',
    },
    {
      name: 'Personalized Career Roadmap',
      price: '₹49',
      description: 'A sequenced week-by-week learning path built specifically around your verified skill gaps.',
    },
    {
      name: 'AI Mock Interview (Tech / HR)',
      price: '₹100',
      description: 'Adaptive role-specific interview round with structured correctness, communication, and time feedback.',
    },
    {
      name: 'Aptitude & DSA Preparation',
      price: '₹100',
      description: 'Timed assessment rounds covering reasoning, quantitative aptitude, and core data structure patterns.',
    },
  ] as PayPerUseItem[],
};
