export default function paramsEncoder(params: Record<string, any> | object): string {
    return new URLSearchParams(params as Record<string, string>).toString()
}
