import { cn } from "@/lib/utils";

interface PartnerAvatarProps {
  imageUrl?: string | null;
  businessName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses: Record<NonNullable<PartnerAvatarProps["size"]>, string> = {
  sm: "w-10 h-10 text-sm",
  md: "w-16 h-16 text-xl",
  lg: "w-24 h-24 text-3xl",
};

export function PartnerAvatar({
  imageUrl,
  businessName,
  size = "md",
  className,
}: Readonly<PartnerAvatarProps>) {
  const sizeCls = sizeClasses[size];
  const initial = businessName.charAt(0).toUpperCase();

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={businessName}
        className={cn(sizeCls, "rounded-full object-cover shrink-0", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        sizeCls,
        "rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0",
        className
      )}
      aria-label={businessName}
    >
      {initial}
    </div>
  );
}
