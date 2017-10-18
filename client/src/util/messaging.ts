export function prepareMessage(operation: ClueLess.Operation, data: any = null): string {
	return JSON.stringify({
		timestamp: Date.now(),
		operation: operation,
		data: data
	})
}