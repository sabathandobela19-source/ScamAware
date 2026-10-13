import { CoreFactor, FactorDetail, QuizScenario } from '../types/scam';

export const FACTOR_DETAILS: Record<CoreFactor, FactorDetail> = {
  Trust: {
    factor: 'Trust',
    title: 'Trust & Rapport Exploitation',
    tagline: 'Exploiting social warmth, familiarity, and established relationships',
    description:
      'Attackers manufacture emotional intimacy, impersonate colleagues, or mirror trusted brands to lower cognitive defenses and bypass normal skepticism.',
    color: {
      primary: '#e5e5e5', // Sky-600
      light: '#262626',
      border: '#525252',
      badgeBg: '#262626',
      badgeText: '#fafafa',
      gradient: 'from-sky-500 to-blue-600',
      glow: 'rgba(255, 255, 255, 0.08)',
    },
    commonExploits: [
      'Romance Scams (building fake personal bonds before asking for funds)',
      'Familiar Colleague Impersonation (mimicking a teammate on chat)',
      'Vendor / Supplier Relationship hijacking',
      'Affinity Group and Community-based deception',
    ],
    psychologicalMechanism:
      'Social heuristic: Humans are conditioned to reciprocate warmth and assume honesty from members of our social ingroup.',
  },
  Urgency: {
    factor: 'Urgency',
    title: 'Urgency & Artificial Deadlines',
    tagline: 'Compressing decision time to bypass critical thinking',
    description:
      'Attackers create artificial time crunches—such as expiring deliveries, 15-minute wire transfer requests, or immediate account closures—to force hurried mistakes.',
    color: {
      primary: '#e5e5e5', // Orange-600
      light: '#262626',
      border: '#525252',
      badgeBg: '#262626',
      badgeText: '#fafafa',
      gradient: 'from-amber-500 to-orange-600',
      glow: 'rgba(255, 255, 255, 0.08)',
    },
    commonExploits: [
      'Same-Day Delivery / Package Rescheduling Links',
      'Limited-Time Financial or Payroll Deadline Demands',
      'Flash Investment Offers & Expiring Cryptocurrency Discounts',
      'Emergency Meeting or Flight Ticket Confirmation Traps',
    ],
    psychologicalMechanism:
      'Cognitive load heuristic: Time pressure shifts human decision-making from reflective deliberative reasoning (System 2) to reactive instinct (System 1).',
  },
  Fear: {
    factor: 'Fear',
    title: 'Fear & Threat Manipulation',
    tagline: 'Triggering anxiety around severe consequences and loss',
    description:
      'Attackers threaten legal arrest, malware infections, account permanent bans, or disciplinary actions so victims act out of panic rather than evaluation.',
    color: {
      primary: '#e5e5e5', // Red-600
      light: '#262626',
      border: '#525252',
      badgeBg: '#262626',
      badgeText: '#fafafa',
      gradient: 'from-rose-500 to-red-600',
      glow: 'rgba(255, 255, 255, 0.08)',
    },
    commonExploits: [
      'Fake Antivirus / "System Locked with Trojan" Popups',
      'Immediate Arrest or Tax Audit Subpoena Threats',
      'Bank Account Compromised / Unauthorized Wire Warnings',
      'HR Workplace Policy Violation & Immediate Termination Threats',
    ],
    psychologicalMechanism:
      'Threat-avoidance reflex: Intense anxiety commands attention and prioritizes immediate elimination of danger over validating the messenger.',
  },
  Authority: {
    factor: 'Authority',
    title: 'Authority & Institutional Power',
    tagline: 'Leveraging rank, law enforcement, or corporate hierarchy',
    description:
      'Attackers adopt the identity of CEOs, IT Directors, legal counsel, or government officials to exploit the natural human reflex to obey established hierarchy.',
    color: {
      primary: '#e5e5e5', // Violet-600
      light: '#262626',
      border: '#525252',
      badgeBg: '#262626',
      badgeText: '#fafafa',
      gradient: 'from-violet-500 to-indigo-600',
      glow: 'rgba(255, 255, 255, 0.08)',
    },
    commonExploits: [
      'Executive Impersonation (CEO wire transfers & confidential acquisitions)',
      'IT Helpdesk Director Mandated Security Token Reset',
      'Law Enforcement & Court Summons Compliance Requests',
      'Government Revenue Agency Tax Adjustment Notices',
    ],
    psychologicalMechanism:
      'Milgram obedience heuristic: People defer to perceived authority figures to avoid insubordination, disciplinary friction, or legal penalty.',
  },
};

