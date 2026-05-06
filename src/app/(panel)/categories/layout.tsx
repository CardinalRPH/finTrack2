import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Categories",
    description: "Manage your financial categories and icons.",
};

export default function CategoriesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}