import Image from 'next/image';

type BrandLogoProps = {
  size?: number;
  className?: string;
};

export default function BrandLogo({ size = 100, className = '' }: BrandLogoProps) {
  return (
    <Image
      src="/images/logo.png"
      alt="Waitee Logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}
