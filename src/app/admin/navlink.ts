// constants/navLinks.ts

export type NavLink = {
  title: string;
  href: string;
  children?: NavLink[];
};

export const NAVLINKS: NavLink[] = [
  {
    title: "Manage Students",
    href: "/admin/manage-students",
  },
  {
    title: "Exam Department",
    href: "/admin/exam-department",
  },
  {
    title: "Fees Department",
    href: "/admin/fees-department",
  },
  {
    title: "Reports",
    href: "/admin/reports",
  },
  {
    title: "Settings",
    href: "/admin/settings",
  },
];
