// local imports
import type { JobPosting, JobMatch } from '../../src/misc/job_schemas.js';

/** A valid `job-posting`. */
export const SAMPLE_JOB_POSTING: JobPosting = {
	title: 'Senior Backend Engineer',
	company: 'Acme Pay',
	location: 'London, UK',
	employmentType: 'full_time',
	remote: 'hybrid',
	url: 'https://acme.example.com/careers/senior-backend',
	source: 'acme.example.com',
	postedDate: '2026-06-01',
	salaryText: '£90k–£110k',
	description: 'Own and evolve the payment services powering checkout.',
	responsibilities: ['Design and operate payment APIs', 'Mentor engineers'],
	requirements: ['5+ years backend experience', 'Go', 'PostgreSQL'],
	niceToHave: ['Kafka', 'Payments domain experience'],
	keywords: ['Go', 'PostgreSQL', 'Kafka', 'payments', 'APIs'],
};

/** A valid `job-match`. */
export const SAMPLE_JOB_MATCH: JobMatch = {
	overallFit: 78,
	verdict: 'strong',
	summary: 'Strong fit on backend and payments; the main gap is Kafka.',
	matchedRequirements: ['5+ years backend experience', 'Go', 'PostgreSQL'],
	missingRequirements: [],
	matchedKeywords: ['Go', 'PostgreSQL', 'payments', 'APIs'],
	missingKeywords: ['Kafka'],
	strengths: ['Direct payments-systems experience at Acme Pay'],
	gaps: ['No Kafka experience mentioned'],
	tailoringTips: ['Lead the summary with payments-infrastructure impact and the 40% latency win'],
};
