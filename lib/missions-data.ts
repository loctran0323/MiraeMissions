// Seed content for the 9 summer-intern missions, taken from the reference design.
// `instructions` lines render as a checklist/paragraph block on the mission page.

export interface MissionSeed {
  slug: string;
  title: string;
  short_description: string;
  deliverable_type: string;
  instructions: string;
}

export const MISSION_SEEDS: MissionSeed[] = [
  {
    slug: "about-your-team",
    title: "About your team",
    short_description: "Write 3 things about your team.",
    deliverable_type: "Photo + memo",
    instructions: [
      "What work does your team do?",
      "What work will you be doing?",
      "Anything else about your team that you've noticed?",
    ].join("\n"),
  },
  {
    slug: "share-a-skill",
    title: "Share a skill with your team",
    short_description: "Pick something you are good at and teach it to someone else.",
    deliverable_type: "Photo / video + memo",
    instructions: [
      "Choose a skill you're genuinely good at — technical or not.",
      "Teach it to a teammate, one-on-one or to the group.",
      "Capture a photo or short video of the session.",
      "In your memo, note what you taught and how it went.",
    ].join("\n"),
  },
  {
    slug: "present-your-work",
    title: "Present your work",
    short_description: "Give a presentation on your work.",
    deliverable_type: "Photo / video + memo",
    instructions: [
      "Prepare a short presentation on a project you've worked on.",
      "Present it to your team or manager.",
      "Capture a photo or video of the presentation.",
      "Summarize the key points and any feedback you received.",
    ].join("\n"),
  },
  {
    slug: "lunch-with-a-team-member",
    title: "Go for lunch with a team member",
    short_description: "No work talk — just get to know each other.",
    deliverable_type: "Photo + memo",
    instructions: [
      "Invite a team member to lunch.",
      "Keep it personal — no work talk.",
      "Snap a photo together.",
      "Share one thing you learned about them.",
    ].join("\n"),
  },
  {
    slug: "coffee-chat",
    title: "Go for a coffee chat",
    short_description: "Invite someone for coffee. What did you discover?",
    deliverable_type: "Photo + memo",
    instructions: [
      "Invite someone outside your immediate team for coffee.",
      "Ask about their role and career path.",
      "Capture a photo of the moment.",
      "In your memo, share what you discovered.",
    ].join("\n"),
  },
  {
    slug: "introduce-two-people",
    title: "Introduce two people",
    short_description: "Connect two people who should know each other.",
    deliverable_type: "Photo + memo",
    instructions: [
      "Identify two people who would benefit from knowing each other.",
      "Make the introduction in person or over a message.",
      "Capture proof of the introduction (photo or screenshot).",
      "Explain why you connected them.",
    ].join("\n"),
  },
  {
    slug: "you-in-action",
    title: "You in action",
    short_description: "Capture a moment of you in action from a culture activity.",
    deliverable_type: "Photo / video",
    instructions: [
      "Take part in a company culture activity.",
      "Capture a photo or video of you in action.",
      "Add a short memo describing the activity.",
    ].join("\n"),
  },
  {
    slug: "group-in-action",
    title: "The group in action",
    short_description: "Capture a moment of the group in action.",
    deliverable_type: "Photo / video",
    instructions: [
      "Join a group activity or team event.",
      "Capture a photo or video of the group in action.",
      "Add a short memo describing the moment.",
    ].join("\n"),
  },
  {
    slug: "a-hidden-rule",
    title: "A hidden rule",
    short_description: "What's a hidden rule within the company you've noticed?",
    deliverable_type: "Memo (+ optional photo)",
    instructions: [
      "Observe the unwritten norms around the office.",
      "Identify one 'hidden rule' that isn't in any handbook.",
      "Write it up in your memo — add a photo if it helps.",
    ].join("\n"),
  },
];
