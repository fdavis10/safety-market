const SITE_RU = {
  name: 'Р ПЛЮС',
  letter: 'Р',
  tagline: 'Подбор международного персонала под различные задачи и специальности',
  description:
    'Кадровое агентство «Р ПЛЮС» закрывает вакансии квалифицированными специалистами и сопровождает кандидата от проверки документов до выхода на рабочее место в Российской Федерации.',
  mission:
    'Мы берём на себя юридический, логистический и бытовой контур, чтобы работодатель получил готового сотрудника, а специалист — прозрачные условия, поддержку на всех этапах и безопасный маршрут переезда.',
  activity: [
    'Поиск и первичный отбор кандидатов под профиль вакансии',
    'Аудит документов, визовое сопровождение и финансовые гарантии',
    'Международная логистика переезда, включая сложные маршруты',
    'Адаптация в РФ: жильё, медицина, язык и консьерж-поддержка',
  ],
}

const SITE_EN = {
  tagline: 'International staffing for a wide range of roles and specialties',
  description:
    'R PLUS staffing agency fills vacancies with qualified specialists and supports each candidate from document review through starting work in the Russian Federation.',
  mission:
    'We take care of the legal, logistics, and everyday setup so the employer receives a ready employee, and the specialist gets transparent terms, support at every stage, and a safe relocation route.',
  activity: [
    'Search and initial screening of candidates for the vacancy profile',
    'Document audit, visa support, and financial guarantees',
    'International relocation logistics, including complex routes',
    'Adaptation in Russia: housing, medical checks, language, and concierge support',
  ],
}

const RULES_EN = `
Terms of use for the R PLUS staffing agency website

1. General
The website is intended for learning about agency services and placing orders.
By submitting a request, you confirm that the information provided is accurate, including citizenship.

2. Ordering services
Services are added to the cart and completed through the order form. Prices on the website
are shown in rubles and may be clarified after the candidate’s document audit.

3. Payment
Payment is accepted by bank card only. The full card number and CVV are not stored by the agency:
only the last four digits and the payment system are used to confirm the payment.

4. Personal data
We process full name, contact details, and citizenship solely to perform the contract
and provide migration support. Data is not shared with third parties without a legal basis.

5. Indexing limits
The website is closed to search-engine indexing and is not a public advertising catalog
in open search.

6. Liability
The agency is not liable for refusals by consular or migration authorities if the candidate
provided inaccurate information or failed to meet the receiving party’s requirements.
`.trim()

const OFFER_EN = `
Public offer for staffing agency services by R PLUS

1. Subject
The Contractor provides the Customer with recruitment, document, visa,
logistics, and adaptation support services according to the selected catalog items
or a turnkey package.

2. Acceptance
Placing an order with citizenship details, accepting this offer, and paying by card
constitutes acceptance. The contract is concluded upon successful charge.

3. Price and settlement
The price is fixed in the order. Payment is accepted by bank card only. Other methods
(cash, bank transfer details, e-wallets) are not accepted.

4. Timelines
Delivery time depends on the selected service, readiness of the candidate’s documents, and
government authority processing. Estimates are provided after the initial audit.

5. Cancellation and refunds
A refund is possible before service delivery begins, upon written request. If work has already started
(documents filed, tickets purchased, housing booked), the actually incurred portion is retained.

6. Confidentiality
The parties keep candidate personal data and the employer’s commercial information confidential.
`.trim()

const PRIVACY_EN = `
Personal data processing policy of the R PLUS staffing agency

1. General
This Policy defines how the R PLUS agency processes and protects personal data of website users
and clients in accordance with applicable personal data laws of the Russian Federation (Federal Law No. 152-FZ).

2. Controller
The controller is R PLUS LLC. Contact details are published on the website and in the contract (offer).

3. Data processed
Full name, email, phone number, citizenship, information provided in the order and comments,
and technical data needed to operate the website and process payments.

4. Purposes
Contract performance, order processing and support, contacting the customer, payment processing,
migration and adaptation support, and compliance with Russian law.

5. Legal bases
The data subject’s consent, conclusion and performance of a contract, and other bases provided by law.

6. Sharing
Data may be shared with the payment provider (bank) to process payment, and with government bodies
and partners to the extent required to deliver services, where a legal basis exists.
Sharing without a legal basis is not performed.

7. Retention
Data is retained for as long as needed for the processing purposes and for periods required by law
and contract, after which it is deleted or anonymized.

8. Data subject rights
You may request information about processing, demand correction, blocking, or deletion, and withdraw
consent where the law allows, by contacting the Controller.

9. Security measures
The Controller takes organizational and technical measures to protect personal data against unlawful
access, destruction, alteration, blocking, copying, and distribution.

10. Policy updates
The current Policy is published on the website. Continued use of the site after updates means acceptance
of the revised Policy unless the law requires otherwise.
`.trim()

