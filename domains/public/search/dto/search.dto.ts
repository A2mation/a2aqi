export type SearchBy = 'state' | 'city' | 'street';


export type SearchResult = {
    id: string
    name: string
    country: string
    state?: string
    street?: string
    city?: string
    aqi: number
}