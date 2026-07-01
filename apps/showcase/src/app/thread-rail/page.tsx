"use client";

import type { ThreadRailStates } from "@ui/ui";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ThreadRailRoot,
  ThreadRailTrack,
  ThreadRailTick,
  ThreadRailPreview,
  ThreadRailPreviewTitle,
  ThreadRailPreviewDescription,
  threadRailStates,
} from "@ui/ui";
import { FaGithub } from "react-icons/fa";

import { StateToggle } from "../../components/state-toggle";

type Turn = {
  id: string;
  prompt: string;
  reply: string;
};

const conversation: Turn[] = [
  {
    id: "t1",
    prompt: "Can you help me plan the launch for our new editor?",
    reply:
      "Let's start with the story you want to tell. A launch lands when it opens on one sharp idea, not a feature list. What's the single thing the editor does that nothing else does?",
  },
  {
    id: "t2",
    prompt: "It makes collaborative editing feel instant, even offline.",
    reply:
      "Good, that's your headline. Everything else is proof. Lead with a demo of two cursors moving in perfect sync, then reveal the network was off the whole time. Show, don't claim.",
  },
  {
    id: "t3",
    prompt: "How long should the launch video be?",
    reply:
      "Ninety seconds. The first five decide whether anyone watches the rest, so open on the payoff, the offline reveal, and let the mechanics come after. Cut anything that isn't the one idea.",
  },
  {
    id: "t4",
    prompt: "What about the landing page?",
    reply:
      "One viewport, one sentence, one live demo. No carousel, no logo wall above the fold. The visitor should understand the product before they scroll, and want to try it because they scrolled.",
  },
  {
    id: "t5",
    prompt: "Should we do a waitlist or open it up?",
    reply:
      "Open it. Waitlists protect you from feedback you actually need on day one. If capacity is the worry, gate by invites people can share. Scarcity that spreads beats scarcity that stalls.",
  },
  {
    id: "t6",
    prompt: "Which channels should we prioritise?",
    reply:
      "Pick the two where your users already gather and go deep, rather than five where you're a stranger. For a developer editor that usually means one strong technical writeup and one live thread you actually reply in.\n\nThe writeup is your anchor. Explain the hard problem you solved, show the before and after, and be honest about the tradeoffs you made. People trust a team that can articulate why the thing was difficult, because it signals you understood it deeply enough to have earned the simple result.\n\nThe live thread is where the launch actually happens. Post the demo, then stay in the replies for the rest of the day. Answer the sceptics in good faith, thank the people who share it, and turn every question into a chance to show another angle of the product.\n\nEverything else is amplification. A newsletter, a short video, a couple of well placed comments can all extend the reach, but they only work if the anchor and the thread underneath them are strong. Spread yourself across ten channels and you will do all of them badly. Do two of them exceptionally and the rest takes care of itself.",
  },
  {
    id: "t7",
    prompt: "Can you draft the opening line for the announcement?",
    reply:
      '"We rebuilt collaborative editing so it never waits for the network. Here are two people writing the same document with the wifi off." It states the claim and immediately hands over the proof.',
  },
  {
    id: "t8",
    prompt: "How do we handle pricing on launch day?",
    reply:
      "Keep it visible and simple. A launch is the worst time to make someone email sales. Three tiers, one recommended, and a free tier generous enough that the value is obvious before anyone pays.",
  },
  {
    id: "t9",
    prompt: "What metrics actually matter here?",
    reply:
      "Activation over signups. Thousands of accounts that never open a second document tell you nothing. Track the share who create, invite a collaborator, and come back the next day. That's the real curve.",
  },
  {
    id: "t10",
    prompt: "Any advice for the first 24 hours?",
    reply:
      "Be present, not polished. Answer every reply, ship a fix live if something breaks, and thank the people who show up early. The launch isn't the post. It's the conversation that follows it.",
  },
  {
    id: "t11",
    prompt: "And once the dust settles?",
    reply:
      "Write down what surprised you while it's fresh. The gap between what you expected and what people actually did is the roadmap for the next release, and the seed of your next launch.",
  },
  {
    id: "t12",
    prompt: "This is great, thank you.",
    reply:
      "Anytime. Ship it, stay in the thread, and let the offline demo do the talking. Good luck on launch day.",
  },
];

// The turn the state toggle demonstrates on.
const demoTick = conversation[6]!.id;

