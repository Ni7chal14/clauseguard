export default function WelcomeHeader({ user }) {
  return (
    <section className="flex flex-col md:flex-row md:items-center justify-between gap-stack-md reflective-card glass-panel rounded-2xl p-6 border-l-4 border-primary">
      <div>
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-2">
          Welcome {user.name}!
        </h1>
        <p className="text-on-surface-variant text-body-md font-body-md max-w-2xl">
          {user.role} • Your governance and compliance status is currently{" "}
          <span className="text-primary font-semibold">{user.status}</span>.
        </p>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col items-center bg-background/50 p-3 rounded-lg border border-primary/20 min-w-[92px]">
          <span className="text-headline-md text-primary font-bold">{user.leaveBalance}</span>
          <span className="text-label-sm text-on-surface-variant">Leave Balance</span>
        </div>
        <div className="flex flex-col items-center bg-background/50 p-3 rounded-lg border border-primary/20 min-w-[92px]">
          <span className="text-headline-md text-primary font-bold">{user.expenseStatus}</span>
          <span className="text-label-sm text-on-surface-variant">Expense Status</span>
        </div>
      </div>
    </section>
  );
}
