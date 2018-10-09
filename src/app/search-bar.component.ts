import { Component, EventEmitter, Output, OnInit } 	from '@angular/core';
import { Router, ActivatedRoute, ParamMap }			from '@angular/router';
import { GuitarService }							from './guitar.service';


@Component({
	selector: 'search-bar',
	templateUrl: 'search-bar.component.html',
	styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnInit {
	@Output() searchByChange = new EventEmitter<string>();
	@Output() searchChange = new EventEmitter<string>();
	searchBy: string = 'New Arrivals';
	search: string = '';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private service: GuitarService
	) {}

	ngOnInit() {
		this.searchBy = this.service.searchBy;
	}

	// Hitting enter on the searchbar - keyup event
	onEnter(event: any) {
		if (event.keyCode == 13) { // enter
			this.service.searchTerm = event.target.value;
			this.callSearch();
			this.searchBy = this.service.searchBy;
			this.router.navigate(['/Search']);
		}
	}

	// Clicking the search button to search
	onSearch(term: string) {
		this.service.searchTerm = term;
		this.callSearch();
		this.searchBy = this.service.searchBy;
		this.router.navigate(['/Search']);
	}

	onButtonClick(by: string) {
		this.searchBy = this.service.searchBy = by;
		this.router.navigate(['/Search']);
	}

	callSearch() {
		this.service.callSearch$.next([this.service.searchTerm, this.service.searchBy, this.service.isElectric, this.service.isAcoustic, this.service.isBass, this.service.isLefty, this.service.isRelic, this.service.isUnpriced]);
	}

}