import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.98-4.66 1.98-3.56 0-6.21-2.82-6.21-6.38s2.65-6.38 6.21-6.38c1.8 0 3.06.67 4.13 1.69l2.52-2.49C18.05 3.3 15.49 2 12.48 2c-5.45 0-9.84 4.38-9.84 9.8s4.39 9.8 9.84 9.8c2.93 0 5.25-1.01 7.03-2.79 1.83-1.83 2.52-4.35 2.52-6.81 0-.58-.05-1.14-.14-1.68h-9.5z"
    />
  </svg>
);

export function GoogleSignInButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <Button variant="outline" className={cn('w-full', className)}>
      <GoogleIcon className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
}
