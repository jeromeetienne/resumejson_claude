// npm imports
import { z } from 'zod';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Zod schemas for the ATS pipeline outputs.
//	Ported from resumejson_cli (src/ats/*_schema.ts).
//
//	Unlike ResumeJson, these are strict (all fields required): they are produced
//	by Claude in one shot and should be fully populated, so a missing field is a
//	real error the validate gate should surface.
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// ─── ats-score ───────────────────────────────────────────────────────────────

export const AtsScoreIssueSchema = z.object({
	severity: z.enum(['critical', 'major', 'minor']),
	category: z.enum([
		'missing_section',
		'weak_language',
		'missing_keywords',
		'poor_formatting',
		'missing_metrics',
		'vague_content',
		'acronym_not_expanded',
		'missing_contact_info',
	]),
	message: z.string().describe('Human-readable explanation of the issue'),
	suggestion: z.string().describe('Concrete fix the user can apply'),
});

export const AtsScoreSectionSchema = z.object({
	section: z.string().describe('Section title as it appears in the resume'),
	score: z.number().min(0).max(100).describe('ATS readiness score for this section'),
	issues: z.array(AtsScoreIssueSchema),
});

export const AtsScoreSchema = z.object({
	overallScore: z.number().min(0).max(100).describe('Overall ATS readiness score'),
	sectionScores: z.array(AtsScoreSectionSchema),
	missingCriticalSections: z.array(z.string())
		.describe('Standard sections entirely absent from the resume'),
	keywordDensity: z.enum(['low', 'moderate', 'high']).describe('How keyword-rich the resume is'),
	topStrengths: z.array(z.string()).max(5)
		.describe('Top things this resume does well for ATS'),
	topImprovements: z.array(z.string()).max(5)
		.describe('Most impactful changes to improve ATS performance'),
});

// ─── ats-review ──────────────────────────────────────────────────────────────

export const AtsReviewActionSchema = z.object({
	priority: z.enum(['high', 'medium', 'low']),
	category: z.enum([
		'keyword_gap',
		'formatting_issue',
		'section_missing',
		'section_reorder',
		'content_rewrite',
		'metrics_needed',
		'contact_info',
		'length_issue',
		'acronym_expansion',
	]),
	problem: z.string().describe('What is wrong or suboptimal'),
	action: z.string().describe('Exact action the user should take to fix this'),
	exampleBefore: z.string().describe('Current text or a representative snippet showing the problem'),
	exampleAfter: z.string().describe('Rewritten text after applying the fix'),
});

export const AtsReviewSchema = z.object({
	summary: z.string().describe('One-paragraph executive summary of the resume\'s ATS compliance'),
	complianceLevel: z.enum(['non_compliant', 'partially_compliant', 'mostly_compliant', 'fully_compliant'])
		.describe('Overall ATS compliance level'),
	actions: z.array(AtsReviewActionSchema)
		.describe('Ordered list of concrete actions to improve ATS compliance, highest priority first'),
	quickWins: z.array(z.string()).max(5)
		.describe('Easy fixes that can be done in under a minute each'),
	dealBreakers: z.array(z.string())
		.describe('Issues that will almost certainly cause ATS rejection if not fixed'),
});

// ─── ats-question ────────────────────────────────────────────────────────────

export const AtsQuestionItemSchema = z.object({
	priority: z.enum(['critical', 'important', 'optional']),
	category: z.enum([
		'target_role',
		'contact_info',
		'missing_metrics',
		'employment_gap',
		'work_experience',
		'education_details',
		'certification',
		'skills_gap',
	]),
	question: z.string().describe('Specific, direct question for the user to fill in the missing data'),
	context: z.string().describe('Which resume section or bullet prompted this question and why the data is needed for ATS'),
	answer: z.string().describe('The user\'s answer — empty when unanswered, filled by ats_answering'),
});

export const AtsQuestionSchema = z.object({
	questions: z.array(AtsQuestionItemSchema),
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Types inferred from the schemas.
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export type AtsScoreIssue = z.infer<typeof AtsScoreIssueSchema>;
export type AtsScoreSection = z.infer<typeof AtsScoreSectionSchema>;
export type AtsScore = z.infer<typeof AtsScoreSchema>;
export type AtsReviewAction = z.infer<typeof AtsReviewActionSchema>;
export type AtsReview = z.infer<typeof AtsReviewSchema>;
export type AtsQuestionItem = z.infer<typeof AtsQuestionItemSchema>;
export type AtsQuestion = z.infer<typeof AtsQuestionSchema>;
