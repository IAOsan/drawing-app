import { Model, DrawingTool, DEFAULT_BRUSH_SIZE } from './model';
import { View, Coordinates } from './view';

export class Controller {
	private _tempBrushSize: number | null = null;

	constructor(private _model: Model, private _view: View) {
		this._view.updateBrushSizeToView(_model.brushSize);
		this._view.bindMousePress(this._handlePress);
		this._view.bindMouseDrag(this._handleDrag);
		this._view.bindMouseRelease(this._handleRelease);
		this._view.bindToolChange(this._handleToolChange);
		this._view.bindChangeBrushColor(this._handleChangeBrushColor);
		this._view.bindChangeBrushSize(this._handleChangeBrushSize);
		this._view.bindChangeBackgroundColor(this._handleBackgroundColor);
	}

	private _handleDrag = (coords: Coordinates): void => {
		if (this._model.shouldDraw) {
			this._view.drawing(coords);
		}
	};

	private _handlePress = (coords: Coordinates): void => {
		this._model.shouldDraw = true;
		const brushColor =
			this._model.drawingTool === DrawingTool.Brush
				? this._model.brushColor
				: this._model.bgColor;

		this._view.startDrawing({
			coords,
			brushColor,
			brushSize: this._model.brushSize,
		});
	};

	private _handleRelease = (): void => {
		this._model.shouldDraw = false;
	};

	private _switchToCleaner(): void {
		this._model.drawingTool = DrawingTool.Cleaner;
		this._view.clearCanvas();
	}

	private _switchToEraser(): void {
		const eraserScaleFactor: number =
			this._model.brushSize > 50
				? 1.5
				: this._model.brushSize > 20
				? 2
				: 3;

		this._model.drawingTool = DrawingTool.Eraser;
		this._tempBrushSize = this._model.brushSize;
		this._model.brushSize *= eraserScaleFactor;
	}

	private _switchToBrush(): void {
		this._model.drawingTool = DrawingTool.Brush;
		this._model.brushSize = this._tempBrushSize || DEFAULT_BRUSH_SIZE;
		this._view.updateBrushSizeToView(this._model.brushSize);
	}

	private _handleToolChange = (id: string): void => {
		if (id === this._model.drawingTool) return;

		switch (id) {
			case DrawingTool.Brush:
				this._switchToBrush();
				break;
			case DrawingTool.Eraser:
				this._switchToEraser();
				break;
			case DrawingTool.Cleaner:
				this._switchToCleaner();
				break;
			default:
				console.log('Tool not recognized.');
		}
	};

	private _handleChangeBrushColor = (color: string): void => {
		this._model.brushColor = color;
	};

	private _handleChangeBrushSize = (size: number): void => {
		this._model.brushSize = size;
	};

	private _handleBackgroundColor = (color: string): void => {
		this._model.bgColor = color;
		this._view.changeCanvasColor(color);
	};
}
