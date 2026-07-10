// local imports
import type { ResumeJson } from '../../src/misc/resume_schemas.js';

/**
 * A minimal but complete canonical {@link ResumeJson}: every top-level section key
 * is present (value, `null`, or `[]`), so it passes strict schema validation.
 */
export const SAMPLE_RESUME: ResumeJson = {
	$schema: null,
	basics: {
		name: 'Ada Lovelace',
		label: 'Analytical Engine Programmer',
		image: null,
		email: 'ada@example.com',
		phone: null,
		url: null,
		summary: 'Wrote the first algorithm intended for a machine.',
		location: {
			address: null,
			postalCode: null,
			city: 'London',
			countryCode: 'GB',
			region: null,
		},
		profiles: [
			{ network: 'GitHub', username: 'ada', url: 'https://github.com/ada' },
		],
	},
	work: [
		{
			name: 'Analytical Engine Project',
			location: 'London',
			description: 'Mechanical general-purpose computer',
			position: 'Programmer',
			url: null,
			startDate: '1842-01-01',
			endDate: '1843-01-01',
			summary: 'Translated and annotated the engine memoir.',
			highlights: ['Wrote the first published algorithm'],
		},
	],
	volunteer: [],
	education: [
		{
			institution: 'Self-taught',
			url: null,
			area: 'Mathematics',
			studyType: null,
			startDate: null,
			endDate: null,
			score: null,
			courses: null,
		},
	],
	awards: [],
	certificates: [],
	publications: [],
	skills: [
		{ name: 'Mathematics', level: 'Expert', keywords: ['algorithms', 'analysis'] },
	],
	languages: [],
	interests: [],
	references: [],
	projects: [],
	meta: {
		canonical: null,
		version: 'v1.0.0',
		lastModified: null,
	},
};
