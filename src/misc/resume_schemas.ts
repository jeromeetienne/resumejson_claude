// npm imports
import { z } from 'zod';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Zod schema for the JSON Resume format.
//	Ported from resumejson_cli (data/schemas/resume.schema.json).
//
//	Every field is `.nullable().default(null)`: lenient input, canonical output.
//	Real JSON Resume documents may omit sections and fields, so any missing key is
//	accepted and normalized to `null` on parse. The parsed value therefore always
//	carries all keys (value or `null`) — a stable shape for downstream tools to
//	walk — while wrong types are still rejected.
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export const Iso8601Schema = z.string()
	.regex(/^([1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]|[1-2][0-9]{3}-[0-1][0-9]|[1-2][0-9]{3})$/)
	.describe('Similar to the standard date type, but each section after the year is optional. e.g. 2014-06-29 or 2023-04');

export const ResumeLocationSchema = z.object({
	address: z.string()
		.describe('To add multiple address lines, use \\n. For example, 1234 Glücklichkeit Straße\\nHinterhaus 5. Etage li.')
		.nullable().default(null),
	postalCode: z.string().nullable().default(null),
	city: z.string().nullable().default(null),
	countryCode: z.string()
		.describe('code as per ISO-3166-1 ALPHA-2, e.g. US, AU, IN')
		.nullable().default(null),
	region: z.string()
		.describe('The general region where you live. Can be a US state, or a province, for instance.')
		.nullable().default(null),
});

export const ResumeProfileSchema = z.object({
	network: z.string()
		.describe('e.g. Facebook or Twitter')
		.nullable().default(null),
	username: z.string()
		.describe('e.g. neutralthoughts')
		.nullable().default(null),
	url: z.string()
		.describe('e.g. http://twitter.example.com/neutralthoughts')
		.nullable().default(null),
});

export const ResumeBasicsSchema = z.object({
	name: z.string().nullable().default(null),
	label: z.string()
		.describe('e.g. Web Developer')
		.nullable().default(null),
	image: z.string()
		.describe('URL (as per RFC 3986) to a image in JPEG or PNG format')
		.nullable().default(null),
	email: z.string()
		.describe('e.g. thomas@gmail.com')
		.nullable().default(null),
	phone: z.string()
		.describe('Phone numbers are stored as strings so use any format you like, e.g. 712-117-2923')
		.nullable().default(null),
	url: z.string()
		.describe('URL (as per RFC 3986) to your website, e.g. personal homepage')
		.nullable().default(null),
	summary: z.string()
		.describe('Write a short 2-3 sentence biography about yourself')
		.nullable().default(null),
	location: ResumeLocationSchema.nullable().default(null),
	profiles: z.array(ResumeProfileSchema)
		.describe('Specify any number of social networks that you participate in')
		.nullable().default(null),
});

export const ResumeWorkSchema = z.object({
	name: z.string()
		.describe('e.g. Facebook')
		.nullable().default(null),
	location: z.string()
		.describe('e.g. Menlo Park, CA')
		.nullable().default(null),
	description: z.string()
		.describe('e.g. Social Media Company')
		.nullable().default(null),
	position: z.string()
		.describe('e.g. Software Engineer')
		.nullable().default(null),
	url: z.string()
		.describe('e.g. http://facebook.example.com')
		.nullable().default(null),
	startDate: Iso8601Schema.nullable().default(null),
	endDate: Iso8601Schema.nullable().default(null),
	summary: z.string()
		.describe('Give an overview of your responsibilities at the company')
		.nullable().default(null),
	highlights: z.array(z.string())
		.describe('Specify multiple accomplishments')
		.nullable().default(null),
});

export const ResumeVolunteerSchema = z.object({
	organization: z.string()
		.describe('e.g. Facebook')
		.nullable().default(null),
	position: z.string()
		.describe('e.g. Software Engineer')
		.nullable().default(null),
	url: z.string()
		.describe('e.g. http://facebook.example.com')
		.nullable().default(null),
	startDate: Iso8601Schema.nullable().default(null),
	endDate: Iso8601Schema.nullable().default(null),
	summary: z.string()
		.describe('Give an overview of your responsibilities at the company')
		.nullable().default(null),
	highlights: z.array(z.string())
		.describe('Specify accomplishments and achievements')
		.nullable().default(null),
});

