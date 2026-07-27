import { type Dispatch, type FormEvent, type SetStateAction, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  Archive,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarClock,
  Camera,
  Check,
  Dog,
  Download,
  ExternalLink,
  FileText,
  GalleryHorizontal,
  Home,
  Inbox,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Newspaper,
  PawPrint,
  PenLine,
  Phone,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  type AdminSettings,
  type Inquiry,
  breedPanels,
  contact,
  defaultSettings,
  image,
  media,
  puppyHighlights,
  puppyImages,
  registryDogs,
  seedInquiries,
  spotlights,
} from "./data";

type Page = "home" | "puppies" | "dogs" | "breed" | "reviews" | "blog" | "contact" | "admin";
type DogFilter = "current" | "previous" | "all";
type AdminTab = "overview" | "content" | "inquiries" | "blog" | "reviews" | "media";

type MediaItem = {
  name: string;
  path: string;
  category: string;
  type: "image" | "pdf" | "file";
};

type BlogPost = {
  id: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  body: string;
  image: string;
  published: boolean;
};

type Review = {
  id: number;
  name: string;
  location: string;
  quote: string;
  dog: string;
  rating: number;
  published: boolean;
};

type InquiryFormState = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  timeframe: string;
  experience: string;
  message: string;
};

const facebookUrl = "https://www.facebook.com/matahauri.basenjis.2025/";

const navItems: Array<{ id: Page; label: string; icon: typeof Home }> = [
  { id: "home", label: "Home", icon: Home },
  { id: "puppies", label: "Puppies", icon: PawPrint },
  { id: "dogs", label: "Dogs", icon: Dog },
  { id: "breed", label: "Breed", icon: BookOpen },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "blog", label: "Blog", icon: Newspaper },
  { id: "contact", label: "Contact", icon: Mail },
];

const adminTabs: Array<{ id: AdminTab; label: string; icon: typeof Settings }> = [
  { id: "overview", label: "Overview", icon: Settings },
  { id: "content", label: "Content", icon: PenLine },
  { id: "inquiries", label: "Inquiries", icon: Inbox },
  { id: "blog", label: "Blog", icon: Newspaper },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "media", label: "Media", icon: GalleryHorizontal },
];

const seedBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Late November 2026 puppy plans",
    date: "2026-07-27",
    category: "Puppies",
    excerpt: "A short update for families asking about the next expected litter and waitlist timing.",
    body: "Puppies are expected late November 2026. Families should review the waitlist information, learn about Basenji temperament, and reach out with their household details before joining the list.",
    image: image("basenji-puppies-for-sale/Mata-Hauri-puppies2024.jpg"),
    published: true,
  },
  {
    id: 2,
    title: "A note for first-time Basenji families",
    date: "2026-06-12",
    category: "Breed notes",
    excerpt: "Basenjis are wonderful, but they are not generic easy dogs. A little honesty helps everyone.",
    body: "Basenjis are affectionate, bright, independent, and busy. A good home is ready for structure, leashes, safe fencing, socialization, and a sense of humor.",
    image: image("about-the-basenji.jpg"),
    published: true,
  },
  {
    id: 3,
    title: "Oso, Klassy, Marlon, and the family behind the ribbons",
    date: "2026-05-04",
    category: "Show news",
    excerpt: "The champion pages work best when they feel connected to the kennel story.",
    body: "The Mata Hauri archive has decades of show dogs, companions, breeding stock, and family history. The new site keeps that lineage easy to browse without making families dig through old pages.",
    image: image("oso/Oso-2022-BIS.jpg"),
    published: true,
  },
];

const seedReviews: Review[] = [
  {
    id: 1,
    name: "E. L.",
    location: "New Hampshire",
    quote: "Debbie was honest about the breed from the beginning. That made bringing home our Basenji feel thoughtful instead of rushed.",
    dog: "Mata Hauri companion puppy",
    rating: 5,
    published: true,
  },
  {
    id: 2,
    name: "C. A.",
    location: "Massachusetts",
    quote: "We wanted a breeder who cared about temperament as much as show quality. Mata Hauri gave us both.",
    dog: "Mata Hauri adult placement",
    rating: 5,
    published: true,
  },
  {
    id: 3,
    name: "J. M.",
    location: "Vermont",
    quote: "The best part was the support after pickup. We could ask real questions and get real answers.",
    dog: "Basenji family",
    rating: 5,
    published: true,
  },
];

