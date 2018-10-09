import { Component, OnInit }		from '@angular/core';
import { trigger, state, style, 
	animate, transition, 
	animateChild }					from '@angular/animations';
import { Observable }				from 'rxjs/Observable';
import { BehaviorSubject }			from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';

import { Guitar }					from './guitar';
import { GuitarService }			from './guitar.service';


@Component({
	selector: 'search',
	templateUrl: 'search.component.html',
	styleUrls: ['./search.component.css'],
	animations: [
		trigger('guitarLoadAnimation', [
			transition('void => *', [
				style({opacity: 0}), animate(300)
			])
		])
	],
})
export class SearchComponent implements OnInit {

	// Observables/BehaviorSubjects
	public guitars$: Observable<Guitar[]>;
	public search$: BehaviorSubject<string[]>;
	public callSearch$: BehaviorSubject<(string | boolean)[]>;
	public searchComplete$: Observable<boolean>;

	// Guitar list to display
	public guitars: Guitar[] = [];
	public allGuitars: Guitar[] = [];

	// Search variables
	public searchBy: string = "New Arrivals";
	public searchTerm: string = '';
	public resultsLabel: string = "New Arrivals";
	public numResults: number = 0;
	
	constructor(
		private service: GuitarService
	) {}

	ngOnInit() {
		// Getting the searchBy and searchTerm from the service
		this.searchBy = this.service.searchBy;
		this.searchTerm = this.service.searchTerm;

		// Get Observables from the guitar service
		this.guitars$ = this.service.guitars;
		this.searchComplete$ = this.service.searchComplete;
		this.search$ = <BehaviorSubject<string[]>>this.service.search$;
		this.callSearch$ = <BehaviorSubject<(string | boolean)[]>>this.service.callSearch$;

		// Calling the search when you first navigate to the page
		this.callSearch();

		// Subscribing to searchComplete to get the resultsLabel when the search is done
		this.searchComplete$
		.subscribe(res => {
			this.resultsLabel = this.service.resultsLabel;
		});

		// Getting the guitars out of the service
		this.guitars$
		.subscribe(guitars => {
			this.allGuitars = guitars;
			this.filterGuitars();
		});
	}


	toggleElectric() {
		this.service.isElectric = !this.service.isElectric;
		if (!this.service.isElectric && !this.service.isAcoustic) {
			this.service.isAcoustic = true;
		}
		this.filterGuitars();
	}

	toggleAcoustic() {
		this.service.isAcoustic = !this.service.isAcoustic;
		if (!this.service.isElectric && !this.service.isAcoustic) {
			this.service.isElectric = true;
		}
		this.filterGuitars();
	}

	toggleBass() {
		this.service.isBass = !this.service.isBass;
		this.filterGuitars();
	}

	toggleLefty() {
		this.service.isLefty = !this.service.isLefty;
		this.filterGuitars();
	}

	toggleRelic() {
		this.service.isRelic = !this.service.isRelic;
		this.filterGuitars();
	}

	toggleUnpriced() {
		this.service.isUnpriced = !this.service.isUnpriced;
		this.filterGuitars();
	}

	getElectric(): boolean {
		return this.service.isElectric;
	}

	getAcoustic(): boolean {
		return this.service.isAcoustic;
	}

	getBass(): boolean {
		return this.service.isBass;
	}

	getLefty(): boolean {
		return this.service.isLefty;
	}

	getRelic(): boolean {
		return this.service.isRelic;
	}

	getUnpriced(): boolean {
		return this.service.isUnpriced;
	}

	callSearch() {
		this.callSearch$.next([this.service.searchTerm, this.service.searchBy]);
	}

	filterGuitars() {
		this.service.setResultsLabel();
		this.resultsLabel = this.service.resultsLabel;
		this.guitars = this.allGuitars.filter(guitar => {
			if ((this.service.isElectric && guitar.electric) || (this.service.isAcoustic && !guitar.electric)) {
				if ((this.service.isRelic || (!this.service.isRelic && !guitar.isRelic)) &&
					(this.service.isLefty || (!this.service.isLefty && !guitar.isLefty)) &&
					(this.service.isBass || (!this.service.isBass && !guitar.isBass)) &&
					(this.service.isUnpriced || (!this.service.isUnpriced && !guitar.unpriced))) {
						return true;
				}
			}
		});
		this.numResults = this.guitars.length;
	}

}