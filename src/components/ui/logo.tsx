import PassChainLogo from "/PassChainLogo.png";

function Logo({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={className} {...props}>
      <img src={PassChainLogo} alt="Logo" className="w-30 h-30" />
    </div>
  );
}

export { Logo };
