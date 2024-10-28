import { useEffect, useState } from "react"
import Image from "next/image";
export default function ThemeSwitch() {
	 const [toggleTheme, setToggleTheme] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("toggleTheme") || "light";
      setToggleTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("toggleTheme", toggleTheme);
      document.documentElement.setAttribute("data-bs-theme", toggleTheme);
    }
  }, [toggleTheme]);

  const handleToggleTheme = () => {
    setToggleTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

	return (
		<a className="btn btn-mode change-mode mr-15" onClick={handleToggleTheme}>
			{toggleTheme === "light" ? (
				<Image width={25} height={25} className="light-mode" src="/assets/imgs/template/icons/light.svg" alt="Light Mode" />
			) : (
				<Image width={25} height={25} className="dark-mode" src="/assets/imgs/template/icons/light-w.svg" alt="Dark Mode" />
			)}
		</a>
	)
}