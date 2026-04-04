import { PollutantMajorCitiesRepository } from "../repo/pollutant.majorcities.repo";

export class PollutantMajorCitiesService {

    private popularCitiesName = [
        "Ahmedabad",
        "Bengaluru",
        "Chennai",
        "Hyderabad",
        "Kolkata",
        "Mumbai",
        "Delhi",
        "Pune",
    ];

    private obj = new PollutantMajorCitiesRepository();

    /**
    * @returns Popular Cities Pollutant Details
    */
    public async majorCitiesPollutantData() {
        return this.obj.majorCitiesPollutantData(this.popularCitiesName);
    }


    /**
     * @returns Popular Cities Name
     */
    public getPopullarCitiesName() {
        return this.popularCitiesName;
    }
}