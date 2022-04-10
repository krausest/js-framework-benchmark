import { mount, setDetectionStrategy } from '../node_modules/slingjs/sling.min.es5';
import ControllerComponent from './controller';

setDetectionStrategy(s.CHANGE_STRATEGY_MANUAL);

// initialize
mount('main', new ControllerComponent());