export const SERVICES_EN = {
  audit: {
    name: 'Initial audit and clearance (Compliance Check)',
    short_label: 'Documents',
    description:
      'Passport review, database checks for entry bans to Russia, and preliminary registration in electronic systems.',
  },
  notary: {
    name: 'Notarized translations and legalization',
    short_label: 'Legalization',
    description:
      'Professional translation of the passport, education documents, certificates, and references from the candidate’s native language into Russian. Notarial certification for submission to official Russian authorities.',
  },
  visa: {
    name: 'Visa support and invitation',
    short_label: 'Visa',
    description:
      'Preparation of an official invitation, payment of consular fees, and personal support when submitting documents to the Russian embassy in your country.',
  },
  insurance: {
    name: 'Financial risk insurance (Risk Guarantee)',
    short_label: 'Guarantees',
    description:
      'Financial protection for the candidate. A guarantee of advance payment refund if a visa is unexpectedly refused by the consulate or a medical exam in Russia is failed through no fault of the candidate.',
  },
  'logistics-standard': {
    name: 'Logistics: Standard route (Direct or 1 stop)',
    short_label: 'Flight',
    description:
      'Purchase of tickets for direct flights or flights with one comfortable connection. Optimal for countries with direct connections.',
  },
  'logistics-multimodal': {
    name: 'Logistics: Complex multimodal route',
    short_label: 'Multimodal',
    description:
      'Planning complex routes (more than two connections). Combining air, rail, water, and road transport. Includes transit visa arrangements.',
  },
  'travel-kit': {
    name: 'Travel support (Travel Box)',
    short_label: 'En route',
    description:
      'Transit hotel costs, meals on the way, local transport tickets in transit zones, and pocket money (cigarettes, communication).',
  },
  welcome: {
    name: 'Welcome package: Housing and meals',
    short_label: 'Housing',
    description:
      'Airport meet-and-greet and transfer. Placement in comfortable housing and full food support (three meals a day or a daily allowance) during the adaptation period.',
  },
  'legalization-rf': {
    name: 'Legalization in Russia: Migration and medical checks',
    short_label: 'Migration',
    description:
      'Migration registration, medical exam fees, fingerprinting, and preparation of a basic document set for legal employment.',
  },
  language: {
    name: 'Professional language adaptation',
    short_label: 'Language',
    description:
      'Express training in essential Russian basics. Learning job-specific terminology and phrases for safe and effective performance at work.',
  },
  kit: {
    name: 'Household items and other essentials',
    short_label: 'Everyday',
    description:
      'Purchase of seasonal clothing, footwear, and hygiene items. Issuance of a basic smartphone with a prepaid local SIM card.',
  },
  concierge: {
    name: '24/7 concierge and financial logistics',
    short_label: '24/7',
    description:
      'A personal coordinator who speaks your language for everyday and workplace issues. Help setting up legal channels to safely send earnings to family at home.',
  },
  'legal-social-support': {
    name: 'Legal and social support for 1 year from arrival',
    short_label: 'Support',
    description:
      'Help with legal, social, and administrative matters, support when dealing with government bodies and organizations, and consulting support at all key stages of adaptation.',
  },
}

const PACKAGE_PAYMENT_EN = {
  entry: '50% prepayment',
  move: '100% prepayment',
  turnkey: 'Postpayment',
}

export function getDefaultSite(lang = 'ru') {
  return lang === 'en' ? { ...SITE_RU, ...SITE_EN } : { ...SITE_RU }
}

export function localizeSite(site, lang) {
  const base = site || SITE_RU
  if (lang !== 'en') {
    return {
      ...base,
      tagline: SITE_RU.tagline,
      description: SITE_RU.description,
      mission: SITE_RU.mission,
      activity: SITE_RU.activity,
    }
  }
  return {
    ...base,
    ...SITE_EN,
    rules: RULES_EN,
    offer: OFFER_EN,
    privacy: PRIVACY_EN,
  }
}

export function localizeService(service, lang) {
  if (!service || lang !== 'en') return service
  const en = SERVICES_EN[service.slug]
  if (!en) return service
  return { ...service, ...en }
}

export function localizePackage(pack, lang) {
  if (!pack) return pack
  // Visual label only: payment key stays "90", prices unchanged
  const payment_terms = String(pack.payment_terms || '').replaceAll('90%', '100%')
  if (lang !== 'en') return { ...pack, payment_terms }
  return {
    ...pack,
    name: 'VIP All-Inclusive',
    description: 'All catalog services included.',
    payment_terms: PACKAGE_PAYMENT_EN[pack.slug] || payment_terms,
    services: (pack.services || []).map((service) => localizeService(service, lang)),
  }
}

export function localizeCartItemName(item, lang, t, servicesById = {}) {
  if (!item) return ''
  if (item.kind === 'package') {
    const route =
      item.logistics_route === 'multimodal' ? t('route.complexShort') : t('route.standardShort')
    return `${t('package.vip')} · ${route}`
  }
  const service = servicesById[item.service]
  if (service) {
    const localized = localizeService(service, lang)
    return localized?.name || item.item_name
  }
  return item.item_name
}
