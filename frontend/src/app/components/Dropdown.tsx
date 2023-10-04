interface DropdownProps {
  children: React.ReactNode;
  heading: string;
}

const Dropdown = ({ children, heading }: DropdownProps) => {
  return (
    <div
      tabIndex={0}
      className="collapse collapse-arrow border-none rounded-md bg-stone-800 "
    >
      <div className="collapse-title text-base text-neutral-200 text-center font-semibold" style={{paddingLeft: "3em"}}>{heading}</div>
      <div className="collapse-content">{children}</div>
    </div>
  );
};

export default Dropdown;
