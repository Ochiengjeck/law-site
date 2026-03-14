import { prisma } from "@/lib/prisma";

const DEFAULTS: Record<string, string> = {
  // Brand identity
  "site.logoUrl": "",
  // Theme colors
  "theme.navy":      "#1B3A6B",
  "theme.navyDark":  "#0f2548",
  "theme.gold":      "#C9A84C",
  "theme.goldDark":  "#b8953e",
  "theme.lightGray": "#F5F7FA",
  "site.iconUrl": "",

  // Home page
  "home.hero.badge": "Maritime · ESG · Corporate · Property",
  "home.hero.title": "Principled Legal Counsel.\nSustainable Futures.",
  "home.hero.subtitle":
    "SW Law LLP is a premier legal consultancy delivering expert counsel in maritime law, ESG compliance, and corporate practice — rooted in integrity and the Blue Economy.",
  "home.hero.imageUrl": "https://picsum.photos/seed/sw-hero/1920/1080",
  "home.hero.cta1": "Request a Consultation",
  "home.hero.cta2": "Our Services",
  "home.stat.1.value": "4",
  "home.stat.1.label": "Practice Areas",
  "home.stat.2.value": "100+",
  "home.stat.2.label": "Clients Served",
  "home.stat.3.value": "Est. 2020",
  "home.stat.3.label": "Founded",
  "home.stat.4.value": "Nairobi",
  "home.stat.4.label": "Kenya",
  "home.about.title": "Built on Integrity.\nDriven by Purpose.",
  "home.about.text1":
    "SW Law LLP places the Blue Economy at the forefront of legal practice, advising clients at the intersection of maritime commerce, environmental stewardship, and corporate governance.",
  "home.about.text2":
    "Our practice is defined by principled counsel and a deep commitment to sustainable development — for our clients, and for Kenya's future.",
  "home.about.imageUrl": "https://picsum.photos/seed/sw-about/800/600",
  "home.cta.title": "Ready to Discuss Your Legal Needs?",
  "home.cta.subtitle":
    "Our team is ready to provide expert guidance tailored to your specific circumstances.",
  "home.cta.imageUrl": "https://picsum.photos/seed/sw-cta/1920/600",

  // About page
  "about.hero.title": "A Practice Built on Principle",
  "about.hero.subtitle":
    "SW Law LLP is a Nairobi-based legal consultancy committed to delivering principled, expert legal services across maritime law, ESG compliance, corporate practice, and property law.",
  "about.hero.imageUrl": "https://picsum.photos/seed/sw-about-hero/1920/700",
  "about.mission.title": "Multi-disciplinary counsel for a complex world",
  "about.mission.text1":
    "At SW Law LLP, we understand that legal challenges rarely exist in isolation. Commercial decisions, environmental obligations, and regulatory requirements are deeply intertwined — and our lawyers are trained to navigate this complexity.",
  "about.mission.text2":
    "We bring together specialists in maritime law, ESG, corporate governance, and property law under one roof, enabling us to provide cohesive, multi-disciplinary counsel to our clients.",
  "about.mission.imageUrl": "https://picsum.photos/seed/sw-about/800/600",
  "about.quote":
    "The measure of a great law firm is not only the cases it wins, but the principles it defends and the futures it helps build.",
  "about.blueEconomy.title": "Committed to the Blue Economy",
  "about.blueEconomy.subtitle":
    "The Blue Economy — the sustainable use of ocean resources for economic growth — sits at the heart of our maritime practice. Kenya's vast coastline and its strategic position in the Indian Ocean present both significant opportunity and unique legal complexity.",
  "about.blueEconomy.1.heading": "Maritime Commerce",
  "about.blueEconomy.1.body":
    "Advising shipowners, charterers, and operators on all aspects of maritime trade, vessel operations, and logistics.",
  "about.blueEconomy.1.imageUrl": "https://picsum.photos/seed/sw-maritime/600/400",
  "about.blueEconomy.2.heading": "Environmental Stewardship",
  "about.blueEconomy.2.body":
    "Supporting clients in meeting marine environmental regulations and developing sustainability strategies for ocean-based industries.",
  "about.blueEconomy.2.imageUrl": "https://picsum.photos/seed/sw-esg/600/400",
  "about.blueEconomy.3.heading": "Regulatory Navigation",
  "about.blueEconomy.3.body":
    "Guiding clients through Kenya's maritime regulatory framework and international conventions applicable to their operations.",
  "about.blueEconomy.3.imageUrl": "https://picsum.photos/seed/sw-corporate/600/400",
  "about.value.1.icon": "⚖",
  "about.value.1.title": "Integrity",
  "about.value.1.description":
    "We uphold the highest standards of professional ethics in every engagement, providing honest, transparent counsel that clients can rely on.",
  "about.value.2.icon": "✦",
  "about.value.2.title": "Excellence",
  "about.value.2.description":
    "Our lawyers combine deep sector knowledge with rigorous legal analysis to deliver outcomes that advance our clients' interests.",
  "about.value.3.icon": "🌊",
  "about.value.3.title": "Sustainability",
  "about.value.3.description":
    "We believe the law is a powerful instrument for sustainable development. Our practice actively supports the transition to a Blue Economy.",
  "about.value.4.icon": "◆",
  "about.value.4.title": "Client Focus",
  "about.value.4.description":
    "Every matter receives personalised attention. We take time to understand the unique context and objectives of each client.",

  // Services page
  "services.hero.title": "Comprehensive Legal Services",
  "services.hero.subtitle":
    "SW Law LLP offers a broad range of legal services, anchored by deep expertise in maritime law and ESG compliance, and extending to corporate, property, and family matters.",
  "services.hero.imageUrl": "https://picsum.photos/seed/sw-services-hero/1920/700",

  // Partners page
  "partners.hero.title": "Meet Our Partners",
  "partners.hero.subtitle":
    "SW Law LLP is led by experienced legal professionals who combine sector expertise with a commitment to principled, client-centred practice.",
  "partners.hero.imageUrl": "https://picsum.photos/seed/sw-partners-hero/1920/700",

  // Blog page
  "blog.hero.title": "Legal Insights",
  "blog.hero.subtitle":
    "Commentary and analysis from the SW Law LLP team on maritime law, ESG compliance, regulatory developments, and legal trends in Kenya.",
  "blog.hero.imageUrl": "https://picsum.photos/seed/sw-blog-hero/1920/700",

  // Contact page
  "contact.email": "info@swlawllp.co.ke",
  "contact.officeHours": "Mon – Fri\n8:00 AM – 6:00 PM EAT",
  "contact.imageUrl": "https://picsum.photos/seed/sw-contact/900/1200",
  "contact.tagline": "Principled Legal Counsel for a Sustainable Future",
};

export async function getPageSettings(
  section: string
): Promise<Record<string, string>> {
  const prefix = section + ".";
  const rows = await prisma.siteSetting.findMany({
    where: { key: { startsWith: prefix } },
  });
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(DEFAULTS)) {
    if (k.startsWith(prefix)) result[k.slice(prefix.length)] = v;
  }
  for (const row of rows) result[row.key.slice(prefix.length)] = row.value;
  return result;
}

export { DEFAULTS };
