import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "SaaS Notes",
  description: "Multi-tenant SaaS Notes App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
