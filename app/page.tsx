"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const liveSnippets = [
  `stack = ["Next.js", "FastAPI", "LangChain"]`,
  `async def draft_case_study(topic: str):
    brief = await research(topic)
    return await write(brief)`,
  `def deploy(region: str, project: str):
    print(f"🚀 pushing {project} to {region}")
    return "ok"`,
  `for sprint in roadmap:
    ship(sprint.features)
    measure(sprint.metrics)`,
]

const buildLogEntries = [
  "ship(api): ✅ smoke tests passing",
  "ship(ui): ⚙️ compiling Tailwind layers",
  "ops: ☁️ syncing edge cache",
  "monitor: 📈 latency 142ms",
  "ai: 🤖 generating script drafts",
  "cms: 📦 importing new case study",
]

const commandQueueEntries = [
  '$ plan next-case-study --topic "AI x Media"',
  "$ ingest yt-metrics.csv --into dashboard",
  "$ notify clients --channel slack",
  "$ deploy landing --target fly.io",
  "$ queue reels --batch 04",
]

export default function Home() {
  const [isDark, setIsDark] = useState(true)
  const [activeSection, setActiveSection] = useState("")
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  const [liveOutput, setLiveOutput] = useState("")
  const [snippetIndex, setSnippetIndex] = useState(0)
  const [logIndex, setLogIndex] = useState(0)
  const [commandIndex, setCommandIndex] = useState(0)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  useEffect(() => {
    let charIndex = 0
    let timeout: ReturnType<typeof setTimeout>

    const playSnippet = () => {
      const snippet = liveSnippets[snippetIndex]
      if (!snippet) return

      setLiveOutput(snippet.slice(0, charIndex + 1))

      if (charIndex < snippet.length - 1) {
        charIndex += 1
        timeout = setTimeout(playSnippet, 55)
      } else {
        timeout = setTimeout(() => {
          setSnippetIndex((prev) => (prev + 1) % liveSnippets.length)
        }, 1600)
      }
    }

    playSnippet()
    return () => clearTimeout(timeout)
  }, [snippetIndex])

  useEffect(() => {
    const logInterval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % buildLogEntries.length)
    }, 2400)

    const commandInterval = setInterval(() => {
      setCommandIndex((prev) => (prev + 1) % commandQueueEntries.length)
    }, 3200)

    return () => {
      clearInterval(logInterval)
      clearInterval(commandInterval)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: "0px 0px -20% 0px" },
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="flex flex-col gap-4">
          {["intro", "services", "pricing", "work", "thoughts", "connect"].map((section) => (
            <button
              key={section}
              onClick={() => document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })}
              className={`w-2 h-8 rounded-full transition-all duration-500 ${
                activeSection === section ? "bg-foreground" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Navigate to ${section}`}
            />
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
        <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)_240px] lg:gap-10">
          <aside className="hidden lg:flex sticky top-1/2 -translate-y-1/2 h-fit flex-col gap-4">
            <div className="rounded-2xl border border-border bg-muted/15 p-5 shadow-inner space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                <span>Live coding</span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  running
                </span>
              </div>
              <pre
                className="text-xs leading-relaxed text-muted-foreground font-mono overflow-hidden whitespace-pre-wrap min-h-[140px]"
                aria-live="polite"
              >
                {liveOutput}
                <span className="ml-1 inline-block h-4 w-2 bg-muted-foreground/40 animate-pulse align-middle" />
              </pre>
            </div>

            <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Build logs</div>
              <ul className="space-y-1 text-xs font-mono text-muted-foreground" aria-live="polite">
                {Array.from({ length: 4 }).map((_, idx) => {
                  const entry = buildLogEntries[(logIndex + idx) % buildLogEntries.length]
                  return <li key={`${entry}-${idx}`}>{entry}</li>
                })}
              </ul>
            </div>

            <div className="rounded-2xl border border-dashed border-border/70 bg-muted/10 p-4 space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Command queue</div>
              <ul className="text-xs font-mono text-muted-foreground space-y-2" aria-live="polite">
                {Array.from({ length: 3 }).map((_, idx) => {
                  const entry = commandQueueEntries[(commandIndex + idx) % commandQueueEntries.length]
                  return <li key={`${entry}-${idx}`}>{entry}</li>
                })}
              </ul>
            </div>
          </aside>

          <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10">
        <header
          id="intro"
          ref={(el) => {
            sectionsRef.current[0] = el
          }}
          className="min-h-screen flex items-start sm:items-center opacity-0 pt-16 sm:pt-0"
        >
          <div className="grid lg:grid-cols-5 gap-12 sm:gap-16 w-full">
            <div className="lg:col-span-3 space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-2">
                <div className="text-sm text-muted-foreground font-mono tracking-wider">PORTFOLIO / 2025</div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight">
                  Jathursh
                  <br />
                  <span className="text-muted-foreground">Path</span>
                </h1>
              </div>

              <div className="space-y-6 max-w-md">
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  AI Content Creator & Software Engineer building intelligent,
                  <span className="text-foreground"> AI-driven web applications</span>,
                  <span className="text-foreground"> automation</span>, and
                  <span className="text-foreground"> modern digital experiences</span>.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Available for work
                  </div>
                  <div>Qatar</div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link
                    href="https://www.youtube.com/@AI_Genso"
                    className="group flex items-center gap-2 px-3 py-1 text-xs border border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    YouTube
                  </Link>
                  <Link
                    href="https://paypal.me/Jathursh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-3 py-1 text-xs border border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 5h-2V5h2v3zM4 19h16v-2H4z" />
                    </svg>
                    Support / Pay via PayPal
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-end space-y-6 sm:space-y-8 mt-8 lg:mt-0">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">CURRENTLY</div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="text-foreground">Freelancer</div>
                    <div className="text-muted-foreground">@ Fiverr</div>
                    <div className="text-xs text-muted-foreground">2024 - present</div>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-border/50">
                    <div className="text-foreground">Content creator</div>
                    <div className="text-muted-foreground">@ YouTube</div>
                    <div className="text-xs text-muted-foreground">2025 - present</div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-border/50">
                  <div className="text-sm text-muted-foreground font-mono">FOCUS</div>
                  <div className="flex flex-wrap gap-2">
                    {["Django", "SpringBoot", "Machine Learning", "AI Content Creation"].map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs border border-foreground/30 text-muted-foreground rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section
          id="services"
          ref={(el) => {
            sectionsRef.current[1] = el
          }}
          className="py-20 sm:py-32 opacity-0"
        >
          <div className="space-y-10 sm:space-y-12">
            <h2 className="text-3xl sm:text-4xl font-light">Services</h2>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-7">
              {[
                {
                  title: "AI Video Generation",
                  description: "Short-form content, faceless videos, reels & YouTube automation-style edits.",
                },
                {
                  title: "AI Images & Editing",
                  description: "Thumbnails, AI portraits, branding visuals, product edits, and enhancements.",
                },
                {
                  title: "AI Voice & Music",
                  description: "Voice cloning, AI voice-overs, and generative music beds tailored to your content.",
                },
                {
                  title: "Website Creation",
                  description: "Fast, modern, minimal websites optimized for speed, conversion, and branding.",
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className="group p-6 sm:p-8 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 will-change-transform"
                >
                  <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-medium group-hover:text-muted-foreground transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Custom pricing based on Requirements
            </p>

            <div className="pt-4 sm:pt-5 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                href="https://drive.google.com/drive/folders/1m8Gf6zvFajzDqiNRUK3mmIiBtlav3VL2?usp=sharing"
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium border border-border text-foreground hover:border-foreground hover:bg-foreground/5 transition-all duration-300 hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]"
              >
                View Samples
              </Link>
              <Link
                href="https://forms.gle/PyaybRZtDdHRv2Pk6"
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium border border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground transition-all duration-300 hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)]"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </section>

        <section
          id="pricing"
          ref={(el) => {
            sectionsRef.current[2] = el
          }}
          className="py-20 sm:py-32 opacity-0"
        >
          <div className="space-y-12 sm:space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl font-light">AI Video Pricing</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {[
                {
                  title: "AI Product Video (0–30 sec)",
                  price: "$20",
                  features: ["Cinematic AI video", "Smooth animation", "Social media ready", "Fast delivery"],
                },
                {
                  title: "AI Product Video (30–60 sec)",
                  price: "$40",
                  features: ["Cinematic AI video", "Smooth animation", "Social media ready", "Fast delivery"],
                },
              ].map((plan) => (
                <div
                  key={plan.title}
                  className="group p-6 sm:p-8 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 will-change-transform flex flex-col gap-6"
                >
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-medium group-hover:text-muted-foreground transition-colors duration-300">
                      {plan.title}
                    </h3>
                    <div className="text-3xl sm:text-4xl font-light">{plan.price}</div>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-foreground/60" aria-hidden />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="space-y-6 flex flex-col items-center">
              <div className="w-full max-w-2xl rounded-lg border border-foreground/20 bg-muted/30 p-5 sm:p-6 text-center shadow-[0_6px_24px_-18px_rgba(0,0,0,0.45)]">
                <p className="text-sm sm:text-base leading-relaxed">
                  🎁 First 10 orders get 30% OFF
                  <br />
                  Use code: FIRST30
                </p>
              </div>

              <div className="flex w-full flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 sm:w-auto">
                <Link
                  href="https://forms.gle/PyaybRZtDdHRv2Pk6"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 text-sm font-medium border border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground transition-all duration-300 hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)]"
                >
                  Submit a Request
                </Link>
                <Link
                  href="https://wa.me/97430080741?text=Hi%2C%20I%20want%20an%20AI%20product%20video.%20Code%3A%20FIRST30"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 text-sm font-medium border border-border text-foreground hover:border-foreground hover:bg-foreground/5 transition-all duration-300 hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]"
                  aria-label="Open WhatsApp chat with pre-filled message for AI product video"
                >
                  WhatsApp Me
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="work"
          ref={(el) => {
            sectionsRef.current[3] = el
          }}
          className="min-h-screen py-20 sm:py-32 opacity-0"
        >
          <div className="space-y-12 sm:space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl font-light">Selected Work</h2>
              {/* <div className="text-sm text-muted-foreground font-mono">2023</div> */}
            </div>

            <div className="space-y-8 sm:space-y-12">
            <div className="group grid lg:grid-cols-12 gap-4 sm:gap-8 py-6 sm:py-8 border-b border-border/50 hover:border-border transition-colors duration-500">
                <div className="lg:col-span-2">
                  <div className="text-xl sm:text-2xl font-light text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                    2025
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-medium">Content Creator</h3>
                    {/* <p className="text-xs text-muted-foreground mt-1">2025 – present</p> */}
                  </div>
                  <p className="text-muted-foreground leading-relaxed max-w-lg space-y-1">
                    <span className="block">
                      - AI image generation using Nano-Banana and DALL·E for thumbnails, concepts, and visual branding.
                    </span>
                    <span className="block">
                      - AI video generation from text/image prompts with Wan 2.5, Kling 1.6, and Sora 2 for shorts and long-form.
                    </span>
                    <span className="block">
                      - Running an independent AI YouTube channel focused on AI-generated stories, shorts, and viral story ideas.
                    </span>
                    <span className="block">
                      - AI voice cloning and narration using TTS models, plus editing pipelines in CapCut and Canva.
                    </span>
                  </p>
                </div>

                <div className="lg:col-span-4 mt-2 lg:mt-0 space-y-2">
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {["Nano-Banana", "DALL·E", "Wan 2.5"].map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-1 text-xs text-muted-foreground rounded group-hover:border-muted-foreground/50 transition-colors duration-500"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {["Kling 1.6", "Sora 2", "CapCut", "Canva", "RunwayML", "Photoshop","After Effects"].map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-1 text-xs text-muted-foreground rounded group-hover:border-muted-foreground/50 transition-colors duration-500"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="group grid lg:grid-cols-12 gap-4 sm:gap-8 py-6 sm:py-8 border-b border-border/50 hover:border-border transition-colors duration-500">
                <div className="lg:col-span-2">
                  <div className="text-xl sm:text-2xl font-light text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                    2023
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-medium">Software Engineer Intern - Backend</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed max-w-lg">
                    {/* Developed and optimized backend microservices using Spring Boot and RESTful architecture. Performed
                    root cause analysis, debugging, and unit testing across financial and e-commerce applications.
                    Collaborated using Git, CI/CD, Docker, and Postman to ensure maintainable and scalable code
                    delivery. */}
                    <span className="block">
                      - Developed and optimized backend microservices using Spring Boot and RESTful architecture.
                    </span>
                    <span className="block">
                      - Performed root cause analysis, debugging, and unit testing across financial and e-commerce applications.
                    </span>
                    <span className="block">
                      - Collaborated using Git, CI/CD, Docker, and Postman to ensure maintainable and scalable code
                      delivery.
                    </span>
                  </p>
                </div>

                <div className="lg:col-span-4 mt-2 lg:mt-0 space-y-2">
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {["SpringBoot", "MySQL", "Mockito"].map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs text-muted-foreground rounded group-hover:border-muted-foreground/50 transition-colors duration-500"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {["Postman"].map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs text-muted-foreground rounded group-hover:border-muted-foreground/50 transition-colors duration-500"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="thoughts"
          ref={(el) => {
            sectionsRef.current[4] = el
          }}
          className="min-h-screen py-20 sm:py-32 opacity-0"
        >
          <div className="space-y-12 sm:space-y-16">
            <h2 className="text-3xl sm:text-4xl font-light">Recent Thoughts</h2>

            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
              {[
                {
                  title: "Hook, Retention, PayOff",
                  excerpt: "How to structure AI-generated videos that hook viewers in the first 3 seconds, maintain retention, and deliver satisfying payoffs.",
                  date: "Jan 2025",
                  readTime: "6 min",
                },
                {
                  title: "SpringBoot APIs",
                  excerpt: "Best practices for designing RESTful microservices, handling concurrency, and optimizing database queries in production.",
                  date: "Dec 2024",
                  readTime: "8 min",
                },
                {
                  title: "Python Automation",
                  excerpt: "Scripting workflows for batch AI image generation, video processing pipelines, and YouTube automation using Python.",
                  date: "Nov 2024",
                  readTime: "5 min",
                },
                {
                  title: "AI Voice Cloning",
                  excerpt: "Navigating the technical and ethical considerations of TTS models, voice synthesis, and content authenticity.",
                  date: "Oct 2024",
                  readTime: "7 min",
                },
              ].map((post, index) => (
                <article
                  key={index}
                  className="group p-6 sm:p-8 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-500 hover:shadow-lg cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-medium group-hover:text-muted-foreground transition-colors duration-300">
                      {post.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <span>Read more</span>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="connect"
          ref={(el) => {
            sectionsRef.current[5] = el
          }}
          className="py-20 sm:py-32 opacity-0"
        >
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16">
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-3xl sm:text-4xl font-light">Let's Connect</h2>

              <div className="space-y-6">
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Always interested in new opportunities, collaborations, and conversations about technology and design.
                </p>

                <div className="space-y-4">
                  <Link
                    href="mailto:Jathursh007@gmail.com"
                    className="group flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors duration-300"
                  >
                    <span className="text-base sm:text-lg">Jathursh007@gmail.com</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="text-sm text-muted-foreground font-mono">ELSEWHERE</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "GitHub", handle: "@Justy11", url: "https://github.com/Justy-11" },
                  { name: "v0.dev", handle: "@jathursh11", url: "https://v0.app/@jathursh11-4767" },
                  { name: "Instagram", handle: "@justy11", url: "https://instagram.com/justy__11" },
                  { name: "LinkedIn", handle: "@Jathurshan Pathmarasa", url: "https://www.linkedin.com/in/jathurshan-pathmarasa-53b267365/" },
                ].map((social) => (
                  <Link
                    key={social.name}
                    href={social.url}
                    className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                        {social.name}
                      </div>
                      <div className="text-sm text-muted-foreground">{social.handle}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 sm:py-16 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">© 2025 Jathursh. All rights reserved.</div>
              <div className="text-xs text-muted-foreground">Built with v0.dev by Jathursh</div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="group p-3 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 0zM17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              <button className="group p-3 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300">
                <svg
                  className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9 9 0 110-18c4.97 0 9 3.582 9 8z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </footer>
      </main>

          <aside className="hidden lg:flex sticky top-1/2 -translate-y-1/2 h-fit flex-col gap-4">
            <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Google AdSense</div>
              {/* <p className="text-sm text-muted-foreground leading-relaxed">
                Reserve a responsive ad slot here. Drop your{" "}
                <code className="font-mono text-xs">ins.adsbygoogle</code> container and script to monetize long-form sessions.
              </p> */}
              <div className="h-32 w-full rounded-xl bg-background border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
                300×600 media
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background/70 p-5 space-y-4">
              <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Partner highlight</div>
              {/* <p className="text-sm text-muted-foreground">
                Swap in newsletter promos, affiliate mentions, or product announcements without touching the hero layout.
              </p> */}
              <button className="w-full rounded-full border border-foreground/40 px-4 py-2 text-xs uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-colors duration-300">
                Request media kit
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
