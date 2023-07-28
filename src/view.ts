import { hexToRgb } from './utils';

export interface Coordinates {
	x: number;
	y: number;
}

interface DrawingOptions {
	coords: Coordinates;
	brushColor: string;
	brushSize: number;
}

export class View {
	private _canvas: HTMLCanvasElement;
	private _ctx: CanvasRenderingContext2D | null;
	private _toolbar: HTMLDivElement;
	private _brushColorPicker: HTMLInputElement;
	private _brushSizeControl: HTMLInputElement;
	private _brushSizeLabel: HTMLSpanElement;
	private _bucketColorPicker: HTMLInputElement;

	constructor() {
		this._canvas = this._getElement<HTMLCanvasElement>('#canvas');
		this._toolbar = this._getElement<HTMLDivElement>('.toolbar');
		this._brushColorPicker = this._getElement<HTMLInputElement>(
			'#brush-color-picker'
		);
		const rangeContainer = this._getElement<HTMLDivElement>('.range');
		this._brushSizeControl = <HTMLInputElement>(
			rangeContainer.firstElementChild!
		);
		this._brushSizeLabel = <HTMLSpanElement>(
			rangeContainer.lastElementChild!
		);
		this._bucketColorPicker = this._getElement<HTMLInputElement>(
			'#bucket-color-picker'
		);
		this._ctx = this._getContext();

		this._setupCanvas();
	}

	private _formatBrushSizeToView(value: number): string {
		return value < 10 ? `0${value}` : value.toString();
	}

	private _getElement<T extends HTMLElement>(selector: string): T {
		return <T>document.querySelector(selector);
	}

	private _getContext(): CanvasRenderingContext2D | null {
		if (this._canvas && this._canvas.getContext !== undefined) {
			const ctx = <CanvasRenderingContext2D>this._canvas.getContext('2d');
			return ctx || null;
		}
		return null;
	}

	private _getCurrentPosition(e: MouseEvent): { x: number; y: number } {
		const { left, top } = this._canvas.getBoundingClientRect();
		return {
			x: e.clientX - left,
			y: e.clientY - top,
		};
	}

	private _setupCanvas(): void {
		this._canvas.height =
			window.innerHeight - this._toolbar.getBoundingClientRect().height;
		this._canvas.width = window.innerWidth;
		// setup context
		if (!this._ctx) return;
		this._ctx.lineCap = 'round';
		this._ctx.lineJoin = 'round';
	}

	private _updateColorPickerToView(element: HTMLInputElement): void {
		const wrapper = element.parentElement!;
		const rgb = hexToRgb(element.value);
		const rgba = `rgba(${Object.values(rgb)}, 0.4)`;

		wrapper.style.cssText = `--color: ${rgba}`;
	}

	public bindChangeBrushColor(handler: (c: string) => void): void {
		this._brushColorPicker.addEventListener('input', (): void => {
			handler(this._brushColorPicker.value);
			this._updateColorPickerToView(this._brushColorPicker);
		});
	}

	public bindChangeBrushSize(handler: (s: number) => void): void {
		this._brushSizeControl.addEventListener('input', (): void => {
			handler(+this._brushSizeControl.value);
			this.updateBrushSizeToView(+this._brushSizeControl.value);
		});
	}

	public bindChangeBackgroundColor(handler: (c: string) => void): void {
		this._bucketColorPicker.addEventListener('input', (): void => {
			handler(this._bucketColorPicker.value);
			this._updateColorPickerToView(this._bucketColorPicker);
		});
	}

	public bindToolChange(handler: (id: string) => void): void {
		this._toolbar.addEventListener('click', (e: MouseEvent): void => {
			const currentTarget = <HTMLDivElement>e.currentTarget;
			const target = <HTMLElement>e.target;
			const allBtns: HTMLButtonElement[] = [
				...currentTarget.querySelectorAll('button'),
			];
			const targetBtn = <HTMLButtonElement>target?.closest('button');

			if (!targetBtn) return;
			handler(targetBtn.id);
			allBtns.forEach((b) => b.classList.remove('active'));
			targetBtn.classList.add('active');
		});
	}

	public bindMousePress(handler: (c: Coordinates) => void): void {
		this._canvas.addEventListener('mousedown', (e: MouseEvent): void => {
			const coords = this._getCurrentPosition(e);
			handler(coords);
		});
	}

	public bindMouseDrag(handler: (c: Coordinates) => void): void {
		this._canvas.addEventListener('mousemove', (e: MouseEvent) => {
			const coords = this._getCurrentPosition(e);
			handler(coords);
		});
	}

	public bindMouseRelease(handler: () => void): void {
		this._canvas.addEventListener('mouseup', () => {
			handler();
		});
	}

	public clearCanvas(): void {
		if (this._ctx) {
			this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		}
	}

	public changeCanvasColor(color: string): void {
		this._canvas.style.backgroundColor = color;
	}

	public drawing(coords: Coordinates): void {
		if (this._ctx) {
			this._ctx.lineTo(coords.x, coords.y);
			this._ctx.stroke();
		}
	}

	public startDrawing(opts: DrawingOptions): void {
		if (this._ctx) {
			this._ctx.strokeStyle = opts.brushColor;
			this._ctx.lineWidth = opts.brushSize;
			this._ctx.beginPath();
			this._ctx.moveTo(opts.coords.x, opts.coords.y);
		}
	}

	public updateBrushSizeToView(value: number): void {
		this._brushSizeControl.value = value.toString();
		this._brushSizeLabel.textContent = this._formatBrushSizeToView(value);
	}
}
