// local imports
import type { AtsScore, AtsReview, AtsQuestion } from '../../src/misc/ats_schemas.js';

/** A valid `ats-score` output. */
export const SAMPLE_ATS_SCORE: AtsScore = {
	overallScore: 72,
	sectionScores: [
		{
			section: 'Work Experience',
			score: 80,
			issues: [
				{
					severity: 'minor',
					category: 'missing_metrics',
					message: 'Bullets describe impact without numbers.',
					suggestion: 'Add a percentage or count to the top bullet.',
				},
			],
		},
	],
	missingCriticalSections: [],
	keywordDensity: 'moderate',
	topStrengths: ['Standard section headings', 'Clear chronology'],
	topImprovements: ['Quantify achievements', 'Expand acronyms on first use'],
};

/** A valid `ats-review` output. */
export const SAMPLE_ATS_REVIEW: AtsReview = {
	summary: 'The resume parses cleanly but under-uses metrics and misses a LinkedIn URL.',
	complianceLevel: 'partially_compliant',
	actions: [
		{
			priority: 'high',
			category: 'metrics_needed',
			problem: 'The lead bullet states impact without a number.',
			action: 'Add the measured result to the bullet.',
			exampleBefore: 'Improved the build pipeline.',
			exampleAfter: 'Cut CI build time 40% (12m → 7m) by parallelizing tests.',
		},
	],
	quickWins: ['Add a LinkedIn URL to basics.profiles'],
	dealBreakers: [],
};

/** A valid `ats-question` output (unanswered). */
export const SAMPLE_ATS_QUESTION: AtsQuestion = {
	questions: [
		{
			priority: 'critical',
			category: 'target_role',
			question: 'What job title or industry are you targeting?',
			context: 'basics.label is empty; needed to optimize keywords.',
			answer: '',
		},
	],
};
