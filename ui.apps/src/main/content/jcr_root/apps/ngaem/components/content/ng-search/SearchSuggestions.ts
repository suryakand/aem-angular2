import { Http, Response } from "@angular/http";
import { Subject } from "rxjs/Subject";

import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

export class CustomData extends Subject<CompleterItem[]> implements CompleterData {

    constructor(private http: Http) {
        super();
    }

    public search(term: string): void {
        this.http.get(`/bin/search/suggestions?q=${term}`)
        .map((res: Response) => {
            // Convert the result to CompleterItem[]
            let data = res.json();
            let matches: CompleterItem[];
            if (data && data['mySuggester']) {
                matches = data['mySuggester'].map((episode: any) => this.convertToItem(episode));
                this.next(matches);
            }
        }).subscribe();
    }

    public cancel() {
        // Handle cancel
    }

    public convertToItem(data: any): CompleterItem | null {
        if (!data) {
            return null;
        }
        // data will be string if an initial value is set
        return {
            title: typeof data === "string" ? data : data.nm
        } as CompleterItem;
    }
}