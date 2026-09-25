import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Loader2, Database, Layers, Users, MonitorPlay, CalendarClock, Award } from "lucide-react";
import { toast } from "sonner";
import axios, { API } from "@/lib/api";
import { Reveal, Eyebrow, MaskedLine } from "@/components/Reveal";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-obsidian/70 px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-champagne/60 focus:ring-1 focus:ring-champagne/30 transition-colors duration-300";
const labelCls = "block font-mono text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2";

const PROGRAMS = {
  "big-data-engineering": {
    icon: Database,
    title: "Big Data Engineering",
    tag: "Cohort Program",
    interest: "Big Data Engineering Program",
    intro:
      "A practitioner-led program covering the full data engineering discipline — from pipelines and warehousing to large-scale processing — taught by the engineers who build and run these systems in production.",
    whoFor: [
      "Engineers and graduates moving into data engineering roles",
      "Analysts who want real engineering depth, not just dashboards",
      "Technical founders who want to understand their own data stack",
    ],
    curriculum: [
      { title: "Foundations of Data Engineering", topics: "The data lifecycle, OLTP vs OLAP, SQL in depth, how production data teams actually work" },
      { title: "Pipelines & ETL", topics: "Batch ingestion, transformation design, orchestration and scheduling, data quality checks" },
      { title: "Warehousing & Modelling", topics: "Dimensional modelling, star schemas, partitioning, performance fundamentals" },
      { title: "Big Data Processing", topics: "Distributed systems thinking, Spark fundamentals, working with large datasets efficiently" },
      { title: "Capstone: Production Pipeline", topics: "An end-to-end pipeline built on real production patterns, reviewed by Epoh Tech engineers" },
    ],
    facts: [
      { icon: MonitorPlay, label: "Format", value: "Live, instructor-led sessions" },
      { icon: Users, label: "Taught by", value: "Working Epoh Tech engineers" },
      { icon: CalendarClock, label: "Cohort dates", value: "Announced to registered participants" },
      { icon: Award, label: "Outcome", value: "Portfolio-grade capstone project" },
    ],
  },
  "oracle-fusion-oic": {
    icon: Layers,
    title: "Oracle Fusion with OIC",
    tag: "Cohort Program",
    interest: "Oracle Fusion with OIC Program",
    intro:
      "Hands-on Oracle Fusion and Oracle Integration Cloud training led by certified Oracle professionals — from technical foundations to delivering end-to-end integration solutions for enterprise environments.",
    whoFor: [
      "ERP technical consultants working in Oracle ecosystems",
      "Integration developers moving to Oracle Integration Cloud",
      "IT professionals supporting Oracle Fusion environments",
    ],
    curriculum: [
      { title: "Oracle Fusion Technical Foundations", topics: "Architecture, ESS jobs, BIP reporting and the Fusion data model" },
      { title: "Integration Patterns with OIC", topics: "Connections, adapters, orchestration and integration design principles" },
      { title: "Building Integrations", topics: "REST and SOAP integrations, file-based flows, lookups and mappings" },
      { title: "Enterprise Scenarios", topics: "End-to-end business flows, error handling, monitoring and support" },
      { title: "Capstone: Guided Solution Build", topics: "A complete integration solution built and reviewed by certified Oracle professionals" },
    ],
    facts: [
      { icon: MonitorPlay, label: "Format", value: "Live, instructor-led sessions" },
      { icon: Users, label: "Taught by", value: "Certified Oracle professionals" },
      { icon: CalendarClock, label: "Cohort dates", value: "Announced to registered participants" },
      { icon: Award, label: "Outcome", value: "End-to-end integration project" },
    ],
  },
};

