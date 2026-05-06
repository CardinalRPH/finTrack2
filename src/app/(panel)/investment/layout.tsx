import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Investment",
    description: "Track your Investment easyly",
};

export default function InvestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}