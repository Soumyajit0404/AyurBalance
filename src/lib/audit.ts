
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function logAudit(action: string, userId: string, details?: any) {
	try {
		await addDoc(collection(db, "auditLogs"), {
			action,
			userId,
			details: details || null,
			timestamp: serverTimestamp(),
		});
	} catch (e) {
		// Optionally handle/log error
		// console.error("Audit log failed", e);
	}
}
