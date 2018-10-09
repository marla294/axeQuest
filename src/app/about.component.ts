import { Component, OnInit }				from '@angular/core';
import { HttpClient, HttpHeaders }	from '@angular/common/http';
import { BehaviorSubject }			from 'rxjs/BehaviorSubject';

// HTTP Header Stuff
const headerDict = {
	'Access-Control-Allow-Origin' : '*',
	'Content-Type' : 'application/json'
}
const httpOptions = {
	headers: new HttpHeaders(headerDict)
}

// JSON response data shape
class SiteInfo {
	constructor(
		public Name: string,
		public BaseURL: string,
		public LogoURL: string
	) {}
}

@Component({
	selector: 'about',
	templateUrl: 'about.component.html',
	styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {

	sites$: BehaviorSubject<SiteInfo[]> = new BehaviorSubject([]);
	private _url: string = `https://www.axequest.com/guitar-search/api/Sites`;

	constructor(private http: HttpClient) {}

	ngOnInit() {
		this.http.get<SiteInfo[]>(`${this._url}`, httpOptions).subscribe(res => {
			this.sites$.next(res);
		});
	}

}