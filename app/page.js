import Image from "next/image";

// Move AuthButton to a separate Client Component
import AuthButton from "./components/AuthButton";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <AuthButton />
    </div>
  );
}
