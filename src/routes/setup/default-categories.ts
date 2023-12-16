import { type Category } from "@/model/schema";

const defaultCategories: Category[] = [
  {
    name: "Food",
    icon: "🍔",
    color: "#ff9900",
    type: "Expense",
  },
  {
    name: "Transportation",
    icon: "🚗",
    color: "#0099ff",
    type: "Expense",
  },
  {
    name: "Housing",
    icon: "🏠",
    color: "#ff6600",
    type: "Expense",
  },
  {
    name: "Entertainment",
    icon: "🎬",
    color: "#ffcc00",
    type: "Expense",
  },
  {
    name: "Bills",
    icon: "🧾",
    color: "#009933",
    type: "Expense",
  },
  {
    name: "Shopping",
    icon: "🛍️",
    color: "#9900ff",
    type: "Expense",
  },
  {
    name: "Health & Fitness",
    icon: "🏋️‍♀️",
    color: "#00cc00",
    type: "Expense",
  },
  {
    name: "Personal Care",
    icon: "🧴",
    color: "#cc00ff",
    type: "Expense",
  },
  {
    name: "Gifts",
    icon: "🎁",
    color: "#ff0099",
    type: "Expense",
  },
  {
    name: "Other",
    icon: "❓",
    color: "#999999",
    type: "Expense",
  },
  {
    name: "Salary",
    color: "#2ecc71",
    icon: "💰",
    type: "Income",
  },
  {
    name: "Investments",
    color: "#9b59b6",
    icon: "📈",
    type: "Income",
  },
  // TODO: add these later, requires schema change
  // {
  //   name: "Gifts",
  //   color: "#e74c3c",
  //   icon: "🎁",
  //   type: "Income",
  // },
  // {
  //   name: "Other",
  //   color: "#3498db",
  //   icon: "❓",
  //   type: "Income",
  // },
];

export default defaultCategories;
