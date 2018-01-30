import {Injectable} from "@angular/core";
import { Http, Response }   from '@angular/http';

@Injectable()
export class LocationService {

    constructor(private http: Http) {

    }

    searchLocation(queryString: String) {
        let ci = this;
        console.log(`LocationService invoked for: ${queryString}`);
        return ci.http.get(`http://freegeoip.net/json/${queryString}`);
    }

}