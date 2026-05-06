import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Records",
    description: "Add your purchase and income records here",
};

export default function RecordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}