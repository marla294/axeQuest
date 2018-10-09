export class Guitar {
	priceStr: string = '';
	electric: boolean = false;
	unpriced: boolean = false;

	constructor(
		public dateListed: string,
		public isAcoustic: boolean,
		public isBass: boolean,
		public isLefty: boolean,
		public isRelic: boolean,
		public image: string,
		public link: string,
		public name: string,
		public make: string,
		public model: string,
		public price: number,
		public site: string
	) {
		this.priceStr = this.price === 0 ? '' : `$${price}`;
		this.electric = isAcoustic === false ? true : false;
		this.unpriced = this.price === 0 ? true : false;
	}

	
}