export const ALL_SCENARIOS: QuizScenario[] = [
  // ==========================================
  // TRUST FACTOR (10 Scenarios)
  // ==========================================
  {
    id: 'trust-1',
    factor: 'Trust',
    pairedTactic: 'Urgency',
    context: 'Personal',
    scenarioType: 'Romance Scam',
    title: 'The Deployed Partner Emergency',
    situation:
      'You have been messaging someone on a dating app for three weeks. They have shared photos, voice notes, and emotional stories about working as an overseas civil engineer. Today, they message saying customs seized their travel passport and tools, and they desperately need $400 via cryptocurrency to clear transit fees before their phone battery dies.',
    question: 'What is the safest action in this situation?',
    options: [
      {
        id: 'a',
        text: 'Send the $400 immediately, since they have shared voice notes and personal background over several weeks.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Offer to send half the money ($200) to minimize your personal risk while helping them out.',
        isSafer: false,
      },
      {
        id: 'c',
        text: 'Pause, decline to transfer money or cryptocurrency, and conduct a reverse image search on their profile pictures.',
        isSafer: true,
      },
      {
        id: 'd',
        text: 'Ask them to give you their bank routing number instead so you have an official financial trace.',
        isSafer: false,
      },
    ],
    feedback:
      'Romance scams exploit emotional trust built over weeks or months, pairing it with sudden urgency. Scammers frequently invent remote occupations (military, overseas engineering) to explain why they can never meet in person before requesting untraceable funds.',
    saferAction:
      'Never transfer money, cryptocurrency, or gift cards to someone you have only met online. Run reverse image searches on profile pictures.',
  },
  {
    id: 'trust-2',
    factor: 'Trust',
    pairedTactic: 'Authority',
    context: 'Workplace',
    scenarioType: 'Vendor Invoice Tampering',
    title: 'Long-Time Supplier Banking Change',
    situation:
      'You receive an email from a regular office supplier you have worked with for two years. The email thread is a continuation of your previous correspondence, but the account executive says: "Please note our company moved banks last Friday. For this month\'s $8,500 invoice, please update your electronic remittance records to the attached wire details."',
    question: 'How should you respond to this request?',
    options: [
      {
        id: 'a',
        text: 'Update the banking details and issue payment, as this vendor has been a trusted partner for years.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Call the supplier’s finance team using the official phone number in your existing master agreement to verbally confirm the change.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Reply directly to the email asking if they can provide a scanned copy of their voided check.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Forward the email to your internal accounting department asking them to process it before late payment penalties apply.',
        isSafer: false,
      },
    ],
    feedback:
      'Vendor Email Compromise (VEC) exploits existing professional trust. Attackers take over legitimate supplier accounts or spoof close domains to intercept invoices. Replying to the compromised email keeps you talking to the attacker.',
    saferAction:
      'Perform out-of-band verification by calling known contacts on previously verified numbers—never using contact info in the new request.',
  },
  {
    id: 'trust-3',
    factor: 'Trust',
    pairedTactic: 'Flattery & Rapport',
    context: 'Personal',
    scenarioType: 'Cryptocurrency Affinity Scam',
    title: 'Friendly Group Chat Investment Mentor',
    situation:
      'A fellow member of your local gardening hobby Discord server starts a friendly direct message conversation with you. After sharing gardening tips and photos for ten days, they casually mention how they financed their new greenhouse using a high-yield algorithmic trading portal. They offer to guide you step-by-step.',
    question: 'What is the most prudent step to take?',
    options: [
      {
        id: 'a',
        text: 'Invest a small starter amount ($50) to test if the trading portal allows seamless withdrawals.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Recognize this as affinity-based grooming; decline the offer and report the behavior to community moderators.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Ask them to share their personal tax filings to prove their trading gains before joining.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Sign up on the suggested platform with a secondary email and test credentials.',
        isSafer: false,
      },
    ],
    feedback:
      'Affinity scams leverage common hobbies or shared social spaces to establish quick trust. Fraudulent platforms often fake initial small profits on screen to induce much larger deposits before locking all withdrawals.',
    saferAction:
      'Treat unsolicited investment advice from online casual acquaintances with high skepticism, regardless of shared group memberships.',
  },
  {
    id: 'trust-4',
    factor: 'Trust',
    pairedTactic: 'Social Proof',
    context: 'Workplace',
    scenarioType: 'Colleague Chat Impersonation',
    title: 'Teammate’s Quick Phone Number Switch',
    situation:
      'On Microsoft Teams, you receive a direct message from an account showing your coworker Sarah’s profile picture and name: "Hey! My phone fell in the sink this morning so IT is setting up my replacement. Could you do me a quick favor and forward the two-factor authentication code that was just sent to our project inbox?"',
    question: 'How should you proceed?',
    options: [
      {
        id: 'a',
        text: 'Send the code right away so Sarah doesn’t fall behind on her morning project deliverables.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Walk over to Sarah’s desk or connect via an alternate verified channel (internal video call) before sharing any access code.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Type the code backward in the chat as a precaution in case the message is logged.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Reply in the chat asking for her employee ID number before forwarding the code.',
        isSafer: false,
      },
    ],
    feedback:
      'Colleagues naturally want to help each other. Attackers exploit helpful workplace culture to steal session cookies or multi-factor authentication (MFA) codes. Legitimate coworkers and IT staff never require your MFA codes.',
    saferAction:
      'Never share multi-factor codes or one-time passwords with anyone, even someone claiming to be a trusted teammate.',
  },
  {
    id: 'trust-5',
    factor: 'Trust',
    pairedTactic: 'Isolation',
    context: 'Personal',
    scenarioType: 'Romance Scam',
    title: 'The Private Investment Opportunity',
    situation:
      'Someone you met on an online dating forum tells you they love you after one month of daily messages. They share that their uncle is a senior banking director with insider knowledge of private foreign exchange arbitrate. They ask you not to tell family or friends because "outsiders would get jealous and ruin our private future together."',
    question: 'What is the critical red flag and the safest step?',
    options: [
      {
        id: 'a',
        text: 'Keep the secret as requested to protect your romantic relationship, but start with a minimal deposit.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Recognize the isolation tactic and romantic manipulation; sever contact and do not invest any funds.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Ask for the uncle’s LinkedIn profile before transferring any money.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Ask the person to co-sign an agreement guaranteeing your principal deposit.',
        isSafer: false,
      },
    ],
    feedback:
      'Isolation is a classic manipulation tactic paired with romance. Attackers isolate victims from friends and family who might objectively spot the scam. The promise of a shared future lowers rational financial scrutiny.',
    saferAction:
      'If an online romantic interest demands secrecy or introduces financial/crypto opportunities, stop communicating immediately.',
  },
  {
    id: 'trust-6',
    factor: 'Trust',
    pairedTactic: 'Familiarity',
    context: 'Workplace',
    scenarioType: 'Former Employee Outreach',
    title: 'Former Colleague Reference Archive Request',
    situation:
      'A message on LinkedIn arrives from Mark, an engineer who left your company three months ago. He says: "Hey buddy! Hope the sprint is going well! I’m interviewing at a cloud vendor and need to review the architecture diagram we drew last year. Could you send that private team Figma export to my personal Gmail?"',
    question: 'What is your safest professional action?',
    options: [
      {
        id: 'a',
        text: 'Send the diagram, because Mark wrote most of the initial code and already knows the architecture anyway.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Politely decline, explain that proprietary company assets cannot be transferred externally, and notify your security team.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Export the file with your company’s watermark removed so Mark’s prospective employer doesn’t notice.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Ask Mark to send an email from his new employer’s corporate domain first.',
        isSafer: false,
      },
    ],
    feedback:
      'Trust from previous relationships can linger after employment ends. Former colleagues no longer have authorized access to proprietary data, and their personal social accounts could also be compromised or leveraged for corporate espionage.',
    saferAction:
      'Internal intellectual property must never be shared with ex-employees or external personal emails, regardless of past camaraderie.',
  },
  {
    id: 'trust-7',
    factor: 'Trust',
    pairedTactic: 'Charity & Empathy',
    context: 'Personal',
    scenarioType: 'Disaster Relief Impersonation',
    title: 'Neighborhood Relief Drive',
    situation:
      'Following a severe local flash flood, someone knocks on your door wearing a branded neighborhood association t-shirt and holding a clipboard. They tell you they are collecting cash or Venmo donations for your elderly neighbor Mrs. Higgins whose basement flooded.',
    question: 'What should you do before giving any donation?',
    options: [
      {
        id: 'a',
        text: 'Hand them $20 in cash because they have a neighborhood shirt and clipboard.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Send the money through Venmo since digital transactions can always be refunded easily.',
        isSafer: false,
      },
      {
        id: 'c',
        text: 'Politely inform them you donate directly to registered charities or verified family organizers, and check on Mrs. Higgins directly.',
        isSafer: true,
      },
      {
        id: 'd',
        text: 'Take a photo of their clipboard and post it online asking neighbors if it is real.',
        isSafer: false,
      },
    ],
    feedback:
      'Scammers exploit localized empathy and community trust in the wake of natural disasters. Branded clothing and clipboards are trivially inexpensive props that provide false legitimacy.',
    saferAction:
      'Always verify charitable initiatives through recognized non-profit registries or direct communication with the affected parties.',
  },
  {
    id: 'trust-8',
    factor: 'Trust',
    pairedTactic: 'Professional Reciprocity',
    context: 'Workplace',
    scenarioType: 'Conference Network Connection',
    title: 'The Tech Conference Resume Review',
    situation:
      'You receive an email from someone you briefly chatted with at a cybersecurity conference: "Great chatting at the keynote! You mentioned your team is hiring junior analysts. Attached is my mentee\'s resume in a password-protected zip file (pass: 2025hire). Let me know if you can refer him!"',
    question: 'How should you handle the attached file?',
    options: [
      {
        id: 'a',
        text: 'Unzip the archive and open the document since you met this person in person at the conference.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Forward the archive to your internal HR talent acquisition team without scanning it.',
        isSafer: false,
      },
      {
        id: 'c',
        text: 'Do not open the archive; ask the sender to submit standard PDF applications through the official company careers portal.',
        isSafer: true,
      },
      {
        id: 'd',
        text: 'Open the file on your mobile phone instead of your workplace laptop to test if it contains malware.',
        isSafer: false,
      },
    ],
    feedback:
      'Password-protected ZIP files are a common tactic used to bypass email gateway security scanners. Attackers build casual conference rapport specifically to deliver targeted malware payloads.',
    saferAction:
      'Direct all candidates and resumes through standardized career portals. Never open password-protected archives from external contacts.',
  },
  {
    id: 'trust-9',
    factor: 'Trust',
    pairedTactic: 'Family Emergency',
    context: 'Personal',
    scenarioType: 'Impersonated Family Member',
    title: 'New Number WhatsApp Message',
    situation:
      'You receive a WhatsApp message from an unfamiliar number: "Hi Mum / Dad, my phone fell down the toilet so this is my temporary temporary number. I have a bill due in two hours and my banking app is locked on this new device. Could you please pay it for me?"',
    question: 'What is your immediate response?',
    options: [
      {
        id: 'a',
        text: 'Pay the bill immediately so your child’s utilities or credit rating is not affected.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Call your child on their original, known phone number or speak with another family member who is with them.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Ask the new number to text a selfie as immediate proof of identity.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Send a partial payment to test the billing details.',
        isSafer: false,
      },
    ],
    feedback:
      'The "Hi Mum / Dad" scam exploits instinctual parental trust and protective instincts. Attackers blast thousands of numbers hoping a recipient has an adult child.',
    saferAction:
      'Always call the existing contact number on file or ask a personal security question only the real family member could answer.',
  },
  {
    id: 'trust-10',
    factor: 'Trust',
    pairedTactic: 'Brand Familiarity',
    context: 'Workplace',
    scenarioType: 'SaaS Renewal Phishing',
    title: 'Trusted Cloud Storage Quota Notice',
    situation:
      'You get an email that matches your workplace cloud storage provider’s styling, font, and brand colors. It claims: "Your shared team drive is at 99.4% capacity. Storage will freeze in 24 hours unless you confirm your team administrator credentials here: [portal-cloud-sync.net/auth]".',
    question: 'What reveals this as a deceptive attack?',
    options: [
      {
        id: 'a',
        text: 'Nothing; trusted software brands frequently use third-party domains for customer storage expansions.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'The external mismatch in domain URL ([portal-cloud-sync.net]) and the attempt to collect admin credentials via an unsolicited link.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Cloud storage providers never experience capacity limits in corporate environments.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'The email was sent during business hours rather than over the weekend.',
        isSafer: false,
      },
    ],
    feedback:
      'Familiar brand logos and styling are trivial to copy. Attackers rely on visual trust so users overlook suspicious domain URLs in links.',
    saferAction:
      'Check the actual destination URL or navigate directly to the service dashboard through your browser bookmarks.',
  },

  // ==========================================
  // URGENCY FACTOR (10 Scenarios)
  // ==========================================
  {
    id: 'urgency-1',
    factor: 'Urgency',
    pairedTactic: 'Authority',
    context: 'Workplace',
    scenarioType: 'CEO Wire Transfer',
    title: 'The 30-Minute Confidential Wire',
    situation:
      'At 4:45 PM on a Friday, an email arrives appearing to be from your company’s CEO: "I am in confidential board negotiations for an emergency acquisition. The deal closes in 30 minutes. Immediately wire $24,500 to escrow account #89102. Do not discuss with anyone on Slack—strictly confidential."',
    question: 'What is the correct protocol?',
    options: [
      {
        id: 'a',
        text: 'Execute the wire immediately because the CEO emphasized the 30-minute deadline and board confidentiality.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Follow standard financial dual-control authorization procedures and confirm the request verbally via executive desk phone.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Send half the wire amount now to satisfy the time constraint, then verify the rest Monday morning.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Post the request in the general company Slack channel to ask coworkers if the CEO mentioned an acquisition.',
        isSafer: false,
      },
    ],
    feedback:
      'Business Email Compromise (BEC) uses artificial Friday-afternoon deadlines and executive secrecy to induce panic and skip accounting verification controls.',
    saferAction:
      'Never bypass established dual-authorization or verification policies for urgent wire transfers, regardless of claimed executive rank.',
  },
  {
    id: 'urgency-2',
    factor: 'Urgency',
    pairedTactic: 'Loss Aversion',
    context: 'Personal',
    scenarioType: 'Delivery Notification',
    title: 'Expiring Package Redirection',
    situation:
      'You receive an SMS: "USPS Notice: Your package #US9842 cannot be delivered due to incomplete street number. Update address within 12 hours at [usps-redelivery-portal.info] or it will be destroyed with a $45 return penalty."',
    question: 'How should you evaluate this SMS?',
    options: [
      {
        id: 'a',
        text: 'Click the link quickly because the 12-hour timer is already counting down and you want your package.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Open the official postal carrier website or app independently and enter the tracking number into their official search tool.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Reply to the text with your home address so they can update it without you needing to click the link.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Forward the SMS to five friends to see if their postal notifications look similar.',
        isSafer: false,
      },
    ],
    feedback:
      'Fake delivery texts ("smishing") use extreme time pressure ("12 hours or destroyed") to induce immediate clicking before the victim can consider whether they even ordered a package.',
    saferAction:
      'Ignore links in text messages. Track parcels directly on the carrier’s authentic website (e.g. usps.com).',
  },
  {
    id: 'urgency-3',
    factor: 'Urgency',
    pairedTactic: 'Scarcity',
    context: 'Personal',
    scenarioType: 'Flash Sale Fraud',
    title: 'The 10-Minute Gaming Console Deal',
    situation:
      'While scrolling social media, an ad shows a high-end graphics card at 75% off. Clicking leads to a webpage with a ticking 09:59 countdown timer that says: "Only 2 units remaining at this promotional price! Timer expires in 9 minutes."',
    question: 'What psychological factor is being weaponized here?',
    options: [
      {
        id: 'a',
        text: 'Legitimate seasonal clearance marketing; rapid checkouts are normal for tech sales.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Manufactured scarcity and urgency designed to prevent the buyer from researching the website’s domain registration and reviews.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'A computer hardware lottery mandated by manufacturer retail policies.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Technical network load shedding to distribute web server traffic.',
        isSafer: false,
      },
    ],
    feedback:
      'Artificial countdown timers suppress rational price comparison. Fraudulent e-commerce storefronts use fake timers that reset every time the page refreshes to harvest credit card data.',
    saferAction:
      'Step away from artificial countdown timers. Verify merchant authenticity on independent consumer protection boards before entering payment details.',
  },
  {
    id: 'urgency-4',
    factor: 'Urgency',
    pairedTactic: 'Workplace Disruption',
    context: 'Workplace',
    scenarioType: 'Payroll Verification',
    title: 'Urgent Direct Deposit Re-enrollment',
    situation:
      'An email with the subject "URGENT: Payroll Cutoff 1:00 PM Today" arrives: "Human Resources has upgraded payroll servers. If you do not re-confirm your direct deposit bank information by 1:00 PM today, your bi-weekly paycheck will be suspended for 30 days. Click here to confirm."',
    question: 'What is the appropriate response?',
    options: [
      {
        id: 'a',
        text: 'Immediately click the link and enter your banking credentials so your rent check doesn’t bounce.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Do not click the link; verify payroll updates directly through your organization’s internal HR employee portal or HR manager.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Forward your online banking password to the HR email address for manual entry.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Wait until 12:59 PM to see if HR sends a cancellation notice before clicking.',
        isSafer: false,
      },
    ],
    feedback:
      'Payroll phishing attacks use tight deadlines threatening financial disruption to trick employees into typing login credentials into spoofed company portals.',
    saferAction:
      'Access corporate HR and payroll portals exclusively through bookmarked company intranet links, never via urgent email links.',
  },
  {
    id: 'urgency-5',
    factor: 'Urgency',
    pairedTactic: 'Fear',
    context: 'Personal',
    scenarioType: 'Utility Shutoff Scam',
    title: 'Immediate Electricity Disconnection Call',
    situation:
      'You receive an automated phone call claiming to be your city power utility: "Your account is 48 hours overdue. A technician is en route to disconnect electricity in 45 minutes. Press 1 to connect to payment processing immediately or purchase a prepaid voucher."',
    question: 'What action should you take?',
    options: [
      {
        id: 'a',
        text: 'Press 1 and pay over the phone with a debit card so your power isn’t cut.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Hang up, find your utility bill or check your online utility account directly, and call the official customer service number.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Rush to the grocery store to buy the requested prepaid debit cards.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Offer to leave cash in an envelope at your electrical meter box for the technician.',
        isSafer: false,
      },
    ],
    feedback:
      'Real public utilities are regulated and legally required to provide written warning notices weeks before service termination. Demanding prepaid cards within minutes is a definitive scam hallmark.',
    saferAction:
      'Utilities never demand immediate payment via gift cards or prepaid vouchers over the phone. Hang up and call the number on your physical bill.',
  },
  {
    id: 'urgency-6',
    factor: 'Urgency',
    pairedTactic: 'Professional Obligation',
    context: 'Workplace',
    scenarioType: 'Meeting Calendar Invite',
    title: 'Emergency Board Meeting Reschedule',
    situation:
      'A calendar invite pops up in your inbox titled: "URGENT: Mandatory Executive Sync in 5 Minutes - Link Changed". The invite description says: "Join Zoom room immediately [zoom-secure-corporate-auth.org/join] or enter your Microsoft SSO credentials to enter."',
    question: 'What indicates this is a phishing trap?',
    options: [
      {
        id: 'a',
        text: 'The meeting is scheduled on short notice, which never happens in real companies.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'The link points to an external third-party domain asking for enterprise SSO credentials under a five-minute rush.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Calendar invitations cannot carry links to virtual video rooms.',
        isSafer: false,
      },
    ],
    feedback:
      'Attackers exploit the workplace fear of being late to an executive sync. By pairing a 5-minute countdown with credential harvesting, employees rush through authentication prompts without inspecting the URL.',
    saferAction:
      'Check the calendar meeting URL. If asked for credentials on an unexpected domain, close the tab and check with the organizer.',
  },
  {
    id: 'urgency-7',
    factor: 'Urgency',
    pairedTactic: 'Reward Opportunity',
    context: 'Personal',
    scenarioType: 'Airline Miles Expiration',
    title: 'Unclaimed Frequent Flyer Miles',
    situation:
      'An email states: "Your 65,000 frequent flyer reward points will expire tonight at 11:59 PM. Redeem for gift cards or flights before midnight by confirming your member password and security pin here."',
    question: 'How should you evaluate this notification?',
    options: [
      {
        id: 'a',
        text: 'Click the link and input your PIN before midnight so your accumulated miles aren’t lost.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Log into the official airline mobile app or authentic website directly to inspect your point balance.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Forward your frequent flyer account number to the sender asking for a 24-hour extension.',
        isSafer: false,
      },
    ],
    feedback:
      'Reward point phishing exploits the fear of losing accrued benefits combined with arbitrary midnight deadlines. Legitimate airline loyalty programs send multiple advance notices over months.',
    saferAction:
      'Never log in via links in unexpected expiration warnings. Check your loyalty balance directly via the official airline app.',
  },
  {
    id: 'urgency-8',
    factor: 'Urgency',
    pairedTactic: 'IT Support',
    context: 'Workplace',
    scenarioType: 'Password Expiry Panic',
    title: 'Corporate Password Expiring in 1 Hour',
    situation:
      'A pop-up email from "IT Security Helpdesk" states: "Your corporate Active Directory password expires in 60 minutes. Failure to renew will lock you out of VPN and email for 48 hours. Keep current password by validating credentials here: [link]"',
    question: 'What is the recommended action?',
    options: [
      {
        id: 'a',
        text: 'Click the link immediately to prevent losing VPN and email access during work.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Contact your internal IT helpdesk through verified internal ticketing systems or use native OS password change settings (Ctrl+Alt+Del).',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Type your old password and a new password on the web page to ensure business continuity.',
        isSafer: false,
      },
    ],
    feedback:
      'Short password expiration windows are designed to trigger panic about missing work deadlines. Genuine enterprise directory services provide advance desktop notices, not urgent email links asking to "keep your current password".',
    saferAction:
      'Change workplace passwords only through your operating system settings or your company’s confirmed single-sign-on dashboard.',
  },
  {
    id: 'urgency-9',
    factor: 'Urgency',
    pairedTactic: 'Financial Loss',
    context: 'Personal',
    scenarioType: 'Cryptocurrency Wallet Sync',
    title: 'Hardware Wallet Firmware Migration',
    situation:
      'You receive an urgent notification purporting to be from a hardware crypto wallet manufacturer: "CRITICAL: Vulnerability detected in firmware v2.1. You must synchronize your 24-word recovery seed phrase within 2 hours or your crypto balances will be permanently desynchronized from the blockchain."',
    question: 'What should you do?',
    options: [
      {
        id: 'a',
        text: 'Enter your 24-word recovery phrase immediately on the website to safeguard your wallet balances.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Recognize that recovery seed phrases must NEVER be entered into any digital website or form under any circumstance.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Enter 23 of the words and omit the last word to see if the system accepts it.',
        isSafer: false,
      },
    ],
    feedback:
      'Blockchains cannot "desynchronize" private keys, and hardware manufacturers can never access or require your recovery phrase. The 2-hour urgency is designed to prevent victims from consulting crypto safety documentation.',
    saferAction:
      'Never disclose or type your private keys or recovery seed phrase online. Any request for a seed phrase is a guaranteed scam.',
  },
  {
    id: 'urgency-10',
    factor: 'Urgency',
    pairedTactic: 'Compliance',
    context: 'Workplace',
    scenarioType: 'Contract Signature Deadline',
    title: 'Client Signature Required Before Fiscal Close',
    situation:
      'A sales rep on your team emails you: "Our largest prospective client agreed to sign our contract right now, but DocuSign is failing on their end. They sent this custom executable form [ClientContract.exe] and need our countersignature before midnight to book revenue this quarter!"',
    question: 'What is the correct protocol?',
    options: [
      {
        id: 'a',
        text: 'Execute the file quickly to ensure the company makes its quarterly sales target.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Refuse to run an executable (.exe) file, alert your IT security department, and insist on approved document formats (e.g., standard PDF through enterprise signing tools).',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Rename the file from .exe to .pdf and open it.',
        isSafer: false,
      },
    ],
    feedback:
      'Executable files (.exe, .scr, .vbs) disguised as urgent contracts are common malware delivery vehicles. Sales targets and fiscal deadlines create emotional urgency that attackers weaponize against normal caution.',
    saferAction:
      'Never open or run executable files received via email. Contracts should strictly be shared via standard document formats or enterprise e-signature platforms.',
  },

  // ==========================================
  // FEAR FACTOR (10 Scenarios)
  // ==========================================
  {
    id: 'fear-1',
    factor: 'Fear',
    pairedTactic: 'Authority & Legal Threat',
    context: 'Personal',
    scenarioType: 'Tax Audit & Arrest Threat',
    title: 'The Federal Tax Enforcement Call',
    situation:
      'A voicemail from an unknown number states: "This is Special Agent Davies from Federal Tax Revenue Services. There is an active arrest warrant in your name for unpaid back taxes. Federal marshals are dispatched to your home unless you call back within 20 minutes to settle the tax deficit."',
    question: 'What is the appropriate course of action?',
    options: [
      {
        id: 'a',
        text: 'Call back immediately with your credit card ready to avoid arrest at your home.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Ignore the voicemail, as real tax revenue authorities never threaten sudden police arrest via phone or demand immediate settlement over the phone.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Call the local police station and ask them to cancel the federal warrant.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Send a money order to the return address left on the voicemail.',
        isSafer: false,
      },
    ],
    feedback:
      'Fear-based scams induce intense panic using threats of arrest, imprisonment, or asset forfeiture. In reality, legitimate tax agencies communicate audits through formal postal mail and provide structured appeals processes.',
    saferAction:
      'Government tax agencies never demand immediate phone payment or threaten immediate arrest. Check tax records via the official government portal.',
  },
  {
    id: 'fear-2',
    factor: 'Fear',
    pairedTactic: 'Technical Urgency',
    context: 'Personal',
    scenarioType: 'Tech Support Scareware',
    title: 'The Red Screen Trojan Alert',
    situation:
      'While browsing a recipe blog, your computer screen turns bright red with loud siren sounds and a full-screen window: "WARNING: Trojan.Spyware.Banker detected! Your financial passwords and camera are being broadcast to hackers. Do NOT turn off your PC! Call Windows Security Helpline: 1-800-XXX-XXXX immediately!"',
    question: 'How should you handle this screen?',
    options: [
      {
        id: 'a',
        text: 'Call the 1-800 phone number and allow their technician to install remote access tools to clean your hard drive.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Recognize this as browser scareware; close the browser tab or terminate the browser process via Task Manager, and do not call the number.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Leave the computer running and buy $500 in Google Play cards to pay for security remediation.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Unplug your computer monitor permanently.',
        isSafer: false,
      },
    ],
    feedback:
      'Scareware locks the browser into full-screen mode to produce acute terror. Legitimate operating systems (Windows, macOS) never display toll-free phone numbers in alerts or instruct users to call them.',
    saferAction:
      'Force-close the browser tab using Task Manager / Activity Monitor. Never call phone numbers displayed on browser popups.',
  },
  {
    id: 'fear-3',
    factor: 'Fear',
    pairedTactic: 'Disciplinary Action',
    context: 'Workplace',
    scenarioType: 'Workplace Policy Violation',
    title: 'Internal Audit Non-Compliance Warning',
    situation:
      'An email with the subject "NOTICE OF DISCIPLINARY PROCEEDING" arrives: "A compliance audit has identified inappropriate files downloaded to your work laptop in violation of Company Code of Conduct Section 4. Review the attached confidential disciplinary dossier [Audit_Report.docm] to respond before termination hearings begin at 5:00 PM."',
    question: 'What is the safest way to proceed?',
    options: [
      {
        id: 'a',
        text: 'Open the Word document immediately and click "Enable Macros" to see what files you are accused of downloading.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Do not open the macro-enabled document; contact your HR manager or supervisor directly through official internal phone/chat channels to confirm if any audit exists.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Forward the document to all your coworkers to ask if they received similar termination notices.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Reply to the sender apologizing and asking for leniency before reading the document.',
        isSafer: false,
      },
    ],
    feedback:
      'Fear of job termination causes intense personal panic, leading employees to overlook security warnings. The `.docm` format contains malicious macros designed to infect corporate networks once the user clicks "Enable Macros".',
    saferAction:
      'Never enable macros on unexpected office documents. Validate HR disciplinary inquiries directly through your known manager or internal HR contact.',
  },
  {
    id: 'fear-4',
    factor: 'Fear',
    pairedTactic: 'Shame & Extortion',
    context: 'Personal',
    scenarioType: 'Sextortion / Blackmail Phishing',
    title: 'The Webcam Compromise Blackmail',
    situation:
      'You receive an email quoting one of your old passwords in the subject line. The sender claims: "I installed Pegasus spyware on your router and recorded you visiting adult websites through your webcam. If you do not send $1,200 in Bitcoin to my wallet within 48 hours, I will email the video montage to all your Facebook contacts and family members."',
    question: 'How should you respond to this threat?',
    options: [
      {
        id: 'a',
        text: 'Pay the Bitcoin immediately to prevent personal humiliation and exposure to your family.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Recognize this as a mass automated sextortion scam using credentials leaked from past public data breaches; do not pay, mark as spam, and change that password on any account where it was used.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Reply to the email pleading with the blackmailer to delete the recording.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Cover your webcam with tape and send half the Bitcoin balance.',
        isSafer: false,
      },
    ],
    feedback:
      'Automated sextortion relies on shame and dread. Attackers obtain old password hashes from historical data leaks and paste them into mass mailers. They do not actually possess video recordings.',
    saferAction:
      'Never pay extortion demands. Update breached passwords across your accounts and enable multi-factor authentication (MFA).',
  },
  {
    id: 'fear-5',
    factor: 'Fear',
    pairedTactic: 'Financial Crisis',
    context: 'Personal',
    scenarioType: 'Bank Account Compromise Alert',
    title: 'The $3,400 Wire Authorization Alert',
    situation:
      'You receive an urgent SMS: "[Chase Alert]: A wire transfer of $3,412.50 to foreign account RO-8912 was initiated from your checking account. If this was NOT you, call our fraud defense unit immediately at 1-888-294-XXXX to freeze your account."',
    question: 'What is your safest reaction?',
    options: [
      {
        id: 'a',
        text: 'Call the 1-888 number in the SMS immediately to freeze the unauthorized wire before the money leaves.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Open the Chase app independently or dial the customer service number printed directly on the back of your physical debit card.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Text back "STOP WIRE" to the unknown shortcode.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Log into your bank through a link found via public Google search ads.',
        isSafer: false,
      },
    ],
    feedback:
      'Bank alert smishing triggers acute fear of monetary loss. When victims call the fraudulent number in the text, a fake "bank representative" instructs them to transfer funds to a "safe government holding account" (which belongs to the scammer).',
    saferAction:
      'Always call the telephone number stamped on the physical back of your payment card or on your official monthly paper statements.',
  },
  {
    id: 'fear-6',
    factor: 'Fear',
    pairedTactic: 'Corporate Liability',
    context: 'Workplace',
    scenarioType: 'Legal Subpoena Notice',
    title: 'Intellectual Property Lawsuit Subpoena',
    situation:
      'An email from "Legal_Notice@court-district-summons.us" states: "You have been named as a defendant in Federal Copyright Infringement Action #49102. Failure to review summons exhibits within 24 hours will result in default civil judgment of $250,000 against your employer."',
    question: 'What should you do?',
    options: [
      {
        id: 'a',
        text: 'Click the link to download the summons exhibits so your company avoids the default judgment.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Forward the email directly to your company’s in-house legal counsel or corporate security team without opening attachments or links.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Reply asking what copyrighted materials were allegedly infringed.',
        isSafer: false,
      },
    ],
    feedback:
      'Attackers use legal jargon and massive liability figures to terrify staff into opening malware. Official legal process service requires formal legal service protocols, not random email links.',
    saferAction:
      'Direct all legal correspondence to your corporate legal affairs department. Never click links in unsolicited legal summons.',
  },
  {
    id: 'fear-7',
    factor: 'Fear',
    pairedTactic: 'Personal Identity Theft',
    context: 'Personal',
    scenarioType: 'Social Security Suspension',
    title: 'Suspension of Social Security Number',
    situation:
      'An automated phone call says: "This is the Social Security Administration. Your Social Security Number has been suspended due to abandoned rental car containing illicit narcotics found on the southern border. Press 1 to speak with an investigator."',
    question: 'What reality check clarifies this situation?',
    options: [
      {
        id: 'a',
        text: 'Social Security Numbers can be suspended immediately by police over the phone.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Social Security Numbers are never "suspended", and government agencies do not call citizens threatening arrest over rental vehicles.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'You should press 1 and explain that you have never rented a vehicle near the border.',
        isSafer: false,
      },
    ],
    feedback:
      'The government does not "suspend" Social Security Numbers. This fear script is designed to manipulate victims into revealing their full SSN and liquidating bank assets into gift cards.',
    saferAction:
      'Hang up immediately. Government agencies never call to announce criminal investigations or SSN suspensions.',
  },
  {
    id: 'fear-8',
    factor: 'Fear',
    pairedTactic: 'Ransomware',
    context: 'Workplace',
    scenarioType: 'IT Security Alert',
    title: 'Critical Ransomware Outbreak Warning',
    situation:
      'A message pops up on your workplace computer styled with company IT colors: "URGENT: Active Ransomware Detected on Your Subnet. To prevent encryption of your local hard drive, click here immediately to download the emergency Antivirus Patch tool."',
    question: 'What should you do?',
    options: [
      {
        id: 'a',
        text: 'Download and run the emergency patch tool right away to protect your files.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Disconnect your device from the network (unplug ethernet / turn off Wi-Fi) and notify internal IT security through your phone or a secondary device.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Copy all your files to an external thumb drive and then run the patch.',
        isSafer: false,
      },
    ],
    feedback:
      'Attackers pose as security defenses to deliver the actual malware payload. Legitimate enterprise IT systems deploy patches silently in the background, rather than prompting users with emergency download links.',
    saferAction:
      'Disconnect from the network immediately and report suspected security incidents to IT via official channels.',
  },
  {
    id: 'fear-9',
    factor: 'Fear',
    pairedTactic: 'Grandparent Scam',
    context: 'Personal',
    scenarioType: 'Bail Bond Emergency',
    title: 'The Late Night Car Accident Call',
    situation:
      'An elderly person receives a phone call at 2:00 AM from a weeping voice: "Grandma, it’s me! I was in a terrible car accident. The other driver is in the hospital and police arrested me for reckless driving. Please don’t tell mom and dad! My public defender needs $5,000 bail right now."',
    question: 'What is the safest action for the grandparent to take?',
    options: [
      {
        id: 'a',
        text: 'Wire the $5,000 immediately to keep the grandchild out of jail and keep the secret.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Hang up and immediately call the grandchild or their parents on their known cell phone numbers to verify their location.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Ask the weeping caller to give you the police badge number and pay over the phone.',
        isSafer: false,
      },
    ],
    feedback:
      'The "grandparent scam" uses voice distress, late-night timing, and familial fear to bypass critical evaluation. AI voice cloning now allows scammers to mimic voices from brief social media clips.',
    saferAction:
      'Establish a private family code word, and always contact parents or family members directly before sending emergency funds.',
  },
  {
    id: 'fear-10',
    factor: 'Fear',
    pairedTactic: 'Healthcare Emergency',
    context: 'Workplace',
    scenarioType: 'Health Insurance Cancellation',
    title: 'Employee Medical Benefits Cancellation',
    situation:
      'An email states: "Your employer-sponsored health insurance coverage has lapsed due to missing open enrollment documentation. Medical claims will be rejected starting midnight unless you resubmit your health card and SSN here: [link]"',
    question: 'What is the correct protocol?',
    options: [
      {
        id: 'a',
        text: 'Click the link immediately so your upcoming doctor appointments are covered.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Log into your organization’s internal employee benefits portal directly or call your internal HR benefits team to check your coverage status.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Email your health card photo to the sender to ensure coverage remains active.',
        isSafer: false,
      },
    ],
    feedback:
      'Fear of losing medical coverage causes severe anxiety. Phishers exploit health enrollment periods to harvest Social Security and personal healthcare numbers.',
    saferAction:
      'Verify healthcare insurance status exclusively through official HR benefits coordinators or your insurance card’s official customer portal.',
  },

  // ==========================================
  // AUTHORITY FACTOR (10 Scenarios)
  // ==========================================
  {
    id: 'authority-1',
    factor: 'Authority',
    pairedTactic: 'Urgency',
    context: 'Workplace',
    scenarioType: 'IT Director Mandate',
    title: 'The Mandatory Security Token Reset',
    situation:
      'An email arrives from the Chief Information Security Officer (CISO): "By order of the Executive Committee, all employees must update their Multi-Factor Authentication keys following an enterprise security directive. Authenticate with your corporate credentials at [ciso-enterprise-auth.com] within 2 hours or face disciplinary review."',
    question: 'What is the safest step in this situation?',
    options: [
      {
        id: 'a',
        text: 'Comply quickly because the CISO and Executive Committee mandated the change under threat of disciplinary review.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Inspect the domain URL, decline to input credentials, and verify the mandate via your standard internal IT ticketing portal or IT desk.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Forward your username and password to your direct manager so they can complete the reset on your behalf.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Click the link but intentionally type an incorrect password to see if the page is fake.',
        isSafer: false,
      },
    ],
    feedback:
      'Authority phishing invokes high-ranking executives (CISO, Board) to trigger the Milgram compliance reflex. Employees naturally fear defying executive orders, which leads them to overlook unfamiliar login domains.',
    saferAction:
      'Enterprise security rollouts are announced through internal town halls, ticketing channels, and intranet updates—never through external untrusted domains.',
  },
  {
    id: 'authority-2',
    factor: 'Authority',
    pairedTactic: 'Legal Intimidation',
    context: 'Workplace',
    scenarioType: 'Audit Inspector Visit',
    title: 'The Surprise Regulatory Compliance Audit',
    situation:
      'A person dressed in a sharp dark suit with a laminated badge reading "Federal Trade Commission Regulatory Auditor" arrives in your office reception. They state: "I am conducting a surprise compliance inspection. Provide me with guest Wi-Fi credentials and plug this USB diagnostic drive into your workstation to pull network telemetry."',
    question: 'What is the proper workplace security action?',
    options: [
      {
        id: 'a',
        text: 'Comply immediately and plug in the USB drive to avoid federal regulatory penalties for non-compliance.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Never insert untrusted USB devices; escort the visitor to security or front desk reception and contact your compliance officer immediately.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Allow them to plug the USB into a secondary receptionist computer instead of your main workstation.',
        isSafer: false,
      },
      {
        id: 'd',
        text: 'Offer to email them internal network diagrams on your phone instead.',
        isSafer: false,
      },
    ],
    feedback:
      'Physical social engineering often relies on intimidating props (suits, clipboards, fake federal badges). Attackers know receptionists and junior staff hesitate to question federal authority figures.',
    saferAction:
      'Strict visitor escort policies and USB bans must be enforced regardless of the visitor’s purported rank or government credentials.',
  },
  {
    id: 'authority-3',
    factor: 'Authority',
    pairedTactic: 'Secrecy',
    context: 'Workplace',
    scenarioType: 'Gift Card Request',
    title: 'Executive Client Appreciation Request',
    situation:
      'You receive an SMS: "Hi, this is Mark, your VP of Sales. I am stuck in an offsite partner presentation and need to reward five prospective enterprise clients. Please run to the store near the office, buy 5x $100 Apple gift cards, and scratch the backs to send me photos of the codes. I will reimburse your expense report today."',
    question: 'Why is this request clearly fraudulent?',
    options: [
      {
        id: 'a',
        text: 'Executives never attend offsite partner presentations without sales managers present.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Executives and legitimate companies never instruct employees to buy retail gift cards or text gift card PIN codes for corporate expenses.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Apple gift cards cannot be purchased in quantities of five.',
        isSafer: false,
      },
    ],
    feedback:
      'The "executive gift card scam" exploits authority and workplace compliance. Attackers spoof executive names, knowing employees want to impress leadership by executing urgent favors.',
    saferAction:
      'No legitimate organization or manager uses consumer gift card codes for business expenses. Treat any gift card purchase request as fraudulent.',
  },
  {
    id: 'authority-4',
    factor: 'Authority',
    pairedTactic: 'Government Legitimacy',
    context: 'Personal',
    scenarioType: 'Jury Duty Non-Appearance',
    title: 'The Missed Federal Jury Duty Summons',
    situation:
      'A caller identifies himself as Lieutenant Ramirez from the County Sheriff’s Department: "You failed to appear for federal jury duty on Tuesday. A bench warrant has been issued by Judge Miller. To avoid immediate detention until the next court session, pay a $750 court bond via Green Dot MoneyPak over the phone."',
    question: 'How should you evaluate this situation?',
    options: [
      {
        id: 'a',
        text: 'Pay the $750 over the phone so you do not get arrested in front of your family or neighbors.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Recognize this as a known law enforcement imposter scam; real courts notify jury summons via postal mail and never collect court fines over the phone via prepaid money cards.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Negotiate the court bond down to $300.',
        isSafer: false,
      },
    ],
    feedback:
      'Law enforcement impersonators use official judicial titles, badge numbers, and courtroom jargon to paralyze victims with fear of authority. Court citations are never resolved using prepaid cards over the phone.',
    saferAction:
      'Courts and sheriffs never demand bail or fine payments via prepaid cards or telephone calls. Contact the court clerk directly if concerned.',
  },
  {
    id: 'authority-5',
    factor: 'Authority',
    pairedTactic: 'Corporate Compliance',
    context: 'Workplace',
    scenarioType: 'HR Policy Agreement',
    title: 'Mandatory Revised Anti-Harassment Agreement',
    situation:
      'An email purporting to come from the Chief People Officer reads: "Pursuant to new labor standards, all team members must sign the updated 2025 Workplace Code of Conduct. Please authenticate your employee credentials on our compliance partner portal [workplace-compliance-docs.net/sign] to complete the mandatory certification."',
    question: 'What is the correct way to handle this request?',
    options: [
      {
        id: 'a',
        text: 'Click the link and sign in right away to ensure your employment status remains compliant.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Inspect the link; navigate to your official corporate Learning Management System (LMS) or HR portal independently to locate assigned courses.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Ask the Chief People Officer on Twitter if the policy update is real.',
        isSafer: false,
      },
    ],
    feedback:
      'Attackers weaponize HR authority and mandatory compliance training schedules. Because employees expect annual corporate training, they blindly input SSO credentials into external lookalike domains.',
    saferAction:
      'Access training and compliance documentation solely via your organization’s internal, verified learning dashboard.',
  },
  {
    id: 'authority-6',
    factor: 'Authority',
    pairedTactic: 'Bank Security Officer',
    context: 'Personal',
    scenarioType: 'Fraud Department Impersonation',
    title: 'The Central Bank Fraud Investigator',
    situation:
      'You receive a phone call showing your bank’s caller ID. The caller says: "I am Senior Fraud Specialist Wallace from your bank’s Fraud Operations. An internal rogue teller is transferring funds from your account. To protect your savings, you must wire your balance to our secure Federal Reserve depository escrow account while we arrest the teller."',
    question: 'What should you do?',
    options: [
      {
        id: 'a',
        text: 'Follow the instructions and wire your funds to the "secure depository" account as advised by the fraud specialist.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Hang up immediately, recognize caller ID spoofing, and call your bank using the phone number printed on the back of your debit card.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Ask the caller for the rogue teller’s employee name and go to the branch to confront them.',
        isSafer: false,
      },
    ],
    feedback:
      'Caller ID numbers can be spoofed trivially. Banks never instruct customers to move funds to an "escrow" or "safe" account to protect them from rogue employees. The "safe account" is the attacker’s account.',
    saferAction:
      'Never transfer money to a "safe account" at the instruction of an inbound caller. Hang up and call your bank independently.',
  },
  {
    id: 'authority-7',
    factor: 'Authority',
    pairedTactic: 'Customs / Border Agency',
    context: 'Personal',
    scenarioType: 'Customs Clearance Agent',
    title: 'The Intercepted International Package',
    situation:
      'You receive an email from "customs-inspection-division@fed-clearance.org" with an official state crest: "An international parcel addressed to you has been intercepted carrying unregistered medical goods. To prevent referral to federal prosecutors, pay the $350 customs documentation levy at [link]."',
    question: 'What identifies this as an authority exploit?',
    options: [
      {
        id: 'a',
        text: 'Real customs agencies never inspect international parcels.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'The email uses official crests and prosecutorial threats from an unofficial non-governmental domain (.org instead of official .gov) to extort payments.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Customs clearance letters are only sent via telegram.',
        isSafer: false,
      },
    ],
    feedback:
      'Official government crests and intimidating legal vocabulary are used to manufacture false authority. Official government agencies in the United States operate under `.gov` or verified domains, not arbitrary `.org` or `.net` addresses.',
    saferAction:
      'Government agencies use `.gov` domains. Verify any customs notices directly through official carrier tracking or customs service centers.',
  },
  {
    id: 'authority-8',
    factor: 'Authority',
    pairedTactic: 'Executive Confidentiality',
    context: 'Workplace',
    scenarioType: 'Executive Recruiter Outreach',
    title: 'Board-Level Executive Search Invitation',
    situation:
      'A message from a purported high-profile executive search firm partner states: "Our board client is privately vetting candidates for a Confidential Senior Vice President role with 2x your current compensation. Review the board memo [Executive_Dossier_NDA.iso] to confirm mutual interest before positions close."',
    question: 'What is the danger here?',
    options: [
      {
        id: 'a',
        text: 'The file is an .ISO disk image file commonly used to deliver malware that bypasses email filters.',
        isSafer: true,
      },
      {
        id: 'b',
        text: 'Senior Vice President compensation packages can never be discussed without video calls.',
        isSafer: false,
      },
      {
        id: 'c',
        text: 'Executive search firms are not permitted to use LinkedIn or email.',
        isSafer: false,
      },
    ],
    feedback:
      'Attackers flatter targets with high-level corporate roles and leverage prestigious authority. Disk images (.iso, .img, .vhd) mount like virtual drives and are heavily abused by cybercriminals to execute malware.',
    saferAction:
      'Never mount .ISO or .IMG files received via email. Executive search communications should never require downloading virtual disk images.',
  },
  {
    id: 'authority-9',
    factor: 'Authority',
    pairedTactic: 'Tax Compliance',
    context: 'Personal',
    scenarioType: 'Tax Return Recalculation',
    title: 'The Tax Authority Refund Recalculation',
    situation:
      'An SMS arrives: "Internal Revenue Notice: Due to an administrative recalculation, you are entitled to a tax rebate of $642.18. Confirm your identity and submit your bank account and debit card details at [irs-rebate-portal-gov.online] to claim your funds."',
    question: 'What should you do?',
    options: [
      {
        id: 'a',
        text: 'Submit your banking details quickly so the rebate funds can be deposited into your account.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Recognize that tax agencies do not send text messages about unexpected refunds, and the domain (.online) is not an official government (.gov) website.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Reply to the text asking them to send a paper check instead.',
        isSafer: false,
      },
    ],
    feedback:
      'The allure of an unexpected tax refund paired with the presumed authority of national revenue services causes victims to willingly enter debit card numbers and PINs into phishing portals.',
    saferAction:
      'Tax authorities do not issue refunds via unsolicited SMS links. Check refund status only on the official irs.gov portal.',
  },
  {
    id: 'authority-10',
    factor: 'Authority',
    pairedTactic: 'Workplace Hierarchy',
    context: 'Workplace',
    scenarioType: 'C-Suite Calendar Reschedule',
    title: 'C-Suite Private Assistant Task',
    situation:
      'You get an email claiming to be from the Executive Assistant to the Chairman of the Board: "The Chairman needs five new Apple MacBook Pro laptops shipped to the London innovation lab for tomorrow’s investor summit. Purchase them using this company credit card authorization link [board-procurements.net] immediately."',
    question: 'What is the correct protocol?',
    options: [
      {
        id: 'a',
        text: 'Process the order through the link immediately to ensure the Chairman is prepared for the investor summit.',
        isSafer: false,
      },
      {
        id: 'b',
        text: 'Route all hardware and equipment purchases strictly through your enterprise IT procurement system, verifying with the Chairman’s verified office directly.',
        isSafer: true,
      },
      {
        id: 'c',
        text: 'Forward the email to the London office and ask if they need extra power adapters too.',
        isSafer: false,
      },
    ],
    feedback:
      'Junior staff often fear questioning requests attributed to the Chairman or C-Suite assistants. Attackers set up spoofed procurement links to harvest credit card and enterprise credentials.',
    saferAction:
      'All procurement must follow standardized internal purchase order (PO) workflows, regardless of which executive’s name is invoked.',
  },
];