export default function ThreadRailPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Active ticks = the turns whose user message is currently in view. It is a
  // set, not a single row, so every visible turn lights up at once.
  const [active, setActive] = useState<string[]>([]);
  const [previewState, setPreviewState] = useState<ThreadRailStates>("default");

  useEffect(() => {
    const viewport = scrollRef.current;
    if (!viewport) return;

    const anchors = Array.from(
      viewport.querySelectorAll<HTMLElement>("[data-anchor]"),
    );
    const inView = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.anchor;
          if (!id) continue;
          if (entry.isIntersecting) inView.add(id);
          else inView.delete(id);
        }
        setActive(
          anchors
            .map((anchor) => anchor.dataset.anchor)
            .filter((id): id is string => !!id && inView.has(id)),
        );
      },
      { root: viewport },
    );

    for (const anchor of anchors) observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  const scrollToTurn = (id: string) => {
    scrollRef.current?.querySelector(`[data-anchor="${id}"]`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Selecting a state demonstrates it on the real rail: "active" scrolls to the
  // demo turn (so the highlight lands where the reader is), "hovered" opens its
  // preview. Any real interaction with the panel hands the rail back to live.
  const demonstrate = (state: ThreadRailStates) => {
    setPreviewState(state);
    if (state === "active") scrollToTurn(demoTick);
  };
  const backToLive = () =>
    setPreviewState((state) => (state === "default" ? state : "default"));

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#101010] p-8">
      <div
        onWheel={backToLive}
        onPointerDown={backToLive}
        className="relative flex h-[560px] w-full max-w-2xl overflow-hidden rounded-xl border border-[#252525] bg-[#0d0d0d]"
      >
        {/* The rail sits in the panel's left gutter and reflects the reader's
            position — one tick per turn, active while its message is on screen. */}
        <div className="-translate-y-1/2 absolute top-1/2 left-4 z-20">
          <ThreadRailRoot
            value={active}
            onValueChange={scrollToTurn}
            hovered={previewState === "hovered" ? demoTick : undefined}
          >
            <ThreadRailTrack>
              {conversation.map((turn) => (
                <ThreadRailTick
                  key={turn.id}
                  value={turn.id}
                  aria-label={turn.prompt}
                >
                  <ThreadRailPreview>
                    <ThreadRailPreviewTitle>
                      {turn.prompt}
                    </ThreadRailPreviewTitle>
                    <ThreadRailPreviewDescription>
                      {turn.reply}
                    </ThreadRailPreviewDescription>
                  </ThreadRailPreview>
                </ThreadRailTick>
              ))}
            </ThreadRailTrack>
          </ThreadRailRoot>
        </div>

        <div
          ref={scrollRef}
          className="h-full w-full overflow-y-auto py-8 pr-8 pl-16 [scrollbar-color:rgba(255,255,255,0.12)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb:hover]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2"
        >
          {conversation.map((turn) => (
            <div key={turn.id} className="mb-8">
              <p
                data-anchor={turn.id}
                className="ml-auto w-fit max-w-[80%] scroll-mt-8 rounded-2xl bg-white px-4 py-2 text-sm text-black"
              >
                {turn.prompt}
              </p>
              <p className="mt-3 max-w-[90%] whitespace-pre-line text-sm leading-relaxed text-white/70">
                {turn.reply}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto my-24 flex w-[650px] max-w-full flex-col justify-start">
        <p className="mb-2 text-sm font-light tracking-wide text-white">
          Thread Rail
        </p>
        <p className="text-sm font-light tracking-wide text-[#888]">
          A navigation rail for long chat threads. Hover a tick to preview a
          turn, then click to jump straight to it.
        </p>
        <hr className="my-16 border-[#333] border-opacity-50" />
        <div className="flex flex-row flex-wrap items-center justify-between gap-16 text-white">
          <StateToggle
            states={threadRailStates as readonly ThreadRailStates[]}
            activeState={previewState}
            onStateChange={demonstrate}
            layoutId="thread-rail-state"
          />

          <div className="flex w-full flex-row-reverse items-center justify-end gap-4 tracking-wide md:w-fit md:flex-row">
            <span className="text-xs font-light">
              Built by <Link href={"https://x.com/danielsims"}>danielsims</Link>
            </span>
            <Link href={"https://github.com/danielsims/ui"}>
              <FaGithub className="fill-white text-white" size={24} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
