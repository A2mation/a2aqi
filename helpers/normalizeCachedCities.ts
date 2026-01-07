export function normalizeCachedCities(input: Record<string, any>) {
    return Object.keys(input)
        .filter((key) => key !== "cached")
        .sort((a, b) => Number(a) - Number(b))
        .map((key) => input[key])
}

/*
[
  { "name": "Kolkata", "country": "India", ... },
  { "name": "Howrah", "country": "India", ... },
  { "name": "Bara Bazar", "country": "India", ... },
  { "name": "Salkhia", "country": "India", ... },
  { "name": "Esplanade", "country": "India", ... },
  { "name": "Nārikeldānga", "country": "India", ... }
]

*/
