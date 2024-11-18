import { Section } from "../interfaces";

export const SECTIONS: Section[] = [
  {
    name: "backlog",
    id: "026ce9c6-b269-461e-87a2-cd51a8b44a41",
    tasks: [
      {
        id: "3b81de1e-cc15-4631-826f-36a4a0d48e94",
        title: "Implement a custom navigation bar with dropdown menus and responsive layout using tailwind CSS",
        description: "Develop a custom navigation bar featuring dropdown menus, ensuring it is fully responsive and styled using Tailwind CSS for a modern look and feel.",
        priority: { color: "blue", level: "low"},
        createdAt: "2025-01-05",
        updatedAt: "2025-01-05",
        completed: false,
        dueDate: "2025-01-24",
        tags: ["frontend", "pagination", "UI"],
        section: "026ce9c6-b269-461e-87a2-cd51a8b44a41"
      },
      {
        id: "9e76ab2b-d39d-423a-a00e-0c79acbcdc95",
        title: "Complete redesign landing page",
        description: "Redesign the landing page to better showcase the app's key features, improve usability, and create a visually appealing layout that aligns with the brand identity.",
        priority: { color: "red", level: "high"},
        createdAt: "2025-01-05",
        updatedAt: "2025-01-05",
        completed: false,
        dueDate: "2025-01-24",
        tags: ["UI", "UX", "design"],
        subtasks: [
          { description: "Create wireframes for the new layout", completed: false },
          { description: "Conduct user testing for wireframes", completed: false },
          { description: "Finalize high-fidelity designs", completed: false }
        ],
        section: "026ce9c6-b269-461e-87a2-cd51a8b44a41"
      },
      
    ],
  },
  {
    name: 'In progress',
    id: '6cc5397f-cf07-466b-a8ea-c2ed12b6f152',
    tasks: [
      {
        id: "af45c56b-1bc4-4a87-808f-b22a9d3f3a2a",
        title: "Fix bugs in the form validation logic",
        description: "Review and fix issues in the form validation logic to ensure proper error handling and user feedback.",
        priority: { color: "yellow", level: "medium"},
        createdAt: "2025-01-05",
        updatedAt: "2025-01-05",
        completed: false,
        dueDate: "2025-01-24",
        tags: ["frontend", "bugfix", "forms"],
        subtasks: [
          { description: "Test all input fields for edge cases", completed: true },
          { description: "Ensure validation messages are displayed correctly", completed: false },
          { description: "Fix any JavaScript errors in the validation logic", completed: false }
        ],
        section: "6cc5397f-cf07-466b-a8ea-c2ed12b6f152"
      },
    ],
  },
  {
    name: 'Completed',
    id: 'c6c4b960-762f-4ae6-9650-5571f21b64d8',
    tasks: [],
  },
]; 