"use client";

import { useAuth } from "@/contexts/AuthContext";
import AdminNavbar from "@/components/admin/AdminNavbar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RoleLayoutGate({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();

    if (loading) return null;

    const isAdmin = user?.role === "admin";

    if (isAdmin) {
        return (
            <>
                <AdminNavbar />
                {children}
            </>
        );
    }

    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}