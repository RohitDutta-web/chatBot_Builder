import { ChatFlow } from "./models/chatFlow.model.js";

export async function createSampleChatflows() {
  // Chatflow 1: Course Recommendation
  const flow1Nodes = [
    {
      id: "n1",
      type: "text",
      message: "Hi there! I'll help you pick the best course. What's your goal?",
      options: [
        { label: "Change career", next: "n2" },
        { label: "Level up in current position", next: "n3" }
      ],
      next: null
    },
    {
      id: "n2",
      type: "text",
      message: "Great! How many hours per week do you have for studying?",
      options: [
        { label: "3-5", next: "n4" },
        { label: "5-8", next: "n5" }
      ],
      next: null
    },
    {
      id: "n3",
      type: "text",
      message: "Awesome! How many hours per week do you have for studying?",
      options: [
        { label: "3-5", next: "n4" },
        { label: "5-8", next: "n5" }
      ],
      next: null
    },
    {
      id: "n4",
      type: "text",
      message: "Our 1-year course is a good fit for you! Want to see the full program?",
      options: [ { label: "Yes", next: "n6" } ],
      next: null
    },
    {
      id: "n5",
      type: "text",
      message: "Our 6-month course is a good fit for you! Want to see the full program?",
      options: [ { label: "Yes", next: "n6" } ],
      next: null
    },
    {
      id: "n6",
      type: "quick_reply",
      message: "Amazing! What's your email? I'll send you the program.",
      options: [],
      next: "n7"
    },
    {
      id: "n7",
      type: "quick_reply",
      message: "Leave us your phone and we'll contact you when a new student group starts the course.",
      options: [],
      next: "n8"
    },
    {
      id: "n8",
      type: "text",
      message: "Thank you! We've sent you the program.",
      options: [],
      next: null
    }
  ];

  // Chatflow 2: Bot Interruption
  const flow2Nodes = [
    {
      id: "m1",
      type: "text",
      message: "Sorry, didn't catch that. Let me call a human — they'll help you!",
      options: [],
      next: null
    }
  ];

  await ChatFlow.create({
    name: "Course Recommendation",
    triggers: ["Visited the website", "course info"],
    nodes: flow1Nodes
  });
  await ChatFlow.create({
    name: "Bot Interruption",
    triggers: ["help", "human"],
    nodes: flow2Nodes
  });
  console.log("Sample chatflows created.");
}

// To run: import and call createSampleChatflows() from a script or REPL
