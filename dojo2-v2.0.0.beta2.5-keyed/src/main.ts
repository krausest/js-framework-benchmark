import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import App from './App';

const root = document.getElementById('main') || undefined;

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append(root);
