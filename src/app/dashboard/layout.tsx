// src/app/dashboard/layout.tsx

// This layout file is intentionally simple to wrap the dashboard page.
// The main dashboard logic is in @/components/shopiggo/Dashboard.tsx to allow for suspense boundaries.
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
