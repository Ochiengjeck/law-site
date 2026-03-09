import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULTS } from "../lib/siteSettings";

const prisma = new PrismaClient();

async function main() {
  // ── Admin user ──────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("Admin1234!", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@swlaw.com" },
    update: {},
    create: {
      name: "SW Law Admin",
      email: "admin@swlaw.com",
      password: hashedPassword,
      role: "admin",
    },
  });
  console.log("✓ Admin user created: admin@swlaw.com / Admin1234!");

  // ── Site settings (defaults) ────────────────────────────────────────────────
  for (const [key, value] of Object.entries(DEFAULTS)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
  // Ensure branding keys exist even if already seeded without them
  for (const key of ["site.logoUrl", "site.iconUrl"]) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value: "" },
    });
  }
  console.log(`✓ Site settings seeded (${Object.keys(DEFAULTS).length} keys)`);

  // ── Partners ─────────────────────────────────────────────────────────────────
  await prisma.partner.deleteMany({});
  await prisma.partner.createMany({
    data: [
      {
        name: "Faith Sulwe",
        role: "Managing Partner",
        imageUrl: "",
        bio: [
          "Faith Sulwe is the founding and Managing Partner of SW Law LLP. With extensive experience in maritime law and the Blue Economy, Faith has built a reputation as one of Kenya's foremost maritime legal practitioners. She advises shipowners, charterers, port operators, and maritime financiers on the full spectrum of maritime legal matters.",
          "Faith's practice is particularly focused on the intersection of maritime commerce and environmental sustainability. She has advised on landmark vessel transactions, complex chartering disputes, and regulatory compliance frameworks for clients operating in Kenya's Indian Ocean waters and beyond.",
          "Faith is a passionate advocate for the Blue Economy as a vehicle for sustainable development in Kenya and across the African continent. She regularly speaks at maritime and ESG conferences and has contributed to policy discussions on Kenya's maritime regulatory framework.",
        ].join("\n\n"),
        expertise: [
          "Maritime & Shipping Law",
          "Blue Economy",
          "Marine Environmental Law",
          "ESG Compliance",
        ].join("\n"),
        education: [
          "LLB (Hons) – University of Nairobi",
          "Advocate of the High Court of Kenya",
          "Diploma in Maritime Law – World Maritime University",
        ].join("\n"),
        order: 1,
      },
      {
        name: "Lillian Waweru",
        role: "Partner",
        imageUrl: "",
        bio: [
          "Lillian Waweru is a Partner at SW Law LLP, leading the firm's corporate and ESG practice. She brings deep expertise in corporate advisory, mergers and acquisitions, and the rapidly evolving field of ESG compliance — helping organisations align their legal obligations with sustainable business practice.",
          "Lillian advises a diverse range of clients including listed companies, private equity funds, and multinational corporations on corporate governance, commercial transactions, and ESG strategy. Her work spans sectors including financial services, energy, and manufacturing.",
          "Recognised for her pragmatic and client-centred approach, Lillian is known for translating complex regulatory requirements into clear, actionable frameworks. She is a sought-after advisor on ESG reporting, stakeholder engagement, and sustainable finance in the Kenyan market.",
        ].join("\n\n"),
        expertise: [
          "ESG Compliance",
          "Corporate & Commercial Law",
          "Mergers & Acquisitions",
          "Regulatory Advisory",
        ].join("\n"),
        education: [
          "LLB (Hons) – University of Nairobi",
          "LLM in Commercial Law – University of Edinburgh",
          "Advocate of the High Court of Kenya",
        ].join("\n"),
        order: 2,
      },
    ],
  });
  console.log("✓ Partners seeded");

  // ── Services ─────────────────────────────────────────────────────────────────
  await prisma.service.deleteMany({});
  await prisma.service.createMany({
    data: [
      {
        title: "Maritime & Shipping Law",
        slug: "maritime",
        badge: "Core Practice",
        description:
          "Our maritime practice is one of the most comprehensive in Kenya. We advise shipowners, operators, charterers, financiers, and insurers on the full spectrum of maritime legal matters — from vessel transactions to regulatory compliance and dispute resolution.",
        imageUrl: "",
        items: [
          "Marine environmental law and compliance",
          "Shipping logistics advisory",
          "Vessel registration and flagging",
          "Vessel sale and purchase agreements",
          "Chartering contracts (time, voyage, bareboat)",
          "Maritime regulatory compliance",
          "Port state control matters",
          "Cargo claims and marine insurance",
        ].join("\n"),
        category: "main",
        order: 1,
      },
      {
        title: "ESG Compliance",
        slug: "esg",
        badge: "Environmental · Social · Governance",
        description:
          "As ESG obligations become central to business operations and investor expectations, SW Law LLP helps organisations develop robust frameworks that satisfy regulatory requirements, build stakeholder trust, and drive sustainable performance.",
        imageUrl: "",
        items: [
          "ESG strategy development and implementation",
          "Stakeholder engagement frameworks",
          "Compliance evaluation and gap analysis",
          "ESG reporting and disclosure",
          "Training and capacity building",
          "Supply chain due diligence",
          "Green finance advisory",
          "Climate risk and regulatory compliance",
        ].join("\n"),
        category: "main",
        order: 2,
      },
      {
        title: "Corporate & Commercial Law",
        slug: "corporate",
        badge: "Business Legal Solutions",
        description:
          "We advise businesses at every stage of their lifecycle — from incorporation and structuring through to complex M&A transactions and ongoing regulatory compliance. Our commercial lawyers understand both the legal and commercial dimensions of your decisions.",
        imageUrl: "",
        items: [
          "Corporate advisory and governance",
          "Mergers and acquisitions",
          "Commercial transaction structuring",
          "Regulatory compliance audits",
          "Joint ventures and partnerships",
          "Contract drafting and negotiation",
          "Business licensing and permits",
          "Corporate restructuring",
        ].join("\n"),
        category: "main",
        order: 3,
      },
      {
        title: "Conveyancing & Property Law",
        slug: "conveyancing",
        badge: "Real Estate & Land Matters",
        description:
          "Our property law team handles the full range of conveyancing and real estate transactions, from straightforward transfers to complex sectional title and lease matters. We provide clear, efficient advice to safeguard your property interests.",
        imageUrl: "",
        items: [
          "Title conversion and registration",
          "Sectional title processing",
          "Lease extension and variation",
          "Property transfers and purchases",
          "Security perfection (charges and mortgages)",
          "Land sub-division",
          "Caution and caveat lodging",
          "Stamp duty and land rates advisory",
        ].join("\n"),
        category: "main",
        order: 4,
      },
      // Other services
      {
        title: "Family Law",
        slug: "",
        badge: "",
        description: "Divorce, custody, maintenance, and matrimonial property.",
        imageUrl: "",
        items: "",
        category: "other",
        order: 1,
      },
      {
        title: "Probate & Estate Administration",
        slug: "",
        badge: "",
        description: "Wills, grants of probate, and administration of deceased estates.",
        imageUrl: "",
        items: "",
        category: "other",
        order: 2,
      },
      {
        title: "Employment Law",
        slug: "",
        badge: "",
        description:
          "Contracts, disciplinary matters, redundancy, and tribunal representation.",
        imageUrl: "",
        items: "",
        category: "other",
        order: 3,
      },
      {
        title: "Alternative Dispute Resolution",
        slug: "",
        badge: "",
        description: "Mediation, arbitration, and negotiated settlements.",
        imageUrl: "",
        items: "",
        category: "other",
        order: 4,
      },
      {
        title: "Equity & Trust Law",
        slug: "",
        badge: "",
        description: "Trust formation, trustee obligations, and beneficiary rights.",
        imageUrl: "",
        items: "",
        category: "other",
        order: 5,
      },
    ],
  });
  console.log("✓ Services seeded (4 main + 5 other)");

  // ── Sample blog post ──────────────────────────────────────────────────────────
  await prisma.blogPost.upsert({
    where: { slug: "kenya-blue-economy-maritime-law-outlook" },
    update: {},
    create: {
      title: "Kenya's Blue Economy: Maritime Law Outlook for 2026",
      slug: "kenya-blue-economy-maritime-law-outlook",
      excerpt:
        "Kenya's vast Indian Ocean coastline presents significant economic opportunity. Here is what businesses need to know about the evolving maritime legal landscape.",
      content: `Kenya's 600km Indian Ocean coastline is not merely a geographical feature — it is an economic frontier. The Blue Economy, defined by the United Nations as the sustainable use of ocean resources for economic growth, has moved from policy aspiration to operational priority for the Kenyan government.

In this article, we examine the key maritime legal developments businesses and investors should track in 2026.

**Regulatory Framework Updates**

The Kenya Maritime Authority (KMA) has continued to strengthen Kenya's compliance with international maritime conventions, including MARPOL, SOLAS, and the MLC 2006. Shipowners and operators calling at Kenyan ports should ensure their vessels meet the current standards to avoid port state control detentions.

**Vessel Registration**

Kenya's ship registry remains an attractive option for regional shipowners. The legal framework governing vessel registration has been modernised, offering competitive fees and a streamlined process for international vessel owners seeking a reputable flag state.

**Environmental Compliance**

Marine environmental law continues to evolve rapidly. The IMO's 2030 and 2050 decarbonisation targets are reshaping the global shipping industry. Kenyan operators are increasingly seeking legal advice on energy efficiency regulations, carbon intensity indicators, and alternative fuel strategies.

**Looking Ahead**

The convergence of maritime law, ESG obligations, and Blue Economy policy creates a complex but navigable legal environment. SW Law LLP's maritime practice is well-positioned to advise clients across the full spectrum of these intersecting areas.

For specific advice on how these developments may affect your business, contact our maritime team.`,
      author: "Faith Sulwe",
      published: true,
    },
  });
  console.log("✓ Sample blog post created");

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
