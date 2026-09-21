"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TRIP_TYPES, type Trip, type TripStyle } from "@/lib/trips";
import { quizQuestions, quizResults } from "@/lib/quiz";

function createEmptyScores(): Record<TripStyle, number> {
  return TRIP_TYPES.reduce(
    (acc, type) => {
      acc[type] = 0;
      return acc;
    },
    {} as Record<TripStyle, number>,
  );
}

export default function TripQuiz({ trips }: { trips: Trip[] }) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<TripStyle, number>>(
    createEmptyScores(),
  );

  const isResult = step >= quizQuestions.length;

  const winner = useMemo(
    () =>
      TRIP_TYPES.reduce(
        (best, type) => (scores[type] > scores[best] ? type : best),
        TRIP_TYPES[0],
      ),
    [scores],
  );

  const matchingTrip = useMemo(
    () => trips.find((trip) => trip.travelStyle === winner),
    [trips, winner],
  );

  const handleAnswer = (optionScores: TripStyle[]) => {
    setScores((prev) => {
      const next = { ...prev };
      optionScores.forEach((type) => {
        next[type] += 1;
      });
      return next;
    });
    setStep((prev) => prev + 1);
  };

  const handleReset = () => {
    setStep(0);
    setScores(createEmptyScores());
  };

  const question = !isResult ? quizQuestions[step] : null;
  const result = isResult ? quizResults[winner] : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid md:grid-cols-2">
      <div className="p-8 sm:p-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
          Two-minute quiz
        </p>
        <h2 className="mt-3 font-serif text-3xl font-bold text-slate-900">
          What kind of trip are you due?
        </h2>
        <p className="mt-3 text-slate-600">
          Four questions, one honest answer about the sort of break you
          actually need — plus a trip from your stack that fits it.
        </p>

        <div className="mt-6 flex gap-2">
          {quizQuestions.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 flex-1 rounded-full ${
                isResult || index < step
                  ? "bg-teal-950"
                  : index === step
                    ? "bg-orange-600"
                    : "bg-stone-200"
              }`}
            />
          ))}
        </div>

        {question && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900">
              {question.prompt}
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              {question.options.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleAnswer(option.scores)}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-slate-900 transition hover:border-slate-300 hover:bg-stone-50"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className="mt-8">
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              {result.title}
            </h3>
            <p className="mt-3 text-slate-600">{result.blurb}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              {matchingTrip ? (
                <Link
                  href={`/trips/${matchingTrip.id}`}
                  className="inline-flex items-center justify-center rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-900"
                >
                  View your {matchingTrip.destination.split(",")[0]} trip
                </Link>
              ) : (
                <Link
                  href="/trips/new"
                  className="inline-flex items-center justify-center rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-900"
                >
                  Plan a {winner.toLowerCase()} trip
                </Link>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                Take it again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative h-56 w-full md:h-auto">
        <Image
          src="/images/hero-travel.jpg"
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
