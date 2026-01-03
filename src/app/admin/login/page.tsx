"use client";

import RoleLoginPage from "@/components/RoleLoginPage";

export default function AdminPortalLogin() {
    return (
        <RoleLoginPage
            role="admin"
            title="Command Center"
            description="Restricted access for platform administrators and controllers."
            redirectPath="/admin/dashboard"
        />
    );
}
