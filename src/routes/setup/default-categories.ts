import type { Category } from "@/model/schema";

const defaultCategories: Category[] = [
  {
    name: "Food",
    icon: "🍔",
    color: "#ff9900",
  },
  {
    name: "Transportation",
    icon: "🚗",
    color: "#0099ff",
  },
  {
    name: "Housing",
    icon: "🏠",
    color: "#ff6600",
  },
  {
    name: "Entertainment",
    icon: "🎬",
    color: "#ffcc00",
  },
  {
    name: "Bills",
    icon: "🧾",
    color: "#009933",
  },
  {
    name: "Shopping",
    icon: "🛍️",
    color: "#9900ff",
  },
  {
    name: "Health & Fitness",
    icon: "🏋️‍♀️",
    color: "#00cc00",
  },
  {
    name: "Personal Care",
    icon: "🧴",
    color: "#cc00ff",
  },
  {
    name: "Gifts",
    icon: "🎁",
    color: "#ff0099",
  },
  {
    name: "Other",
    icon: "❓",
    color: "#999999",
  },
];

export default defaultCategories;
