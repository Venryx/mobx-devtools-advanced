/*export type FrontendStore = import("../../frontend/Store").Store;
export type BackendStore = Pick<FrontendStore,
	"inferPaths" | "autoSerializeDepth"
>;*/
/*export type GetBackendStoreData = import("../../frontend/Store").GetBackendStoreData;
export type BackendStore = ReturnType<typeof GetBackendStoreData>;*/
export type BackendStore = import("../../frontend/Store").BackendStore_Source;


/*export class BackendStore {
	inferPaths = 1;
	autoSerializeDepth = 7;
}*/

export const backendStore = {} as BackendStore;
export function UpdateBackendStore(data: Partial<BackendStore>) {
	Object.assign(backendStore, data);
	//console.log("Auto-serialize depth set on manual-backend to:", settings.autoSerializeDepth);
	console.log("Backend store updated with:", data);
}