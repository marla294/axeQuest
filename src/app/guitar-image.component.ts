import { Component, Input, OnInit }	from '@angular/core';
import { Guitar }			from './guitar';

@Component({
	selector: 'guitar-image',
	templateUrl: './guitar-image.component.html',
	styleUrls: ['./guitar-image.component.css'],
})
export class GuitarImageComponent implements OnInit {
	@Input() guitar: Guitar;
	public site: string;
	public crop: boolean = false;

	ngOnInit() {
		this.site = this.guitar.site;
		this.guitarCrop();
	}

	guitarCrop() {
		if (this.site === "Wild West Guitars" || 
			this.site === "Rainbow Guitars" ||
			this.site === "Wildwood Guitars") {
			this.crop = true;
		} else {
			this.crop = false;
		}
	}
}