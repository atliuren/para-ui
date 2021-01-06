import {
    addons
} from '@storybook/addons';
import {
    themes
} from '@storybook/theming';

import ParaTheme from './ParaTheme';

addons.setConfig({
    theme: ParaTheme,
});