export const ResumeEducationSchema = z.object({
	institution: z.string()
		.describe('e.g. Massachusetts Institute of Technology')
		.nullable().default(null),
	url: z.string()
		.describe('e.g. http://facebook.example.com')
		.nullable().default(null),
	area: z.string()
		.describe('e.g. Arts')
		.nullable().default(null),
	studyType: z.string()
		.describe('e.g. Bachelor')
		.nullable().default(null),
	startDate: Iso8601Schema.nullable().default(null),
	endDate: Iso8601Schema.nullable().default(null),
	score: z.string()
		.describe('grade point average, e.g. 3.67/4.0')
		.nullable().default(null),
	courses: z.array(z.string())
		.describe('List notable courses/subjects')
		.nullable().default(null),
});

export const ResumeAwardSchema = z.object({
	title: z.string()
		.describe('e.g. One of the 100 greatest minds of the century')
		.nullable().default(null),
	date: Iso8601Schema.nullable().default(null),
	awarder: z.string()
		.describe('e.g. Time Magazine')
		.nullable().default(null),
	summary: z.string()
		.describe('e.g. Received for my work with Quantum Physics')
		.nullable().default(null),
});

export const ResumeCertificateSchema = z.object({
	name: z.string()
		.describe('e.g. Certified Kubernetes Administrator')
		.nullable().default(null),
	date: Iso8601Schema.nullable().default(null),
	url: z.string()
		.describe('e.g. http://example.com')
		.nullable().default(null),
	issuer: z.string()
		.describe('e.g. CNCF')
		.nullable().default(null),
});

export const ResumePublicationSchema = z.object({
	name: z.string()
		.describe('e.g. The World Wide Web')
		.nullable().default(null),
	publisher: z.string()
		.describe('e.g. IEEE, Computer Magazine')
		.nullable().default(null),
	releaseDate: Iso8601Schema.nullable().default(null),
	url: z.string()
		.describe('e.g. http://www.computer.org.example.com/csdl/mags/co/1996/10/rx069-abs.html')
		.nullable().default(null),
	summary: z.string()
		.describe('Short summary of publication. e.g. Discussion of the World Wide Web, HTTP, HTML.')
		.nullable().default(null),
});

export const ResumeSkillSchema = z.object({
	name: z.string()
		.describe('e.g. Web Development')
		.nullable().default(null),
	level: z.string()
		.describe('e.g. Master')
		.nullable().default(null),
	keywords: z.array(z.string())
		.describe('List some keywords pertaining to this skill')
		.nullable().default(null),
});

export const ResumeLanguageSchema = z.object({
	language: z.string()
		.describe('e.g. English, Spanish')
		.nullable().default(null),
	fluency: z.string()
		.describe('e.g. Fluent, Beginner')
		.nullable().default(null),
});

export const ResumeInterestSchema = z.object({
	name: z.string()
		.describe('e.g. Philosophy')
		.nullable().default(null),
	keywords: z.array(z.string()).nullable().default(null),
});

export const ResumeReferenceSchema = z.object({
	name: z.string()
		.describe('e.g. Timothy Cook')
		.nullable().default(null),
	reference: z.string()
		.describe('e.g. Joe blogs was a great employee, who turned up to work at least once a week. He exceeded my expectations when it came to doing nothing.')
		.nullable().default(null),
});

