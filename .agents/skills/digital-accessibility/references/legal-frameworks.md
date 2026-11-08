# Legal Frameworks for Digital Accessibility

Each section names the instrument, the technical standard it points at, who it covers, the dates that matter, and the primary source used. Every fact here was checked on 2026-09-15. Deadlines move, so if the current date is much later, re-check the source before quoting a date to a user.

## Contents

- [United States: ADA Title II](#united-states-ada-title-ii)
- [United States: ADA Title III](#united-states-ada-title-iii)
- [United States: Section 508](#united-states-section-508)
- [Canada: AODA (Ontario)](#canada-aoda-ontario)
- [Canada: Accessible Canada Act](#canada-accessible-canada-act)
- [European Union: European Accessibility Act](#european-union-european-accessibility-act)
- [European Union: Web Accessibility Directive](#european-union-web-accessibility-directive)
- [United Kingdom](#united-kingdom)
- [Other jurisdictions](#other-jurisdictions)
- [Overlays and automated "compliance" claims](#overlays-and-automated-compliance-claims)

---

## United States: ADA Title II

**Covers**: state and local government entities, including their web content and mobile apps, and content provided through contractors.

**Technical standard**: WCAG 2.1 Level AA, set by the DOJ final rule published 24 April 2024 (28 CFR part 35, subpart H).

**Compliance dates**: extended by one year by an interim final rule published 20 April 2026 (91 FR 20902).

| Entity | Original date | Current date |
|---|---|---|
| Population 50,000 or more | 24 April 2026 | 26 April 2027 |
| Population under 50,000, and special district governments | 26 April 2027 | 26 April 2028 |

The substantive requirements did not change. Existing ADA obligations continue to apply before the compliance dates.

**Exceptions in the rule**: archived web content, pre-existing conventional electronic documents, third-party content not under contract, individualised password-protected documents, and pre-existing social media posts. Each has conditions; read the rule before relying on one.

**Enforcement**: DOJ investigations and private suits.

**Sources**
- Rule overview: https://www.ada.gov/resources/2024-03-08-web-rule/
- Extension: https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web

---

## United States: ADA Title III

**Covers**: places of public accommodation, meaning businesses open to the public. Courts disagree on whether a website with no physical location is covered. The Ninth Circuit in Robles v. Domino's Pizza (2019) held the ADA applies to the website and app of a business with physical locations; the Supreme Court declined to hear the appeal.

**Technical standard**: no regulation names a WCAG version for Title III. DOJ settlements and consent decrees, and most private settlements, use WCAG 2.1 AA. Treat WCAG 2.1 AA as the floor and build to 2.2 AA.

**Litigation volume**: 3,117 website accessibility suits were filed in US federal court in 2025, 36% of all Title III filings and a 27% increase on 2024 (Seyfarth Shaw count). Including state courts, UsableNet counted more than 5,000. Retail, food service and hospitality are the most targeted sectors.

**Enforcement**: private suits (injunctive relief and attorneys' fees under federal law; damages under some state laws such as California's Unruh Act), DOJ investigations, structured negotiation.

**Sources**
- Seyfarth Shaw 2025 filings: https://www.adatitleiii.com/2026/03/federal-court-website-accessibility-lawsuit-filings-bounce-back-in-2025/
- UsableNet tracker: https://info.usablenet.com/ada-website-compliance-lawsuit-tracker
- Robles v. Domino's, 913 F.3d 898 (9th Cir. 2019), cert. denied 7 October 2019.

---

## United States: Section 508

**Covers**: information and communication technology developed, procured, maintained or used by federal agencies, including websites, software, documents and hardware. Vendors selling to federal agencies must document conformance.

**Technical standard**: the Revised 508 Standards (effective 18 January 2018) incorporate WCAG 2.0 Level AA by reference for web content, non-web documents and software. No refresh to WCAG 2.1 or 2.2 had been finalised as of the check date.

**Documentation**: agencies request an Accessibility Conformance Report (ACR) built on the ITI VPAT. Current template: VPAT 2.5Rev (April 2025), in 508, WCAG, EU and INT editions.

**Enforcement**: administrative complaints to the agency; Section 508 programme offices; GSA's government-wide reporting. There is no private right of action against vendors.

**Sources**
- Access Board ICT standards: https://www.access-board.gov/ict/
- Section508.gov: https://www.section508.gov/
- ITI VPAT: https://www.itic.org/policy/accessibility/vpat

---

## Canada: AODA (Ontario)

**Covers**: every organisation in Ontario with at least one employee, through the Integrated Accessibility Standards Regulation (O. Reg. 191/11). The Information and Communications Standard covers websites and web content.

**Technical standard**: WCAG 2.0 Level AA for all public websites and web content of designated public sector organisations and private or non-profit organisations with 50 or more employees, since 1 January 2021 (excluding live captions 1.2.4 and audio description 1.2.5). The regulation still names WCAG 2.0. Provincial statements about moving to a newer version were not in the regulation as of the check date.

**Reporting**: organisations with 20 or more employees file an accessibility compliance report. The next filing deadline for private and non-profit organisations is 31 December 2026. Organisations with 50 or more employees also publish a multi-year accessibility plan.

**Penalties**: AODA s.37 allows fines up to CA$100,000 per day for corporations and CA$50,000 per day for individuals and unincorporated organisations, and directors and officers personally. Complaints can also go to the Human Rights Tribunal of Ontario under the Human Rights Code.

**Sources**
- O. Reg. 191/11: https://www.ontario.ca/laws/regulation/110191
- AODA: https://www.ontario.ca/laws/statute/05a11
- Ontario compliance reporting: https://www.ontario.ca/page/completing-your-accessibility-compliance-report

---

## Canada: Accessible Canada Act

**Covers**: federally regulated entities: federal departments and agencies, Crown corporations, Parliament, banks, telecommunications and broadcasting companies, interprovincial transport, and other federal-jurisdiction employers. Goal in the Act: a barrier-free Canada by 1 January 2040.

**Technical standard**: CAN/ASC-EN 301 549:2024, published by Accessibility Standards Canada on 31 May 2024. It adopts EN 301 549 v3.2.1 without modification, so web content maps to WCAG 2.1 Level AA.

**Regulation**: Regulations Amending the Accessible Canada Regulations (SOR/2025-255), published in Canada Gazette Part II on 17 December 2025. They add an Information and Communication Technologies part requiring conformance to CAN/ASC-EN 301 549 for web pages and web applications, mobile applications and digital documents, plus accessibility statements, training, procurement requirements and assessment of existing applications.

| Who | ICT obligations in force |
|---|---|
| Federal public sector (departments, agencies, Crown corporations) | 5 December 2027 |
| Private sector entities with 100 or more employees (three-year average) | 5 December 2028 |
| Entities with 99 or fewer employees | Exempt from the ICT part |
| First Nations band councils | Exempt until 31 December 2033 |

Transport, broadcasting and telecommunications providers are handled by the Canadian Transportation Agency and CRTC under their own instruments.

**Existing obligations (since 2021 to 2023 depending on size)**: publish an accessibility plan every three years, describe a feedback process, publish yearly progress reports, and consult persons with disabilities when preparing them.

**Enforcement**: Accessibility Commissioner at the Canadian Human Rights Commission; administrative monetary penalties.

**Sources**
- SOR/2025-255: https://gazette.gc.ca/rp-pr/p2/2025/2025-12-17/html/sor-dors255-eng.html
- Standard: https://accessible.canada.ca/creating-accessibility-standards/canasc-en-301-5492024-accessibility-requirements-ict-products-and-services
- Adoption announcement (31 May 2024): https://www.canada.ca/en/accessibility-standards-canada/news/2024/05/accessibility-standards-canada-adopts-the-globally-recognized-accessibility-standard-for-ict-products-and-services.html

---

## European Union: European Accessibility Act

**Instrument**: Directive (EU) 2019/882, transposed into each member state's national law.

**Covers**: products and services placed on the EU market after 28 June 2025, wherever the supplier is based: computers and operating systems, smartphones, self-service terminals, e-readers, e-commerce services, consumer banking, electronic communications, audiovisual media access services, transport information and ticketing, and e-books.

**Technical standard**: presumption of conformity comes from the harmonised standard cited in the Official Journal. As of the check date that is EN 301 549 v3.2.1 (2021), which maps web content to WCAG 2.1 Level AA and adds requirements for software, hardware, documents and support services.

EN 301 549 v4.1.1 was published by ETSI in September 2026. It adopts WCAG 2.2, adds the six new AA criteria, removes 4.1.1 Parsing and strengthens requirements to respect user accessibility preferences. It becomes the legal reference only once cited in the Official Journal, expected around October 2026. Until then, v3.2.1 remains the yardstick.

**Dates**: applies to new products and services since 28 June 2025. Service contracts concluded before then may run unchanged until 28 June 2030. Self-service terminals lawfully in use before 28 June 2025 may stay in service up to 20 years.

**Exemptions**: microenterprises (fewer than 10 staff and at most EUR 2 million turnover or balance sheet) providing services are exempt. Microenterprises dealing in products are not exempt from the requirements, only from some administrative obligations. Disproportionate burden and fundamental alteration defences exist and must be documented.

**Enforcement**: national market surveillance and compliance authorities. Penalties are set nationally and must be effective, proportionate and dissuasive.

**Sources**
- Directive: https://eur-lex.europa.eu/eli/dir/2019/882/oj
- EN 301 549 update (AccessibleEU, 7 Sept 2026): https://accessible-eu-centre.ec.europa.eu/content-corner/news/european-accessibility-standard-en-301-549-has-been-updated-2026-09-07_en
- ETSI EN 301 549: https://www.etsi.org/deliver/etsi_en/301500_301599/301549/

---

## European Union: Web Accessibility Directive

**Instrument**: Directive (EU) 2016/2102.

**Covers**: websites (since 23 September 2020 for all) and mobile apps (since 23 June 2021) of public sector bodies.

**Technical standard**: EN 301 549 (WCAG 2.1 AA for web content).

**Requirements**: a published accessibility statement using the model statement in Implementing Decision (EU) 2018/1523, a feedback mechanism, and an enforcement procedure. Member states monitor and report to the Commission every three years.

**Source**: https://eur-lex.europa.eu/eli/dir/2016/2102/oj

---

## United Kingdom

**Public sector**: the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 require WCAG 2.2 Level AA, an accessibility statement in the government model format, and reasonable adjustments. The Government Digital Service monitors a sample of sites and apps each year and has assessed against WCAG 2.2 since October 2024. The Equality and Human Rights Commission and the Equality Commission for Northern Ireland enforce.

**Private sector**: the Equality Act 2010 places an anticipatory duty on service providers to make reasonable adjustments, which applies to websites and apps. No WCAG version is written into the Act; WCAG 2.2 AA is the standard used in guidance and disputes.

**Sources**
- https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps
- https://www.legislation.gov.uk/uksi/2018/952/contents

---

## Other jurisdictions

Checked less deeply. Verify before quoting to a user in these countries.

- **Australia**: Disability Discrimination Act 1992 covers digital services (Maguire v. SOCOG, 2000, is the landmark case). The Australian Human Rights Commission's guidance names WCAG 2.2 AA as the expected standard, and the Digital Transformation Agency's Digital Experience Policy requires government services to meet WCAG AA with movement to 2.2. Source: https://humanrights.gov.au/resource-hub/by-resource-type/guidelines-and-standards/guides-and-standards-disability-rights/chapter-3-standards-and-guidelines-digital-accessibility
- **Israel**: Equal Rights for Persons with Disabilities regulations reference Israeli Standard 5568, based on WCAG 2.0 AA.
- **Japan**: JIS X 8341-3 mirrors WCAG 2.0. The revised Act for Eliminating Discrimination against Persons with Disabilities, in force 1 April 2024, extended the duty to provide reasonable accommodation to private businesses.
- **South Korea**: Korean Web Content Accessibility Guidelines (KWCAG), derived from WCAG, under the Act on Welfare of Persons with Disabilities.
- **India**: Rights of Persons with Disabilities Act 2016; Guidelines for Indian Government Websites (GIGW 3.0, 2023) align with WCAG 2.1.

---

## Overlays and automated "compliance" claims

On 3 January 2025 the US Federal Trade Commission announced a proposed order against accessiBe, and approved it as final in April 2025. accessiBe pays US$1 million and is barred from claiming its automated product can make any website WCAG-compliant, or keep it compliant, without evidence. The FTC also found it had presented paid reviews as independent.

Practical rule: never tell a user that installing a script or widget makes a site conform, and flag it if a client's marketing says so.

**Source**: https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-approves-final-order-requiring-accessibe-pay-1-million
