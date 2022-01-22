export function equal<T>(a: T, b: T) {
	// TODO
	return JSON.stringify(a) == JSON.stringify(b)
} 

export function JsonParse<T>(jsonString: string): T {
	// TODO
	return JSON.parse(jsonString);
}