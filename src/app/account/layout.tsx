import AccountHero from './AccountHero';
import AccountSidebar from './AccountSidebar';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AccountHero />
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-4 py-8 flex flex-col lg:flex-row gap-8 items-start">
        <AccountSidebar />
        <div className="min-w-0 flex-1 w-full">{children}</div>
      </div>
    </div>
  );
}
