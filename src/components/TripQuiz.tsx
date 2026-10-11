"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TRIP_TYPES,
  type Trip,
  type TripStyle,
  formatDate,
  getNights,
} from "@/lib/trips";
import { quizQuestions, quizResults } from "@/lib/quiz";
import { MapPinIcon, PlaneIcon, SparkleIcon } from "@/components/icons";
import { getTravelStyleMeta } from "@/lib/travelStyleMeta";

// Stack trips use their own style names ("City break", "Adventure"), so a
// result matches any trip whose style contains one of these words.
const STYLE_KEYWORDS: Record<TripStyle, string[]> = {
  Beach: ["beach"],
  City: ["city"],
  Mountains: ["mountain", "adventure"],
  "Road trip": ["road"],
  Culture: ["culture"],
};

function matchesStyle(tripStyle: string, style: TripStyle) {
  const key = tripStyle.toLowerCase();
  return STYLE_KEYWORDS[style].some((word) => key.includes(word));
}

// One photo per question, so the panel moves with the quiz.
const QUESTION_PHOTOS = [
  {
    src: "/images/hero-travel.jpg",
    alt: "A calm mountain lake reflecting rocky peaks at first light",
    caption: "Somewhere quiet",
  },
  {
    src: "/images/trip-lisbon.jpg",
    alt: "A tram climbing a narrow, tiled street in Lisbon",
    caption: "Lisbon, Portugal",
  },
  {
    src: "/images/trip-kyoto.jpg",
    alt: "A pagoda above a quiet lane of wooden houses in Kyoto",
    caption: "Kyoto, Japan",
  },
  {
    src: "/images/trip-capetown.jpg",
    alt: "Table Mountain rising above Cape Town's harbour",
    caption: "Cape Town, South Africa",
  },
];

// Shown on the result when no trip in the stack matches the style yet.
const STYLE_PHOTOS: Record<TripStyle, string> = {
  Beach: "/images/trip-capetown.jpg",
  City: "/images/trip-lisbon.jpg",
  Mountains: "/images/hero-travel.jpg",
  "Road trip": "/images/hero-travel.jpg",
  Culture: "/images/trip-kyoto.jpg",
};

const photoLayerClass =
  "object-cover transition-[opacity,transform] duration-[1200ms] ease-out";

// Most points wins. Ties go to whichever tied style was picked most
// recently, rather than always to the first style in TRIP_TYPES.
function pickWinner(answers: TripStyle[][]): TripStyle {
  const scores = new Map<TripStyle, number>();
  answers.flat().forEach((type) => {
    scores.set(type, (scores.get(type) ?? 0) + 1);
  });
  const best = Math.max(0, ...scores.values());

  for (let i = answers.length - 1; i >= 0; i--) {
    const tied = answers[i].find((type) => scores.get(type) === best);
    if (tied) return tied;
  }
  return TRIP_TYPES[0];
}

