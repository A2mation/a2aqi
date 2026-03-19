export type SubscriptionValidationResult =
    | {
        valid: true;
        source: "cache" | "db";
        data: any;
    }
    | {
        valid: false;
        reason: "revoked" | "not_found" | "expired_or_inactive" | "forbidden";
    };