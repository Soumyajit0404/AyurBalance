import { dbAdmin } from "./firebase";
import { FieldValue } from "firebase-admin/firestore";

export async function logAudit(action: string, userId: string, details?: unknown) {
	if (!dbAdmin) return;
	try {
		await dbAdmin.collection("auditLogs").add({
			action,
			userId,
			details: details ?? null,
			timestamp: FieldValue.serverTimestamp(),
		});
	} catch (e) {
		// Optionally handle/log error
		// console.error("Audit log failed", e);
	}
}
