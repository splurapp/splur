import { type Category } from "@/model/schema";

const defaultCategories: Category[] = [
  {
    name: "Food",
    icon: "🍔",
    color: "#ff9900",
    types: ["Expense"],
  },
  {
    name: "Transportation",
    icon: "🚗",
    color: "#0099ff",
    types: ["Expense"],
  },
  {
    name: "Housing",
    icon: "🏠",
    color: "#ff6600",
    types: ["Expense"],
  },
  {
    name: "Entertainment",
    icon: "🎬",
    color: "#ffcc00",
    types: ["Expense"],
  },
  {
    name: "Bills",
    icon: "🧾",
    color: "#009933",
    types: ["Expense"],
  },
  {
    name: "Shopping",
    icon: "🛍️",
    color: "#9900ff",
    types: ["Expense"],
  },
  {
    name: "Health & Fitness",
    icon: "🏋️‍♀️",
    color: "#00cc00",
    types: ["Expense"],
  },
  {
    name: "Personal Care",
    icon: "🧴",
    color: "#cc00ff",
    types: ["Expense"],
  },
  {
    name: "Gifts",
    icon: "🎁",
    color: "#ff0099",
    types: ["Expense", "Income"],
  },
  {
    name: "Other",
    icon: "❓",
    color: "#999999",
    types: ["Expense", "Income"],
  },
  {
    name: "Salary",
    color: "#2ecc71",
    icon: "💰",
    types: ["Income"],
  },
  {
    name: "Investments",
    color: "#9b59b6",
    icon: "📈",
    types: ["Income"],
  },
];

export default defaultCategories;
