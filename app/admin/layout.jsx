// app/admin/layout.jsx
// force-dynamic prevents Next.js from trying to statically prerender any admin page.
// Admin pages always need cookies + live data — static prerender would fail.

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — Nii Kwei Ministries",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }) {
  return <div className="min-h-screen bg-gray-50 antialiased">{children}</div>;
}
