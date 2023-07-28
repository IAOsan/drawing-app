import { Model } from './model';
import { View } from './view';
import { Controller } from './controller';
import './style.css';

function init(): void {
	new Controller(new Model(), new View());
}

window.addEventListener('DOMContentLoaded', init);
