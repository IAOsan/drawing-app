"use strict";
exports.__esModule = true;
require("./style.css");
var utils_1 = require("./utils");
var DEFAULT_BRUSH_SIZE = 10;
var DEFAULT_COLOR = '#000';
var DEFAULT_BGCOLOR = '#f6f6f6';
var DrawingTool;
(function (DrawingTool) {
    DrawingTool["Brush"] = "brush";
    DrawingTool["Eraser"] = "eraser";
    DrawingTool["Bucket"] = "bucket";
    DrawingTool["Clear"] = "clear";
})(DrawingTool || (DrawingTool = {}));
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.brushSize = DEFAULT_BRUSH_SIZE;
        this.currentColor = DEFAULT_COLOR;
        this.bgColor = DEFAULT_BGCOLOR;
        this._shouldDraw = false;
        this._tool = DrawingTool.Brush;
        this._tempBrushSize = null;
        this._tempColor = null;
        this._handleBrushSize = function (e) {
            var target = e.target;
            if (target === _this._brushSizeSlider) {
                _this.brushSize = +_this._brushSizeSlider.value;
            }
            if (target === _this._brushSizeControl) {
                _this.brushSize = +_this._brushSizeControl.value;
            }
            _this._syncBrushSizeToView();
        };
        this._handleBrushColor = function () {
            var wrapper = _this._brushColorPicker.parentElement;
            var rgb = utils_1.hexToRgb(_this._brushColorPicker.value);
            var rgba = "rgba(" + Object.values(rgb) + ", 0.4)";
            _this.currentColor = _this._brushColorPicker.value;
            wrapper.style.cssText = "--color: " + rgba;
        };
        this._handleDrag = function (e) {
            if (!_this._ctx || !_this._shouldDraw)
                return;
            var _a = _this._getCurrentPosition(e), x = _a.x, y = _a.y;
            _this._ctx.lineTo(x, y);
            _this._ctx.stroke();
        };
        this._handlePress = function (e) {
            if (!_this._ctx)
                return;
            var _a = _this._getCurrentPosition(e), x = _a.x, y = _a.y;
            _this._shouldDraw = true;
            _this._ctx.strokeStyle = _this.currentColor;
            _this._ctx.lineWidth = _this.brushSize;
            _this._ctx.beginPath();
            _this._ctx.moveTo(x, y);
        };
        this._handleRelease = function () {
            _this._shouldDraw = false;
        };
        this._handleToolChange = function (e) {
            var target = e.target;
            var btn = target === null || target === void 0 ? void 0 : target.closest('button');
            var eraserScaleFactor = _this.brushSize > 50 ? 1.5 : _this.brushSize > 20 ? 2 : 3;
            if (!btn)
                return;
            if (btn.id === DrawingTool.Brush) {
                _this.currentColor = _this._tempColor || DEFAULT_COLOR;
                _this.brushSize = _this._tempBrushSize || DEFAULT_BRUSH_SIZE;
                _this._tool = DrawingTool.Brush;
                _this._syncBrushSizeToView();
            }
            if (btn.id === DrawingTool.Eraser) {
                _this._tempColor = _this.currentColor;
                _this.currentColor = _this.bgColor;
                _this._tempBrushSize = _this.brushSize;
                _this.brushSize *= eraserScaleFactor;
                _this._tool = DrawingTool.Eraser;
            }
            if (btn.id === DrawingTool.Clear && _this._ctx) {
                _this._ctx.clearRect(0, 0, _this._canvas.width, _this._canvas.height);
            }
            _this._brushBtn.classList.toggle('active', _this._tool === DrawingTool.Brush);
            _this._eraserBtn.classList.toggle('active', _this._tool === DrawingTool.Eraser);
        };
        this._toolbar = this._getElement('.toolbar');
        this._canvas = this._getElement('#canvas');
        this._brushBtn = this._getElement('#brush');
        this._eraserBtn = this._getElement('#eraser');
        this._brushSizeSlider =
            this._getElement('#brush-size-slider');
        this._brushSizeControl = this._getElement('#brush-size-control');
        this._brushColorPicker = this._getElement('#brush-color-picker');
        this._bucketColorPicker = this._getElement('#bucket-color-picker');
        this._ctx = this._getContext();
        this._setupCanvas();
        this._syncBrushSizeToView();
        this._initLocalListeners();
    }
    App.prototype._getElement = function (selector) {
        return document.querySelector(selector);
    };
    App.prototype._getContext = function () {
        if (this._canvas && this._canvas.getContext !== undefined) {
            var ctx = this._canvas.getContext('2d');
            return ctx || null;
        }
        return null;
    };
    App.prototype._getCurrentPosition = function (e) {
        var _a = this._canvas.getBoundingClientRect(), left = _a.left, top = _a.top;
        return {
            x: e.clientX - left,
            y: e.clientY - top
        };
    };
    App.prototype._setupCanvas = function () {
        this._canvas.height =
            window.innerHeight - this._toolbar.getBoundingClientRect().height;
        this._canvas.width = window.innerWidth;
        // setup context
        if (!this._ctx)
            return;
        this._ctx.lineCap = 'round';
        this._ctx.lineJoin = 'round';
    };
    App.prototype._syncBrushSizeToView = function () {
        this._brushSizeControl.value = this.brushSize.toString();
        this._brushSizeSlider.value = this.brushSize.toString();
    };
    App.prototype._initLocalListeners = function () {
        this._toolbar.addEventListener('click', this._handleToolChange);
        this._brushSizeSlider.addEventListener('change', this._handleBrushSize);
        this._brushSizeControl.addEventListener('change', this._handleBrushSize);
        this._brushColorPicker.addEventListener('input', this._handleBrushColor);
        this._canvas.addEventListener('mousedown', this._handlePress);
        this._canvas.addEventListener('mousemove', this._handleDrag);
        this._canvas.addEventListener('mouseup', this._handleRelease);
    };
    return App;
}());
window.addEventListener('DOMContentLoaded', function () {
    new App();
});
