// app/admin/layout.jsx
// Dedicated layout for all /admin/* pages.
// LayoutShell already suppresses Navbar + Footer for /admin routes,
// so this just ensures a clean dark background and correct metadata.

export const metadata = {
  title: "Admin — Nii Kwei Ministries",
  description: "Internal admin dashboard",
  robots: "noindex, nofollow", // never appear in search results
};

export default function AdminLayout({ children }) {
  return <div className="min-h-screen bg-black antialiased">{children}</div>;
}
