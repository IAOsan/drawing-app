import './style.css';

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
	private _brushBtn: HTMLButtonElement;
	private _eraserBtn: HTMLButtonElement;
	private _canvas: HTMLCanvasElement;
	private _ctx: CanvasRenderingContext2D | null;
	private _shouldDraw: boolean = false;
	private _tool: DrawingTool = DrawingTool.Brush;

	constructor() {
		this._toolbar = this._getElement<HTMLDivElement>('.toolbar');
		this._canvas = this._getElement<HTMLCanvasElement>('#canvas');
		this._brushBtn = this._getElement<HTMLButtonElement>('#brush');
		this._eraserBtn = this._getElement<HTMLButtonElement>('#eraser');
		this._ctx = this._getContext();

		this._setupCanvas();
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

	private _handleToolChange = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		const btn = target?.closest('button');

		if (!btn) return;
		if (btn.id === DrawingTool.Brush) {
			this.currentColor = DEFAULT_COLOR;
			this.brushSize = DEFAULT_BRUSH_SIZE;
			this._tool = DrawingTool.Brush;
		}
		if (btn.id === DrawingTool.Eraser) {
			this.currentColor = this.bgColor;
			this.brushSize = this.brushSize * 3;
			this._tool = DrawingTool.Eraser;
		}

		this._brushBtn.classList.toggle(
			'active',
			this._tool === DrawingTool.Brush
		);
		this._eraserBtn.classList.toggle(
			'active',
			this._tool === DrawingTool.Eraser
		);
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

	private _handleDrag = (e: MouseEvent): void => {
		if (!this._ctx || !this._shouldDraw) return;
		const { x, y } = this._getCurrentPosition(e);

		this._ctx.lineTo(x, y);
		this._ctx.stroke();
	};

	private _handleRelease = (): void => {
		this._shouldDraw = false;
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

	private _initLocalListeners(): void {
		this._toolbar.addEventListener('click', this._handleToolChange);
		this._canvas.addEventListener('mousedown', this._handlePress);
		this._canvas.addEventListener('mousemove', this._handleDrag);
		this._canvas.addEventListener('mouseup', this._handleRelease);
	}
}

window.addEventListener('DOMContentLoaded', () => {
	new App();
});