export default function TripQuiz({ trips }: { trips: Trip[] }) {
  // The styles scored by each answer so far, in order.
  const [answers, setAnswers] = useState<TripStyle[][]>([]);
  const step = answers.length;
  const isResult = step >= quizQuestions.length;

  const winner = useMemo(() => pickWinner(answers), [answers]);

  const matchingTrip = useMemo(
    () => trips.find((trip) => matchesStyle(trip.travelStyle, winner)),
    [trips, winner],
  );

  // The clicked answer disappears with each step, so move focus to the new
  // question (or the result) for keyboard and screen-reader users. Skipped
  // on first render so the page doesn't jump to the quiz on load.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasInteracted = useRef(false);
  useEffect(() => {
    if (hasInteracted.current) headingRef.current?.focus();
  }, [step]);

  const handleAnswer = (optionScores: TripStyle[]) => {
    hasInteracted.current = true;
    setAnswers((prev) => [...prev, optionScores]);
  };

  const handleReset = () => {
    hasInteracted.current = true;
    setAnswers([]);
  };

  const question = !isResult ? quizQuestions[step] : null;
  const result = isResult ? quizResults[winner] : null;

  const resultImage = matchingTrip?.image ?? STYLE_PHOTOS[winner];
  const resultAlt = matchingTrip
    ? matchingTrip.destination
    : `A ${winner.toLowerCase()} trip`;
  const resultMeta = getTravelStyleMeta(winner);
  const ResultIcon = resultMeta.icon;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid md:grid-cols-2 dark:border-slate-800 dark:bg-slate-900">
      <div className="p-8 sm:p-10">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] text-orange-700 uppercase dark:text-orange-400">
          <SparkleIcon className="h-3.5 w-3.5" />
          Two-minute quiz
        </p>
        <h2 className="mt-3 font-serif text-3xl font-bold text-slate-900 dark:text-slate-50">
          What kind of trip are you due?
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Four questions, one honest answer about the sort of break you
          actually need — plus a trip from your stack that fits it.
        </p>

        <p className="mt-6 text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400">
          {isResult
            ? "Your result"
            : `Question ${step + 1} of ${quizQuestions.length}`}
        </p>
        <div className="mt-2 flex gap-2" aria-hidden="true">
          {quizQuestions.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                isResult || index < step
                  ? "bg-teal-950 dark:bg-teal-400"
                  : index === step
                    ? "bg-orange-500"
                    : "bg-stone-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>

        {question && (
          <div className="mt-8">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="text-lg font-semibold text-slate-900 focus:outline-none dark:text-slate-50"
            >
              {question.prompt}
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              {question.options.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleAnswer(option.scores)}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-orange-400 dark:hover:bg-orange-950/30"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className="animate-fade-in-up mt-8">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="flex items-center gap-2 font-serif text-2xl font-bold text-slate-900 focus:outline-none dark:text-slate-50"
            >
              <SparkleIcon className="h-5 w-5 text-amber-400" />
              {result.title}
            </h3>
            <p className="mt-3 text-slate-600 dark:text-slate-300">{result.blurb}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              {matchingTrip ? (
                <Link
                  href={`/trips/${matchingTrip.id}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-md"
                >
                  <PlaneIcon className="h-3.5 w-3.5 -rotate-45" />
                  View your {matchingTrip.destination.split(",")[0]} trip
                </Link>
              ) : (
                <Link
                  href="/trips/new"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-md"
                >
                  <PlaneIcon className="h-3.5 w-3.5 -rotate-45" />
                  Plan a {winner.toLowerCase()} trip
                </Link>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-medium text-slate-500 transition hover:text-teal-900 dark:text-slate-400 dark:hover:text-amber-300"
              >
                Take it again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative h-72 w-full overflow-hidden md:h-auto md:min-h-[28rem]">
        {/* Every photo stays mounted and the active one fades in, so
            switching steps is a smooth crossfade rather than a flash. */}
        {QUESTION_PHOTOS.map((photo, index) => {
          const isActive = !isResult && index === step;
          return (
            <Image
              key={photo.src}
              src={photo.src}
              alt={isActive ? photo.alt : ""}
              aria-hidden={!isActive}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className={`${photoLayerClass} ${
                isActive
                  ? "scale-100 opacity-100"
                  : "opacity-0 motion-safe:scale-105"
              }`}
            />
          );
        })}

        {isResult &&
          (resultImage.startsWith("/") ? (
            <Image
              key={resultImage}
              src={resultImage}
              alt={resultAlt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="animate-fade-in-up object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={resultImage}
              src={resultImage}
              alt={resultAlt}
              className="animate-fade-in-up absolute inset-0 h-full w-full object-cover"
            />
          ))}

        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/70 via-teal-950/10 to-transparent" />

        {!isResult && (
          <span
            key={step}
            className="animate-fade-in-up absolute bottom-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold tracking-[0.12em] text-white uppercase ring-1 ring-white/25 backdrop-blur"
          >
            <MapPinIcon className="h-3.5 w-3.5 text-amber-300" />
            {QUESTION_PHOTOS[step].caption}
          </span>
        )}

        {isResult && (
          <div className="animate-fade-in-up absolute inset-x-5 bottom-5 rounded-2xl bg-stone-50/95 px-5 py-4 text-slate-900 shadow-lg backdrop-blur sm:right-auto sm:max-w-xs dark:bg-slate-900/95 dark:text-slate-50">
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400">
              <ResultIcon className={`h-3.5 w-3.5 ${resultMeta.iconClass}`} />
              {matchingTrip ? "Your match" : `${winner} trips`}
            </p>
            {matchingTrip ? (
              <>
                <p className="mt-1 font-semibold">{matchingTrip.destination}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {formatDate(matchingTrip.startDate)} ·{" "}
                  {getNights(matchingTrip)} nights ·{" "}
                  {matchingTrip.travelStyle}
                </p>
              </>
            ) : (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Nothing in your stack yet — this could be the first.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
