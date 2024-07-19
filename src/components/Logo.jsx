import LogoCm from "../assets/LogoCm.svg";

export default function Logo({ size }) {
  const height = size === "sm" ? "h-6" : "h-8";
  const fontSize = size === "sm" ? "text-xl" : "text-2xl";
  return (
    <div className="flex items-center justify-center gap-2">
      <img className={height} src={LogoCm} alt="logo" />
      <h2
        className={`${fontSize} font-semibold tracking-widest mb-0.5 text-primary`}
      >
        CopyMax
      </h2>
    </div>
  );
}
