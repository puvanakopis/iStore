"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RouteGate({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) return;
        if (!user) return;

        const isAdminRoute = pathname.startsWith("/admin");

        if (user.role === "admin" && !isAdminRoute) {
            router.replace("/admin");
        }

        if (user.role !== "admin" && isAdminRoute) {
            router.replace("/");
        }
    }, [user, loading, pathname, router]);

    return <>{children}</>;
}