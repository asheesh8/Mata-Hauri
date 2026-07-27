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
const redditDiscussionUrl = "https://www.reddit.com/r/Basenji/comments/1f09ixl/good_breeder_at_the_northeastern_area_more/";

const redditHighlights = [
  {
    quote: "Debbie breeds for friendliness, and our girl is very friendly and loves everyone she meets.",
    source: "r/Basenji commenter",
  },
  {
    quote: "Debbie knows her basenjis. She treats them like family. Absolutely worth the drive.",
    source: "Boston-area Basenji owner",
  },
];

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
  const latestPosts = blogPosts.filter((post) => post.published).slice(0, 4);
  const featuredReview = reviews.find((review) => review.published);
  const journalLayout =
    latestPosts.length >= 4 ? "layout-list" : latestPosts.length === 3 ? "layout-three" : "layout-feature";
  const peekerPostId = latestPosts[1]?.id ?? latestPosts[0]?.id;
  const homeLinks: Array<{ page: Page; icon: typeof Home; label: string; copy: string }> = [
    {
      page: "puppies",
      icon: PawPrint,
      label: "Puppy plans and waitlist",
      copy: `${settings.puppyAnnouncement} Pickup details, health notes, and waitlist basics live here.`,
    },
    {
      page: "dogs",
      icon: Dog,
      label: "Meet the Mata Hauri dogs",
      copy: "Browse current dogs, previous champions, pedigrees, photos, and featured stories.",
    },
    {
      page: "breed",
      icon: BookOpen,
      label: "Learn the Basenji honestly",
      copy: "A practical look at temperament, care, escape-artist tendencies, and home fit.",
    },
    {
      page: "contact",
      icon: Mail,
      label: "Start a conversation",
      copy: "Send Debbie your household details, timing, dog experience, and questions.",
    },
  ];

  return (
    <motion.main className="home-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="home-hero decor-host">
        <BasenjiRunner className="hero-runner" variant="tri" flipped />
        <PawTrail className="hero-paws" count={5} />
        <div className="home-hero-bg" aria-hidden="true">
          <img
            src={image("matahauri-basenjis-home-upscaled.jpg")}
            alt=""
          />
          <span />
        </div>
        <div className="hero-content">
          <motion.div
            className="home-copy"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.46 }}
          >
            <span className="eyebrow hero-eyebrow">🐾 {settings.heroStatus}</span>
            <h1>Mata Hauri Basenjis</h1>
            <p>
              Champion Basenjis raised with health, temperament, and a lifetime of
              breed knowledge in Enfield, New Hampshire.
            </p>
            <div className="home-actions">
              <button type="button" className="primary-action" onClick={() => setPage("puppies")}>
                <PawPrint size={18} aria-hidden="true" />
                Puppy information
              </button>
              <button type="button" className="secondary-action hero-secondary" onClick={() => setPage("contact")}>
                <Mail size={18} aria-hidden="true" />
                Contact Debbie
              </button>
            </div>
            <div className="home-facts" aria-label="Mata Hauri quick facts">
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
          </motion.div>
        </div>
      </section>

      <section className="home-story decor-host">
        <PawTrail className="story-paws" count={4} />
        <div className="home-story-copy">
          <span className="eyebrow">🏡 Who we are</span>
          <h2>A small New England kennel with decades of Basenji history.</h2>
          <p>
            Mata Hauri is Debbie Hauri's long-running Basenji program in Enfield,
            New Hampshire. The kennel has show history, but the heart of the work
            is still simple: know the breed, raise sound dogs, and place them with
            people who understand what a Basenji really is.
          </p>
          <p>
            Puppy plans, pedigrees, breed notes, and Debbie's contact details all
            stay close to the real kennel story, so families can learn before they
            rush into a decision.
          </p>
        </div>
        <figure className="home-story-photo">
          <BasenjiRunner className="photo-runner" variant="red" />
          <img src={image("basenji-puppies-for-sale/Mata-Hauri-puppies2024.jpg")} alt="Debbie, family, and Mata Hauri Basenji puppies" />
          <figcaption>Family-raised puppies, long breeder memory, and direct conversations with Debbie.</figcaption>
        </figure>
      </section>

      <section className="home-start decor-host">
        <PawTrail className="start-paws" count={6} />
        <div className="home-section-heading">
          <span className="eyebrow">✨ Start here</span>
          <h2>Find the part of the kennel you came for.</h2>
          <p>
            Puppy families, breed researchers, and longtime Basenji people can each
            head toward the details that matter most.
          </p>
        </div>
        <nav className="home-link-list" aria-label="Homepage section links">
          {homeLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button key={link.page} type="button" className="home-link-row" onClick={() => setPage(link.page)}>
                <span className="home-link-icon">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong>{link.label}</strong>
                  <small>{link.copy}</small>
                </span>
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            );
          })}
        </nav>
      </section>

      <section className="home-journal decor-host">
        <PawTrail className="journal-paws" count={5} />
        <div className="journal-main">
          <div className="home-section-heading">
            <span className="eyebrow">📝 From the kennel</span>
            <h2>Recent notes and useful updates.</h2>
          </div>
          <div className={clsx("journal-post-list", journalLayout, `post-count-${latestPosts.length}`)}>
            {latestPosts.map((post) => (
              <button
                type="button"
                className={clsx("journal-post", post.id === peekerPostId && "has-peeker")}
                key={post.id}
                onClick={() => setPage("blog")}
              >
                <span className="journal-post-media">
                  {post.id === peekerPostId && <BasenjiPeeker />}
                  <img src={post.image} alt="" />
                </span>
                <span>
                  <small>{post.category} · {post.date}</small>
                  <strong>{post.title}</strong>
                  <em>{post.excerpt}</em>
                </span>
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
        <aside className="journal-sidebar">
          <article className="journal-note current-note">
            <CalendarClock size={19} aria-hidden="true" />
            <span>🐶 Puppy planning</span>
            <h3>{settings.puppyAnnouncement}</h3>
            <p>{settings.shippingPolicy}</p>
            <button type="button" className="text-button" onClick={() => setPage("puppies")}>
              Puppy details
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </article>
          <article className="journal-note community-note">
            <RedditMark compact />
            <span>💬 Public community mention</span>
            <blockquote>
              <p>"{redditHighlights[1].quote}"</p>
              <footer>{redditHighlights[1].source}</footer>
            </blockquote>
            <a className="text-button" href={redditDiscussionUrl} target="_blank" rel="noreferrer">
              Read the Reddit thread
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </article>
          {featuredReview && (
            <article className="journal-note family-note">
              <Star size={19} aria-hidden="true" />
              <span>⭐ Family note</span>
              <blockquote>
                <p>"{featuredReview.quote}"</p>
                <footer>{featuredReview.name}, {featuredReview.location}</footer>
              </blockquote>
              <button type="button" className="text-button" onClick={() => setPage("reviews")}>
                More reviews
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </article>
          )}
        </aside>
      </section>

      <section className="home-contact-line">
        <div>
          <span>📬 Ready to talk?</span>
          <h2>Tell Debbie about your household, timing, and Basenji experience.</h2>
        </div>
        <button type="button" className="primary-action" onClick={() => setPage("contact")}>
          <Mail size={18} aria-hidden="true" />
          Contact Debbie
        </button>
      </section>
    </motion.main>
  );
}

function BasenjiPeeker() {
  return (
    <span className="basenji-peeker" aria-hidden="true">
      <svg viewBox="0 0 148 118" role="img">
        <path className="peeker-arm rear" d="M42 72c-11 13-14 25-10 36" />
        <path className="peeker-arm front" d="M99 72c11 13 14 25 10 36" />
        <path className="peeker-ear rear" d="M49 39 39 5c23 6 36 22 38 45Z" />
        <path className="peeker-ear front" d="M88 42 118 12c5 29-8 49-33 61Z" />
        <path className="peeker-inner-ear rear" d="M52 37 47 18c11 7 18 16 21 29Z" />
        <path className="peeker-inner-ear front" d="M91 44 109 26c1 15-6 27-19 36Z" />
        <path className="peeker-head" d="M45 42c15-25 51-25 67 0 15 23 1 51-29 56-30 5-52-19-38-56Z" />
        <path className="peeker-mask" d="M83 34c15 1 26 10 31 27-4 17-15 29-34 36-12-18-11-43 3-63Z" />
        <path className="peeker-face" d="M54 43c13 4 21 17 25 38 2 9 1 16-3 22-19 1-35-10-42-28-7-17 1-29 20-32Z" />
        <path className="peeker-blaze" d="M68 34c7 11 9 29 6 54-10-7-15-21-15-36 0-10 3-16 9-18Z" />
        <path className="peeker-muzzle" d="M38 75c13-10 32-8 41 4-2 14-15 22-33 20-15-2-22-11-8-24Z" />
        <ellipse className="peeker-nose" cx="39" cy="80" rx="7" ry="5.2" />
        <circle className="peeker-eye" cx="60" cy="61" r="4.1" />
        <circle className="peeker-eye" cx="90" cy="63" r="4.1" />
        <circle className="peeker-eye-shine" cx="61" cy="59" r="1.2" />
        <circle className="peeker-eye-shine" cx="91" cy="61" r="1.2" />
        <path className="peeker-smile" d="M52 91c7 5 17 4 24-2" />
        <path className="peeker-paw rear" d="M23 101c7-9 25-9 32 0 3 5 0 11-8 12H30c-8-1-11-7-7-12Z" />
        <path className="peeker-paw front" d="M94 101c7-9 25-9 32 0 3 5 0 11-8 12h-17c-8-1-11-7-7-12Z" />
        <path className="peeker-toes rear" d="M34 104v6M43 104v6" />
        <path className="peeker-toes front" d="M105 104v6M114 104v6" />
      </svg>
    </span>
  );
}

function BasenjiRunner({
  className,
  variant = "tri",
  flipped = false,
}: {
  className?: string;
  variant?: "tri" | "red";
  flipped?: boolean;
}) {
  return (
    <span className={clsx("basenji-runner", className, `variant-${variant}`, flipped && "flipped")} aria-hidden="true">
      <span className="basenji-sprite">
        <svg viewBox="0 0 230 168" role="img">
          <ellipse className="basenji-shadow" cx="116" cy="154" rx="80" ry="9" />
          <path className="basenji-tail-curl" d="M181 74c25-38 69-10 47 23-15 22-47 9-36-13 6-12 23-9 23 4" />
          <path className="basenji-tail-tip" d="M199 74c14-10 28-3 30 11" />
          <path className="basenji-body" d="M66 67c20-20 76-23 115-9 19 7 26 22 20 43-7 24-35 38-78 38-50 0-84-16-89-42-2-12 8-22 32-30Z" />
          <path className="basenji-back-mark" d="M101 55c27-6 60-3 80 4-8 19-26 31-55 32-24 1-36-9-25-36Z" />
          <path className="basenji-belly" d="M61 104c27 20 88 26 128 8-11 20-36 29-72 27-37-2-61-13-72-32 4-3 9-4 16-3Z" />
          <path className="basenji-chest" d="M58 65c25 14 33 41 22 74-26-6-43-25-45-50-1-15 8-26 23-24Z" />
          <path className="basenji-neck" d="M49 65c5-21 20-32 40-28l13 32c-14 13-28 16-42 9Z" />
          <path className="basenji-head" d="M36 29c19-21 49-10 57 18 7 28-16 47-43 43-27-4-34-39-14-61Z" />
          <path className="basenji-ear rear" d="M47 27 39 0c22 5 33 20 36 39Z" />
          <path className="basenji-ear front" d="M76 35 101 5c7 27-1 47-23 59Z" />
          <path className="basenji-inner-ear rear" d="M50 26 46 11c10 6 16 13 19 24Z" />
          <path className="basenji-inner-ear front" d="M78 39 94 20c1 14-4 25-16 33Z" />
          <path className="basenji-face-mark" d="M45 30c12 4 20 16 24 34 4 14 3 25-2 33-17 1-32-9-39-25-8-18 0-35 17-42Z" />
          <path className="basenji-blaze" d="M57 25c7 9 9 24 7 45-10-5-16-17-15-30 0-8 3-13 8-15Z" />
          <path className="basenji-muzzle" d="M27 64c14-9 34-7 42 5-1 14-15 22-33 20-15-2-21-12-9-25Z" />
          <path className="basenji-smile" d="M40 80c8 6 19 5 26-2" />
          <circle className="basenji-eye left" cx="50" cy="52" r="3.8" />
          <circle className="basenji-eye right" cx="73" cy="53" r="3.8" />
          <circle className="basenji-eye-shine left" cx="51" cy="50" r="1.1" />
          <circle className="basenji-eye-shine right" cx="74" cy="51" r="1.1" />
          <ellipse className="basenji-nose" cx="29" cy="69" rx="7" ry="5.2" />
          <path className="basenji-leg hind far" d="M137 125c-7 12-11 24-10 36" />
          <path className="basenji-leg hind near" d="M167 119c10 12 16 26 18 42" />
          <path className="basenji-leg fore far" d="M69 124c-2 13-1 25 2 37" />
          <path className="basenji-leg fore near" d="M92 119c9 13 15 27 16 42" />
          <path className="basenji-sock hind-far" d="M127 144c-2 6-2 11 0 17" />
          <path className="basenji-sock hind-near" d="M179 143c3 6 5 12 6 18" />
          <path className="basenji-sock fore-far" d="M69 144c0 6 1 12 2 17" />
          <path className="basenji-sock fore-near" d="M103 143c3 6 5 12 5 18" />
          <path className="basenji-paw hind-far" d="M119 161h18" />
          <path className="basenji-paw hind-near" d="M177 161h20" />
          <path className="basenji-paw fore-far" d="M63 161h18" />
          <path className="basenji-paw fore-near" d="M99 161h20" />
        </svg>
      </span>
    </span>
  );
}

function PawTrail({ className, count = 5 }: { className?: string; count?: number }) {
  return (
    <span className={clsx("paw-trail", className)} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} />
      ))}
    </span>
  );
}

function RedditMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={clsx("reddit-mark", compact && "compact")} aria-hidden="true">
      <span>r/</span>
    </span>
  );
}

function CommunityMentionCard() {
  return (
    <article className="community-card">
      <div className="community-card-copy">
        <RedditMark />
        <span className="eyebrow">💬 Reddit community mention</span>
        <h2>Recommended by Basenji people looking in New England.</h2>
        <p>
          In a public r/Basenji discussion about finding a good breeder near Boston,
          multiple commenters brought up Mata Hauri and Debbie's hands-on approach.
        </p>
        <a className="secondary-action community-link" href={redditDiscussionUrl} target="_blank" rel="noreferrer">
          View the Reddit thread
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="community-quotes">
        {redditHighlights.map((highlight) => (
          <blockquote key={highlight.quote}>
            <MessageCircle size={18} aria-hidden="true" />
            <p>"{highlight.quote}"</p>
            <footer>{highlight.source}</footer>
          </blockquote>
        ))}
      </div>
    </article>
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
            <div className="spotlight-copy-head">
              <span className="eyebrow">{active.name}</span>
              <strong>{active.callout}</strong>
            </div>
            <h2>{active.title}</h2>
            <p className="spotlight-subtitle">{active.subtitle}</p>
            <div className="spotlight-story-grid">
              <article>
                <Dog size={19} aria-hidden="true" />
                <span>The dog</span>
                <p>{active.dogStory}</p>
              </article>
              <article>
                <BadgeCheck size={19} aria-hidden="true" />
                <span>The competition</span>
                <p>{active.competitionStory}</p>
              </article>
            </div>
            <div className="win-grid" aria-label={`${active.name} show highlights`}>
              {active.wins.map((win) => (
                <div className="win-item" key={win}>
                  <BadgeCheck size={17} aria-hidden="true" />
                  {win}
                </div>
              ))}
            </div>
            <div className="spotlight-people" aria-label={`${active.name} people and pedigree details`}>
              {active.meta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div className="spotlight-media">
            <figure className="spotlight-main-frame">
              <img className="spotlight-main" src={active.images[0]} alt={`${active.name} feature`} />
              <figcaption>{active.imageCaption}</figcaption>
            </figure>
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
      intro="Family notes, public community mentions, and honest context for people trying to choose a Basenji breeder in New England."
    >
      <CommunityMentionCard />
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
