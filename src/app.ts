import './style.css';
import { hexToRgb } from './utils';

const DEFAULT_BRUSH_SIZE: number = 10;
const DEFAULT_COLOR: string = '#000';
const DEFAULT_BGCOLOR: string = '#f6f6f6';

enum DrawingTool {
	Brush = 'brush',
	Eraser = 'eraser',
}

class App {
	private brushSize: number = DEFAULT_BRUSH_SIZE;
	private currentColor: string = DEFAULT_COLOR;
	private bgColor: string = DEFAULT_BGCOLOR;
	private _toolbar: HTMLDivElement;
	private _canvas: HTMLCanvasElement;
	private _brushBtn: HTMLButtonElement;
	private _eraserBtn: HTMLButtonElement;
	private _brushSizeSlider: HTMLInputElement;
	private _brushSizeControl: HTMLInputElement;
	private _colorPicker: HTMLInputElement;
	private _ctx: CanvasRenderingContext2D | null;
	private _shouldDraw: boolean = false;
	private _tool: DrawingTool = DrawingTool.Brush;
	private _tempBrushSize: number | null = null;
	private _tempColor: string | null = null;

	constructor() {
		this._toolbar = this._getElement<HTMLDivElement>('.toolbar');
		this._canvas = this._getElement<HTMLCanvasElement>('#canvas');
		this._brushBtn = this._getElement<HTMLButtonElement>('#brush');
		this._eraserBtn = this._getElement<HTMLButtonElement>('#eraser');
		this._brushSizeSlider =
			this._getElement<HTMLInputElement>('#brush-size-slider');
		this._brushSizeControl = this._getElement<HTMLInputElement>(
			'#brush-size-control'
		);
		this._colorPicker = this._getElement<HTMLInputElement>('#color-picker');
		this._ctx = this._getContext();

		this._setupCanvas();
		this._syncBrushSizeToView();
		this._initLocalListeners();
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

	private _handleBrushSize = (e: Event): void => {
		const target = <HTMLInputElement>e.target;
		if (target === this._brushSizeSlider) {
			this.brushSize = +this._brushSizeSlider.value;
		}
		if (target === this._brushSizeControl) {
			this.brushSize = +this._brushSizeControl.value;
		}

		this._syncBrushSizeToView();
	};

	private _handleColorChange = (): void => {
		const wrapper = this._colorPicker.parentElement!;
		const rgb = hexToRgb(this._colorPicker.value);
		const rgba = `rgba(${Object.values(rgb)}, 0.4)`;

		this.currentColor = this._colorPicker.value;
		wrapper.style.cssText = `--color: ${rgba}`;
	};

	private _handleDrag = (e: MouseEvent): void => {
		if (!this._ctx || !this._shouldDraw) return;
		const { x, y } = this._getCurrentPosition(e);

		this._ctx.lineTo(x, y);
		this._ctx.stroke();
	};

	private _handlePress = (e: MouseEvent): void => {
		if (!this._ctx) return;
		const { x, y } = this._getCurrentPosition(e);
		this._shouldDraw = true;

		this._ctx.strokeStyle = this.currentColor;
		this._ctx.lineWidth = this.brushSize;
		this._ctx.beginPath();
		this._ctx.moveTo(x, y);
	};

	private _handleRelease = (): void => {
		this._shouldDraw = false;
	};

	private _handleToolChange = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		const btn = target?.closest('button');
		const eraserScaleFactor: number =
			this.brushSize > 50 ? 1.5 : this.brushSize > 20 ? 2 : 3;

		if (!btn) return;
		if (btn.id === DrawingTool.Brush) {
			this.currentColor = this._tempColor || DEFAULT_COLOR;
			this.brushSize = this._tempBrushSize || DEFAULT_BRUSH_SIZE;
			this._tool = DrawingTool.Brush;
			this._syncBrushSizeToView();
		}
		if (btn.id === DrawingTool.Eraser) {
			this._tempColor = this.currentColor;
			this.currentColor = this.bgColor;
			this._tempBrushSize = this.brushSize;
			this.brushSize *= eraserScaleFactor;
			this._tool = DrawingTool.Eraser;
		}
		// if (btn.id === DrawingTool.Clear && this._ctx) {
		// 	this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		// }

		this._brushBtn.classList.toggle(
			'active',
			this._tool === DrawingTool.Brush
		);
		this._eraserBtn.classList.toggle(
			'active',
			this._tool === DrawingTool.Eraser
		);
	};

	private _setupCanvas(): void {
		this._canvas.height =
			window.innerHeight - this._toolbar.getBoundingClientRect().height;
		this._canvas.width = window.innerWidth;
		// setup context
		if (!this._ctx) return;
		this._ctx.lineCap = 'round';
		this._ctx.lineJoin = 'round';
	}

	private _syncBrushSizeToView() {
		this._brushSizeControl.value = this.brushSize.toString();
		this._brushSizeSlider.value = this.brushSize.toString();
	}

	private _initLocalListeners(): void {
		this._toolbar.addEventListener('click', this._handleToolChange);
		this._brushSizeSlider.addEventListener('change', this._handleBrushSize);
		this._brushSizeControl.addEventListener(
			'change',
			this._handleBrushSize
		);
		this._colorPicker.addEventListener('input', this._handleColorChange);
		this._canvas.addEventListener('mousedown', this._handlePress);
		this._canvas.addEventListener('mousemove', this._handleDrag);
		this._canvas.addEventListener('mouseup', this._handleRelease);
	}
}

window.addEventListener('DOMContentLoaded', () => {
	new App();
});
