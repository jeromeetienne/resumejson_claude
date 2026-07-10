// npm imports
import { z } from 'zod';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Zod schemas for the job-search skill.
//
//	A `job-posting` is a structured capture of a real job ad (extracted by Claude
//	from a web page — never fabricated). A `job-match` scores one posting against a
//	ResumeJson. Both are strict, one-shot Claude outputs that should be fully
//	populated; genuinely-optional page fields (location, salary, dates) are nullable.
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// ─── job-posting ─────────────────────────────────────────────────────────────

export const JobPostingSchema = z.object({
	title: z.string().describe('Job title as stated in the posting'),
	company: z.string().describe('Hiring company / organization'),
	location: z.string().nullable().describe('Location as stated, or null if not given'),
	employmentType: z.enum(['full_time', 'part_time', 'contract', 'internship', 'temporary', 'other'])
		.nullable().describe('Employment type if stated'),
	remote: z.enum(['on_site', 'hybrid', 'remote', 'unspecified']).describe('Work arrangement'),
	url: z.string().describe('Canonical URL of the posting'),
	source: z.string().describe('Where it was found, e.g. the job board or site name / domain'),
	postedDate: z.string().nullable().describe('Posting date as stated (ISO-8601 or free text), or null'),
	salaryText: z.string().nullable().describe('Compensation as stated, verbatim, or null'),
	description: z.string().describe('Short summary of the role in your own words'),
	responsibilities: z.array(z.string()).describe('Key responsibilities listed'),
	requirements: z.array(z.string()).describe('Required qualifications / must-haves'),
	niceToHave: z.array(z.string()).describe('Preferred / nice-to-have qualifications'),
	keywords: z.array(z.string()).describe('Skills, tools, and technologies named in the posting'),
});

// ─── job-match ───────────────────────────────────────────────────────────────

export const JobMatchSchema = z.object({
	overallFit: z.number().min(0).max(100).describe('How well the resume fits the posting, 0-100'),
	verdict: z.enum(['strong', 'possible', 'weak']).describe('Overall fit verdict'),
	summary: z.string().describe('One-paragraph explanation of the fit'),
	matchedRequirements: z.array(z.string()).describe('Posting requirements the resume clearly satisfies'),
	missingRequirements: z.array(z.string()).describe('Posting requirements the resume does not evidence'),
	matchedKeywords: z.array(z.string()).describe('Posting keywords present in the resume'),
	missingKeywords: z.array(z.string()).describe('Posting keywords absent from the resume'),
	strengths: z.array(z.string()).describe('Where the candidate is a strong fit'),
	gaps: z.array(z.string()).describe('Notable gaps to be aware of'),
	tailoringTips: z.array(z.string()).describe('Concrete ways to tailor the resume for this posting (no fabrication)'),
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Types inferred from the schemas.
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export type JobPosting = z.infer<typeof JobPostingSchema>;
export type JobMatch = z.infer<typeof JobMatchSchema>;
