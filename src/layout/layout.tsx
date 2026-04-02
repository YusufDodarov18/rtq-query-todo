"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, Toolbar, Button } from "@mui/material";
import QueryProvider from "../providers/layout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "C-a-thunkTodo", path: "/cattodo" },
    { label: "C-a-thunkCategories", path: "/catcategories" },
  ];

  return (
    <html lang="en">
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              href={item.path}
              sx={{
                color: "white",
                fontSize: "18px",
                fontWeight: pathname === item.path ? "bold" : "normal",
                borderBottom:
                  pathname === item.path ? "2px solid white" : "none",
                textTransform: "none",
              }}
            >
              {item.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
      <QueryProvider>
        <body>{children}</body>
      </QueryProvider>
    </html>
  );
}
