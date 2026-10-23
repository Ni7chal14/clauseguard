import PillNav from "../ui/PillNav";

export default function HRTopBar() {
  return (
    <div className="hidden md:flex justify-between items-center mb-6 border-b border-outline-variant/10 pb-4">
      <div className="flex items-center">
        <PillNav
          logo={null}
          items={[
            { label: 'Employee Dashboard', href: '/' },
            { label: 'HR Compliance Portal', href: '/hr' }
          ]}
          activeHref="/hr"
          baseColor="#15121a"
          pillColor="#1d1a22"
          hoveredPillTextColor="#10b981"
          pillTextColor="#c4c4c4"
          initialLoadAnimation={true}
        />
      </div>
    </div>
  );
}
