"use client";

import RoleLoginPage from "@/components/RoleLoginPage";

export default function AstrologerPortalLogin() {
    return (
        <RoleLoginPage
            role="astrologer"
            title="Astrologer Portal"
            description="Secure access for authorized astronomical consultants."
            redirectPath="/astrologer/dashboard"
        />
    );
}
