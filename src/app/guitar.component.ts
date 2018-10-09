import { Component, Input }	from '@angular/core';
import { Guitar }		from './guitar';

@Component({
	selector: 'guitar',
	templateUrl: './guitar.component.html',
	styleUrls: ['./guitar.component.css'],
})
export class GuitarComponent {
	@Input() guitar: Guitar;


}