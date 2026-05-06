
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Statistics",
    description: "View your income and expenses track by time, wallet, and category ",
};

export default function StatisticLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}