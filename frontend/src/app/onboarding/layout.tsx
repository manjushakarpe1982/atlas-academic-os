import { OnboardingProvider } from './_components/OnboardingContext';

export default function OnboardingSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
}
