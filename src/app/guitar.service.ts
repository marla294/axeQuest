import { Injectable }				from '@angular/core';
import { HttpClient, HttpHeaders }	from '@angular/common/http';
import { BehaviorSubject }			from 'rxjs/BehaviorSubject';
import { Guitar }					from './guitar';
import { SearchBarComponent }	from './search-bar.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

// HTTP Header Stuff
const headerDict = {
	'Access-Control-Allow-Origin' : '*',
	'Content-Type' : 'application/json'
}
const httpOptions = {
	headers: new HttpHeaders(headerDict)
}

// JSON response data shape
class GuitarJSON {
	constructor(
		public DateListed: string,
		public Image: string,
		public IsAcoustic: boolean,
		public IsBass: boolean,
		public IsLefty: boolean,
		public IsRelic: boolean,
		public Link: string,
		public Name: string,
		public Make: string,
		public Model: string,
		public Price: number,
		public Site: string
	) {}
}

@Injectable()
export class GuitarService {

	// Guitars
	private _guitars: BehaviorSubject<Guitar[]> = new BehaviorSubject([]);
	private dataStore: { guitars: Guitar[] } = { guitars: [] };

	// Searchbar storage
	public searchBy: string = 'New Arrivals';
	public searchTerm: string = '';

	// Guitar Search Attributes
	private _isElectric: boolean = true;
	private _isAcoustic: boolean = false;
	private _isBass: boolean = false;
	private _isLefty: boolean = false;
	private _isRelic: boolean = false;
	private _isUnpriced: boolean = true;

	// Searching
	search$: BehaviorSubject<string[]>;
	callSearch$: BehaviorSubject<(string | boolean)[]>;
	private _searchComplete: BehaviorSubject<boolean> = new BehaviorSubject(true);
	private _optionsLabel: string = 'Results for ';
	private _resultsLabel: string = 'New Arrivals';
	
	// URL to load from
	private _url: string = `https://www.axequest.com/guitar-search/api/`;

	constructor(private http: HttpClient) {
		// Constructing the options label that will go in front of the search results label
		this.setOptionsLabel();

		// Search behavior subject that the whole thing will work on.  Array is [term, search], search = new arrivals or inventory
		this.search$ = <BehaviorSubject<string[]>>new BehaviorSubject(['', 'New Arrivals']);

		// switchMap will switch between the different loads, and stop a load if a new one comes in
		// res = [term, searchBy]
		this.search$
		.switchMap(res => {
			let scrubbedSearch = this.cleanSearch(<string>res[0]);
			this.setOptionsLabel();
			// If scrubbed search is not empty
			if (scrubbedSearch !== null) {
				this.searchTerm = scrubbedSearch;
				if (res[1] === "New Arrivals") {
					this.searchBy = 'New Arrivals';
					this.setResultsLabel();
					return this.http.get<GuitarJSON[]>(`${this._url}NewArrivals?search=${scrubbedSearch}`, httpOptions);
				} else if (res[1] === "Inventory") {
					this.searchBy = 'Inventory';
					this.setResultsLabel();
					return this.http.get<GuitarJSON[]>(`${this._url}Inventory?search=${scrubbedSearch}`, httpOptions);
				}
			} else {
				this.searchTerm = '';
				this.searchBy = 'New Arrivals';
				this._resultsLabel = `New Arrivals: ${this._optionsLabel}`;
				return this.http.get<GuitarJSON[]>(`${this._url}NewArrivals`, httpOptions);
			}
		})
		.subscribe(res => {
			// Storing the data locally
			this.dataStore.guitars = res
			.map(guitar => new Guitar(guitar.DateListed, guitar.IsAcoustic, guitar.IsBass, guitar.IsLefty, guitar.IsRelic, guitar.Image, guitar.Link, guitar.Name, guitar.Make, guitar.Model, guitar.Price, guitar.Site));

			// Updating the behavior subject
			this._guitars.next(Object.assign({}, this.dataStore).guitars);

			// Tell everybody we are done loading stuff
			this.loadSearchComplete(true);
		});

		// Observable for calling the search
		this.callSearch$ = new BehaviorSubject([this.searchTerm, this.searchBy]);

		// Subscribing to callSearch to call the service searching observable, and does the throttling and distinctUntilChanged
		this.callSearch$
		.throttleTime(400)
		.distinctUntilChanged((x: string[], y: string[]) => {
			let nope = x[0] === y[0] && x[1] === y[1] ? true : false;
			return nope;
		})
		.subscribe(res => {
			this.loadSearchComplete(false);
			this.search$.next(<string[]>[res[0], res[1]]);
		});

	}

	get guitars() {
		return this._guitars;
	}

	get searchComplete() {
		return this._searchComplete.asObservable();
	}

	get resultsLabel() {
		return this._resultsLabel;
	}

	get isElectric() {
		return this._isElectric;
	}

	get isAcoustic() {
		return this._isAcoustic;
	}

	get isBass() {
		return this._isBass;
	}

	get isLefty() {
		return this._isLefty;
	}

	get isRelic() {
		return this._isRelic;
	}

	get isUnpriced() {
		return this._isUnpriced;
	}

	set isElectric(o: boolean) {
		this._isElectric = o;
	}

	set isAcoustic(o: boolean) {
		this._isAcoustic = o;
	}

	set isBass(o: boolean) {
		this._isBass = o;
	}

	set isLefty(o: boolean) {
		this._isLefty = o;
	}

	set isRelic(o: boolean) {
		this._isRelic = o;
	}

	set isUnpriced(o: boolean) {
		this._isUnpriced = o;
	}

	loadSearchComplete(complete: boolean) {
		this._searchComplete.next(complete);
	}

	// Set the options label that will prepend the results label
	setOptionsLabel() {
		this._optionsLabel = `${this._isElectric ? (this._isAcoustic ? 'Electric and ' : 'Electric') : ''}${this._isAcoustic ? 'Acoustic' : ''}`;
	}

	setResultsLabel() {
		this.setOptionsLabel();
		if (this.searchTerm === '' || this.searchTerm === null) {
			this._resultsLabel = `New Arrivals: ${this._optionsLabel}`;
		} else {
			this._resultsLabel = `Results for "${this.searchTerm}" in ${this.searchBy}: ${this._optionsLabel}`;
		}
	}

	// This will clean up the search term for all HTTP requests to make sure it is safe.  Only terms with numbers, letters, and spaces will be allowed
	cleanSearch(term: string): string {
		// Replace only whitespace with empty string
		let clean = term.replace(/[\s]+$/g, ""); 

		// Replace non-alphanumeric or whitespace with empty string
		clean = clean.replace(/[^0-9A-Za-z-/\s]+/g,""); 

		// Limit search to 50 characters
		clean = clean.substring(0, 50); 

		// If the search is totally empty, return null so we know to search new arrivals
		if (clean === "") {
			clean = null;
		}

		return clean;
	}

}