export const ResumeProjectSchema = z.object({
	name: z.string()
		.describe('e.g. The World Wide Web')
		.nullable().default(null),
	description: z.string()
		.describe('Short summary of project. e.g. Collated works of 2017.')
		.nullable().default(null),
	highlights: z.array(z.string())
		.describe('Specify multiple features')
		.nullable().default(null),
	keywords: z.array(z.string())
		.describe('Specify special elements involved')
		.nullable().default(null),
	startDate: Iso8601Schema.nullable().default(null),
	endDate: Iso8601Schema.nullable().default(null),
	url: z.string()
		.describe('e.g. http://www.computer.org/csdl/mags/co/1996/10/rx069-abs.html')
		.nullable().default(null),
	roles: z.array(z.string())
		.describe('Specify your role on this project or in company')
		.nullable().default(null),
	entity: z.string()
		.describe('Specify the relevant company/entity affiliations e.g. \'greenpeace\', \'corporationXYZ\'')
		.nullable().default(null),
	type: z.string()
		.describe('e.g. \'volunteering\', \'presentation\', \'talk\', \'application\', \'conference\'')
		.nullable().default(null),
});

export const ResumeMetaSchema = z.object({
	canonical: z.string()
		.describe('URL (as per RFC 3986) to latest version of this document')
		.nullable().default(null),
	version: z.string()
		.describe('A version field which follows semver - e.g. v1.0.0')
		.nullable().default(null),
	lastModified: z.string()
		.describe('Using ISO 8601 with YYYY-MM-DDThh:mm:ss')
		.nullable().default(null),
});

export const ResumeJsonSchema = z.object({
	$schema: z.string()
		.describe('link to the version of the schema that can validate the resume')
		.nullable().default(null),
	basics: ResumeBasicsSchema.nullable().default(null),
	work: z.array(ResumeWorkSchema).nullable().default(null),
	volunteer: z.array(ResumeVolunteerSchema).nullable().default(null),
	education: z.array(ResumeEducationSchema).nullable().default(null),
	awards: z.array(ResumeAwardSchema)
		.describe('Specify any awards you have received throughout your professional career')
		.nullable().default(null),
	certificates: z.array(ResumeCertificateSchema)
		.describe('Specify any certificates you have received throughout your professional career')
		.nullable().default(null),
	publications: z.array(ResumePublicationSchema)
		.describe('Specify your publications through your career')
		.nullable().default(null),
	skills: z.array(ResumeSkillSchema)
		.describe('List out your professional skill-set')
		.nullable().default(null),
	languages: z.array(ResumeLanguageSchema)
		.describe('List any other languages you speak')
		.nullable().default(null),
	interests: z.array(ResumeInterestSchema).nullable().default(null),
	references: z.array(ResumeReferenceSchema)
		.describe('List references you have received')
		.nullable().default(null),
	projects: z.array(ResumeProjectSchema)
		.describe('Specify career projects')
		.nullable().default(null),
	meta: ResumeMetaSchema
		.describe('The schema version and any other tooling configuration lives here')
		.nullable().default(null),
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	Types inferred from the schemas — the single source of truth.
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export type ResumeLocation = z.infer<typeof ResumeLocationSchema>;
export type ResumeProfile = z.infer<typeof ResumeProfileSchema>;
export type ResumeBasics = z.infer<typeof ResumeBasicsSchema>;
export type ResumeWork = z.infer<typeof ResumeWorkSchema>;
export type ResumeVolunteer = z.infer<typeof ResumeVolunteerSchema>;
export type ResumeEducation = z.infer<typeof ResumeEducationSchema>;
export type ResumeAward = z.infer<typeof ResumeAwardSchema>;
export type ResumeCertificate = z.infer<typeof ResumeCertificateSchema>;
export type ResumePublication = z.infer<typeof ResumePublicationSchema>;
export type ResumeSkill = z.infer<typeof ResumeSkillSchema>;
export type ResumeLanguage = z.infer<typeof ResumeLanguageSchema>;
export type ResumeInterest = z.infer<typeof ResumeInterestSchema>;
export type ResumeReference = z.infer<typeof ResumeReferenceSchema>;
export type ResumeProject = z.infer<typeof ResumeProjectSchema>;
export type ResumeMeta = z.infer<typeof ResumeMetaSchema>;
export type ResumeJson = z.infer<typeof ResumeJsonSchema>;
