import { TOGGLE_SIDEBAR, POSITION_SIDEBAR, TOGGLE_OPEN_SIDEBAR, CHANGE_ACTIVE_SIDEBAR_ITEM } from '../constants';

export const toggleSidebar = state => ({
    type: TOGGLE_SIDEBAR,
    state,
});

export const positionSidebar = position => ({
    type: POSITION_SIDEBAR,
    position,
});

export const toggleOpenSidebar = () => ({
    type: TOGGLE_OPEN_SIDEBAR,
});

export const changeActiveSidebarItem = activeItem => ({
    type: CHANGE_ACTIVE_SIDEBAR_ITEM,
    activeItem,
});
