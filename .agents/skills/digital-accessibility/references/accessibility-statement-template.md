# Accessibility Statement Template

Use this template when a user asks for an accessibility statement. Customize all bracketed fields.

---

## Template

```markdown
# Accessibility Statement for [Organization Name]

**Last updated: [Date]**

[Organization Name] is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.

## Conformance Status

This [website/application] aims to conform to the [Web Content Accessibility Guidelines (WCAG) 2.2 Level AA / other applicable standard]. [Current conformance status: choose one]:

- **Fully conformant**: The content fully conforms to the accessibility standard without any exceptions.
- **Partially conformant**: Some parts of the content do not fully conform to the accessibility standard.
- **Non-conformant**: The content does not conform to the accessibility standard.

[If partially conformant, describe known limitations below.]

## Known Limitations

We are aware of the following accessibility limitations:

| Area | Description | Remediation Plan | Timeline |
|------|-------------|------------------|----------|
| [e.g., Video content] | [e.g., Some older videos lack captions] | [e.g., Captioning all videos] | [e.g., Quarter and year] |
| [e.g., PDF documents] | [e.g., Some PDFs are not tagged for screen readers] | [e.g., Remediating priority documents] | [e.g., Ongoing] |

## Compatibility

This [website/application] is designed to be compatible with the following assistive technologies:

- Screen readers (NVDA, JAWS, VoiceOver, TalkBack)
- Screen magnification software
- Speech recognition software
- Keyboard-only navigation

This [website/application] is not compatible with:
- [List any known incompatibilities, e.g., "Browsers older than 3 major versions"]

## Technical Specifications

Accessibility of this [website/application] relies on the following technologies:

- HTML
- CSS
- JavaScript
- WAI-ARIA

These technologies are relied upon for conformance with the accessibility standards used.

## Assessment Methods

[Organization Name] assessed the accessibility of this [website/application] through:

- [Self-evaluation / external audit / user testing with people with disabilities / automated testing: list applicable methods]
- [If audited: "An independent accessibility audit was conducted by [Auditor Name] on [Date]."]

## Feedback

We welcome your feedback on the accessibility of [this website/application/Organization Name's digital services]. Please let us know if you encounter accessibility barriers:

- **Email**: [accessibility@example.com]
- **Phone**: [phone number]
- **Mailing address**: [physical address]
- **Response time**: We aim to respond to feedback within [X] business days.

## Enforcement Procedure

[Choose the applicable section based on jurisdiction:]

**For US organizations (ADA):**
If you are not satisfied with our response, you may file a complaint with the U.S. Department of Justice, Civil Rights Division, or pursue other legal remedies under the ADA.

**For Ontario organizations (AODA):**
If you are not satisfied with our response, you may contact the Accessibility Directorate of Ontario or file a complaint with the Human Rights Tribunal of Ontario.

**For Canadian federal organizations (ACA):**
If you are not satisfied with our response, you may file a complaint with the Accessibility Commissioner at the Canadian Human Rights Commission.

**For EU organizations (EAA / Web Accessibility Directive):**
If you are not satisfied with our response, you may contact [the relevant national enforcement body for your member state].

**For UK organizations:**
If you are not satisfied with our response, you may contact the Equality Advisory Support Service (EASS) or the Equality and Human Rights Commission (EHRC).

## Additional Information

[Optional sections:]
- Date of first publication of this statement: [Date]
- This statement was last reviewed on: [Date]
- [Link to VPAT/ACR if available]
- [Link to multi-year accessibility plan if applicable (AODA, ACA)]
```

---

## Guidance for Filling Out the Template

### Conformance Status
Be honest. Courts and regulators view overclaiming conformance more negatively than transparently admitting partial conformance with a remediation plan. "Partially conformant" with a clear plan is better than "fully conformant" when it's not true.

### Known Limitations
List specific, concrete limitations. Vague statements like "some content may not be accessible" are unhelpful. Name the specific content types, pages, or features.

### Assessment Methods
If the user hasn't done formal testing, recommend they at minimum: run axe-core or Lighthouse, do a keyboard walkthrough, and test with one screen reader. Note the methods actually used: don't claim user testing if it didn't happen.

### Feedback Mechanism
A feedback route is required by the EU Web Accessibility Directive, the UK PSBAR 2018, the Accessible Canada Act (feedback process) and the AODA IASR (s.11, accessible feedback processes). The mechanism must be accessible itself.

### Statement format where a model is mandated
- EU public sector: the model statement in Commission Implementing Decision (EU) 2018/1523.
- UK public sector: the GOV.UK sample statement at https://www.gov.uk/guidance/model-accessibility-statement.
- Canada, federally regulated: accessibility statements for web pages and apps under SOR/2025-255, from 5 December 2027 (federal public sector) and 5 December 2028 (private sector). Provide multiple contact methods (not just a web form: someone who can't use the form needs an alternative).

### Review Schedule
Recommend reviewing and updating the statement at least annually, and after any major site redesign or new feature launch.
