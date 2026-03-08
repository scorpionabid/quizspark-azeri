/**
 * usePermissionAuditLog
 * localStorage-əsaslı mini audit log — son 50 icazə dəyişikliyini saxlayır.
 */
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "quizspark_permission_audit_log";
const MAX_ENTRIES = 50;

export type AuditAction = "granted" | "revoked";

export interface AuditLogEntry {
    id: string;
    timestamp: string; // ISO string
    role: string;
    permissionName: string;
    permissionId: string;
    action: AuditAction;
}

function loadLog(): AuditLogEntry[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as AuditLogEntry[]) : [];
    } catch {
        return [];
    }
}

function saveLog(entries: AuditLogEntry[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
    } catch {
        // localStorage dolduqda sessizce keç
    }
}

export function usePermissionAuditLog() {
    const [log, setLog] = useState<AuditLogEntry[]>(() => loadLog());

    // Browser tabları arası sinxronizasiya
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                setLog(loadLog());
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const addEntry = useCallback(
        (entry: Omit<AuditLogEntry, "id" | "timestamp">) => {
            const newEntry: AuditLogEntry = {
                ...entry,
                id: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
            };
            setLog((prev) => {
                const updated = [newEntry, ...prev].slice(0, MAX_ENTRIES);
                saveLog(updated);
                return updated;
            });
        },
        []
    );

    const clearLog = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setLog([]);
    }, []);

    return { log, addEntry, clearLog };
}
