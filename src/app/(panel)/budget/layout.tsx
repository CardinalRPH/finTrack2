import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Budget",
    description: "Manage your financial budget and feature",
};

export default function BudgetLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}