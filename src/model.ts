export enum DrawingTool {
	Brush = 'brush',
	Eraser = 'eraser',
	Bucket = 'bucket',
	Cleaner = 'cleaner',
}

interface State {
	brushSize: number;
	brushColor: string;
	bgColor: string;
	shouldDraw: boolean;
	drawingTool: DrawingTool;
}

export const DEFAULT_BRUSH_COLOR: string = '#000';
export const DEFAULT_BRUSH_SIZE: number = 10;
export const DEFAULT_BGCOLOR: string = '#f6f6f6';

export class Model {
	private _state: State = {
		brushSize: 10,
		brushColor: DEFAULT_BRUSH_COLOR,
		bgColor: DEFAULT_BGCOLOR,
		shouldDraw: false,
		drawingTool: DrawingTool.Brush,
	};

	set bgColor(color: string) {
		this._state.bgColor = color;
	}

	set brushColor(color: string) {
		this._state.brushColor = color;
	}

	set brushSize(size: number) {
		this._state.brushSize = size;
	}

	set drawingTool(tool: DrawingTool) {
		this._state.drawingTool = tool;
	}

	set shouldDraw(condition: boolean) {
		this._state.shouldDraw = condition;
	}

	get bgColor(): string {
		return this._state.bgColor;
	}

	get brushColor(): string {
		return this._state.brushColor;
	}

	get brushSize(): number {
		return this._state.brushSize;
	}

	get drawingTool(): DrawingTool {
		return this._state.drawingTool;
	}

	get shouldDraw(): boolean {
		return this._state.shouldDraw;
	}
}
