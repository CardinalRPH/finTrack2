import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Wallet",
    description: "Track your expenses and income based on your wallet ",
};

export default function WalletLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}