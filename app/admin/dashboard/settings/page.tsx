import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DEFAULTS } from "@/lib/siteSettings";
import { updateSettings } from "./actions";
import ImageUpload from "@/components/admin/ImageUpload";
import ColorField from "@/components/admin/ColorField";
import SubmitButton from "@/components/admin/SubmitButton";

const TABS = [
  { id: "branding", label: "Branding" },
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "partners", label: "Partners" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany();
  const result: Record<string, string> = { ...DEFAULTS };
  for (const row of rows) result[row.key] = row.value;
  return result;
}

/* ─── UI primitives ──────────────────────────────────────────── */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[200px_1fr] gap-8 py-7 border-b border-gray-100 last:border-0">
      <div className="pt-0.5">
        <h3 className="text-sm font-semibold text-navy">{title}</h3>
        {description && (
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  hint,
  textarea,
  rows,
  placeholder,
  half,
}: {
  label: string;
  name: string;
  value: string;
  hint?: string;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
  half?: boolean;
}) {
  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all placeholder:text-gray-300";

  return (
    <div className={half ? "flex-1" : undefined}>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-2 leading-relaxed">{hint}</p>}
      {textarea ? (
        <textarea
          name={name}
          defaultValue={value}
          rows={rows ?? 3}
          placeholder={placeholder}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          type="text"
          name={name}
          defaultValue={value}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-4">{children}</div>;
}

function RepeatItem({
  label,
  index,
  children,
}: {
  label: string;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-4 space-y-4">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
        {label} {index}
      </p>
      {children}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; saved?: string }>;
}) {
  const { tab = "home", saved } = await searchParams;
  const s = await getAllSettings();

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Site Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Edit text and images across the public site</p>
        </div>
        {saved === "1" && (
          <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Changes saved
          </span>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-0 border-b border-gray-200">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/admin/dashboard/settings?tab=${t.id}`}
            className={`px-4 py-2.5 text-sm font-medium rounded-t transition-colors ${
              tab === t.id
                ? "bg-white border border-b-white border-gray-200 text-navy -mb-px"
                : "text-gray-500 hover:text-navy hover:bg-white/50"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Card wrapping all sections */}
      <form action={updateSettings}>
        <input type="hidden" name="_tab" value={tab} />

        <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl px-8">

          {/* ─── BRANDING ─── */}
          {tab === "branding" && (
            <>
              <Section
                title="Logo"
                description="Shown in the navbar and anywhere the site mark appears. Recommended: PNG or SVG with a transparent background, max 400 × 120 px."
              >
                <ImageUpload
                  name="site.logoUrl"
                  category="branding"
                  defaultValue={s["site.logoUrl"]}
                  label="Logo image"
                />
                {s["site.logoUrl"] ? (
                  <p className="text-xs text-gray-400">
                    When a logo is uploaded it replaces the text &ldquo;SW Law LLP&rdquo; in the navbar. Remove the URL to revert to text.
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">
                    No logo uploaded — the navbar currently shows the firm name as text.
                  </p>
                )}
              </Section>

              <Section
                title="Favicon / App icon"
                description="The small icon shown in browser tabs and bookmarks. Recommended: square PNG or ICO, 32 × 32 px or 512 × 512 px for best results."
              >
                <ImageUpload
                  name="site.iconUrl"
                  category="branding"
                  defaultValue={s["site.iconUrl"]}
                  label="Icon image"
                />
                {s["site.iconUrl"] ? (
                  <p className="text-xs text-gray-400">
                    This icon is injected into the &lt;head&gt; on every page. Browser tab icons may take a few minutes to refresh.
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">
                    No custom icon uploaded — the default Next.js favicon is used.
                  </p>
                )}
              </Section>

              <Section
                title="Theme Colors"
                description="Colors used throughout the entire site — admin panel and public pages. Changes apply immediately on save."
              >
                <div className="grid grid-cols-2 gap-5">
                  <ColorField
                    name="theme.navy"
                    label="Primary Color"
                    description="Main backgrounds, headings, nav bar, buttons"
                    defaultValue={s["theme.navy"]}
                    originalDefault="#1B3A6B"
                  />
                  <ColorField
                    name="theme.navyDark"
                    label="Primary Dark"
                    description="Footer, hero overlays, active/hover states of primary"
                    defaultValue={s["theme.navyDark"]}
                    originalDefault="#0f2548"
                  />
                  <ColorField
                    name="theme.gold"
                    label="Accent Color"
                    description="Gold highlights, badges, underlines, CTA buttons"
                    defaultValue={s["theme.gold"]}
                    originalDefault="#C9A84C"
                  />
                  <ColorField
                    name="theme.goldDark"
                    label="Accent Dark"
                    description="Hover/active state of accent elements"
                    defaultValue={s["theme.goldDark"]}
                    originalDefault="#b8953e"
                  />
                  <ColorField
                    name="theme.lightGray"
                    label="Page Background"
                    description="Alternating section backgrounds, admin dashboard background"
                    defaultValue={s["theme.lightGray"]}
                    originalDefault="#F5F7FA"
                  />
                </div>
                <div className="mt-3 bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
                  ⚠ Changing the Primary or Accent colors affects both the admin panel and the live site.
                  Ensure sufficient contrast for accessibility.
                </div>
              </Section>
            </>
          )}

          {/* ─── HOME ─── */}
          {tab === "home" && (
            <>
              <Section title="Hero" description="Full-screen banner shown at the top of the homepage.">
                <Field label="Badge text" name="home.hero.badge" value={s["home.hero.badge"]} />
                <Field
                  label="Heading"
                  name="home.hero.title"
                  value={s["home.hero.title"]}
                  hint="Use a line break to split the heading — the second line renders in gold."
                  textarea rows={2}
                />
                <Field label="Subtitle" name="home.hero.subtitle" value={s["home.hero.subtitle"]} textarea />
                <ImageUpload name="home.hero.imageUrl" category="settings" defaultValue={s["home.hero.imageUrl"]} label="Background image" />
                <Row>
                  <Field label="Primary button" name="home.hero.cta1" value={s["home.hero.cta1"]} half />
                  <Field label="Secondary button" name="home.hero.cta2" value={s["home.hero.cta2"]} half />
                </Row>
              </Section>

              <Section title="Stats bar" description="Four figures shown immediately below the hero.">
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-lg border border-gray-100 bg-gray-50/70 p-3 space-y-3">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Stat {i}</p>
                      <Row>
                        <Field label="Value" name={`home.stat.${i}.value`} value={s[`home.stat.${i}.value`]} half />
                        <Field label="Label" name={`home.stat.${i}.label`} value={s[`home.stat.${i}.label`]} half />
                      </Row>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="About snippet" description="Two-column section introducing the firm.">
                <Field label="Heading" name="home.about.title" value={s["home.about.title"]} hint="Line break → second line shown below the first." textarea rows={2} />
                <Field label="Paragraph 1" name="home.about.text1" value={s["home.about.text1"]} textarea />
                <Field label="Paragraph 2" name="home.about.text2" value={s["home.about.text2"]} textarea />
                <ImageUpload name="home.about.imageUrl" category="settings" defaultValue={s["home.about.imageUrl"]} label="Side image" />
              </Section>

              <Section title="Call to action" description="Full-width banner at the bottom of the page.">
                <Field label="Heading" name="home.cta.title" value={s["home.cta.title"]} />
                <Field label="Subtext" name="home.cta.subtitle" value={s["home.cta.subtitle"]} textarea />
                <ImageUpload name="home.cta.imageUrl" category="settings" defaultValue={s["home.cta.imageUrl"]} label="Background image" />
              </Section>
            </>
          )}

          {/* ─── ABOUT ─── */}
          {tab === "about" && (
            <>
              <Section title="Hero" description="Banner shown at the top of /about.">
                <Field label="Title" name="about.hero.title" value={s["about.hero.title"]} />
                <Field label="Subtitle" name="about.hero.subtitle" value={s["about.hero.subtitle"]} textarea />
                <ImageUpload name="about.hero.imageUrl" category="settings" defaultValue={s["about.hero.imageUrl"]} label="Background image" />
              </Section>

              <Section title="Mission / Philosophy" description="Two-column text and image section.">
                <Field label="Section title" name="about.mission.title" value={s["about.mission.title"]} />
                <Field label="Paragraph 1" name="about.mission.text1" value={s["about.mission.text1"]} textarea />
                <Field label="Paragraph 2" name="about.mission.text2" value={s["about.mission.text2"]} textarea />
                <ImageUpload name="about.mission.imageUrl" category="settings" defaultValue={s["about.mission.imageUrl"]} label="Side image" />
              </Section>

              <Section title="Pull quote" description="Large italic blockquote displayed between sections.">
                <Field
                  label="Quote text"
                  name="about.quote"
                  value={s["about.quote"]}
                  hint="Do not include quotation marks — they are added automatically."
                  textarea rows={3}
                />
              </Section>

              <Section title="Blue Economy" description="Three image cards highlighting focus areas.">
                <Field label="Section title" name="about.blueEconomy.title" value={s["about.blueEconomy.title"]} />
                <Field label="Section subtitle" name="about.blueEconomy.subtitle" value={s["about.blueEconomy.subtitle"]} textarea />
                <div className="space-y-3 pt-1">
                  {[1, 2, 3].map((i) => (
                    <RepeatItem key={i} label="Item" index={i}>
                      <Field label="Heading" name={`about.blueEconomy.${i}.heading`} value={s[`about.blueEconomy.${i}.heading`]} />
                      <Field label="Body" name={`about.blueEconomy.${i}.body`} value={s[`about.blueEconomy.${i}.body`]} textarea rows={2} />
                      <ImageUpload name={`about.blueEconomy.${i}.imageUrl`} category="settings" defaultValue={s[`about.blueEconomy.${i}.imageUrl`]} label="Image" />
                    </RepeatItem>
                  ))}
                </div>
              </Section>

              <Section title="Our values" description="Four-column icon grid on the navy background.">
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <RepeatItem key={i} label="Value" index={i}>
                      <Row>
                        <Field label="Icon" name={`about.value.${i}.icon`} value={s[`about.value.${i}.icon`]} placeholder="⚖" half />
                        <Field label="Title" name={`about.value.${i}.title`} value={s[`about.value.${i}.title`]} half />
                      </Row>
                      <Field label="Description" name={`about.value.${i}.description`} value={s[`about.value.${i}.description`]} textarea rows={2} />
                    </RepeatItem>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* ─── SERVICES ─── */}
          {tab === "services" && (
            <>
              <Section title="Hero" description="Banner shown at the top of /services.">
                <Field label="Title" name="services.hero.title" value={s["services.hero.title"]} />
                <Field label="Subtitle" name="services.hero.subtitle" value={s["services.hero.subtitle"]} textarea />
                <ImageUpload name="services.hero.imageUrl" category="settings" defaultValue={s["services.hero.imageUrl"]} label="Background image" />
              </Section>
              <Section title="Service content">
                <div className="flex items-start gap-3 bg-gold/5 border border-gold/25 rounded-lg p-4">
                  <span className="text-gold text-lg leading-none mt-0.5">◈</span>
                  <div>
                    <p className="text-sm font-medium text-navy mb-1">Managed in a separate section</p>
                    <p className="text-sm text-gray-500 mb-3">Titles, descriptions, bullet items, and images for each practice area are edited under Services.</p>
                    <Link href="/admin/dashboard/services" className="text-sm font-semibold text-navy hover:text-gold transition-colors">
                      Go to Services →
                    </Link>
                  </div>
                </div>
              </Section>
            </>
          )}

          {/* ─── PARTNERS ─── */}
          {tab === "partners" && (
            <>
              <Section title="Hero" description="Banner shown at the top of /partners.">
                <Field label="Title" name="partners.hero.title" value={s["partners.hero.title"]} />
                <Field label="Subtitle" name="partners.hero.subtitle" value={s["partners.hero.subtitle"]} textarea />
                <ImageUpload name="partners.hero.imageUrl" category="settings" defaultValue={s["partners.hero.imageUrl"]} label="Background image" />
              </Section>
              <Section title="Partner profiles">
                <div className="flex items-start gap-3 bg-gold/5 border border-gold/25 rounded-lg p-4">
                  <span className="text-gold text-lg leading-none mt-0.5">◉</span>
                  <div>
                    <p className="text-sm font-medium text-navy mb-1">Managed in a separate section</p>
                    <p className="text-sm text-gray-500 mb-3">Bios, expertise, education, and photos for each partner are edited under Partners.</p>
                    <Link href="/admin/dashboard/partners" className="text-sm font-semibold text-navy hover:text-gold transition-colors">
                      Go to Partners →
                    </Link>
                  </div>
                </div>
              </Section>
            </>
          )}

          {/* ─── BLOG ─── */}
          {tab === "blog" && (
            <Section title="Hero" description="Banner shown at the top of /blog.">
              <Field label="Title" name="blog.hero.title" value={s["blog.hero.title"]} />
              <Field label="Subtitle" name="blog.hero.subtitle" value={s["blog.hero.subtitle"]} textarea />
              <ImageUpload name="blog.hero.imageUrl" category="settings" defaultValue={s["blog.hero.imageUrl"]} label="Background image" />
            </Section>
          )}

          {/* ─── CONTACT ─── */}
          {tab === "contact" && (
            <Section title="Contact details" description="Information displayed on the contact page.">
              <Field label="Email address" name="contact.email" value={s["contact.email"]} />
              <Field label="Office hours" name="contact.officeHours" value={s["contact.officeHours"]} hint="Use a line break to split across two lines." textarea rows={2} />
              <Field label="Tagline" name="contact.tagline" value={s["contact.tagline"]} hint="Large text shown on the right-hand image panel." />
              <ImageUpload name="contact.imageUrl" category="settings" defaultValue={s["contact.imageUrl"]} label="Right panel image" />
            </Section>
          )}

        </div>

        {/* Save bar */}
        <div className="mt-6 flex items-center gap-4">
          <SubmitButton />
          {saved === "1" && (
            <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Saved
            </span>
          )}
          <p className="text-xs text-gray-400 ml-auto">Changes apply to the live site immediately.</p>
        </div>
      </form>
    </div>
  );
}
