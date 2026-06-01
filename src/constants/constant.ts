import { Home, SquareDashedMousePointer, Wallet } from "lucide-react";
import { BACKEND_BASE_URL } from "../../env";

export const googleSignIn = () => {
  window.open(`${BACKEND_BASE_URL}/api/auth/google`, "_self");
};

export const MENU_ITEMS = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Net Worth", icon: Wallet, path: "/networth" },
  { name: "Account Management", icon: Wallet, path: "/accountmanagement" },
  { name: "Demo", icon:SquareDashedMousePointer, path: "/demo" },
//   { name: "Budget", icon: PieChart, path: "/budget" },
//   { name: "Settings", icon: Settings, path: "/settings" },
];
