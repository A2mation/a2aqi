"use client";

import { http } from "@/lib/http";
import { useEffect } from "react";

export default function VisitCounter() {
    useEffect(() => {
        http.post("/api/visit");
    }, []);
    return null;
}