export default function EpohProgramDetailPage() {
  const { slug } = useParams();
  const program = PROGRAMS[slug];
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "" });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  if (!program) return <Navigate to="/epohtech/programs" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/epoh/enquiry`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        interest: program.interest,
        message: `Program registration — ${program.title}.${form.note ? ` Note: ${form.note}` : ""}`,
        consent,
      });
      setDone(true);
      toast.success("Registration received — we'll be in touch.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Link
            to="/epohtech/programs"
            data-testid="epoh-program-back-link"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-gray-500 hover:text-champagne transition-colors duration-300"
          >
            <ArrowLeft size={13} /> All Programs
          </Link>
        </Reveal>

        <Reveal className="mt-8 max-w-3xl">
          <Eyebrow>{program.tag}</Eyebrow>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.02]">
            <MaskedLine delay={0.15}><span>{program.title}</span></MaskedLine>
          </h1>
          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">{program.intro}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-5" data-testid="epoh-program-facts">
          {program.facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-white/5 bg-charcoal/50 p-6">
                <f.icon size={18} strokeWidth={1.75} className="text-champagne" />
                <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.25em] text-gray-500">{f.label}</p>
                <p className="mt-1.5 text-sm text-gray-200 leading-snug">{f.value}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>Curriculum</Eyebrow>
              <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.05]">
                What you will <span className="text-champagne">learn.</span>
              </h2>
            </Reveal>
            <div className="mt-10 space-y-4">
              {program.curriculum.map((m, i) => (
                <Reveal key={m.title} delay={i * 0.06}>
                  <div
                    data-testid={`epoh-program-module-${i + 1}`}
                    className="rounded-2xl border border-white/5 bg-charcoal/50 p-6 sm:p-7 hover:border-champagne/25 transition-colors duration-500 flex gap-5"
                  >
                    <span className="font-mono font-bold text-2xl text-champagne/60 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">{m.title}</h3>
                      <p className="mt-1.5 text-[13px] text-gray-500 leading-relaxed">{m.topics}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-12">
              <Eyebrow>Who It's For</Eyebrow>
              <ul className="mt-6 space-y-3" data-testid="epoh-program-who-for">
                {program.whoFor.map((w) => (
                  <li key={w} className="flex items-start gap-3 text-sm text-gray-400">
                    <CheckCircle2 size={16} className="text-champagne shrink-0 mt-0.5" /> {w}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.1} className="lg:sticky lg:top-28">
              {done ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-3xl border border-champagne/25 bg-charcoal/70 p-10 text-center"
                  data-testid="epoh-program-register-success"
                >
                  <CheckCircle2 size={44} className="text-champagne mx-auto" />
                  <h2 className="mt-6 text-2xl font-extrabold text-white tracking-tight">Registration received.</h2>
                  <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                    Thank you for registering for the {program.title} program. Cohort dates and next
                    steps will be shared with you directly.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={submit}
                  data-testid="epoh-program-register-form"
                  className="rounded-3xl border border-champagne/20 bg-charcoal/60 p-8 sm:p-9 space-y-5"
                >
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-champagne">Register Interest</p>
                    <h2 className="mt-3 text-xl font-extrabold text-white tracking-tight">{program.title}</h2>
                  </div>
                  <div>
                    <label htmlFor="epoh-prog-name" className={labelCls}>Full Name *</label>
                    <input id="epoh-prog-name" name="name" required value={form.name} onChange={onChange} placeholder="Your name" data-testid="epoh-program-name-input" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="epoh-prog-email" className={labelCls}>Email Address *</label>
                    <input id="epoh-prog-email" type="email" name="email" required value={form.email} onChange={onChange} placeholder="you@example.com" data-testid="epoh-program-email-input" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="epoh-prog-phone" className={labelCls}>Phone Number *</label>
                    <input id="epoh-prog-phone" name="phone" required value={form.phone} onChange={onChange} placeholder="+91" data-testid="epoh-program-phone-input" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="epoh-prog-note" className={labelCls}>Anything we should know?</label>
                    <textarea id="epoh-prog-note" name="note" rows={3} value={form.note} onChange={onChange} placeholder="Background, goals, questions…" data-testid="epoh-program-note-input" className={`${inputCls} resize-none`} />
                  </div>
                  <label className="flex items-start gap-2.5 text-[11px] text-gray-500 leading-relaxed cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      data-testid="epoh-program-consent-checkbox"
                      className="mt-0.5 h-3.5 w-3.5 accent-[#E6C280]"
                    />
                    <span>
                      I consent to EpohTech Solutions Pvt Ltd processing my details to contact me
                      about this program.
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={loading || !consent}
                    data-testid="epoh-program-register-submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-champagne text-obsidian font-bold tracking-wide px-8 py-4 text-sm hover:bg-champagneBright transition-colors duration-300 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <>REGISTER INTEREST <ArrowUpRight size={15} /></>}
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
