import type { TripStyle } from "./trips";

export type QuizOption = {
  label: string;
  scores: TripStyle[];
};

export type QuizQuestion = {
  prompt: string;
  options: QuizOption[];
};

export const quizQuestions: QuizQuestion[] = [
  {
    prompt: "It's the first morning. What wakes you up?",
    options: [
      { label: "Waves outside the window", scores: ["Beach"] },
      { label: "Church bells and a coffee machine", scores: ["City"] },
      { label: "Cold air and a summit to climb", scores: ["Mountains"] },
      { label: "The engine, already running", scores: ["Road trip"] },
    ],
  },
  {
    prompt: "What's on the table for lunch?",
    options: [
      { label: "Grilled fish, feet in the sand", scores: ["Beach"] },
      {
        label: "Street food from a stall you can't name",
        scores: ["City"],
      },
      {
        label: "Whatever's in the pack, eaten on a ledge",
        scores: ["Mountains"],
      },
      {
        label: "A long lunch that runs into the afternoon",
        scores: ["Culture"],
      },
    ],
  },
  {
    prompt: "What do you bring home?",
    options: [
      { label: "Sand, still in your shoes", scores: ["Beach"] },
      { label: "A gallery print you had to have", scores: ["Culture"] },
      {
        label: "A patch for the jacket, one more town",
        scores: ["Road trip"],
      },
      {
        label: "A ticket stub from something local and loud",
        scores: ["City"],
      },
    ],
  },
  {
    prompt: "How much of the trip is planned?",
    options: [
      {
        label: "Nothing — we'll figure it out there",
        scores: ["Road trip"],
      },
      { label: "A rough shape, room to wander", scores: ["Mountains"] },
      { label: "Every reservation, locked in early", scores: ["Culture"] },
      { label: "A loose list of the must-sees", scores: ["City", "Beach"] },
    ],
  },
];

export const quizResults: Record<TripStyle, { title: string; blurb: string }> =
  {
    Beach: {
      title: "You're due a beach trip.",
      blurb:
        "Salt air, slow mornings, and nowhere to be. Find the shoreline and stay a while.",
    },
    City: {
      title: "You're due a city trip.",
      blurb:
        "New streets, good coffee, something open late. You're due a trip that keeps you moving.",
    },
    Mountains: {
      title: "You're due a mountain trip.",
      blurb:
        "Thin air, a pack on your back, a summit worth the climb. Go earn the view.",
    },
    "Road trip": {
      title: "You're due a road trip.",
      blurb: "An open road, a playlist, no fixed plan. Let the route decide.",
    },
    Culture: {
      title: "You're due a culture trip.",
      blurb:
        "Old buildings, quiet rituals, a lunch nobody's rushing. Slow down and look closely.",
    },
  };
