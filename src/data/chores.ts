import { Chore } from "@/models";

const MockChores: Chore[] = [
  {
    id: "1",
    name: "Chore 1",
    description: "Chore 1 description here...",
    completed_on: "2025-01-21",
    frequency_days: 3,
    public: true,
  },
  {
    id: "2",
    name: "Chore 2",
    description: "Chore 2 description here...",
    completed_on: "2025-01-23",
    frequency_days: 7,
    public: true,
  },
  {
    id: "3",
    name: "Chore 3",
    description: "Chore 3 description here...",
    completed_on: "2025-01-22",
    frequency_days: 4,
    public: false,
  },
  {
    id: "4",
    name: "Chore 4",
    description: "Chore 4 description here...",
    completed_on: "2024-11-22",
    frequency_days: 300,
    public: false,
  },
];

export default MockChores;
