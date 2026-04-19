// src/components/IconRenderer.tsx
import * as HiIcons from "react-icons/hi2"; // Heroicons 2
import * as GiIcons from "react-icons/gi";  // Game Icons (Good for Gold/Investment)
import { IconType } from "react-icons";

interface IconRendererProps {
    iconName: string;
    className?: string;
}

export const IconRenderer = ({ iconName, className }: IconRendererProps) => {
    // Combine all icon libraries you want to support
    const allIcons: Record<string, IconType> = { ...HiIcons, ...GiIcons };

    const IconComponent = allIcons[iconName];

    if (!IconComponent) {
        // Fallback icon if the name doesn't match
        return <HiIcons.HiOutlineQuestionMarkCircle className={className} />;
    }

    return <IconComponent className={className} />;
};