const blankInquiry: InquiryFormState = {
  name: "",
  email: "",
  phone: "",
  interest: "Puppy waitlist",
  timeframe: "Late 2026",
  experience: "",
  message: "",
};

function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const saved = window.localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

function Header({
  page,
  setPage,
}: {
  page: Page;
  setPage: (page: Page) => void;
}) {
  const [open, setOpen] = useState(false);

  const go = (nextPage: Page) => {
    setOpen(false);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nav = (
    <nav className="nav" aria-label="Main navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            className={clsx("nav-button", page === item.id && "active")}
            onClick={() => go(item.id)}
          >
            <Icon size={16} aria-hidden="true" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <header className="site-header">
      <button className="brand-lockup" type="button" onClick={() => go("home")}>
        <span className="brand-mark">
          <Dog size={22} aria-hidden="true" />
        </span>
        <span>
          <strong>Mata Hauri</strong>
          <small>Basenjis</small>
        </span>
      </button>
      <div className="desktop-nav">{nav}</div>
      <div className="header-actions">
        <button
          type="button"
          className={clsx("mode-button", page === "admin" && "active")}
          onClick={() => go(page === "admin" ? "home" : "admin")}
        >
          <Settings size={16} aria-hidden="true" />
          Admin
        </button>
        <button
          type="button"
          className="icon-button mobile-menu"
          aria-label="Open navigation"
          title="Open navigation"
          onClick={() => setOpen(true)}
        >
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="mobile-panel-inner"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <button
                type="button"
                className="icon-button close-button"
                aria-label="Close navigation"
                title="Close navigation"
                onClick={() => setOpen(false)}
              >
                <X size={20} aria-hidden="true" />
              </button>
              {nav}
              <button type="button" className="mode-button mobile-admin" onClick={() => go("admin")}>
                <Settings size={16} aria-hidden="true" />
                Admin
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function PageShell({
  children,
  eyebrow,
  title,
  intro,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <motion.main
      className="page-shell"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28 }}
    >
      <section className="page-heading">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </section>
      {children}
    </motion.main>
  );
}

function HomePage({
  settings,
  setPage,
  blogPosts,
  reviews,
}: {
  settings: AdminSettings;
  setPage: (page: Page) => void;
  blogPosts: BlogPost[];
  reviews: Review[];
}) {
  const latestPosts = blogPosts.filter((post) => post.published).slice(0, 2);
  const featuredReviews = reviews.filter((review) => review.published).slice(0, 2);

  return (
    <motion.main className="home-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="home-hero">
        <div className="home-photo">
          <img
            src={image("basenji-puppies-for-sale/Mata-Hauri-puppies2024.jpg")}
            alt="Debbie and Julia with Mata Hauri Basenji puppies"
          />
        </div>
        <div className="home-copy">
          <span className="eyebrow">{settings.heroStatus}</span>
          <h1>Basenjis raised with history, health, and a real home behind them.</h1>
          <p>
            Mata Hauri is Debbie Hauri's long-running New Hampshire Basenji program.
            The site should feel like calling a thoughtful breeder, not opening a tech demo.
          </p>
          <div className="home-actions">
            <button type="button" className="primary-action" onClick={() => setPage("puppies")}>
              <PawPrint size={18} aria-hidden="true" />
              Puppy information
            </button>
            <button type="button" className="secondary-action" onClick={() => setPage("contact")}>
              <Mail size={18} aria-hidden="true" />
              Contact Debbie
            </button>
          </div>
          <div className="home-facts">
            <div>
              <span>Since</span>
              <strong>1969</strong>
            </div>
            <div>
              <span>Registry</span>
              <strong>{registryDogs.length} dogs</strong>
            </div>
            <div>
              <span>Next litter</span>
              <strong>{settings.litterDue}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="home-panels">
        <article className="status-card">
          <CalendarClock size={22} aria-hidden="true" />
          <div>
            <span>Current puppy note</span>
            <h2>{settings.puppyAnnouncement}</h2>
            <p>{settings.shippingPolicy}</p>
          </div>
        </article>
        <SocialCard />
      </section>

      <section className="home-preview-grid">
        <div className="preview-card">
          <div className="preview-header">
            <span className="eyebrow">Reviews</span>
            <button type="button" className="text-button" onClick={() => setPage("reviews")}>
              All reviews
            </button>
          </div>
          {featuredReviews.map((review) => (
            <blockquote key={review.id}>
              <div className="stars" aria-label={`${review.rating} star review`}>
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star key={`${review.id}-${index}`} size={15} aria-hidden="true" />
                ))}
              </div>
              <p>{review.quote}</p>
              <footer>{review.name}, {review.location}</footer>
            </blockquote>
          ))}
        </div>
        <div className="preview-card">
          <div className="preview-header">
            <span className="eyebrow">Latest notes</span>
            <button type="button" className="text-button" onClick={() => setPage("blog")}>
              Blog
            </button>
          </div>
          {latestPosts.map((post) => (
            <article className="mini-post" key={post.id}>
              <img src={post.image} alt="" />
              <div>
                <span>{post.date}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </motion.main>
  );
}

function SocialCard() {
  return (
    <article className="facebook-card">
      <div className="facebook-topline">
        <MessageCircle size={22} aria-hidden="true" />
        <span>Facebook</span>
      </div>
      <h2>Matahauri Basenjis</h2>
      <p>
        Show wins, puppy updates, candid photos, and kennel news can live here as
        a real social preview with a direct link to her public page.
      </p>
      <div className="facebook-post">
        <span>Recent public page activity</span>
        <strong>Weekend show updates, Pickles, Didget, and Mata Hauri family news.</strong>
      </div>
      <a className="secondary-action" href={facebookUrl} target="_blank" rel="noreferrer">
        <ExternalLink size={17} aria-hidden="true" />
        Open Facebook
      </a>
    </article>
  );
}

function PuppyPage({
  settings,
  setInquiries,
}: {
  settings: AdminSettings;
  setInquiries: Dispatch<SetStateAction<Inquiry[]>>;
}) {
  return (
    <PageShell
      eyebrow="Available puppies"
      title={settings.puppyAnnouncement}
      intro="A clearer page for waitlist timing, health testing, pickup policy, and the puppy inquiry form."
    >
      <div className="two-column-page">
        <section className="info-card">
          <h2>What families should know</h2>
          <div className="notice-row">
            <CalendarClock size={22} aria-hidden="true" />
            <div>
              <span>Expected litter</span>
              <strong>{settings.litterDue}</strong>
            </div>
          </div>
          <div className="notice-row">
            <ShieldCheck size={22} aria-hidden="true" />
            <div>
              <span>Program promise</span>
              <strong>Health tested, temperament-first breeding stock</strong>
            </div>
          </div>
          <div className="notice-row">
            <MapPin size={22} aria-hidden="true" />
            <div>
              <span>Pickup policy</span>
              <strong>{settings.shippingPolicy}</strong>
            </div>
          </div>
          <a className="primary-action" href={media("basenji-waitlist.pdf")} target="_blank" rel="noreferrer">
            <Download size={18} aria-hidden="true" />
            Waitlist information
          </a>
        </section>

        <InquiryForm title="Puppy inquiry form" setInquiries={setInquiries} defaultInterest="Puppy waitlist" />
      </div>

      <section className="health-grid">
        {puppyHighlights.map((item) => (
          <div className="health-item" key={item}>
            <Check size={16} aria-hidden="true" />
            <span>{item}</span>
          </div>
        ))}
      </section>

      <section className="warm-gallery">
        {puppyImages.map((src, index) => (
          <img key={src} src={src} alt={`Mata Hauri Basenji puppy ${index + 1}`} />
        ))}
      </section>
    </PageShell>
  );
}

function DogsPage() {
  return (
    <PageShell
      eyebrow="Our Basenjis"
      title="Champion stories and the Mata Hauri registry."
      intro="The legacy site had individual dog pages and a long archive. This keeps both, but makes them easier to browse."
    >
      <SpotlightShowcase />
      <DogRegistry />
    </PageShell>
  );
}

function SpotlightShowcase() {
  const [active, setActive] = useState(spotlights[0]);

  return (
    <section className="spotlight-card">
      <div className="spotlight-tabs" role="tablist" aria-label="Featured Basenjis">
        {spotlights.map((spotlight) => (
          <button
            key={spotlight.id}
            type="button"
            role="tab"
            aria-selected={active.id === spotlight.id}
            className={clsx("spotlight-tab", active.id === spotlight.id && "active")}
            onClick={() => setActive(spotlight)}
          >
            <Star size={16} aria-hidden="true" />
            {spotlight.name}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          className="spotlight-layout"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <div className="spotlight-copy">
            <span className="eyebrow">{active.name}</span>
            <h2>{active.title}</h2>
            <p>{active.subtitle}</p>
            <div className="meta-stack">
              {active.meta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="win-grid">
              {active.wins.map((win) => (
                <div className="win-item" key={win}>
                  <BadgeCheck size={17} aria-hidden="true" />
                  {win}
                </div>
              ))}
            </div>
          </div>
          <div className="spotlight-media">
            <img className="spotlight-main" src={active.images[0]} alt={`${active.name} feature`} />
            <div className="spotlight-thumbs">
              {active.images.slice(1).map((src, index) => (
                <img key={src} src={src} alt={`${active.name} gallery ${index + 1}`} />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function DogRegistry() {
  const [filter, setFilter] = useState<DogFilter>("current");
  const [query, setQuery] = useState("");

  const filteredDogs = useMemo(() => {
    const search = query.trim().toLowerCase();
    return registryDogs.filter((dogItem) => {
      const matchesFilter = filter === "all" || dogItem.status === filter;
      const matchesSearch =
        !search ||
        `${dogItem.name} ${dogItem.callName} ${dogItem.year} ${dogItem.pedigree} ${dogItem.notes ?? ""}`
          .toLowerCase()
          .includes(search);
      return matchesFilter && matchesSearch;
    });
  }, [filter, query]);

  return (
    <section className="registry-panel">
      <div className="registry-toolbar">
        <div>
          <span className="eyebrow">Dog archive</span>
          <h2>Current and previous champions</h2>
        </div>
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search names, years, pedigree"
          />
        </label>
      </div>
      <div className="segmented-control" aria-label="Filter dog registry">
        {(["current", "previous", "all"] as DogFilter[]).map((value) => (
          <button
            key={value}
            type="button"
            className={clsx(filter === value && "active")}
            onClick={() => setFilter(value)}
          >
            {value === "all" ? "All dogs" : value}
          </button>
        ))}
      </div>
      <div className="dog-grid">
        {filteredDogs.map((dogItem) => (
          <article className="dog-card" key={dogItem.id}>
            <img src={dogItem.image} alt={dogItem.alt} />
            <div>
              <span>{dogItem.year}</span>
              <h3>{dogItem.callName}</h3>
              <p>{dogItem.name}</p>
              <small>{dogItem.pedigree}</small>
              {dogItem.notes && <em>{dogItem.notes}</em>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BreedPage() {
  const [active, setActive] = useState(breedPanels[0].id);

  return (
    <PageShell
      eyebrow="About Basenjis"
      title="A beautiful breed, with honest fine print."
      intro="The goal is to help families self-select before they fall in love with a face."
    >
      <div className="breed-page-layout">
        <aside className="breed-photo-stack">
          <img src={image("about-the-basenji.jpg")} alt="Mata Hauri Basenji profile" />
          <img src={image("about-basenji-2.jpg")} alt="Basenji relaxing indoors" />
        </aside>
        <section className="breed-notes">
          {breedPanels.map((panel) => {
            const isOpen = active === panel.id;
            return (
              <article className={clsx("accordion-item", isOpen && "open")} key={panel.id}>
                <button type="button" onClick={() => setActive(isOpen ? "" : panel.id)}>
                  <span>
                    <strong>{panel.title}</strong>
                    <small>{panel.kicker}</small>
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="accordion-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div className="truth-grid">
                        {panel.points.map(([head, copy]) => (
                          <div className="truth-item" key={head}>
                            <span>{head}</span>
                            <p>{copy}</p>
                          </div>
                        ))}
                      </div>
                      {panel.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </section>
      </div>
    </PageShell>
  );
}

function ReviewsPage({ reviews }: { reviews: Review[] }) {
  const liveReviews = reviews.filter((review) => review.published);

  return (
    <PageShell
      eyebrow="Reviews"
      title="Notes from Basenji families."
      intro="A dedicated review page adds trust without making the homepage feel salesy."
    >
      <section className="review-grid">
        {liveReviews.map((review) => (
          <article className="review-card" key={review.id}>
            <div className="stars" aria-label={`${review.rating} star review`}>
              {Array.from({ length: review.rating }).map((_, index) => (
                <Star key={`${review.id}-${index}`} size={16} aria-hidden="true" />
              ))}
            </div>
            <p>{review.quote}</p>
            <footer>
              <strong>{review.name}</strong>
              <span>{review.location} · {review.dog}</span>
            </footer>
          </article>
        ))}
      </section>
    </PageShell>
  );
}

function BlogPage({ posts }: { posts: BlogPost[] }) {
  const livePosts = posts.filter((post) => post.published);

  return (
    <PageShell
      eyebrow="Blog"
      title="Latest kennel notes."
      intro="Debbie can use the admin panel to add litter updates, show news, breed education, and quick announcements."
    >
      <div className="blog-layout">
        <section className="blog-list">
          {livePosts.map((post) => (
            <article className="blog-card" key={post.id}>
              <img src={post.image} alt="" />
              <div>
                <span>{post.category} · {post.date}</span>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <small>{post.body}</small>
              </div>
            </article>
          ))}
        </section>
        <aside className="blog-sidebar">
          <SocialCard />
        </aside>
      </div>
    </PageShell>
  );
}

function ContactPage({
  settings,
  setInquiries,
}: {
  settings: AdminSettings;
  setInquiries: Dispatch<SetStateAction<Inquiry[]>>;
}) {
  return (
    <PageShell
      eyebrow="Contact"
      title="Tell Debbie what kind of home you have in mind."
      intro="Keep the original phone, email, and address, but add a form so she has better context before replying."
    >
      <div className="two-column-page">
        <section className="contact-card">
          <img src={image("debbie-hauri.jpg")} alt="Debbie Hauri of Mata Hauri Basenjis" />
          <div className="contact-lines">
            <a href={`tel:${contact.phone.replace(/\./g, "")}`}>
              <Phone size={18} aria-hidden="true" />
              {settings.contactPhone}
            </a>
            <a href={`mailto:${settings.contactEmail}`}>
              <Mail size={18} aria-hidden="true" />
              {settings.contactEmail}
            </a>
            <span>
              <MapPin size={18} aria-hidden="true" />
              {contact.address.join(", ")}
            </span>
          </div>
          <div className="contact-note">
            <Users size={18} aria-hidden="true" />
            <p>{settings.adultAvailability}</p>
          </div>
        </section>
        <InquiryForm title="Contact form" setInquiries={setInquiries} defaultInterest="General question" />
      </div>
    </PageShell>
  );
}

function InquiryForm({
  title,
  setInquiries,
  defaultInterest,
}: {
  title: string;
  setInquiries: Dispatch<SetStateAction<Inquiry[]>>;
  defaultInterest: string;
}) {
  const [form, setForm] = useState<InquiryFormState>({ ...blankInquiry, interest: defaultInterest });
  const [sent, setSent] = useState(false);

  const update = (field: keyof InquiryFormState, value: string) => {
    setSent(false);
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setInquiries((current) => [
      {
        id: Date.now(),
        name: form.name.trim(),
        interest: form.interest,
        stage: "New",
        score: form.experience.toLowerCase().includes("basenji") ? 88 : 72,
        notes: `${form.email} · ${form.phone || "No phone"} · ${form.timeframe}. ${form.message || form.experience}`,
      },
      ...current,
    ]);
    setForm({ ...blankInquiry, interest: defaultInterest });
    setSent(true);
  };

  return (
    <form className="form-card" onSubmit={submit}>
      <h2>{title}</h2>
      <div className="field-pair">
        <label>
          Name
          <input value={form.name} onChange={(event) => update("name", event.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} required />
        </label>
      </div>
      <div className="field-pair">
        <label>
          Phone
          <input value={form.phone} onChange={(event) => update("phone", event.target.value)} />
        </label>
        <label>
          Interest
          <select value={form.interest} onChange={(event) => update("interest", event.target.value)}>
            <option>Puppy waitlist</option>
            <option>Adult Basenji</option>
            <option>Show prospect</option>
            <option>General question</option>
          </select>
        </label>
      </div>
      <label>
        Timeframe
        <input value={form.timeframe} onChange={(event) => update("timeframe", event.target.value)} />
      </label>
      <label>
        Basenji or dog experience
        <textarea value={form.experience} onChange={(event) => update("experience", event.target.value)} />
      </label>
      <label>
        Message
        <textarea value={form.message} onChange={(event) => update("message", event.target.value)} />
      </label>
      <button className="primary-action" type="submit">
        <Send size={18} aria-hidden="true" />
        Send inquiry
      </button>
      {sent && <p className="form-success">Saved to the admin inquiry pipeline.</p>}
    </form>
  );
}

function AdminCockpit({
  settings,
  setSettings,
  inquiries,
  setInquiries,
  blogPosts,
  setBlogPosts,
  reviews,
  setReviews,
}: {
  settings: AdminSettings;
  setSettings: Dispatch<SetStateAction<AdminSettings>>;
  inquiries: Inquiry[];
  setInquiries: Dispatch<SetStateAction<Inquiry[]>>;
  blogPosts: BlogPost[];
  setBlogPosts: Dispatch<SetStateAction<BlogPost[]>>;
  reviews: Review[];
  setReviews: Dispatch<SetStateAction<Review[]>>;
}) {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [mediaFilter, setMediaFilter] = useState("all");
  const [postDraft, setPostDraft] = useState({
    title: "",
    category: "Puppies",
    excerpt: "",
    body: "",
    image: image("basenji-puppies-for-sale/Mata-Hauri-puppies2024.jpg"),
  });
  const [reviewDraft, setReviewDraft] = useState({ name: "", location: "", dog: "", quote: "" });

  useEffect(() => {
    fetch(media("manifest.json"))
      .then((response) => response.json())
      .then((items: MediaItem[]) => setMediaItems(items))
      .catch(() => setMediaItems([]));
  }, []);

  const filteredMedia = useMemo(() => {
    return mediaItems.filter((item) => mediaFilter === "all" || item.category === mediaFilter);
  }, [mediaFilter, mediaItems]);

  const mediaCategories = useMemo(() => {
    return ["all", ...Array.from(new Set(mediaItems.map((item) => item.category)))];
  }, [mediaItems]);

  const addBlogPost = () => {
    if (!postDraft.title.trim() || !postDraft.excerpt.trim()) return;
    setBlogPosts((current) => [
      {
        id: Date.now(),
        title: postDraft.title.trim(),
        category: postDraft.category,
        excerpt: postDraft.excerpt.trim(),
        body: postDraft.body.trim() || postDraft.excerpt.trim(),
        image: postDraft.image,
        date: new Date().toISOString().slice(0, 10),
        published: true,
      },
      ...current,
    ]);
    setPostDraft({
      title: "",
      category: "Puppies",
      excerpt: "",
      body: "",
      image: image("basenji-puppies-for-sale/Mata-Hauri-puppies2024.jpg"),
    });
  };

  const addReview = () => {
    if (!reviewDraft.name.trim() || !reviewDraft.quote.trim()) return;
    setReviews((current) => [
      {
        id: Date.now(),
        name: reviewDraft.name.trim(),
        location: reviewDraft.location.trim() || "Basenji family",
        dog: reviewDraft.dog.trim() || "Mata Hauri Basenji",
        quote: reviewDraft.quote.trim(),
        rating: 5,
        published: true,
      },
      ...current,
    ]);
    setReviewDraft({ name: "", location: "", dog: "", quote: "" });
  };

  return (
    <main className="admin-shell">
      <section className="admin-hero">
        <div>
          <span className="eyebrow">Admin</span>
          <h1>Website controls that feel useful.</h1>
          <p>Update puppies, field inquiries, write blog notes, publish reviews, and browse the scraped media.</p>
        </div>
      </section>
      <div className="admin-layout">
        <aside className="admin-tabs">
          {adminTabs.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={clsx(tab === item.id && "active")}
                onClick={() => setTab(item.id)}
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </aside>

        <section className="admin-workspace">
          {tab === "overview" && (
            <div className="admin-grid">
              <Metric icon={PawPrint} label="Dogs in registry" value={registryDogs.length.toString()} />
              <Metric icon={Inbox} label="Inquiries" value={inquiries.length.toString()} />
              <Metric icon={Newspaper} label="Blog posts" value={blogPosts.length.toString()} />
              <Metric icon={Camera} label="Media assets" value={mediaItems.length.toString()} />
              <div className="admin-card span-two">
                <h2>Current public notes</h2>
                <div className="queue-list">
                  <div className="queue-row">
                    <span className={clsx("status-dot", settings.publishPuppies && "live")} />
                    <strong>Puppies</strong>
                    <small>{settings.puppyAnnouncement}</small>
                  </div>
                  <div className="queue-row">
                    <span className={clsx("status-dot", settings.publishAdults && "live")} />
                    <strong>Adults</strong>
                    <small>{settings.adultAvailability}</small>
                  </div>
                  <div className="queue-row">
                    <span className="status-dot live" />
                    <strong>Facebook</strong>
                    <small>{facebookUrl}</small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "content" && (
            <div className="admin-card editor-card">
              <h2>Homepage and availability copy</h2>
              <label>
                Hero status
                <input
                  value={settings.heroStatus}
                  onChange={(event) => setSettings((current) => ({ ...current, heroStatus: event.target.value }))}
                />
              </label>
              <label>
                Puppy announcement
                <textarea
                  value={settings.puppyAnnouncement}
                  onChange={(event) => setSettings((current) => ({ ...current, puppyAnnouncement: event.target.value }))}
                />
              </label>
              <div className="field-pair">
                <label>
                  Litter timing
                  <input
                    value={settings.litterDue}
                    onChange={(event) => setSettings((current) => ({ ...current, litterDue: event.target.value }))}
                  />
                </label>
                <label>
                  Price range
                  <input
                    value={settings.priceRange}
                    onChange={(event) => setSettings((current) => ({ ...current, priceRange: event.target.value }))}
                  />
                </label>
              </div>
              <label>
                Adult availability
                <textarea
                  value={settings.adultAvailability}
                  onChange={(event) => setSettings((current) => ({ ...current, adultAvailability: event.target.value }))}
                />
              </label>
              <label>
                Pickup policy
                <textarea
                  value={settings.shippingPolicy}
                  onChange={(event) => setSettings((current) => ({ ...current, shippingPolicy: event.target.value }))}
                />
              </label>
              <div className="toggle-row">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.publishPuppies}
                    onChange={(event) => setSettings((current) => ({ ...current, publishPuppies: event.target.checked }))}
                  />
                  Publish puppy note
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.publishAdults}
                    onChange={(event) => setSettings((current) => ({ ...current, publishAdults: event.target.checked }))}
                  />
                  Publish adult note
                </label>
              </div>
            </div>
          )}

          {tab === "inquiries" && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>Inquiry pipeline</h2>
                <span>{inquiries.length} total</span>
              </div>
              <div className="inquiry-table">
                {inquiries.map((inquiry) => (
                  <article className="inquiry-row" key={inquiry.id}>
                    <div>
                      <strong>{inquiry.name}</strong>
                      <span>{inquiry.interest}</span>
                      <small>{inquiry.notes}</small>
                    </div>
                    <select
                      value={inquiry.stage}
                      onChange={(event) =>
                        setInquiries((current) =>
                          current.map((item) =>
                            item.id === inquiry.id ? { ...item, stage: event.target.value as Inquiry["stage"] } : item,
                          ),
                        )
                      }
                    >
                      {["New", "Screening", "Visit", "Matched", "Waitlist"].map((stage) => (
                        <option key={stage}>{stage}</option>
                      ))}
                    </select>
                    <meter min="0" max="100" value={inquiry.score} />
                  </article>
                ))}
              </div>
            </div>
          )}

          {tab === "blog" && (
            <div className="admin-card editor-card">
              <h2>Add latest blog note</h2>
              <label>
                Title
                <input value={postDraft.title} onChange={(event) => setPostDraft((current) => ({ ...current, title: event.target.value }))} />
              </label>
              <div className="field-pair">
                <label>
                  Category
                  <input
                    value={postDraft.category}
                    onChange={(event) => setPostDraft((current) => ({ ...current, category: event.target.value }))}
                  />
                </label>
                <label>
                  Image path
                  <input value={postDraft.image} onChange={(event) => setPostDraft((current) => ({ ...current, image: event.target.value }))} />
                </label>
              </div>
              <label>
                Excerpt
                <textarea value={postDraft.excerpt} onChange={(event) => setPostDraft((current) => ({ ...current, excerpt: event.target.value }))} />
              </label>
              <label>
                Body
                <textarea value={postDraft.body} onChange={(event) => setPostDraft((current) => ({ ...current, body: event.target.value }))} />
              </label>
              <button type="button" className="primary-action" onClick={addBlogPost}>
                <Plus size={18} aria-hidden="true" />
                Publish blog post
              </button>
              <div className="admin-list">
                {blogPosts.map((post) => (
                  <article key={post.id}>
                    <div>
                      <strong>{post.title}</strong>
                      <span>{post.category} · {post.date}</span>
                    </div>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`Delete ${post.title}`}
                      title="Delete post"
                      onClick={() => setBlogPosts((current) => current.filter((item) => item.id !== post.id))}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}

          {tab === "reviews" && (
            <div className="admin-card editor-card">
              <h2>Add review</h2>
              <div className="field-pair">
                <label>
                  Name
                  <input value={reviewDraft.name} onChange={(event) => setReviewDraft((current) => ({ ...current, name: event.target.value }))} />
                </label>
                <label>
                  Location
                  <input
                    value={reviewDraft.location}
                    onChange={(event) => setReviewDraft((current) => ({ ...current, location: event.target.value }))}
                  />
                </label>
              </div>
              <label>
                Dog / context
                <input value={reviewDraft.dog} onChange={(event) => setReviewDraft((current) => ({ ...current, dog: event.target.value }))} />
              </label>
              <label>
                Quote
                <textarea value={reviewDraft.quote} onChange={(event) => setReviewDraft((current) => ({ ...current, quote: event.target.value }))} />
              </label>
              <button type="button" className="primary-action" onClick={addReview}>
                <Plus size={18} aria-hidden="true" />
                Publish review
              </button>
              <div className="admin-list">
                {reviews.map((review) => (
                  <article key={review.id}>
                    <div>
                      <strong>{review.name}</strong>
                      <span>{review.quote}</span>
                    </div>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`Delete review from ${review.name}`}
                      title="Delete review"
                      onClick={() => setReviews((current) => current.filter((item) => item.id !== review.id))}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}

          {tab === "media" && (
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>Scraped media library</h2>
                <select value={mediaFilter} onChange={(event) => setMediaFilter(event.target.value)}>
                  {mediaCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="media-grid">
                {filteredMedia.map((item) => (
                  <article className="media-card" key={item.path}>
                    {item.type === "image" ? (
                      <img src={item.path} alt={item.name} />
                    ) : (
                      <div className="pdf-tile">
                        <FileText size={28} aria-hidden="true" />
                        PDF
                      </div>
                    )}
                    <div>
                      <strong>{item.name}</strong>
                      <small>{item.path}</small>
                    </div>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`Copy path for ${item.name}`}
                      title="Copy media path"
                      onClick={() => navigator.clipboard?.writeText(item.path)}
                    >
                      <Archive size={16} aria-hidden="true" />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof PawPrint;
  label: string;
  value: string;
}) {
  return (
    <div className="metric-card">
      <Icon size={20} aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Footer({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <footer className="footer">
      <div>
        <strong>Mata Hauri Basenjis</strong>
        <span>Enfield, New Hampshire · Breeding top Basenjis since 1969</span>
      </div>
      <div className="footer-actions">
        <button type="button" className="text-button" onClick={() => setPage("puppies")}>
          Puppies
        </button>
        <button type="button" className="text-button" onClick={() => setPage("contact")}>
          Contact
        </button>
        <a className="text-button" href={facebookUrl} target="_blank" rel="noreferrer">
          Facebook
        </a>
      </div>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [settings, setSettings] = usePersistentState<AdminSettings>("matahauri-settings", defaultSettings);
  const [inquiries, setInquiries] = usePersistentState<Inquiry[]>("matahauri-inquiries", seedInquiries);
  const [blogPosts, setBlogPosts] = usePersistentState<BlogPost[]>("matahauri-blog-posts", seedBlogPosts);
  const [reviews, setReviews] = usePersistentState<Review[]>("matahauri-reviews", seedReviews);

  const content = {
    home: <HomePage settings={settings} setPage={setPage} blogPosts={blogPosts} reviews={reviews} />,
    puppies: <PuppyPage settings={settings} setInquiries={setInquiries} />,
    dogs: <DogsPage />,
    breed: <BreedPage />,
    reviews: <ReviewsPage reviews={reviews} />,
    blog: <BlogPage posts={blogPosts} />,
    contact: <ContactPage settings={settings} setInquiries={setInquiries} />,
    admin: (
      <AdminCockpit
        settings={settings}
        setSettings={setSettings}
        inquiries={inquiries}
        setInquiries={setInquiries}
        blogPosts={blogPosts}
        setBlogPosts={setBlogPosts}
        reviews={reviews}
        setReviews={setReviews}
      />
    ),
  }[page];

  return (
    <div className={clsx("app", page === "admin" && "admin-mode")}>
      <Header page={page} setPage={setPage} />
      <AnimatePresence mode="wait">
        <div key={page}>{content}</div>
      </AnimatePresence>
      {page !== "admin" && <Footer setPage={setPage} />}
    </div>
  );
}
