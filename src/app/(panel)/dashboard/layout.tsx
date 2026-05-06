import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "View your financial summary",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}